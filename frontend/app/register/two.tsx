import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Link, useRouter } from "expo-router";
import { Check } from "lucide-react-native";
import { useRegister } from "./_register-context";

export default function RegisterStepTwoScreen() {
  const { setupData, setSetupData } = useRegister();

  const navigator = useRouter();
  const handleContinue = () => {
    // Handle continue logic
    // Navigate to next step
    navigator.push("/register/three");
  };

  return (
    <View className="flex-1 bg-white">
      {/* Decorative circles at bottom */}
      <View className="absolute bottom-0 right-0">
        <View className="w-40 h-40 bg-blue-600 rounded-full absolute -bottom-20 -right-10"></View>
        <View className="w-32 h-32 bg-orange-500 rounded-full absolute -bottom-16 right-20"></View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}

        <View className={`flex-1 px-8 pt-4 `}>
          <View className="mb-8">
            <Text className="text-3xl font-semibold text-black mb-1">Registrarse en</Text>
            <Text className="text-4xl font-black text-black mb-8">GoChamba</Text>

            <Text className="text-lg font-semibold text-black">Datos de contacto</Text>
          </View>

          <View className="space-y-6">
            {/* Número de teléfono */}
            <View className="mb-4">
              <Text className="text-gray-700 text-sm font-medium mb-2">Número de teléfono</Text>
              <TextInput
                className="w-full h-12 bg-white rounded-lg px-4 text-black border border-gray-300"
                placeholder=""
                value={setupData?.telefono || ""}
                onChangeText={(text) => setSetupData({ ...setupData, telefono: text })}
                keyboardType="phone-pad"
              />
            </View>

            {/* WhatsApp Checkbox */}
            <View className="mb-4">
              <TouchableOpacity
                onPress={() => setSetupData({ ...setupData, tiene_whatsapp: !setupData?.tiene_whatsapp })}
                className="flex-row items-center"
              >
                <View
                  className={`w-5 h-5 rounded border-2 ${setupData?.tiene_whatsapp ? "bg-blue-600 border-blue-600" : "border-gray-300"} items-center justify-center mr-3`}
                >
                  {setupData?.tiene_whatsapp && <Check size={14} color="white" />}
                </View>
                <Text className="text-gray-700 text-sm">¿Tiene Whatsapp?</Text>
              </TouchableOpacity>
            </View>

            {/* Email */}
            <View className="mb-4">
              <Text className="text-gray-700 text-sm font-medium mb-2">Email</Text>
              {true ? (
                <TextInput
                  className="w-full h-12 bg-gray-200 rounded-lg px-4 text-black border border-gray-300"
                  placeholder=""
                  editable={false}
                  value={setupData?.email || ""}
                />
              ) : (
                <TextInput
                  className="w-full h-12 bg-white rounded-lg px-4 text-black border border-gray-300"
                  placeholder=""
                  value={setupData?.email || ""}
                  onChangeText={(text) => setSetupData({ ...setupData, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              className="w-full h-12 bg-blue-600 rounded-lg flex items-center justify-center mt-8"
              onPress={handleContinue}
            >
              <View className="flex-row items-center">
                <Text className="text-white font-semibold text-base mr-2">Siguiente</Text>
                <Text className="text-white text-lg">→</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
