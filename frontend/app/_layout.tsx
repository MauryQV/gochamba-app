import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { Link, useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Tu URL del backend (cambia según tu configuración)
const API_BASE_URL = "http://localhost:8000"; // Cambia esto

export default function IndexScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      // Handle login logic here
    }, 2000);
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const { idToken, user } = response.data;
        const { name, email, photo } = user;

        console.log("Google Sign In Success:", { idToken, name, email, photo });

        // 🔹 AQUÍ: Enviar el idToken al backend
        const backendResponse = await fetch(`${API_BASE_URL}/auth/google`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_token: idToken,
            // Puedes enviar datos adicionales si lo necesitas
            // phone: "12345678",
            // age: 25
          }),
        });

        if (!backendResponse.ok) {
          const errorData = await backendResponse.json();
          Alert.alert("Error", errorData.error || "Error al autenticarse con Google");
          setIsSubmitting(false);
          return;
        }

        // 🔹 Recibir la respuesta del backend (JWT + usuario)
        const data = await backendResponse.json();
        console.log("Backend Response:", data);

        // 🔹 Guardar el JWT en AsyncStorage
        await AsyncStorage.setItem("authToken", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));

        Alert.alert("Éxito", "¡Sesión iniciada correctamente!");

        // 🔹 Navegar a la siguiente pantalla
        router.push("/one");
      } else {
        Alert.alert("Cancelado", "El inicio de sesión con Google fue cancelado");
      }
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error en Google Sign In:", error);

      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            Alert.alert("En progreso", "Google Sign In está en progreso");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert("Error", "Google Play Services no está disponible");
            break;
          case statusCodes.SIGN_IN_CANCELLED:
            Alert.alert("Cancelado", "Cancelaste el inicio de sesión");
            break;
          default:
            Alert.alert("Error", "Algo salió mal con Google Sign In");
            break;
        }
      } else {
        Alert.alert("Error", "Error desconocido al iniciar sesión");
      }
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-white relative">
      {/* Decorative circles at bottom */}
      <View className="absolute bottom-0 right-0">
        <View className="w-40 h-40 bg-blue-600 rounded-full absolute -bottom-20 -right-10"></View>
        <View className="w-32 h-32 bg-orange-500 rounded-full absolute -bottom-16 right-20"></View>
      </View>

      <View className={`flex-1 justify-center px-8 ${isVisible ? "opacity-100" : "opacity-0"}`}>
        <View className="mb-16">
          <Text className="text-5xl font-black text-black text-center mb-16">GoChamba</Text>
          <Text className="text-3xl font-semibold text-black mb-2">Iniciar Sesión</Text>
        </View>

        <View className="space-y-6">
          <View className="mb-4">
            <Text className="text-gray-700 text-sm font-medium mb-2">Email</Text>
            <TextInput
              keyboardType="email-address"
              className="w-full h-12 bg-gray-50 rounded-lg px-4 text-black border border-gray-200"
              placeholder=""
              value={email}
              onChangeText={(text) => setEmail(text)}
              autoCapitalize="none"
            />
          </View>
          {/* Password Input */}
          <View>
            <Text className="text-gray-700 text-sm font-medium mb-2">Contraseña</Text>
            <View className="relative">
              <TextInput
                secureTextEntry={!showPassword}
                className="w-full h-12 bg-gray-50 rounded-lg px-4 pr-12 text-black border border-gray-200"
                placeholder=""
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
              <TouchableOpacity className="absolute right-3 top-3" onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <Eye size={20} color="#9CA3AF" /> : <EyeOff size={20} color="#9CA3AF" />}
              </TouchableOpacity>
            </View>
          </View>
          {/* Forgot Password */}
          <View className="items-end mt-2">
            <TouchableOpacity>
              <Text className="text-gray-500 text-sm">¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>
          {/* Login Button */}
          <Link href="/one" className="mt-8" asChild>
            <TouchableOpacity
              className={`w-full h-12 bg-blue-600 rounded-lg flex items-center justify-center ${
                isLoading ? "opacity-80" : ""
              }`}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <View className="flex-row items-center">
                  <View className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></View>
                  <Text className="text-white font-semibold text-base">Ingresando...</Text>
                </View>
              ) : (
                <Text className="text-white font-semibold text-base">Ingresar</Text>
              )}
            </TouchableOpacity>
          </Link>
          {/* Divider */}
          <View className="flex-row items-center my-8">
            <View className="flex-1 h-px bg-gray-200"></View>
            <Text className="mx-4 text-gray-500 text-sm">o</Text>
            <View className="flex-1 h-px bg-gray-200"></View>
          </View>
          {/* Google Sign In */}
          <TouchableOpacity
            onPress={handleGoogleSignIn}
            disabled={isSubmitting}
            className={`w-full h-12 bg-white border border-gray-200 rounded-lg flex-row items-center justify-center ${
              isSubmitting ? "opacity-50" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <View className="w-5 h-5 border-2 border-gray-300/50 border-t-gray-700 rounded-full mr-2"></View>
                <Text className="text-gray-700 font-medium">Conectando...</Text>
              </>
            ) : (
              <>
                <Image source={require("./../assets/logo-google.png")} style={{ width: 20, height: 20, marginRight: 8 }} />
                <Text className="text-gray-700 font-medium">Continuar con Google</Text>
              </>
            )}
          </TouchableOpacity>
          {/* Sign Up Link */}
          <View className="flex-row items-center justify-center mt-8">
            <Text className="text-gray-600">¿No tienes una cuenta? </Text>
            <TouchableOpacity>
              <Text className="text-orange-500 font-semibold">Regístrate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}