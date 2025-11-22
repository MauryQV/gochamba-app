import type { ReportedService } from "@/src/hooks/use-reported-services";
import { useReportedServices } from "@/src/hooks/use-reported-services";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Trash2, XCircle } from "lucide-react-native";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ReviewReport() {
  const headerOptions = {
    headerTitle: "GoChamba",
    headerStyle: { backgroundColor: "#2563eb" },
    headerTintColor: "#fff",
    headerTitleStyle: { fontFamily: "Poppins_900Black", fontSize: 30 },
    headerTitleAlign: "center" as const,
  };
  const params = useLocalSearchParams();
  const router = useRouter();
  const { unableService, desestimateReport } = useReportedServices();
  const [loading, setLoading] = useState(false);

  const report: ReportedService = params.report ? JSON.parse(params.report as string) : null;

  if (!report) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-600">No se encontró el reporte</Text>
      </View>
    );
  }

  const handleUnableService = async () => {
    Alert.alert(
      "Eliminar Publicación",
      "¿Estás seguro de que deseas eliminar esta publicación? Esta acción inhabilitará el servicio.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            const result = await unableService(report.id);
            setLoading(false);

            if (result.success) {
              Alert.alert("Éxito", "La publicación ha sido eliminada", [
                {
                  text: "OK",
                  onPress: () => router.back(),
                },
              ]);
            } else {
              Alert.alert("Error", result.error || "No se pudo eliminar la publicación");
            }
          },
        },
      ]
    );
  };

  const handleDesestimate = async () => {
    Alert.alert(
      "Desestimar Reporte",
      "¿Estás seguro de que deseas desestimar este reporte? La publicación quedará activa.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Desestimar",
          onPress: async () => {
            setLoading(true);
            const result = await desestimateReport(report.id);
            setLoading(false);

            if (result.success) {
              Alert.alert("Éxito", "El reporte ha sido desestimado", [
                {
                  text: "OK",
                  onPress: () => router.back(),
                },
              ]);
            } else {
              Alert.alert("Error", result.error || "No se pudo desestimar el reporte");
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={headerOptions} />

      {/* Header */}
      <View className="bg-white pt-6 pb-4 px-4">
        <Text className="text-black text-2xl font-poppinsBold">Revisar Reporte</Text>
      </View>

      <ScrollView className="flex-1">
        {/* Report Information */}
        <View className="bg-red-50 p-5 border-b-2 border-red-200">
          <Text className="text-red-900 text-xl font-bold mb-3">Información del Reporte</Text>
          <View className="mb-2">
            <Text className="text-red-800 font-semibold">Motivo:</Text>
            <Text className="text-red-700">{report.motivo}</Text>
          </View>
          <View className="mb-2">
            <Text className="text-red-800 font-semibold">Descripción:</Text>
            <Text className="text-red-700">{report.descripcion}</Text>
          </View>
          <View className="mb-2">
            <Text className="text-red-800 font-semibold">Estado:</Text>
            <Text className="text-red-700">{report.estado}</Text>
          </View>
          <View className="mb-2">
            <Text className="text-red-800 font-semibold">Fecha de reporte:</Text>
            <Text className="text-red-700">{new Date(report.creadoEn).toLocaleString()}</Text>
          </View>
          {report.resueltoEn && (
            <View className="mb-2">
              <Text className="text-red-800 font-semibold">Resuelto en:</Text>
              <Text className="text-red-700">{new Date(report.resueltoEn).toLocaleString()}</Text>
            </View>
          )}
          {report.resolucion && (
            <View>
              <Text className="text-red-800 font-semibold">Resolución:</Text>
              <Text className="text-red-700">{report.resolucion}</Text>
            </View>
          )}
        </View>

        {/* Reporter Information */}
        <View className="p-5 border-b border-gray-200">
          <Text className="text-gray-900 text-xl font-bold mb-3">Usuario que Reportó</Text>
          <View className="flex-row items-center mb-3">
            <Image source={{ uri: report.usuario.perfil.fotoUrl }} className="w-16 h-16 rounded-full mr-3" />
            <View className="flex-1">
              <Text className="text-gray-800 font-semibold">{report.usuario.perfil.nombreCompleto}</Text>
              <Text className="text-gray-600">{report.usuario.email}</Text>
            </View>
          </View>
        </View>

        {/* Service Information */}
        <View className="p-5">
          <Text className="text-gray-900 text-xl font-bold mb-3">Publicación Reportada</Text>

          {/* Service Title and Price */}
          <View className="mb-4">
            <Text className="text-2xl font-bold text-blue-600 mb-2">{report.servicio.titulo}</Text>
            <View className="bg-green-50 p-3 rounded-lg self-start">
              <Text className="text-green-700 font-bold text-lg">Bs. {report.servicio.precio}</Text>
            </View>
          </View>

          {/* Service Description */}
          <View className="mb-4">
            <Text className="text-gray-700 font-semibold mb-2">Descripción:</Text>
            <Text className="text-gray-600">{report.servicio.descripcion}</Text>
          </View>

          {/* Worker Information */}
          <View className="bg-gray-50 p-4 rounded-lg mb-4">
            <Text className="text-gray-700 font-semibold mb-3">Información del Trabajador</Text>
            <View className="flex-row items-center mb-2">
              <Image
                source={{ uri: report.servicio.PerfilTrabajador.perfil.fotoUrl }}
                className="w-12 h-12 rounded-full mr-3"
              />
              <View className="flex-1">
                <Text className="text-gray-800 font-semibold">
                  {report.servicio.PerfilTrabajador.perfil.nombreCompleto}
                </Text>
                <Text className="text-gray-600 text-sm">CI: {report.servicio.PerfilTrabajador.carnetIdentidad}</Text>
              </View>
            </View>
            <View className="mt-2">
              <Text className="text-gray-600 text-sm">{report.servicio.PerfilTrabajador.descripcion}</Text>
            </View>
          </View>

          {/* Admin Actions */}
          <View className="mb-8">
            <Text className="text-gray-700 font-semibold text-lg mb-4">Acciones de Administrador</Text>

            {/* Disable Service Button */}
            <TouchableOpacity
              onPress={handleUnableService}
              disabled={loading}
              className={`flex-row items-center justify-center bg-red-600 py-4 rounded-lg mb-3 ${
                loading ? "opacity-50" : ""
              }`}
              activeOpacity={0.8}
            >
              <Trash2 size={24} color="#fff" />
              <Text className="text-white font-bold text-lg ml-2">
                {loading ? "Procesando..." : "Eliminar Publicación"}
              </Text>
            </TouchableOpacity>

            {/* Desestimate Report Button */}
            <TouchableOpacity
              onPress={handleDesestimate}
              disabled={loading}
              className={`flex-row items-center justify-center bg-gray-600 py-4 rounded-lg ${
                loading ? "opacity-50" : ""
              }`}
              activeOpacity={0.8}
            >
              <XCircle size={24} color="#fff" />
              <Text className="text-white font-bold text-lg ml-2">
                {loading ? "Procesando..." : "Desestimar Reporte"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
