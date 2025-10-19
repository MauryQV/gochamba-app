import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import { UserRound, Plus, Info } from "lucide-react-native";
import Dropdown from "../../components/Dropdown";
import { useRegister } from "./_register-context";
import { useUploadImage } from "./hooks/_use_upload_image";
const departamentos = [
  "La Paz",
  "Cochabamba",
  "Santa Cruz",
  "Oruro",
  "Potosí",
  "Chuquisaca",
  "Tarija",
  "Beni",
  "Pando",
];

export default function RegisterScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [showErrors, setShowErrors] = useState(false);

  const { setup } = useLocalSearchParams();
  const { setupData, setSetupData } = useRegister();
  useEffect(() => {
    if (setup && !setupData) {
      const dataObj = JSON.parse(setup as string);
      setSetupData({
        ...dataObj.user.perfil,
        userId: dataObj.user.id || "",
        nombreCompleto: dataObj.user.perfil.nombreCompleto || "",
        direccion: "",
        departamento: "",
        telefono: "",
        password: "",
        confirmPassword: "",
        fotoUrl: dataObj.user.perfil.fotoUrl || "",
        email: dataObj.user.email || "",
        tiene_whatsapp: false,
        googleId: dataObj.user.googleId || null,
      });
    }
  }, [setup]);

  const router = useRouter();

  const isFormValid =
    setupData?.nombreCompleto &&
    setupData?.nombreCompleto !== "" &&
    setupData?.direccion &&
    setupData?.direccion !== "" &&
    setupData?.fotoUrl &&
    setupData?.fotoUrl !== "" &&
    setupData?.departamento &&
    setupData?.departamento !== "";

  const handleContinue = () => {
    if (!isFormValid) {
      setShowErrors(true);
      return;
    }
    router.push("/register/two");
  };

  const { handleImagePicker } = useUploadImage(setSetupData);

  return (
    <View className="flex-1 bg-white">
      {/* Decorative circles at bottom */}
      <View className="absolute bottom-0 right-0">
        <View className="w-40 h-40 bg-blue-600 rounded-full absolute -bottom-20 -right-10"></View>
        <View className="w-32 h-32 bg-orange-500 rounded-full absolute -bottom-16 right-20"></View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className={`flex-1 justify-center px-8 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          <View className="mb-8">
            <Text className="text-3xl font-semibold text-black mb-1">Registrarse en</Text>
            <Text className="text-4xl font-black text-black mb-8">GoChamba</Text>

            <Text className="text-lg font-semibold text-black">Datos personales</Text>
          </View>

          <View className="space-y-6">
            {/* Profile Photo */}
            <View className="flex-row items-center mt-1">
              <Text className="text-gray-700 text-sm font-medium">Fotografía</Text>
              <View className="w-4 h-4 rounded-full items-center justify-center ml-1">
                <Info size={16} strokeWidth={2.5} fill="#2563eb" color="white" />
              </View>
            </View>
            <View className="items-center mb-6">
              <View className="relative">
                <TouchableOpacity
                  onPress={handleImagePicker}
                  className={`w-24 h-24 rounded-full items-center justify-center ${
                    showErrors && !setupData?.fotoUrl ? "bg-red-100 border-2 border-red-500" : "bg-blue-100"
                  }`}
                >
                  {setupData?.fotoUrl ? (
                    <Image src={setupData?.fotoUrl || ""} className="w-24 h-24 rounded-full" />
                  ) : (
                    <View className="items-center">
                      <UserRound size={40} color={showErrors && !setupData?.fotoUrl ? "#ef4444" : "#60a5fa"} />
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity onPress={handleImagePicker}>
                  <View className="absolute -bottom-1 right-0 w-6 h-6 bg-blue-500 rounded-full items-center justify-center">
                    <Plus size={12} color="white" />
                  </View>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={handleImagePicker}>
                <Text
                  className={`text-sm mt-2 font-medium ${
                    showErrors && !setupData?.fotoUrl ? "text-red-500" : "text-orange-500"
                  }`}
                >
                  {setupData?.fotoUrl ? "Cambiar fotografía" : "Agregar fotografía"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Nombre Completo */}
            <View className="mb-4">
              <Text className="text-gray-700 text-sm font-medium mb-2">Nombre Completo</Text>
              <TextInput
                className={`w-full h-12 bg-white rounded-lg px-4 text-black border ${
                  showErrors && !setupData?.nombreCompleto ? "border-red-500" : "border-gray-300"
                }`}
                placeholder=""
                value={setupData?.nombreCompleto || ""}
                onChangeText={(text) => {
                  setSetupData({ ...setupData, nombreCompleto: text });
                  if (showErrors) setShowErrors(false);
                }}
                autoCapitalize="words"
              />
            </View>

            {/* Dirección */}
            <View className="mb-4">
              <Text className="text-gray-700 text-sm font-medium mb-2">Dirección</Text>
              <TextInput
                className={`w-full h-12 bg-white rounded-lg px-4 text-black border ${
                  showErrors && !setupData?.direccion ? "border-red-500" : "border-gray-300"
                }`}
                placeholder=""
                value={setupData?.direccion || ""}
                onChangeText={(text) => {
                  setSetupData({ ...setupData, direccion: text });
                  if (showErrors) setShowErrors(false);
                }}
              />
            </View>

            {/* Departamento Dropdown */}
            <Dropdown
              label="Seleccione el departamento"
              placeholder="Seleccione un departamento"
              value={setupData?.departamento || ""}
              options={departamentos}
              onSelect={(option) => {
                setSetupData({ ...setupData, departamento: option });
                if (showErrors) setShowErrors(false);
              }}
              className=""
              error={showErrors && !setupData?.departamento}
            />

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
