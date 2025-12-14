import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { Hammer, House, Settings2, ShieldUser } from "lucide-react-native";
import React from "react";
import { useRegister } from "../register/_register-context";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>["name"]; color: string }) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { setupData } = useRegister();
  const isWorker = setupData?.rol?.includes("TRABAJADOR");
  const isAdmin = setupData?.rol?.includes("ADMIN");
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: useClientOnlyValue(false, true),
        headerStyle: {
          backgroundColor: "#2563eb",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontFamily: "Poppins_900Black",
          fontSize: 30,
        },
        headerTitleAlign: "center",
        headerTitle: "GoChamba",
      }}
    >
      <Tabs.Screen
        name="one"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <House size={28} style={{ marginBottom: -3 }} color={color} />,
        }}
      />
      <Tabs.Screen
        name="worker"
        options={{
          title: "Solicitudes",
          tabBarIcon: ({ color }) => <Hammer size={28} style={{ marginBottom: -3 }} color={color} />,
          href: isWorker ? "/(tabs)/worker" : null,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Opciones",
          tabBarIcon: ({ color }) => <Settings2 size={28} style={{ marginBottom: -3 }} color={color} />,
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: "Administrador",
          tabBarIcon: ({ color }) => <ShieldUser size={28} style={{ marginBottom: -3 }} color={color} />,
          href: isAdmin ? "/(tabs)/admin" : null,
        }}
      />
    </Tabs>
  );
}
