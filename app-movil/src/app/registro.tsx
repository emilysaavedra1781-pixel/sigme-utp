import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { styles } from "@/styles/registro.styles";
import { useRegistroForm } from "@/hooks/useRegistroForm";
import { RegistroField, RegistroSection } from "@/components/registro/RegistroField";

export default function RegistroScreen() {
  const {
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
  } = useRegistroForm();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            style={styles.backButton}
            onPress={goToLogin}
            accessibilityLabel="Volver al inicio de sesión"
          >
            <Ionicons name="arrow-back" size={25} color="#111111" />
          </Pressable>

          <Text style={styles.title}>Registro de Usuario</Text>

          <RegistroSection title="Datos personales" icon="person-outline" />

          <RegistroField
            label="Código universitario"
            placeholder="Ej: U20231234"
            icon="school-outline"
            value={form.codigo}
            error={errors.codigo}
            onChangeText={(v) => updateField("codigo", v)}
            autoCapitalize="characters"
          />
          <RegistroField
            label="DNI"
            placeholder="Ej: 12345678"
            icon="card-outline"
            value={form.dni}
            error={errors.dni}
            onChangeText={(v) => updateField("dni", v)}
            keyboardType="number-pad"
            maxLength={8}
          />
          <RegistroField
            label="Nombres"
            placeholder="Ingresa tus nombres"
            icon="person-outline"
            value={form.nombres}
            error={errors.nombres}
            onChangeText={(v) => updateField("nombres", v)}
          />
          <RegistroField
            label="Apellidos"
            placeholder="Ingresa tus apellidos"
            icon="person-outline"
            value={form.apellidos}
            error={errors.apellidos}
            onChangeText={(v) => updateField("apellidos", v)}
          />
          <RegistroField
            label="Número de teléfono"
            placeholder="Ej: 987 654 321"
            icon="call-outline"
            value={form.telefono}
            error={errors.telefono}
            onChangeText={(v) => updateField("telefono", v)}
            keyboardType="phone-pad"
            maxLength={9}
          />

          <RegistroSection title="Datos del vehículo" icon="car-sport" />

          <RegistroField
            label="Modelo del vehículo"
            placeholder="Ej: Ford Bronco"
            icon="car-sport-outline"
            value={form.modelo}
            error={errors.modelo}
            onChangeText={(v) => updateField("modelo", v)}
          />
          <RegistroField
            label="Placa del vehículo"
            placeholder="Ej: ABC-123"
            icon="card-outline"
            value={form.placa}
            error={errors.placa}
            onChangeText={(v) => updateField("placa", v)}
            autoCapitalize="characters"
          />

          <RegistroSection title="Seguridad" icon="lock-closed" />

          <RegistroField
            label="Contraseña"
            placeholder="Mínimo 8 caracteres"
            icon="lock-closed-outline"
            value={form.password}
            error={errors.password}
            onChangeText={(v) => updateField("password", v)}
            autoCapitalize="none"
            secure
            visible={showPassword}
            onToggleVisible={togglePassword}
          />
          <RegistroField
            label="Confirmar contraseña"
            placeholder="Repite tu contraseña"
            icon="lock-closed-outline"
            value={form.confirmarPassword}
            error={errors.confirmarPassword}
            onChangeText={(v) => updateField("confirmarPassword", v)}
            autoCapitalize="none"
            secure
            visible={showConfirm}
            onToggleVisible={toggleConfirm}
          />

          {!!message && <Text style={styles.message}>{message}</Text>}

          <Pressable
            style={({ pressed }) => [styles.createButton, pressed && styles.buttonPressed]}
            onPress={handleSubmit}
          >
            <Ionicons name="person-add-outline" size={19} color="#FFFFFF" />
            <Text style={styles.createButtonText}>Continuar</Text>
          </Pressable>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tienes cuenta?</Text>
            <Pressable onPress={goToLogin}>
              <Text style={styles.loginLink}>Inicia sesión</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}