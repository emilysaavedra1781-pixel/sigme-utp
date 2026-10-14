import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/styles/dashboard.styles';

export default function MapaScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Ionicons name="map-outline" size={48} color={COLORS.textGray} />
        <Text style={{ fontSize: 18, fontWeight: '700', color: COLORS.textDark, marginTop: 16 }}>
          Próximamente
        </Text>
        <Text style={{ fontSize: 13, color: COLORS.textGray, marginTop: 6, textAlign: 'center' }}>
          El mapa interactivo del estacionamiento estará disponible pronto.
        </Text>
      </View>
    </SafeAreaView>
  );
}