import Dropdown from "@/components/Dropdown-report";
import { useReport } from "@/src/hooks/use-report";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

type ReportMotivo =
  | "CONTENIDO_INAPROPIADO"
  | "INFORMACION_FALSA"
  | "SPAM"
  | "PRECIO_FRAUDULENTO"
  | "SERVICIO_ILEGAL"
  | "OTRO";

type ServiceDetail = {
  id: string;
  title: string;
  trabajador: string;
  profile_photo: string;
};

const MOTIVOS: { value: ReportMotivo; label: string }[] = [
  { value: "CONTENIDO_INAPROPIADO", label: "Contenido Inapropiado" },
  { value: "INFORMACION_FALSA", label: "Información Falsa" },
  { value: "SPAM", label: "Spam" },
  { value: "PRECIO_FRAUDULENTO", label: "Precio Fraudulento" },
  { value: "SERVICIO_ILEGAL", label: "Servicio Ilegal" },
  { value: "OTRO", label: "Otro" },
];

export default function ReportPublicationScreen() {
  const headerOptions = {
    headerTitle: "GoChamba",
    headerStyle: { backgroundColor: "#2563eb" },
    headerTintColor: "#fff",
    headerTitleStyle: { fontFamily: "Poppins_900Black", fontSize: 30 },
    headerTitleAlign: "center" as const,
  };
  const params = useLocalSearchParams();
  const router = useRouter();
  const { submitReport, loading } = useReport();

  const service: ServiceDetail = params.service ? JSON.parse(params.service as string) : null;

  const [selectedMotivo, setSelectedMotivo] = useState<string>("");
  const [descripcion, setDescripcion] = useState("");

  const selectedLabel = MOTIVOS.find((m) => m.value === selectedMotivo)?.label || "";

  if (!service) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-600">No se encontró el servicio</Text>
      </View>
    );
  }

  const handleSubmitReport = async () => {
    if (!selectedMotivo) {
      Alert.alert("Error", "Por favor selecciona un motivo");
      return;
    }

    const result = await submitReport(service.id, selectedMotivo, descripcion || "Sin descripción adicional");

    if (result.success) {
      Alert.alert("Reporte Enviado", "El reporte ha sido enviado exitosamente", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } else {
      Alert.alert("Error", result.error || "No se pudo enviar el reporte");
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={headerOptions} />

      {/* Header */}
      <View className="bg-white pt-6 pb-4 px-4">
        <Text className="text-black text-2xl font-poppinsBold">Reportar Servicio</Text>
      </View>

      <ScrollView className="flex-1 px-6 pb-6">
        {/* Service Info */}
        <View className="bg-gray-50 rounded-lg p-4 mb-6">
          <Text className="text-lg font-semibold mb-3">Detalles del Servicio</Text>
          <View className="flex-row items-center mb-2">
            <Image source={{ uri: service.profile_photo }} className="w-12 h-12 rounded-full mr-3" />
            <View className="flex-1">
              <Text className="font-semibold text-base">{service.trabajador}</Text>
              <Text className="text-gray-600 text-sm">Electricista con 5 años de experiencia</Text>
            </View>
          </View>
          <View className="mt-3 pt-3 border-t border-gray-200">
            <Text className="font-semibold">Servicio: {service.title}</Text>
          </View>
        </View>

        {/* Report Section */}
        <Text className="text-xl font-bold mb-4">REPORTAR</Text>
        <Text className="text-gray-600 mb-4">¿Desea reportar este servicio?</Text>

        {/* Motivo del Reporte */}
        <Dropdown
          label="Motivo del Reporte"
          placeholder="Selecciona un motivo"
          value={selectedLabel}
          options={MOTIVOS.map((m) => m.label)}
          onSelect={(label) => {
            const motivo = MOTIVOS.find((m) => m.label === label);
            if (motivo) setSelectedMotivo(motivo.value);
          }}
          className="mb-4"
        />

        {/* Description Input */}
        <Text className="text-base text-gray-700 mb-3 mt-4">Describe el motivo del reporte</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 h-32 bg-white text-base"
          placeholder="Escribe aquí..."
          placeholderTextColor="#999"
          multiline
          textAlignVertical="top"
          value={descripcion}
          onChangeText={setDescripcion}
        />

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmitReport}
          disabled={loading}
          className={`bg-blue-600 py-4 rounded-lg mt-6 ${loading ? "opacity-50" : ""}`}
          activeOpacity={0.8}
        >
          <Text className="text-white text-center font-bold text-base">{loading ? "ENVIANDO..." : "REPORTAR"}</Text>
        </TouchableOpacity>

        {/* Continue Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-gray-200 py-4 rounded-lg mt-3 mb-6"
          activeOpacity={0.8}
        >
          <Text className="text-gray-700 text-center font-bold text-base">CONTINUAR</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
