import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles, COLORS } from '@/styles/historial.styles';

const ACCESOS = [
  {
    fecha: 'Hoy - 30 de Agosto, 2026',
    registros: [
      { id: '1', lugar: 'Estacionamiento Central', plaza: 'Plaza P04', placa: 'ABC-123', entrada: '08:42', salida: '11:35', duracion: '2 h 53 min' },
      { id: '2', lugar: 'Estacionamiento Central', plaza: 'Plaza P04', placa: 'ABC-123', entrada: '08:42', salida: '11:35', duracion: '2 h 53 min' },
    ],
  },
  {
    fecha: '28 de Agosto, 2026',
    registros: [
      { id: '3', lugar: 'Estacionamiento Central', plaza: 'Plaza P04', placa: 'ABC-123', entrada: '08:42', salida: '11:35', duracion: '2 h 53 min' },
      { id: '4', lugar: 'Estacionamiento Central', plaza: 'Plaza P04', placa: 'ABC-123', entrada: '08:42', salida: '11:35', duracion: '2 h 53 min' },
    ],
  },
];

export default function HistorialScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textDark} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Historial</Text>
          <Text style={styles.subtitle}>Revisa tus accesos al estacionamiento</Text>
        </View>
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterChip}>
          <Text style={styles.filterChipText}>Este mes</Text>
          <Ionicons name="chevron-down" size={12} color={COLORS.textGray} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterChip}>
          <Ionicons name="car-outline" size={13} color={COLORS.textGray} style={{ marginRight: 4 }} />
          <Text style={styles.filterChipText}>Todos</Text>
          <Ionicons name="chevron-down" size={12} color={COLORS.textGray} />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.filterIconButton}>
          <Ionicons name="filter" size={16} color={COLORS.textDark} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconBox}>
            <Ionicons name="time-outline" size={20} color={COLORS.primary} />
          </View>
          <View>
            <Text style={styles.summaryLabel}>Resumen del periodo</Text>
            <Text style={styles.summaryValue}>8 Accesos</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View>
            <Text style={styles.summaryLabel}> </Text>
            <Text style={styles.summaryValue}>16 h 42 min</Text>
          </View>
        </View>

        {ACCESOS.map((grupo) => (
          <View key={grupo.fecha}>
            <Text style={styles.dateGroupLabel}>{grupo.fecha}</Text>
            {grupo.registros.map((r) => (
              <TouchableOpacity key={r.id} style={styles.entryCard}>
                <View style={styles.entryIconBox}>
                  <Ionicons name="location" size={16} color={COLORS.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.entryLocation}>{r.lugar}</Text>
                  <View style={styles.entrySubRow}>
                    <Text style={styles.entrySubText}>{r.plaza}</Text>
                    <Text style={styles.entrySubText}>🚗 {r.placa}</Text>
                  </View>
                  <View style={styles.entryTimesRow}>
                    <View style={styles.entryTimeBlock}>
                      <Text style={styles.entryTimeLabel}>Entrada</Text>
                      <Text style={styles.entryTimeValue}>{r.entrada}</Text>
                    </View>
                    <Ionicons name="arrow-forward" size={12} color={COLORS.textGray} style={styles.entryArrow} />
                    <View style={styles.entryTimeBlock}>
                      <Text style={styles.entryTimeLabel}>Salida</Text>
                      <Text style={styles.entryTimeValue}>{r.salida}</Text>
                    </View>
                    <View style={styles.entryDuration}>
                      <Text style={styles.entryDurationLabel}>Duración</Text>
                      <Text style={styles.entryDurationValue}>{r.duracion}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}