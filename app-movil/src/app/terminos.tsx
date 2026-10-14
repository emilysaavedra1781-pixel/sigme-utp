import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { CATEGORIAS, CONDICIONES, DECLARACIONES, TIPOS } from "@/constants/terminos";
import { useTerminos } from "@/hooks/useTerminos";
import { INK, RED, styles } from "@/styles/terminos.styles";
import {
  ChipGroup,
  ReadOnlyField,
  SiNoSelector,
  TextField,
} from "@/components/terminos/TerminosFields";

export default function TerminosScreen() {
  const t = useTerminos();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
          <Pressable style={styles.backButton} onPress={t.goBack} accessibilityLabel="Volver">
            <Ionicons name="arrow-back" size={25} color={INK} />
          </Pressable>

          <View style={styles.brand}>
            <View style={styles.brandBadge}>
              <Text style={styles.brandBadgeText}>UTP</Text>
            </View>
            <Text style={styles.brandLabel}>Universidad Tecnológica del Perú</Text>
          </View>

          <Text style={styles.title}>SOLICITUD DE AUTORIZACIÓN DE ACCESO AL ESTACIONAMIENTO</Text>
          <Text style={styles.note}>
            Plantilla académica adaptada de las capturas de referencia. Texto por validar con el documento oficial de UTP.
          </Text>

          {DECLARACIONES.map((declaracion) => (
            <View key={declaracion.id} style={styles.declaration}>
              <Text style={styles.statement}>
                {declaracion.id}. {declaracion.description}
              </Text>
              <SiNoSelector
                value={t.respuestas[declaracion.id]}
                onChange={(v) => t.updateRespuesta(declaracion.id, v)}
              />
            </View>
          ))}

          <Text style={styles.sectionHeading}>
            4. Información sobre la autorización de uso de estacionamiento
          </Text>
          {CONDICIONES.map((texto) => (
            <View style={styles.bulletRow} key={texto}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{texto}</Text>
            </View>
          ))}

          <View style={styles.divider} />
          <Text style={styles.sectionHeading}>Política de privacidad</Text>
          <Text style={styles.note}>
            Falta incorporar aquí la versión íntegra y aprobada de la política de privacidad. No se debe publicar esta maqueta como documento oficial.
          </Text>
          <Pressable
            style={styles.acceptRow}
            onPress={t.togglePrivacidad}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: t.aceptaPrivacidad }}
          >
            <Ionicons
              name={t.aceptaPrivacidad ? "checkbox" : "square-outline"}
              size={23}
              color={t.aceptaPrivacidad ? RED : "#8C929C"}
            />
            <Text style={styles.acceptText}>
              Acepto los términos y la política de privacidad (simulación académica).
            </Text>
          </Pressable>

          <View style={styles.divider} />
          <Text style={styles.sectionHeading}>DATOS DEL USUARIO</Text>
          <ReadOnlyField label="1. Fecha de solicitud" value={new Date().toLocaleDateString("es-PE")} />
          <ReadOnlyField
            label="2. Apellidos y nombres"
            value={`${t.data.apellidos} ${t.data.nombres}`.trim()}
          />
          <ReadOnlyField label="3. DNI" value={t.data.dni} />
          <TextField
            label="4. Elija su sede"
            value={t.sede}
            onChangeText={t.changeSede}
            placeholder="Escribe tu sede UTP"
          />
          <ReadOnlyField label="5. Correo institucional" value={t.data.correo} />
          <Text style={styles.label}>6. Elija su categoría</Text>
          <ChipGroup items={CATEGORIAS} current={t.categoria} onChange={t.changeCategoria} />
          <TextField
            label="7. Carrera (estudiante) o área (colaborador)"
            value={t.carreraArea}
            onChangeText={t.changeCarreraArea}
            placeholder="Escribe tu carrera o área"
          />
          <ReadOnlyField label="8. Licencia de conducir" value={t.data.licencia} />

          <Text style={styles.sectionHeading}>9. Registrar vehículos</Text>
          <Text style={styles.hint}>Puedes registrar hasta 2 vehículos en esta maqueta.</Text>
          <Text style={styles.label}>Tipo de vehículo 1</Text>
          <ChipGroup items={TIPOS} current={t.tipo1} onChange={t.changeTipo1} />
          <ReadOnlyField label="Placa del vehículo 1" value={t.data.placa} />
          <ReadOnlyField label="Modelo del vehículo 1" value={t.data.modelo} />

          <Pressable style={styles.secondaryButton} onPress={t.toggleSegundo}>
            <Ionicons
              name={t.segundo ? "remove-circle-outline" : "add-circle-outline"}
              size={19}
              color={RED}
            />
            <Text style={styles.secondaryText}>
              {t.segundo ? "Quitar segundo vehículo" : "Agregar segundo vehículo"}
            </Text>
          </Pressable>

          {t.segundo && (
            <View style={styles.secondVehicle}>
              <Text style={styles.label}>Tipo de vehículo 2</Text>
              <ChipGroup items={TIPOS} current={t.tipo2} onChange={t.changeTipo2} />
              <TextField
                label="Placa del vehículo 2"
                value={t.placa2}
                onChangeText={t.changePlaca2}
                placeholder="Ej: ABC-123"
              />
            </View>
          )}

          <Text style={styles.sectionHeading}>10. ¿Persona con discapacidad?</Text>
          <SiNoSelector
            value={t.discapacidad}
            onChange={t.changeDiscapacidad}
            noDescription=""
          />
          {t.discapacidad === "si" && (
            <ReadOnlyField
              label="Código CONADIS"
              value={t.data.conadis}
              placeholder="Regístralo en Datos adicionales"
            />
          )}

          {!!t.error && <Text style={styles.error}>{t.error}</Text>}
          {!!t.confirmacion && <Text style={styles.confirmation}>{t.confirmacion}</Text>}

          <View style={styles.actions}>
            <Pressable style={styles.cancelButton} onPress={t.goBack}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
            <Pressable style={styles.submitButton} onPress={t.enviar}>
              <Text style={styles.submitText}>Enviar</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}