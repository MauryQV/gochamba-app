import { StatusBar } from "expo-status-bar";
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from "react-native";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, EyeClosed } from "lucide-react-native";
import "./global.css";
export default function App() {
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
  return (
    <View className="h-[100vh] bg-gray-800 relative overflow-hidden flex-1">
      <View
        className={`relative z-10 min-h-screen flex items-center justify-center p-6 transition-all duration-1000 transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <View className="w-full max-w-md">
          <View className="text-center mb-12">
            <View className="mx-autoh-20 rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
              <Text className="text-5xl font-bold text-white mb-2">GoChamba</Text>
            </View>
            <Text className="text-3xl font-bold text-white mb-2">Iniciar Sesión</Text>
            <Text className="text-lg text-white/70">Ingrese para continuar</Text>
          </View>

          <View className="space-y-6">
            <View className="relative group">
              <View className="left-4 top-1/2 z-10">
                <Mail size={20} color="white" />
              </View>
              <View></View>
              <TextInput
                keyboardType="email-address"
                className="w-full h-14 bg-white/10 rounded-2xl pl-12 pr-12 text-white border border-white/20 "
                placeholder="Email address"
                placeholderTextColor="gray"
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
            </View>

            <View className="relative group">
              <View className="left-4 top-1/2 z-10">
                <Lock size={20} color="white" />
              </View>
              <View></View>
              <TextInput
                keyboardType="default"
                className="w-full h-14 bg-white/10 rounded-2xl pl-12 pr-12 text-white border border-white/20"
                placeholder="Password"
                placeholderTextColor="gray"
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
              <TouchableOpacity
                className="absolute right-4 top-1/2 text-gray-400 "
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} color="white" /> : <EyeClosed size={20} color="white" />}
              </TouchableOpacity>
            </View>

            <View className="text-right mt-4">
              <TouchableOpacity>
                <Text className="text-white">¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className={`w-full h-14 rounded-2xl flex items-center justify-center mt-8 group ${
                isLoading ? "opacity-80" : ""
              }`}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <View className="flex items-center">
                  <View className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></View>
                  <Text className="text-white font-semibold text-lg">Signing In...</Text>
                </View>
              ) : (
                <View className="flex-row items-center">
                  <Text className="text-white font-semibold text-lg mr-2">Ingresar</Text>
                  <ArrowRight size={20} color="white" className="transition-transform" />
                </View>
              )}
            </TouchableOpacity>

            <View className="flex items-center my-8">
              <View className="flex-1 h-px bg-white/20"></View>
              <Text className="mx-4 text-white/60">o continua con</Text>
              <View className="flex-1 h-px bg-white/20"></View>
            </View>

            <View className="grid grid-cols-2 gap-4">
              <TouchableOpacity className="h-12 bg-white/10 rounded-xl items-center justify-center border border-white/20 ">
                <Image source={require("./assets/logo-google.png")} style={{ width: 20, height: 20 }} />
                <Text className="text-white font-medium">Google</Text>
              </TouchableOpacity>
            </View>

            <View className="text-center mt-8">
              <Text className="text-white/70">¿No tienes una cuenta? </Text>
              <TouchableOpacity className="text-purple-400 font-semibold hover:text-purple-300 transition-colors">
                <Text>Registrarse</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
