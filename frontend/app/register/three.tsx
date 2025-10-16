import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Link, useRouter } from "expo-router";
import { Check, Eye, EyeOff } from "lucide-react-native";
import { useRegister } from "./_register-context";
import { registerUserFinish } from "@/src/services/register.service";

export default function RegisterStepThreeScreen() {
  const navigator = useRouter();
  const { setupData, setSetupData } = useRegister();
  const [isVisible, setIsVisible] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Password validation
  const hasMinLength = setupData?.password.length >= 8;
  const hasNumber = /\d/.test(setupData?.password || "");

  const handleRegister = async () => {
    setIsLoading(true);

    if (setupData?.password !== setupData?.confirmPassword) {
      alert("Las contraseñas no coinciden");
      setIsLoading(false);

      return;
    }

    try {
      await registerUserFinish(setupData);
      navigator.push("/one");
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Error registering user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Decorative circles at bottom */}
      <View className="absolute bottom-0 right-0">
        <View className="w-40 h-40 bg-blue-600 rounded-full absolute -bottom-20 -right-10"></View>
        <View className="w-32 h-32 bg-orange-500 rounded-full absolute -bottom-16 right-20"></View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className={`flex-1 px-8 pt-4 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          <View className="mb-8">
            <Text className="text-3xl font-semibold text-black mb-1">Registrarse en</Text>
            <Text className="text-4xl font-black text-black mb-8">GoChamba</Text>

            <Text className="text-lg font-semibold text-black">Seguridad</Text>
          </View>

          <View className="space-y-6">
            {/* Contraseña */}
            <View className="mb-4">
              <Text className="text-gray-700 text-sm font-medium mb-2">Contraseña</Text>
              <View className="relative">
                <TextInput
                  secureTextEntry={!showPassword}
                  className="w-full h-12 bg-white rounded-lg px-4 pr-12 text-black border border-gray-300"
                  placeholder=""
                  value={setupData?.password || ""}
                  onChangeText={(text) => setSetupData({ ...setupData, password: text })}
                />
                <TouchableOpacity className="absolute right-3 top-3" onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? <Eye size={20} color="#9CA3AF" /> : <EyeOff size={20} color="#9CA3AF" />}
                </TouchableOpacity>
              </View>
            </View>

            {/* Password Requirements */}
            <View className="mb-4">
              <View className="flex-row items-center mb-2">
                <View className={`w-4 h-4 rounded-full mr-2 ${hasMinLength ? "bg-green-500" : "bg-gray-300"}`}></View>
                <Text className="text-gray-600 text-sm">Al menos 8 caracteres</Text>
              </View>
              <View className="flex-row items-center">
                <View className={`w-4 h-4 rounded-full mr-2 ${hasNumber ? "bg-green-500" : "bg-gray-300"}`}></View>
                <Text className="text-gray-600 text-sm">Al menos un número</Text>
              </View>
            </View>

            {/* Repetir la contraseña */}
            <View className="mb-4">
              <Text className="text-gray-700 text-sm font-medium mb-2">Repita la contraseña</Text>
              <View className="relative">
                <TextInput
                  secureTextEntry={!showConfirmPassword}
                  className="w-full h-12 bg-white rounded-lg px-4 pr-12 text-black border border-gray-300"
                  placeholder=""
                  value={setupData?.confirmPassword || ""}
                  onChangeText={(text) => setSetupData({ ...setupData, confirmPassword: text })}
                />
                <TouchableOpacity
                  className="absolute right-3 top-3"
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <Eye size={20} color="#9CA3AF" /> : <EyeOff size={20} color="#9CA3AF" />}
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              className={`w-full h-12 bg-blue-600 rounded-lg flex items-center justify-center mt-8 ${
                isLoading ? "opacity-80" : ""
              }`}
              onPress={handleRegister}
              disabled={isLoading || !hasMinLength || !hasNumber}
            >
              {isLoading ? (
                <View className="flex-row items-center">
                  <View className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"></View>
                  <Text className="text-white font-semibold text-base">Registrando...</Text>
                </View>
              ) : (
                <View className="flex-row items-center">
                  <Text className="text-white font-semibold text-base mr-2">Registrarse</Text>
                  <Check size={20} color="white" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
