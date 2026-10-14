import { useState } from "react";
import { useRouter } from "expo-router";
import { useRegistro } from "@/context/RegistroContext";

export type FieldKey =
  | "codigo"
  | "dni"
  | "nombres"
  | "apellidos"
  | "telefono"
  | "modelo"
  | "placa"
  | "password"
  | "confirmarPassword";

type Errors = Partial<Record<FieldKey, string>>;

export function useRegistroForm() {
  const router = useRouter();
  const { data: form, updateField: updateRegistroField } = useRegistro();

  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState("");

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirm = () => setShowConfirm((prev) => !prev);

  const updateField = (key: FieldKey, value: string) => {
    updateRegistroField(key, value);
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setMessage("");
  };

  const validate = (): Errors => {
    const nextErrors: Errors = {};

    const values: Record<FieldKey, string> = {
      codigo: form.codigo.trim(),
      dni: form.dni.trim(),
      nombres: form.nombres.trim(),
      apellidos: form.apellidos.trim(),
      telefono: form.telefono.trim(),
      modelo: form.modelo.trim(),
      placa: form.placa.trim().toUpperCase(),
      password: form.password,
      confirmarPassword: form.confirmarPassword,
    };

    for (const key of Object.keys(values) as FieldKey[]) {
      if (!values[key]) nextErrors[key] = "Este campo es obligatorio.";
    }

    if (values.codigo && !/^U?\d{7,10}$/i.test(values.codigo)) {
      nextErrors.codigo = "Ingresa un código universitario válido.";
    }
    if (values.dni && !/^\d{8}$/.test(values.dni)) {
      nextErrors.dni = "El DNI debe tener 8 dígitos.";
    }
    if (values.telefono && !/^\d{9}$/.test(values.telefono)) {
      nextErrors.telefono = "Ingresa un teléfono de 9 dígitos.";
    }
    if (values.placa && !/^[A-Z0-9]{3}-?[A-Z0-9]{3,4}$/i.test(values.placa)) {
      nextErrors.placa = "Ingresa una placa válida.";
    }
    if (values.password && values.password.length < 8) {
      nextErrors.password = "Mínimo 8 caracteres.";
    }
    if (
      values.confirmarPassword &&
      values.password !== values.confirmarPassword
    ) {
      nextErrors.confirmarPassword = "Las contraseñas no coinciden.";
    }

    return nextErrors;
  };

  const handleSubmit = () => {
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setMessage("Revisa los campos señalados.");
      return;
    }

    // Por ahora solo validamos la vista; aún no se envía al backend.
    router.push("/registro-datos");
  };

  const goToLogin = () => router.replace("/login");

  return {
    form,
    errors,
    message,
    showPassword,
    showConfirm,
    togglePassword,
    toggleConfirm,
    updateField,
    handleSubmit,
    goToLogin,
  };
}