import { Pressable, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { Choice } from "@/constants/terminos";
import { RED, styles } from "@/styles/terminos.styles";

type SiNoProps = {
  value: Choice;
  onChange: (value: Choice) => void;
  noDescription?: string;
};

export function SiNoSelector({
  value,
  onChange,
  noDescription = "Seleccionar No impide continuar con el registro.",
}: SiNoProps) {
  return (
    <View style={styles.choices}>
      {(["si", "no"] as const).map((opcion) => (
        <Pressable
          key={opcion}
          style={styles.choiceRow}
          accessibilityRole="radio"
          accessibilityState={{ selected: value === opcion }}
          onPress={() => onChange(opcion)}
        >
          <Ionicons
            name={value === opcion ? "radio-button-on" : "radio-button-off"}
            size={21}
            color={value === opcion ? RED : "#8C929C"}
          />
          <Text style={styles.choiceText}>
            {opcion === "si" ? "Sí" : `No${noDescription ? ` (${noDescription})` : ""}`}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

type ReadOnlyProps = {
  label: string;
  value: string;
  placeholder?: string;
};

export function ReadOnlyField({ label, value, placeholder = "Pendiente" }: ReadOnlyProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.readOnly}>
        <Text style={value ? styles.value : styles.placeholder}>{value || placeholder}</Text>
      </View>
    </View>
  );
}

type TextFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
};

export function TextField({ label, value, onChangeText, placeholder }: TextFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9AA0A8"
        autoCorrect={false}
      />
    </View>
  );
}

type ChipsProps = {
  items: string[];
  current: string;
  onChange: (value: string) => void;
};

export function ChipGroup({ items, current, onChange }: ChipsProps) {
  return (
    <View style={styles.chips}>
      {items.map((item) => (
        <Pressable
          key={item}
          style={[styles.chip, current === item && styles.chipSelected]}
          onPress={() => onChange(item)}
          accessibilityRole="button"
          accessibilityState={{ selected: current === item }}
        >
          <Text style={[styles.chipText, current === item && styles.chipTextSelected]}>
            {item}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}