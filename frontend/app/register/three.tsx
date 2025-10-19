import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Link, useRouter } from "expo-router";
import { Check, Eye, EyeOff } from "lucide-react-native";
import { useRegister } from "./_register-context";
import { registerUserFinish } from "@/src/services/register.service";
import CenteredSpinner from "@/components/Spinner";

export default function RegisterStepThreeScreen() {
  const navigator = useRouter();
  const { setupData, setSetupData } = useRegister();
  const [isVisible, setIsVisible] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const hasMinLength = (setupData?.password?.length || 0) >= 8;
  const hasNumber = /\d/.test(setupData?.password || "");
  const passwordsMatch =
    setupData?.password && setupData?.confirmPassword && setupData?.password === setupData?.confirmPassword;
  const bothPasswordsFilled = setupData?.password && setupData?.confirmPassword;

  const isFormValid = showPassword
    ? hasMinLength && hasNumber && setupData?.password
    : hasMinLength && hasNumber && passwordsMatch;

  const handleRegister = async () => {
    if (!isFormValid) {
      setShowErrors(true);
      return;
    }

    setIsLoading(true);

    if (!showPassword && setupData?.password !== setupData?.confirmPassword) {
      alert("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    if (showPassword && setupData?.password) {
      setSetupData({ ...setupData, confirmPassword: setupData.password });
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
                  className={`w-full h-12 bg-white rounded-lg px-4 pr-12 text-black border ${
                    showErrors && (!hasMinLength || !hasNumber) ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder=""
                  value={setupData?.password || ""}
                  onChangeText={(text) => {
                    setSetupData({ ...setupData, password: text });
                    if (showErrors) setShowErrors(false);
                  }}
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
                <Text className={`text-sm ${hasMinLength ? "text-green-600" : "text-gray-600"}`}>
                  Al menos 8 caracteres
                </Text>
              </View>
              <View className="flex-row items-center mb-2">
                <View className={`w-4 h-4 rounded-full mr-2 ${hasNumber ? "bg-green-500" : "bg-gray-300"}`}></View>
                <Text className={`text-sm ${hasNumber ? "text-green-600" : "text-gray-600"}`}>Al menos un número</Text>
              </View>
              {!showPassword && (
                <View className="flex-row items-center">
                  <View
                    className={`w-4 h-4 rounded-full mr-2 ${
                      bothPasswordsFilled ? (passwordsMatch ? "bg-green-500" : "bg-red-500") : "bg-gray-300"
                    }`}
                  ></View>
                  <Text
                    className={`text-sm ${
                      bothPasswordsFilled ? (passwordsMatch ? "text-green-600" : "text-red-600") : "text-gray-600"
                    }`}
                  >
                    Las contraseñas coinciden
                  </Text>
                </View>
              )}
            </View>

            {/* Repetir la contraseña */}
            {!showPassword && (
              <View className="mb-4">
                <Text className="text-gray-700 text-sm font-medium mb-2">Repita la contraseña</Text>
                <View className="relative">
                  <TextInput
                    secureTextEntry={!showConfirmPassword}
                    className={`w-full h-12 bg-white rounded-lg px-4 pr-12 text-black border ${
                      bothPasswordsFilled && !passwordsMatch ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder=""
                    value={setupData?.confirmPassword || ""}
                    onChangeText={(text) => {
                      setSetupData({ ...setupData, confirmPassword: text });
                      if (showErrors) setShowErrors(false);
                    }}
                  />
                  <TouchableOpacity
                    className="absolute right-3 top-3"
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <Eye size={20} color="#9CA3AF" /> : <EyeOff size={20} color="#9CA3AF" />}
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {showErrors && (
              <Text className="text-red-500 text-sm mt-2">
                {!hasMinLength || !hasNumber
                  ? "La contraseña debe cumplir con los requisitos"
                  : !passwordsMatch
                    ? "Las contraseñas no coinciden"
                    : "Por favor, complete todos los campos correctamente"}
              </Text>
            )}

            {/* Register Button */}
            <TouchableOpacity
              className={`w-full h-12 rounded-lg flex items-center justify-center mt-8 ${
                isLoading ? "opacity-80" : isFormValid ? "bg-blue-600" : "bg-gray-400"
              }`}
              onPress={handleRegister}
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? (
                <View className="flex-row items-center">
                  <CenteredSpinner color="#fff" />
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
