
import type { ComponentProps } from "react";
import { useState } from "react";

import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useMenu } from "@/context/MenuContext";

type MenuItem = {
  label: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  route: string;
};

const menuItems: MenuItem[] = [
  {
    label: "Inicio",
    icon: "home-outline",
    route: "/(tabs)",
  },
  {
    label: "Parking",
    icon: "square-outline",
    route: "/(tabs)/mapa",
  },
  {
    label: "Vehículos",
    icon: "car-outline",
    route: "/(tabs)/vehiculos",
  },
  {
    label: "Historial",
    icon: "time-outline",
    route: "/(tabs)/historial",
  },
  {
    label: "Ayuda",
    icon: "help-circle-outline",
    route: "/ayuda",
  },
];

export default function SideMenu() {
  const { isMenuOpen, setIsMenuOpen } = useMenu();
  const router = useRouter();

  const [showLogoutConfirm, setShowLogoutConfirm] =
    useState(false);

  const [showHelpInfo, setShowHelpInfo] = useState(false);

  const closeMenu = () => {
    setShowLogoutConfirm(false);
    setShowHelpInfo(false);
    setIsMenuOpen(false);
  };

  const handleNavigate = (route: string) => {
    // Ayuda todavía no tiene una pantalla implementada.
    // Mostramos un aviso provisional sin navegar
    // a una ruta inexistente.
    if (route === "/ayuda") {
      setShowHelpInfo(true);
      return;
    }

    closeMenu();

    if (route === "/(tabs)") {
      router.replace("/(tabs)");
      return;
    }

    router.push(route as any);
  };

  const handleLogout = () => {
    // Cierre visual provisional.
    // Emily integrará el cierre de sesión real.
    closeMenu();
    router.replace("/login");
  };

  return (
    <Modal
      visible={isMenuOpen}
      transparent
      animationType="fade"
      onRequestClose={closeMenu}
    >
      <View style={styles.container}>
        {/* Fondo oscuro: permite cerrar tocando fuera */}
        <Pressable
          style={styles.backdrop}
          onPress={closeMenu}
          accessibilityLabel="Cerrar menú"
        />

        {/* Panel blanco inferior */}
        <View style={styles.sheet}>
          <View style={styles.handle} />

          {menuItems.map((item) => (
            <Pressable
              key={item.label}
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.pressed,
              ]}
              onPress={() => handleNavigate(item.route)}
              accessibilityRole="button"
            >
              <Ionicons
                name={item.icon}
                size={23}
                color="#27354B"
              />

              <Text style={styles.menuText}>
                {item.label}
              </Text>

              <Ionicons
                name="arrow-forward"
                size={20}
                color="#E63946"
              />
            </Pressable>
          ))}

          {/* Pie del menú */}
          <View style={styles.footer}>
            <Pressable
              style={styles.logoutButton}
              onPress={() => setShowLogoutConfirm(true)}
            >
              <Ionicons
                name="log-out-outline"
                size={20}
                color="#D32F2F"
              />

              <Text style={styles.logoutText}>
                Cerrar sesión
              </Text>
            </Pressable>

            <Pressable
              style={styles.closeButton}
              onPress={closeMenu}
              accessibilityLabel="Cerrar"
            >
              <Ionicons
                name="close"
                size={22}
                color="#FFFFFF"
              />
            </Pressable>
          </View>
        </View>

        {/* Aviso provisional de Ayuda */}
        {showHelpInfo && (
          <View style={styles.confirmOverlay}>
            <View style={styles.confirmBox}>
              <Text style={styles.confirmTitle}>
                Ayuda
              </Text>

              <Text style={styles.confirmDescription}>
                Esta sección todavía está en desarrollo.
              </Text>

              <Pressable
                style={styles.confirmButton}
                onPress={() => setShowHelpInfo(false)}
              >
                <Text style={styles.confirmButtonText}>
                  Entendido
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Confirmación de cierre de sesión */}
        {showLogoutConfirm && (
          <View style={styles.confirmOverlay}>
            <View style={styles.confirmBox}>
              <Text style={styles.confirmTitle}>
                ¿Cerrar sesión?
              </Text>

              <Text style={styles.confirmDescription}>
                Tendrás que volver a iniciar sesión
                para acceder.
              </Text>

              <View style={styles.confirmActions}>
                <Pressable
                  style={styles.cancelButton}
                  onPress={() =>
                    setShowLogoutConfirm(false)
                  }
                >
                  <Text style={styles.cancelText}>
                    Cancelar
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.confirmButton}
                  onPress={handleLogout}
                >
                  <Text style={styles.confirmButtonText}>
                    Cerrar sesión
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },

  backdrop: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.55)",
  },

  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
    maxHeight: "90%",
  },

  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#DDDDDD",
    alignSelf: "center",
    marginBottom: 16,
  },

  menuItem: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ECEFF3",
    paddingHorizontal: 8,
  },

  pressed: {
    backgroundColor: "#F5F6F8",
  },

  menuText: {
    flex: 1,
    fontSize: 16,
    color: "#27354B",
    fontWeight: "500",
  },

  footer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },

  logoutText: {
    color: "#D32F2F",
    fontSize: 15,
    fontWeight: "600",
  },

  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#FF7E82",
    alignItems: "center",
    justifyContent: "center",
  },

  confirmOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  confirmBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },

  confirmTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#27354B",
    marginBottom: 10,
  },

  confirmDescription: {
    color: "#666666",
    fontSize: 14,
    marginBottom: 24,
  },

  confirmActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },

  cancelButton: {
    padding: 12,
  },

  cancelText: {
    color: "#555555",
    fontWeight: "600",
  },

  confirmButton: {
    backgroundColor: "#D32F2F",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
  },

  confirmButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});