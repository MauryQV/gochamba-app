// app/register/_layout.tsx
import { Stack } from "expo-router";
import { TouchableOpacity, Text } from "react-native";
import { Link } from "expo-router";
import { RegisterProvider } from "./_register-context";

export default function RegisterLayout() {
  return (
    <RegisterProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#ffffff",
          },
          headerTintColor: "#2563eb",
          headerTitleStyle: {
            fontSize: 14,
            fontWeight: "400",
            color: "#6B7280",
          },
          headerShadowVisible: false,
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen
          name="choose-method"
          options={{
            headerTitle: "Regístrarse",
          }}
        />
        <Stack.Screen
          name="one"
          options={{
            headerTitle: "1/3 - Registrarse",
            headerRight: () => (
              <Link href="/" asChild replace>
                <TouchableOpacity>
                  <Text style={{ color: "#2563eb", fontSize: 14, fontWeight: "500" }}>Salir</Text>
                </TouchableOpacity>
              </Link>
            ),
          }}
        />
        <Stack.Screen
          name="two"
          options={{
            headerTitle: "2/3 - Registrarse",
            headerRight: () => (
              <Link href="/" asChild replace>
                <TouchableOpacity>
                  <Text style={{ color: "#2563eb", fontSize: 14, fontWeight: "500" }}>Salir</Text>
                </TouchableOpacity>
              </Link>
            ),
          }}
        />
        <Stack.Screen
          name="three"
          options={{
            headerTitle: "3/3 - Registrarse",
            headerRight: () => (
              <Link href="/" asChild replace>
                <TouchableOpacity>
                  <Text style={{ color: "#2563eb", fontSize: 14, fontWeight: "500" }}>Salir</Text>
                </TouchableOpacity>
              </Link>
            ),
          }}
        />
      </Stack>
    </RegisterProvider>
  );
}
