import { COLORS, styles } from "@/styles/dashboard.styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
export default function DashboardScreen() {
  const totalPlazas = 8;
  const disponibles = 6;
  const porcentajeLibre = Math.round((disponibles / totalPlazas) * 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <Ionicons name="person" size={16} color="#FFF" />
        </View>

        <Text style={styles.headerId}>U22223464</Text>

        <View style={{ flex: 1 }} />

        <View style={{ position: "relative" }}>
          <TouchableOpacity
            style={styles.bellCircle}
            onPress={() => router.push("/notificaciones")}
          >
            <Ionicons name="notifications" size={16} color={COLORS.primary} />
          </TouchableOpacity>

          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: -2,
              right: -2,
              backgroundColor: "#FFC107",
              width: 14,
              height: 14,
              borderRadius: 7,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 8, fontWeight: "700", color: "#000" }}>
              1
            </Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.greeting}>¡Hola!</Text>

        <View style={styles.reservationCard}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: "#FADADD",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 10,
              }}
            >
              <Ionicons name="location" size={18} color={COLORS.primary} />
            </View>

            <View>
              <Text style={styles.reservationLabel}>Plaza A04</Text>
              <Text style={styles.reservationSub}>Vehículo: ABC-123</Text>
            </View>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.reservationSub}>Llegar antes de</Text>
            <Text style={styles.reservationLabel}>15:30</Text>
          </View>
        </View>

        <View style={styles.parkingCard}>
          <Text style={styles.parkingTitle}>ESTACIONAMIENTO SUBTERRÁNEO</Text>

          <Text style={styles.parkingSubtitle}>Actualizado hace 3 seg</Text>

          <View style={styles.parkingRow}>
            <View>
              <Text style={styles.bigNumber}>{totalPlazas}</Text>

              <Text style={styles.bigNumberLabel}>Total de plazas</Text>

              <Text style={[styles.bigNumber, { marginTop: 12 }]}>
                {disponibles}
              </Text>

              <Text style={styles.bigNumberLabel}>Disponibles</Text>
            </View>

            <View
              style={{
                width: 100,
                height: 100,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Svg width={100} height={100} viewBox="0 0 100 100">
                <Circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#FFFFFF55"
                  strokeWidth="10"
                  fill="none"
                />

                <Circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke={COLORS.greenAccent}
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 42 * (1 - porcentajeLibre / 100)
                  }`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </Svg>

              <View style={{ position: "absolute", alignItems: "center" }}>
                <Text style={styles.percentText}>{porcentajeLibre}%</Text>

                <Text style={styles.percentLabel}>libre</Text>
              </View>
            </View>
          </View>

          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#FFFFFF" }]}
              />
              <Text style={styles.legendText}>Ocupados</Text>
            </View>

            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: COLORS.greenAccent },
                ]}
              />
              <Text style={styles.legendText}>Disponibles</Text>
            </View>

            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#FFB300" }]}
              />
              <Text style={styles.legendText}>Plaza reservada</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
