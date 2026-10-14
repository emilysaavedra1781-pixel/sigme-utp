import { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { login, registro } from "@/services/api";

export function useLogin() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);

  const formularioCompleto =
    usuario.trim().length > 0 && password.trim().length > 0;

  const toggleMostrarPassword = () => setMostrarPassword((v) => !v);

  const handleLogin = async () => {
    if (!formularioCompleto || cargando) return;
    setCargando(true);
    try {
      await login(usuario.trim(), password);
      router.replace("/(tabs)");
    } catch (e: any) {
      Alert.alert("No se pudo iniciar sesión", e.message || "Intenta de nuevo");
    } finally {
      setCargando(false);
    }
  };

  const handleRegister = async () => {
    if (!formularioCompleto || cargando) {
      Alert.alert(
        "Registro",
        "Escribe tu código y una contraseña (mínimo 8 caracteres) y vuelve a pulsar Registrarse."
      );
      return;
    }
    setCargando(true);
    try {
      await registro(usuario.trim(), password);
      await login(usuario.trim(), password);
      router.replace("/(tabs)");
    } catch (e: any) {
      Alert.alert("No se pudo registrar", e.message || "Intenta de nuevo");
    } finally {
      setCargando(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert("Recuperar contraseña", "Esta pantalla todavía está pendiente.");
  };

  return {
    usuario,
    setUsuario,
    password,
    setPassword,
    mostrarPassword,
    toggleMostrarPassword,
    cargando,
    formularioCompleto,
    handleLogin,
    handleRegister,
    handleForgotPassword,
  };
}