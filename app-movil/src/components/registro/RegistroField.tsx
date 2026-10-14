import type { ComponentProps } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RED, styles } from "@/styles/registro.styles";

export type IconName = ComponentProps<typeof Ionicons>["name"];

type SectionProps = {
  title: string;
  icon: IconName;
};

export function RegistroSection({ title, icon }: SectionProps) {
  return (
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={18} color={RED} />
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionLine} />
    </View>
  );
}

type FieldProps = {
  label: string;
  placeholder: string;
  icon: IconName;
  value: string;
  error?: string;
  onChangeText: (value: string) => void;
  keyboardType?: "default" | "number-pad" | "phone-pad";
  maxLength?: number;
  autoCapitalize?: "none" | "sentences" | "characters";
  // Solo para campos de contraseña
  secure?: boolean;
  visible?: boolean;
  onToggleVisible?: () => void;
};

export function RegistroField({
  label,
  placeholder,
  icon,
  value,
  error,
  onChangeText,
  keyboardType = "default",
  maxLength,
  autoCapitalize = "sentences",
  secure = false,
  visible = true,
  onToggleVisible,
}: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <View style={[styles.inputContainer, error ? styles.inputError : undefined]}>
        <Ionicons name={icon} size={17} color="#222222" style={styles.inputIcon} />

        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#AAAAAA"
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          secureTextEntry={secure && !visible}
        />

        {secure && (
          <Pressable
            style={styles.eyeButton}
            onPress={onToggleVisible}
            accessibilityRole="button"
            accessibilityLabel={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            <Ionicons
              name={visible ? "eye-outline" : "eye-off-outline"}
              size={19}
              color="#222222"
            />
          </Pressable>
        )}
      </View>

      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}