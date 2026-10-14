import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { styles, COLORS } from '@/styles/vehiculos.styles';

const VEHICULOS_INICIALES = [
  { id: '1', nombre: 'Toyota Corolla', placa: 'ABC-123', marca: 'Toyota', anio: '2022', principal: true },
  { id: '2', nombre: 'Hyundai Accent', placa: 'XYZ-456', marca: 'Hyundai', anio: '2021', principal: false },
  { id: '3', nombre: 'Kia Sportage', placa: 'DEF-789', marca: 'Kia', anio: '2023', principal: false },
];

export default function VehiculosScreen() {
  const router = useRouter();
  const [vehiculos, setVehiculos] = useState(VEHICULOS_INICIALES);

  const handleSetPrincipal = (id: string) => {
    setVehiculos((prev) =>
      prev.map((v) => ({
        ...v,
        principal: v.id === id,
      }))
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textDark} />
        </TouchableOpacity>
        <View style={styles.headerTextBox}>
          <Text style={styles.title}>Mis vehículos</Text>
          <Text style={styles.subtitle}>Gestiona los vehículos que utilizas en el estacionamiento</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoBanner}>
          <Ionicons name="car-sport" size={18} color={COLORS.primary} style={styles.infoBannerIcon} />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoBannerTitle}>Selecciona un vehículo principal</Text>
            <Text style={styles.infoBannerText}>
              Tu vehículo principal se usará por defecto al solicitar una plaza de estacionamiento.
            </Text>
          </View>
        </View>

        {vehiculos.map((v) => (
          <View
            key={v.id}
            style={[styles.vehicleCard, v.principal && styles.vehicleCardSelected]}
          >
            {v.principal && (
              <View style={styles.badgePrincipal}>
                <Ionicons name="star" size={10} color="#FFF" />
                <Text style={styles.badgePrincipalText}>Vehículo principal</Text>
              </View>
            )}

            <View style={styles.vehicleTopRow}>
              <View style={styles.vehicleIconBox}>
                <Ionicons name="car-outline" size={24} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.vehicleName}>{v.nombre}</Text>
                <Text style={styles.vehiclePlate}>{v.placa}</Text>
                <View style={styles.vehicleMetaRow}>
                  <Text style={styles.vehicleMetaText}>🚗 {v.marca}</Text>
                  <Text style={styles.vehicleMetaText}>📅 {v.anio}</Text>
                </View>
              </View>
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.editButton}>
                <Ionicons name="pencil-outline" size={14} color={COLORS.primary} />
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.selectButton,
                  v.principal ? styles.selectButtonFilled : styles.selectButtonOutline,
                ]}
                onPress={() => handleSetPrincipal(v.id)}
                disabled={v.principal}
              >
                <Ionicons
                  name={v.principal ? 'checkmark-circle' : 'person-outline'}
                  size={14}
                  color={v.principal ? '#FFF' : COLORS.primary}
                />
                <Text style={v.principal ? styles.selectButtonTextFilled : styles.selectButtonTextOutline}>
                  {v.principal ? 'Seleccionado' : 'Seleccionar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={18} color="#FFF" />
          <Text style={styles.addButtonText}>Agregar vehículo</Text>
        </TouchableOpacity>

        <View style={styles.footerInfo}>
          <Ionicons name="information-circle-outline" size={16} color="#4B4B4B" />
          <Text style={styles.footerInfoText}>
            Solo puedes registrar vehículos con placas válidas. No puedes eliminar un vehículo con una reserva activa.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}