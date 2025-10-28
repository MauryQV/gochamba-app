import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Check, ChevronRight } from "lucide-react-native";
import { useRegister } from "./_register-context";

export default function RegisterStepTwoScreen() {
  const { setupData, setSetupData } = useRegister();
  const [showErrors, setShowErrors] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const navigator = useRouter();

  const isFormValid =
    setupData?.telefono && setupData?.telefono !== "" && setupData?.email && setupData?.email !== "" && !phoneError;

  const handleContinue = () => {
    if (!isFormValid) {
      setShowErrors(true);
      return;
    }
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
            <Text className="text-3xl font-poppinsSemiBold text-black mb-1">Registrarse en</Text>
            <Text className="text-5xl font-poppinsBlack text-black mb-8">GoChamba</Text>

            <Text className="text-lg font-poppinsSemiBold text-black">Datos de contacto</Text>
          </View>

          <View className="space-y-6">
            {/* Número de teléfono */}
            <View className="mb-4">
              <Text className="text-gray-700 text-sm font-interMedium mb-2">Número de teléfono</Text>
              <TextInput
                className={`w-full h-12 bg-white rounded-lg px-4 text-black border ${
                  (showErrors && !setupData?.telefono) || phoneError ? "border-red-500" : "border-gray-300"
                }`}
                placeholder=""
                value={setupData?.telefono || ""}
                onChangeText={(text) => {
                  // Check if input contains only digits
                  if (text && !/^\d*$/.test(text)) {
                    setPhoneError("Solo se permiten números (0-9)");
                    return;
                  }

                  // Check if length exceeds 8
                  if (text.length > 8) {
                    setPhoneError("No puede tener más de 8 caracteres");
                    return;
                  }

                  setPhoneError("");
                  setSetupData({ ...setupData, telefono: text });
                  if (showErrors) setShowErrors(false);
                }}
                keyboardType="phone-pad"
              />
              {phoneError && <Text className="text-red-500 text-xs mt-1">{phoneError}</Text>}
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
                <Text className="text-gray-700 font-interMedium text-sm">¿Tiene Whatsapp?</Text>
              </TouchableOpacity>
            </View>

            {/* Email */}
            <View className="mb-4">
              <Text className="text-gray-700 text-sm font-interMedium mb-2">Email</Text>
              {setupData?.googleId ? (
                <TextInput
                  className={`w-full h-12 bg-gray-200 rounded-lg px-4 text-black border ${
                    showErrors && !setupData?.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder=""
                  editable={false}
                  value={setupData?.email || ""}
                />
              ) : (
                <TextInput
                  className={`w-full h-12 bg-white rounded-lg px-4 text-black border ${
                    showErrors && !setupData?.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder=""
                  value={setupData?.email || ""}
                  onChangeText={(text) => {
                    setSetupData({ ...setupData, email: text });
                    if (showErrors) setShowErrors(false);
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            </View>

            {showErrors && (
              <Text className="text-red-500 text-sm mt-2">Por favor, complete todos los campos requeridos</Text>
            )}

            {/* Continue Button */}
            <TouchableOpacity
              className={`w-full h-12 rounded-lg flex items-center justify-center mt-8 ${
                isFormValid ? "bg-blue-600" : "bg-gray-400"
              }`}
              onPress={handleContinue}
              disabled={!isFormValid}
            >
              <View className="flex-row items-center">
                <Text className="text-white font-poppinsSemiBold text-base mr-1.5">Siguiente</Text>
                <ChevronRight color="white" size={20} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
