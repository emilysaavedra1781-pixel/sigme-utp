import * as SecureStore from "expo-secure-store";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const TOKEN_KEY = "auth_token";

export async function guardarToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function obtenerToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function borrarToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

// Cliente genérico: agrega el token automáticamente
export async function api(ruta: string, opciones: RequestInit = {}) {
  if (!BASE_URL) {
    throw new Error("Falta EXPO_PUBLIC_API_URL en el .env de la app");
  }

  const token = await obtenerToken();

  let respuesta: Response;
  try {
    respuesta = await fetch(`${BASE_URL}${ruta}`, {
      ...opciones,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...opciones.headers,
      },
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Revisa tu conexión.");
  }

  const datos = await respuesta.json().catch(() => ({}));

  if (respuesta.status === 401 && token) {
    await borrarToken(); // sesión expirada o token inválido
  }

  if (!respuesta.ok) {
    throw new Error(datos.error || "Error en la solicitud");
  }

  return datos;
}

export async function login(codigo_utp: string, password: string) {
  const datos = await api("/auth/login", {
    method: "POST",
    body: JSON.stringify({ codigo_utp, password }),
  });
  await guardarToken(datos.token);
  return datos.usuario;
}

export async function registro(
  codigo_utp: string,
  password: string,
  nombre?: string
) {
  return api("/auth/registro", {
    method: "POST",
    body: JSON.stringify({ codigo_utp, password, nombre }),
  });
}

export async function logout() {
  await borrarToken();
}