import { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";

import { useRegistro } from "@/context/RegistroContext";
import { DECLARACIONES, type Choice, type DeclarationId } from "@/constants/terminos";

const REDIRECT_DELAY_MS = 3000;

export function useTerminos() {
  const router = useRouter();
  const { data } = useRegistro();

  const [respuestas, setRespuestas] = useState<Record<DeclarationId, Choice>>({
    1: null,
    2: null,
    3: null,
  });
  const [aceptaPrivacidad, setAceptaPrivacidad] = useState(false);
  const [sede, setSede] = useState("");
  const [categoria, setCategoria] = useState("");
  const [carreraArea, setCarreraArea] = useState("");
  const [tipo1, setTipo1] = useState("");
  const [segundo, setSegundo] = useState(false);
  const [tipo2, setTipo2] = useState("");
  const [placa2, setPlaca2] = useState("");
  const [discapacidad, setDiscapacidad] = useState<Choice>(null);
  const [error, setError] = useState("");
  const [confirmacion, setConfirmacion] = useState("");

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cancela el temporizador si el usuario sale de la pantalla antes de tiempo
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Envuelve un setter para limpiar mensajes al editar
  function editar<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setError("");
      setConfirmacion("");
    };
  }

  const updateRespuesta = (id: DeclarationId, value: Choice) => {
    setRespuestas((prev) => ({ ...prev, [id]: value }));
    setError("");
    setConfirmacion("");
  };

  const togglePrivacidad = () => {
    setAceptaPrivacidad((prev) => !prev);
    setError("");
  };

  const toggleSegundo = () => setSegundo((prev) => !prev);

  const changeDiscapacidad = (value: Choice) => {
    setDiscapacidad(value);
    setError("");
  };

  const enviar = () => {
    if (timerRef.current) return; // ya se envió, esperando la redirección

    if (DECLARACIONES.some((d) => respuestas[d.id] !== "si")) {
      setError("Debes seleccionar Sí en las tres declaraciones para avanzar.");
      return;
    }
    if (!aceptaPrivacidad) {
      setError("Debes aceptar los términos y la política de privacidad.");
      return;
    }
    if (!sede.trim() || !categoria || !carreraArea.trim() || !tipo1 || !discapacidad) {
      setError("Completa sede, categoría, carrera/área, tipo de vehículo y discapacidad.");
      return;
    }
    if (segundo && (!tipo2 || !placa2.trim())) {
      setError("Completa el tipo y la placa del segundo vehículo, o quítalo.");
      return;
    }
    if (discapacidad === "si" && !data.conadis.trim()) {
      setError("Si corresponde, completa el código CONADIS en Datos adicionales.");
      return;
    }

    setError("");
    setConfirmacion(
      `Formulario validado localmente el ${new Date().toLocaleString("es-PE")}. ` +
        "Es una demostración: todavía no se creó una cuenta ni se registró la aceptación en el servidor. " +
        "Volviendo al inicio de sesión..."
    );

    timerRef.current = setTimeout(() => {
      router.replace("/login");
    }, REDIRECT_DELAY_MS);
  };

  const goBack = () => router.back();

  return {
    data,
    respuestas,
    aceptaPrivacidad,
    sede,
    categoria,
    carreraArea,
    tipo1,
    segundo,
    tipo2,
    placa2,
    discapacidad,
    error,
    confirmacion,

    updateRespuesta,
    togglePrivacidad,
    toggleSegundo,
    changeDiscapacidad,
    changeSede: editar(setSede),
    changeCategoria: editar(setCategoria),
    changeCarreraArea: editar(setCarreraArea),
    changeTipo1: editar(setTipo1),
    changeTipo2: editar(setTipo2),
    changePlaca2: editar(setPlaca2),

    enviar,
    goBack,
  };
}