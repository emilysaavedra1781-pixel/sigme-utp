// Entorno de prueba: NO se usa la base de datos real.
// Se define el entorno antes de importar app/pool (imports dinámicos en `before`).
process.env.NODE_ENV = "test";
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/sigme_test";
process.env.JWT_SECRET = "test-secret";
process.env.JWT_EXPIRES_IN = "1h";
process.env.CORS_ORIGINS = "";
process.env.LOG_LEVEL = "silent";

import { after, before, beforeEach, describe, mock, test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import jwt from "jsonwebtoken";
import type { Express } from "express";
import type { Pool } from "pg";
import type { Logger } from "pino";
import type { Rol } from "../src/shared/types";

// Secreto ficticio de prueba (nunca el valor real del .env)
const TEST_JWT_SECRET = "test-secret";

let app: Express;
let pool: Pool;
let logger: Logger;

// Forma de los eventos de log que interesa comprobar (evita `any`)
interface LogEntry {
  event?: string;
  userId?: number;
  vehicleId?: number;
  status?: number;
  err?: Error;
}

// Capturas para verificar auditoría y logs emitidos
const auditLog: Array<{ usuario_id: number | null; accion: string; elemento_afectado: string }> = [];
const infoLogs: LogEntry[] = [];
const warnLogs: LogEntry[] = [];
const errorLogs: LogEntry[] = [];

// ---------------------------------------------------------------
// Base de datos en memoria que sustituye al pool real de PostgreSQL
// ---------------------------------------------------------------
type Vehiculo = {
  id: number;
  user_id: number;
  placa: string;
  marca: string | null;
  modelo: string | null;
  fecha_registro: string;
};

const vehiculos = new Map<number, Vehiculo>();
let nextId = 1;
let forzarError = false;

function errorDuplicado(): Error {
  return Object.assign(new Error("llave duplicada"), {
    code: "23505",
    constraint: "vehicles_placa_key",
  });
}

type QueryResultLike = { rows: unknown[]; rowCount: number };

// Los parámetros provienen del propio service (no del cliente); en cada rama se
// interpretan con el orden exacto de parámetros de la sentencia correspondiente.
async function fakeQuery(sql: string, params: unknown[] = []): Promise<QueryResultLike> {
  if (forzarError) throw new Error("boom: detalle interno confidencial");

  if (sql.includes("INSERT INTO vehicles")) {
    const [userId, placa, marca, modelo] = params as [number, string, string | null, string | null];
    if ([...vehiculos.values()].some((v) => v.placa === placa)) {
      throw errorDuplicado();
    }
    const v: Vehiculo = {
      id: nextId++,
      user_id: userId,
      placa,
      marca: marca || null,
      modelo: modelo || null,
      fecha_registro: new Date().toISOString(),
    };
    vehiculos.set(v.id, v);
    return { rows: [v], rowCount: 1 };
  }

  if (sql.includes("INSERT INTO audit_log")) {
    const [usuario_id, accion, elemento_afectado] = params as [number | null, string, string];
    auditLog.push({ usuario_id, accion, elemento_afectado });
    return { rows: [], rowCount: 1 };
  }

  if (sql.includes("DELETE FROM vehicles")) {
    const [id, userId] = params as [number, number];
    const v = vehiculos.get(id);
    if (v && v.user_id === userId) {
      vehiculos.delete(id);
      return { rows: [], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  if (sql.includes("FROM vehicles WHERE user_id = $1 ORDER BY id")) {
    const [userId] = params as [number];
    const rows = [...vehiculos.values()]
      .filter((v) => v.user_id === userId)
      .sort((a, b) => a.id - b.id);
    return { rows, rowCount: rows.length };
  }

  if (sql.includes("FROM vehicles WHERE id = $1 AND user_id = $2")) {
    const [id, userId] = params as [number, number];
    const v = vehiculos.get(id);
    return v && v.user_id === userId
      ? { rows: [v], rowCount: 1 }
      : { rows: [], rowCount: 0 };
  }

  if (sql.includes("SELECT id FROM vehicles WHERE id = $1")) {
    const [id] = params as [number];
    const v = vehiculos.get(id);
    return v ? { rows: [{ id }], rowCount: 1 } : { rows: [], rowCount: 0 };
  }

  if (sql.includes("UPDATE vehicles")) {
    const [setPlaca, placa, setMarca, marca, setModelo, modelo, id, userId] = params as [
      boolean,
      string | null,
      boolean,
      string | null,
      boolean,
      string | null,
      number,
      number,
    ];
    const v = vehiculos.get(id);
    if (!v || v.user_id !== userId) return { rows: [], rowCount: 0 };

    if (setPlaca && placa !== null) {
      if ([...vehiculos.values()].some((x) => x.placa === placa && x.id !== id)) {
        throw errorDuplicado();
      }
      v.placa = placa;
    }
    if (setMarca) v.marca = marca;
    if (setModelo) v.modelo = modelo;
    return { rows: [v], rowCount: 1 };
  }

  throw new Error(`Consulta no soportada por el mock: ${sql}`);
}

function authToken(userId: number, rol: Rol = "usuario"): string {
  return jwt.sign(
    { id: userId, codigo: `U${String(userId).padStart(8, "0")}`, rol },
    TEST_JWT_SECRET,
    { expiresIn: "1h" },
  );
}

describe("CRUD de vehículos", () => {
  before(async () => {
    ({ pool } = await import("../src/db/pool"));
    mock.method(pool, "query", fakeQuery);
    ({ logger } = await import("../src/config/logger"));
    mock.method(logger, "info", (o: LogEntry) => { infoLogs.push(o); });
    mock.method(logger, "warn", (o: LogEntry) => { warnLogs.push(o); });
    mock.method(logger, "error", (o: LogEntry) => { errorLogs.push(o); });
    ({ app } = await import("../src/app"));
  });

  beforeEach(() => {
    vehiculos.clear();
    nextId = 1;
    forzarError = false;
    auditLog.length = 0;
    infoLogs.length = 0;
    warnLogs.length = 0;
    errorLogs.length = 0;
  });

  after(() => {
    mock.restoreAll();
  });

  test("1. crea un vehículo correctamente", async () => {
    const res = await request(app)
      .post("/vehicles")
      .set("Authorization", `Bearer ${authToken(1)}`)
      .send({ placa: "abc-123", marca: "Toyota", modelo: "Corolla" });

    assert.equal(res.status, 201);
    assert.equal(res.body.placa, "ABC123"); // normalizada
    assert.equal(res.body.user_id, 1);
    assert.equal(res.body.marca, "Toyota");
    assert.equal(res.body.modelo, "Corolla");
    assert.ok(Number.isInteger(res.body.id));
  });

  test("2. rechaza una placa duplicada con 409", async () => {
    const t = authToken(1);
    await request(app)
      .post("/vehicles")
      .set("Authorization", `Bearer ${t}`)
      .send({ placa: "ABC-123" });

    const res = await request(app)
      .post("/vehicles")
      .set("Authorization", `Bearer ${t}`)
      .send({ placa: "abc123" });

    assert.equal(res.status, 409);
    assert.equal(res.body.error, "La placa ya está registrada");
  });

  test("3. lista solo los vehículos del usuario autenticado", async () => {
    const ta = authToken(1);
    const tb = authToken(2);
    await request(app).post("/vehicles").set("Authorization", `Bearer ${ta}`).send({ placa: "AAA-111" });
    await request(app).post("/vehicles").set("Authorization", `Bearer ${ta}`).send({ placa: "AAA-222" });
    await request(app).post("/vehicles").set("Authorization", `Bearer ${tb}`).send({ placa: "BBB-333" });

    const res = await request(app).get("/vehicles").set("Authorization", `Bearer ${ta}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.length, 2);
    assert.ok(res.body.every((v: Vehiculo) => v.user_id === 1));
  });

  test("3b. devuelve un arreglo vacío cuando no hay vehículos", async () => {
    const res = await request(app).get("/vehicles").set("Authorization", `Bearer ${authToken(7)}`);
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, []);
  });

  test("4. obtiene un vehículo propio", async () => {
    const t = authToken(1);
    const creado = (
      await request(app).post("/vehicles").set("Authorization", `Bearer ${t}`).send({ placa: "XYZ-999" })
    ).body;

    const res = await request(app).get(`/vehicles/${creado.id}`).set("Authorization", `Bearer ${t}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.id, creado.id);
    assert.equal(res.body.placa, "XYZ999");
  });

  test("5. impide que el usuario A lea un vehículo del usuario B", async () => {
    const creado = (
      await request(app).post("/vehicles").set("Authorization", `Bearer ${authToken(2)}`).send({ placa: "BBB-111" })
    ).body;

    const res = await request(app)
      .get(`/vehicles/${creado.id}`)
      .set("Authorization", `Bearer ${authToken(1)}`);

    assert.equal(res.status, 404);
    assert.equal(res.body.error, "Vehículo no encontrado");
  });

  test("6. impide que el usuario A actualice un vehículo del usuario B", async () => {
    const creado = (
      await request(app).post("/vehicles").set("Authorization", `Bearer ${authToken(2)}`).send({ placa: "BBB-222" })
    ).body;

    const res = await request(app)
      .put(`/vehicles/${creado.id}`)
      .set("Authorization", `Bearer ${authToken(1)}`)
      .send({ marca: "Hack" });

    assert.equal(res.status, 404);
  });

  test("7. impide que el usuario A elimine un vehículo del usuario B", async () => {
    const creado = (
      await request(app).post("/vehicles").set("Authorization", `Bearer ${authToken(2)}`).send({ placa: "BBB-333" })
    ).body;

    const res = await request(app)
      .delete(`/vehicles/${creado.id}`)
      .set("Authorization", `Bearer ${authToken(1)}`);

    assert.equal(res.status, 404);
  });

  test("8. rechaza una placa inválida con 400", async () => {
    const t = authToken(1);
    for (const placa of ["", "   ", "12", "AB", "ABC", "ABC12", "ABC-12", "ABC12345", "ABCD-123"]) {
      const res = await request(app)
        .post("/vehicles")
        .set("Authorization", `Bearer ${t}`)
        .send({ placa });
      assert.equal(res.status, 400, `placa inválida esperada: ${JSON.stringify(placa)}`);
    }
  });

  test("8b. acepta placas alfanuméricas del formato del proyecto", async () => {
    const t = authToken(1);
    for (const [entrada, esperada] of [
      ["AB1-234", "AB1234"],
      ["XYZ4567", "XYZ4567"],
      ["abc-123", "ABC123"],
    ] as const) {
      const res = await request(app)
        .post("/vehicles")
        .set("Authorization", `Bearer ${t}`)
        .send({ placa: entrada });
      assert.equal(res.status, 201, `placa válida esperada: ${entrada}`);
      assert.equal(res.body.placa, esperada);
    }
  });

  test("9. rechaza peticiones sin autenticación válida", async () => {
    assert.equal((await request(app).get("/vehicles")).status, 401);
    assert.equal((await request(app).post("/vehicles").send({ placa: "ABC123" })).status, 401);
    assert.equal((await request(app).get("/vehicles/1")).status, 401);
    assert.equal((await request(app).put("/vehicles/1").send({ marca: "x" })).status, 401);
    assert.equal((await request(app).delete("/vehicles/1")).status, 401);

    // Token inválido
    assert.equal(
      (await request(app).get("/vehicles").set("Authorization", "Bearer token-invalido")).status,
      401,
    );
  });

  test("10. actualiza correctamente un vehículo propio", async () => {
    const t = authToken(1);
    const creado = (
      await request(app).post("/vehicles").set("Authorization", `Bearer ${t}`).send({ placa: "OLD-111" })
    ).body;

    const res = await request(app)
      .put(`/vehicles/${creado.id}`)
      .set("Authorization", `Bearer ${t}`)
      .send({ placa: "new-222", marca: "Ford", modelo: "Fiesta" });

    assert.equal(res.status, 200);
    assert.equal(res.body.placa, "NEW222");
    assert.equal(res.body.marca, "Ford");
    assert.equal(res.body.modelo, "Fiesta");
    assert.equal(res.body.user_id, 1);
    assert.equal(res.body.id, creado.id);
  });

  test("10b. rechaza una placa duplicada al actualizar con 409", async () => {
    const t = authToken(1);
    await request(app).post("/vehicles").set("Authorization", `Bearer ${t}`).send({ placa: "DUP-001" });
    const otro = (
      await request(app).post("/vehicles").set("Authorization", `Bearer ${t}`).send({ placa: "DUP-002" })
    ).body;

    const res = await request(app)
      .put(`/vehicles/${otro.id}`)
      .set("Authorization", `Bearer ${t}`)
      .send({ placa: "dup-001" });

    assert.equal(res.status, 409);
    assert.equal(res.body.error, "La placa ya está registrada");
  });

  test("11. elimina correctamente un vehículo propio", async () => {
    const t = authToken(1);
    const creado = (
      await request(app).post("/vehicles").set("Authorization", `Bearer ${t}`).send({ placa: "DEL-111" })
    ).body;

    const res = await request(app).delete(`/vehicles/${creado.id}`).set("Authorization", `Bearer ${t}`);

    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { eliminado: true, id: creado.id });

    const get = await request(app).get(`/vehicles/${creado.id}`).set("Authorization", `Bearer ${t}`);
    assert.equal(get.status, 404);
  });

  test("12. rechaza IDs inválidos con 400", async () => {
    const t = authToken(1);
    assert.equal((await request(app).get("/vehicles/abc").set("Authorization", `Bearer ${t}`)).status, 400);
    assert.equal((await request(app).get("/vehicles/0").set("Authorization", `Bearer ${t}`)).status, 400);
    assert.equal((await request(app).get("/vehicles/-1").set("Authorization", `Bearer ${t}`)).status, 400);
    assert.equal(
      (await request(app).put("/vehicles/abc").set("Authorization", `Bearer ${t}`).send({ marca: "x" })).status,
      400,
    );
    assert.equal((await request(app).delete("/vehicles/xyz").set("Authorization", `Bearer ${t}`)).status, 400);
  });

  test("13. ignora el user_id enviado en el cuerpo (no cambia el propietario)", async () => {
    const t = authToken(1);

    const res = await request(app)
      .post("/vehicles")
      .set("Authorization", `Bearer ${t}`)
      .send({ placa: "OWN-111", user_id: 999 });

    assert.equal(res.status, 201);
    assert.equal(res.body.user_id, 1); // propietario = autenticado, no 999

    const upd = await request(app)
      .put(`/vehicles/${res.body.id}`)
      .set("Authorization", `Bearer ${t}`)
      .send({ user_id: 999, marca: "X" });

    assert.equal(upd.status, 200);
    assert.equal(upd.body.user_id, 1); // sigue siendo el usuario autenticado
  });

  test("14. no filtra detalles internos en errores inesperados", async () => {
    forzarError = true;
    const res = await request(app)
      .get("/vehicles")
      .set("Authorization", `Bearer ${authToken(1)}`);
    forzarError = false;

    assert.equal(res.status, 500);
    // La respuesta pública no debe incluir stack, SQL, mensaje interno ni secretos.
    assert.deepEqual(res.body, { error: "Error interno del servidor" });
    assert.ok(!JSON.stringify(res.body).includes("detalle interno confidencial"));
    assert.ok(!JSON.stringify(res.body).includes("boom"));

    const errLog = errorLogs.find((o) => o?.event === "http.unhandled_error");
    assert.ok(errLog, "debe emitir un log de error (nivel error) para el fallo inesperado");
    assert.ok(typeof errLog.err?.stack === "string" && errLog.err.stack.length > 0, "el log debe incluir stack trace");
    assert.ok(typeof errLog.err?.message === "string" && errLog.err.message.length > 0, "el log debe incluir el mensaje del error");
  });

  test("15. rechaza creación sin placa (campo obligatorio) con 400", async () => {
    const t = authToken(1);
    assert.equal(
      (await request(app).post("/vehicles").set("Authorization", `Bearer ${t}`).send({ marca: "Toyota" })).status,
      400,
    );
    assert.equal(
      (await request(app).post("/vehicles").set("Authorization", `Bearer ${t}`).send({})).status,
      400,
    );
  });

  test("16. consultar un vehículo inexistente devuelve 404", async () => {
    const res = await request(app).get("/vehicles/9999").set("Authorization", `Bearer ${authToken(1)}`);
    assert.equal(res.status, 404);
    assert.equal(res.body.error, "Vehículo no encontrado");
  });

  test("17. actualizar un vehículo inexistente devuelve 404", async () => {
    const res = await request(app)
      .put("/vehicles/9999")
      .set("Authorization", `Bearer ${authToken(1)}`)
      .send({ marca: "X" });
    assert.equal(res.status, 404);
  });

  test("18. eliminar un vehículo inexistente devuelve 404", async () => {
    const res = await request(app).delete("/vehicles/9999").set("Authorization", `Bearer ${authToken(1)}`);
    assert.equal(res.status, 404);
  });

  test("19. actualizar sin campos devuelve 400", async () => {
    const t = authToken(1);
    const creado = (
      await request(app).post("/vehicles").set("Authorization", `Bearer ${t}`).send({ placa: "EMP-111" })
    ).body;
    const res = await request(app).put(`/vehicles/${creado.id}`).set("Authorization", `Bearer ${t}`).send({});
    assert.equal(res.status, 400);
  });

  test("20. actualizar con placa inválida devuelve 400", async () => {
    const t = authToken(1);
    const creado = (
      await request(app).post("/vehicles").set("Authorization", `Bearer ${t}`).send({ placa: "VAL-111" })
    ).body;
    const res = await request(app)
      .put(`/vehicles/${creado.id}`)
      .set("Authorization", `Bearer ${t}`)
      .send({ placa: "123" });
    assert.equal(res.status, 400);
  });

  test("21. un intento no autorizado no altera el vehículo ajeno", async () => {
    const tB = authToken(2);
    const creado = (
      await request(app).post("/vehicles").set("Authorization", `Bearer ${tB}`).send({ placa: "INT-111" })
    ).body;

    const del = await request(app).delete(`/vehicles/${creado.id}`).set("Authorization", `Bearer ${authToken(1)}`);
    assert.equal(del.status, 404);

    const get = await request(app).get(`/vehicles/${creado.id}`).set("Authorization", `Bearer ${tB}`);
    assert.equal(get.status, 200);
    assert.equal(get.body.id, creado.id);
  });

  test("22. registra auditoría en crear, actualizar y eliminar", async () => {
    const t = authToken(1);
    const creado = (
      await request(app).post("/vehicles").set("Authorization", `Bearer ${t}`).send({ placa: "AUD-111" })
    ).body;
    await request(app).put(`/vehicles/${creado.id}`).set("Authorization", `Bearer ${t}`).send({ marca: "X" });
    await request(app).delete(`/vehicles/${creado.id}`).set("Authorization", `Bearer ${t}`);

    const acciones = auditLog.map((a) => a.accion);
    assert.ok(acciones.includes("vehicles.create"), "falta auditoría de creación");
    assert.ok(acciones.includes("vehicles.update"), "falta auditoría de actualización");
    assert.ok(acciones.includes("vehicles.delete"), "falta auditoría de eliminación");

    const create = auditLog.find((a) => a.accion === "vehicles.create")!;
    assert.equal(create.usuario_id, 1);
    assert.equal(create.elemento_afectado, `vehicles:${creado.id}`);
  });

  test("23. emite logs info (creación) y warn (acceso ajeno)", async () => {
    const tA = authToken(1);
    const creado = (
      await request(app).post("/vehicles").set("Authorization", `Bearer ${tA}`).send({ placa: "LOG-111" })
    ).body;

    assert.ok(
      infoLogs.some((o) => o?.event === "vehicles.created" && o.userId === 1 && o.vehicleId === creado.id),
      "falta log info de creación",
    );

    await request(app).get(`/vehicles/${creado.id}`).set("Authorization", `Bearer ${authToken(2)}`);

    assert.ok(
      warnLogs.some((o) => o?.event === "vehicles.read_forbidden" && o.vehicleId === creado.id),
      "falta log warn de acceso ajeno",
    );
  });

  test("24. los tres roles gestionan sus propios vehículos y no los ajenos", async () => {
    const roles: Rol[] = ["usuario", "supervisor", "administrador"];
    const ids = [201, 202, 203];
    const creados: Array<{ id: number; rol: Rol }> = [];

    for (let i = 0; i < roles.length; i++) {
      const t = authToken(ids[i], roles[i]);
      const res = await request(app)
        .post("/vehicles")
        .set("Authorization", `Bearer ${t}`)
        .send({ placa: `RR${i}-11${i}` });
      assert.equal(res.status, 201, `rol ${roles[i]} debe poder crear`);
      assert.equal(res.body.user_id, ids[i]);
      creados.push({ id: res.body.id, rol: roles[i] });
    }

    for (let i = 0; i < roles.length; i++) {
      const t = authToken(ids[i], roles[i]);
      const list = await request(app).get("/vehicles").set("Authorization", `Bearer ${t}`);
      assert.equal(list.status, 200);
      assert.equal(list.body.length, 1, `rol ${roles[i]} debe listar solo lo suyo`);
      assert.equal(list.body[0].user_id, ids[i]);
    }

    const t0 = authToken(ids[0], roles[0]);
    const ajeno = creados.find((v) => v.rol !== roles[0])!;
    const res = await request(app).get(`/vehicles/${ajeno.id}`).set("Authorization", `Bearer ${t0}`);
    assert.equal(res.status, 404);
  });

  test("25. PUT conserva los campos omitidos", async () => {
    const t = authToken(1);
    const creado = (
      await request(app)
        .post("/vehicles")
        .set("Authorization", `Bearer ${t}`)
        .send({ placa: "KEP-111", marca: "Original", modelo: "Original" })
    ).body;

    const res = await request(app)
      .put(`/vehicles/${creado.id}`)
      .set("Authorization", `Bearer ${t}`)
      .send({ placa: "KEP-222" });

    assert.equal(res.status, 200);
    assert.equal(res.body.placa, "KEP222");
    assert.equal(res.body.marca, "Original"); // omitido -> se conserva
    assert.equal(res.body.modelo, "Original"); // omitido -> se conserva
  });

  test("26. PUT permite limpiar marca y modelo con null", async () => {
    const t = authToken(1);
    const creado = (
      await request(app)
        .post("/vehicles")
        .set("Authorization", `Bearer ${t}`)
        .send({ placa: "CLR-111", marca: "Toyota", modelo: "Corolla" })
    ).body;

    const res = await request(app)
      .put(`/vehicles/${creado.id}`)
      .set("Authorization", `Bearer ${t}`)
      .send({ marca: null, modelo: null });

    assert.equal(res.status, 200);
    assert.equal(res.body.marca, null);
    assert.equal(res.body.modelo, null);
    assert.equal(res.body.placa, "CLR111"); // placa omitida -> se conserva
  });
});
