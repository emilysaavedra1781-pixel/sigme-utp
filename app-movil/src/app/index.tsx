import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";
import { obtenerToken } from "@/services/api";

export default function Index() {
  const [cargando, setCargando] = useState(true);
  const [haySesion, setHaySesion] = useState(false);

  useEffect(() => {
    obtenerToken()
      .then((token) => setHaySesion(!!token))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Redirect href={haySesion ? "/(tabs)" : "/login"} />;
}