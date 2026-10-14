import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { RED, styles } from "@/styles/registro-datos.styles";
import { campos, useRegistroDatos } from "@/hooks/useRegistroDatos";

export default function RegistroDatosScreen() {
  const { data, errors, message, handleChange, handleContinue, goBack } =
    useRegistroDatos();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <Pressable
            style={styles.backButton}
            onPress={goBack}
            accessibilityLabel="Volver al registro"
          >
            <Ionicons name="arrow-back" size={25} color="#111111" />
          </Pressable>

          <Text style={styles.title}>Registro de Usuario</Text>
          <Text style={styles.subtitle}>Completa tus datos adicionales</Text>

          <View style={styles.sectionHeader}>
            <Ionicons name="document-text-outline" size={18} color={RED} />
            <Text style={styles.sectionTitle}>Información adicional</Text>
            <View style={styles.sectionLine} />
          </View>

          {campos.map((campo) => (
            <View key={campo.key} style={styles.field}>
              <Text style={styles.label}>
                {campo.label}
                {campo.optional ? " (opcional)" : ""}
              </Text>

              <View
                style={[
                  styles.inputContainer,
                  errors[campo.key] ? styles.inputError : undefined,
                ]}
              >
                <Ionicons
                  name={campo.icon}
                  size={17}
                  color="#222222"
                  style={styles.inputIcon}
                />

                <TextInput
                  style={styles.input}
                  value={data[campo.key]}
                  onChangeText={(value) => handleChange(campo.key, value)}
                  placeholder={campo.placeholder}
                  placeholderTextColor="#AAAAAA"
                  keyboardType={campo.key === "correo" ? "email-address" : "default"}
                  autoCapitalize={campo.key === "correo" ? "none" : "characters"}
                  autoCorrect={false}
                />
              </View>

              {!!errors[campo.key] && (
                <Text style={styles.errorText}>{errors[campo.key]}</Text>
              )}
            </View>
          ))}

          <Text style={styles.hint}>
            Para las fechas utiliza el formato AAAA-MM-DD. Ejemplo: 2028-12-31.
          </Text>

          {!!message && <Text style={styles.message}>{message}</Text>}

          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={handleContinue}
          >
            <Text style={styles.buttonText}>Continuar</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}