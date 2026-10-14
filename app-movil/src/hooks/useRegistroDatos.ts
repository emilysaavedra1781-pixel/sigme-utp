import type { ComponentProps } from "react";
import { useState } from "react";
import { useRouter } from "expo-router";
import type { Ionicons } from "@expo/vector-icons";

import { useRegistro } from "@/context/RegistroContext";

export type DatosKey =
  | "correo"
  | "nacimiento"
  | "licencia"
  | "vencimiento"
  | "conadis";

type IconName = ComponentProps<typeof Ionicons>["name"];

export type Campo = {
  key: DatosKey;
  label: string;
  placeholder: string;
  icon: IconName;
  optional?: boolean;
};

export const campos: Campo[] = [
  {
    key: "correo",
    label: "Correo institucional",
    placeholder: "usuario@utp.edu.pe",
    icon: "mail-outline",
  },
  {
    key: "nacimiento",
    label: "Fecha de nacimiento",
    placeholder: "AAAA-MM-DD",
    icon: "calendar-outline",
  },
  {
    key: "licencia",
    label: "Número de licencia de conducir",
    placeholder: "Ingresa tu número de licencia",
    icon: "card-outline",
  },
  {
    key: "vencimiento",
    label: "Vencimiento de la licencia",
    placeholder: "AAAA-MM-DD",
    icon: "calendar-outline",
  },
  {
    key: "conadis",
    label: "Código CONADIS",
    placeholder: "Opcional",
    icon: "document-text-outline",
    optional: true,
  },
];

function fechaValida(valor: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;

  const fecha = new Date(`${valor}T00:00:00Z`);
  return (
    !Number.isNaN(fecha.getTime()) &&
    fecha.toISOString().slice(0, 10) === valor
  );
}

function fechaHoy() {
  const hoy = new Date();
  return [
    hoy.getFullYear(),
    String(hoy.getMonth() + 1).padStart(2, "0"),
    String(hoy.getDate()).padStart(2, "0"),
  ].join("-");
}

export function useRegistroDatos() {
  const router = useRouter();
  const { data, updateField } = useRegistro();

  const [errors, setErrors] = useState<Partial<Record<DatosKey, string>>>({});
  const [message, setMessage] = useState("");
  const [licenciaAdvertida, setLicenciaAdvertida] = useState(false);

  const handleChange = (key: DatosKey, value: string) => {
    updateField(key, value);
    setErrors((prev) => ({ ...prev, [key]: undefined }));

    if (key === "vencimiento") setLicenciaAdvertida(false);
    setMessage("");
  };

  const handleContinue = () => {
    const nextErrors: Partial<Record<DatosKey, string>> = {};

    for (const campo of campos) {
      if (!campo.optional && !data[campo.key].trim()) {
        nextErrors[campo.key] = "Este campo es obligatorio.";
      }
    }

    if (data.correo.trim() && !/^[^\s@]+@utp\.edu\.pe$/i.test(data.correo.trim())) {
      nextErrors.correo = "Ingresa un correo institucional UTP válido.";
    }

    if (data.nacimiento.trim() && !fechaValida(data.nacimiento.trim())) {
      nextErrors.nacimiento = "Ingresa una fecha válida en formato AAAA-MM-DD.";
    }

    if (data.vencimiento.trim() && !fechaValida(data.vencimiento.trim())) {
      nextErrors.vencimiento = "Ingresa una fecha válida en formato AAAA-MM-DD.";
    }

    if (
      fechaValida(data.nacimiento.trim()) &&
      data.nacimiento.trim() > fechaHoy()
    ) {
      nextErrors.nacimiento = "La fecha de nacimiento no puede ser futura.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setMessage("Revisa los campos señalados.");
      return;
    }

    if (data.vencimiento.trim() < fechaHoy() && !licenciaAdvertida) {
      setLicenciaAdvertida(true);
      setMessage(
        "Atención: la licencia de conducir está vencida. Revisa la fecha. Si deseas continuar con estos datos, vuelve a presionar Continuar."
      );
      return;
    }

    // RF02 será el siguiente paso. Todavía NO se envían datos ni se crean cuentas.
    router.push("/terminos");
  };

  const goBack = () => router.back();

  return {
    data,
    errors,
    message,
    handleChange,
    handleContinue,
    goBack,
  };
}