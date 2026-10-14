import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type Notificacion = {
  id: number;
  tipo: string;
  titulo: string;
  contenido: string;
  fecha: string;
  leida: boolean;
};

export default function NotificacionesScreen() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([
    {
      id: 1,
      tipo: "Reserva",
      titulo: "Reserva confirmada",
      contenido: "Tu plaza fue reservada correctamente.",
      fecha: "Hoy · 10:30 am",
      leida: false,
    },
    {
      id: 2,
      tipo: "Alerta",
      titulo: "Reserva próxima a expirar",
      contenido: "Tu reserva vence pronto.",
      fecha: "Ayer · 4:20 pm",
      leida: false,
    },
    {
      id: 3,
      tipo: "Información",
      titulo: "Reserva finalizada",
      contenido: "Tu reserva finalizó correctamente.",
      fecha: "20 Sep · 6:15 pm",
      leida: true,
    },
  ]);

  const pendientes = notificaciones.filter((item) => !item.leida).length;

  const cambiarEstado = (id: number) => {
    setNotificaciones((actuales) =>
      actuales.map((item) =>
        item.id === id ? { ...item, leida: !item.leida } : item,
      ),
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.titulo}>Notificaciones</Text>
          <Text style={styles.subtitulo}>Historial de avisos recibidos</Text>
        </View>

        <View style={styles.contador}>
          <Text style={styles.contadorTexto}>{pendientes}</Text>
        </View>
      </View>

      {notificaciones.length === 0 ? (
        <View style={styles.vacio}>
          <Text style={styles.vacioTitulo}>No hay notificaciones</Text>
          <Text style={styles.vacioTexto}>
            Todavía no has recibido notificaciones.
          </Text>
        </View>
      ) : (
        notificaciones.map((notificacion) => (
          <View
            key={notificacion.id}
            style={[styles.card, !notificacion.leida && styles.cardNoLeida]}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.tipo}>{notificacion.tipo}</Text>

              {!notificacion.leida && <View style={styles.puntoPendiente} />}
            </View>

            <Text style={styles.cardTitulo}>{notificacion.titulo}</Text>

            <Text style={styles.contenido}>{notificacion.contenido}</Text>

            <Text style={styles.fecha}>{notificacion.fecha}</Text>

            <TouchableOpacity
              style={styles.boton}
              onPress={() => cambiarEstado(notificacion.id)}
            >
              <Text style={styles.botonTexto}>
                {notificacion.leida
                  ? "Marcar como no leída"
                  : "Marcar como leída"}
              </Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
    padding: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  titulo: {
    fontSize: 28,
    fontWeight: "700",
  },

  subtitulo: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },

  contador: {
    minWidth: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#d32f2f",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  contadorTexto: {
    color: "#fff",
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e3e3e3",
  },

  cardNoLeida: {
    borderLeftWidth: 5,
    borderLeftColor: "#1976d2",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  tipo: {
    fontSize: 13,
    color: "#1976d2",
    fontWeight: "600",
  },

  puntoPendiente: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1976d2",
  },

  cardTitulo: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8,
  },

  contenido: {
    fontSize: 15,
    color: "#444",
    marginTop: 6,
    lineHeight: 21,
  },

  fecha: {
    fontSize: 13,
    color: "#888",
    marginTop: 10,
  },

  boton: {
    marginTop: 14,
    alignSelf: "flex-start",
  },

  botonTexto: {
    color: "#1976d2",
    fontWeight: "600",
  },

  vacio: {
    paddingVertical: 50,
    alignItems: "center",
  },

  vacioTitulo: {
    fontSize: 20,
    fontWeight: "700",
  },

  vacioTexto: {
    marginTop: 8,
    color: "#777",
  },
});
