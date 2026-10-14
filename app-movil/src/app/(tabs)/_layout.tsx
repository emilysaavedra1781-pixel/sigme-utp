import { Pressable, StyleSheet, View } from "react-native";

import { Tabs } from "expo-router";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { COLORS } from "@/styles/dashboard.styles";
import { useMenu } from "@/context/MenuContext";

export default function TabsLayout() {
  const { setIsMenuOpen } = useMenu();

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
        tabBar={({ state, navigation }) => (
          <View style={styles.tabBar}>
            {state.routes.map((route, index) => {
              const isFocused = state.index === index;

              const color = isFocused
                ? COLORS.primary
                : COLORS.textGray;

              const onPress = () => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };

              const onLongPress = () => {
                navigation.emit({
                  type: "tabLongPress",
                  target: route.key,
                });
              };

              return (
                <Pressable
                  key={route.key}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  accessibilityRole="button"
                  accessibilityState={
                    isFocused
                      ? { selected: true }
                      : {}
                  }
                  style={styles.tabItem}
                >
                  {route.name === "index" && (
                    <Ionicons
                      name="home"
                      size={24}
                      color={color}
                    />
                  )}

                  {route.name === "mapa" && (
                    <MaterialCommunityIcons
                      name="parking"
                      size={25}
                      color={color}
                    />
                  )}

                  {route.name === "vehiculos" && (
                    <Ionicons
                      name="car-outline"
                      size={24}
                      color={color}
                    />
                  )}

                  {route.name === "historial" && (
                    <Ionicons
                      name="time-outline"
                      size={24}
                      color={color}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        )}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Inicio",
          }}
        />

        <Tabs.Screen
          name="mapa"
          options={{
            title: "Mapa",
          }}
        />

        <Tabs.Screen
          name="vehiculos"
          options={{
            title: "Vehículos",
          }}
        />

        <Tabs.Screen
          name="historial"
          options={{
            title: "Historial",
          }}
        />
      </Tabs>

      {/* Botón flotante "+" para abrir el menú */}
      <Pressable
        style={styles.addButton}
        onPress={() => setIsMenuOpen(true)}
      >
        <Ionicons
          name="add"
          size={28}
          color="#FFFFFF"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  tabBar: {
    position: "absolute",

    left: 16,
    right: 88,
    bottom: 16,

    height: 60,

    flexDirection: "row",
    alignItems: "center",

    borderRadius: 20,
    backgroundColor: "#FFFFFF",

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 8,
  },

  tabItem: {
    flex: 1,
    height: 60,

    alignItems: "center",
    justifyContent: "center",

    padding: 0,
    margin: 0,
  },

  addButton: {
    position: "absolute",

    right: 16,
    bottom: 18,

    width: 56,
    height: 56,

    borderRadius: 18,
    backgroundColor: COLORS.primary,

    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 8,
  },
});