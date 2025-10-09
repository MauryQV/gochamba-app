import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { Link, useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
export default function IndexScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

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
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
 const handleGoogleSignIn = async () => {
  try {
    setIsSubmitting(true);
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();

    if (isSuccessResponse(response)) {
      const { idToken, user } = response.data;
      const { name, email, photo } = user;

      console.log("Google user:", { idToken, name, email, photo });

      await sendTokenToBackend(idToken || "");

      router.push("/one");
    } else {
      console.log("Inicio de sesión con Google cancelado");
    }
  } catch (error) {
    console.error("Error en Google Sign-In:", error);
  } finally {
    setIsSubmitting(false);
  }
};

const sendTokenToBackend = async (idToken: string) => {
  try {
    //esta es mi ip local, tendran que usarla la suya de su red
   
    const response = await fetch("http://192.168.0.5:8000/api/google/verify/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_token: idToken, 
      }),
    });

    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }

    const data = await response.json();
    console.log(" Respuesta del backend:", data);

  } catch (error) {
    console.error(" Error enviando token al backend:", error);
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
              className={`w-full h-12 bg-blue-600 rounded-lg flex items-center justify-center  ${
                isLoading ? "opacity-80" : ""
              }`}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <View className="flex-row items-center">
                  <View className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full "></View>
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
            className="w-full h-12 bg-white border border-gray-200 rounded-lg flex-row items-center justify-center"
          >
            <Image source={require("./../assets/logo-google.png")} style={{ width: 20, height: 20, marginRight: 8 }} />
            <Text className="text-gray-700 font-medium">Continuar con Google</Text>
          </TouchableOpacity>
          {/* <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={() => {
              // initiate sign in
            }}
            disabled={false}
          /> */}
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
