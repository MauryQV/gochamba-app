import Spinner from "@/components/Spinner";
import { useReportedServices } from "@/src/hooks/use-reported-services";
import { useRouter } from "expo-router";
import { ArrowLeft, Eye, Trash2 } from "lucide-react-native";
import { useState } from "react";
import { Alert, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function GetReportedPublications() {
  const router = useRouter();
  const { reportedServices, loading, refetch, unableService } = useReportedServices();
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleUnableService = (reportId: string, serviceTitle: string) => {
    Alert.alert("Eliminar Publicación", `¿Estás seguro de que deseas eliminar la publicación "${serviceTitle}"?`, [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          setProcessingId(reportId);
          const result = await unableService(reportId);
          setProcessingId(null);

          if (result.success) {
            Alert.alert("Éxito", "La publicación ha sido eliminada");
          } else {
            Alert.alert("Error", result.error || "No se pudo eliminar la publicación");
          }
        },
      },
    ]);
  };

  const handleReview = (report: any) => {
    router.push({
      pathname: "/admin/review-report",
      params: { report: JSON.stringify(report) },
    });
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-blue-600 pt-12 pb-6 px-4">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Publicaciones Reportadas</Text>
      </View>

      <ScrollView
        className="flex-1 px-4 mt-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {loading && !reportedServices ? (
          <View className="mt-10 flex flex-col items-center justify-center">
            <Spinner h={36} w={36} />
            <Text className="text-center text-xs mt-4 text-gray-600">Cargando reportes</Text>
          </View>
        ) : !reportedServices || reportedServices.length === 0 ? (
          <View className="mt-10 flex flex-col items-center justify-center">
            <Text className="text-center text-gray-600">No hay publicaciones reportadas</Text>
          </View>
        ) : (
          reportedServices.map((report) => (
            <View key={report.id} className="bg-white border border-gray-200 rounded-2xl p-4 mb-4 shadow-sm">
              {/* Service Info */}
              <View className="mb-3">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-lg font-semibold text-blue-600 flex-1">{report.servicio.titulo}</Text>
                  <Image
                    source={{ uri: report.servicio.PerfilTrabajador.perfil.fotoUrl }}
                    className="w-10 h-10 rounded-full"
                  />
                </View>
                <Text className="text-gray-700 text-sm mb-1">
                  Trabajador: {report.servicio.PerfilTrabajador.perfil.nombreCompleto}
                </Text>
                <Text className="text-gray-700 text-sm mb-1">Precio: Bs. {report.servicio.precio}</Text>
              </View>

              {/* Report Info */}
              <View className="bg-red-50 p-3 rounded-lg mb-3">
                <Text className="text-red-800 font-semibold mb-1">Motivo: {report.motivo}</Text>
                <Text className="text-red-700 text-sm mb-1">Descripción: {report.descripcion}</Text>
                <Text className="text-red-700 text-sm">Reportado por: {report.usuario.perfil.nombreCompleto}</Text>
                <Text className="text-red-600 text-xs mt-1">
                  Estado: {report.estado} | Fecha: {new Date(report.creadoEn).toLocaleDateString()}
                </Text>
              </View>

              {/* Action Buttons */}
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => handleUnableService(report.id, report.servicio.titulo)}
                  disabled={processingId === report.id}
                  className={`flex-1 flex-row items-center justify-center bg-red-600 py-3 rounded-lg ${
                    processingId === report.id ? "opacity-50" : ""
                  }`}
                  activeOpacity={0.8}
                >
                  <Trash2 size={18} color="#fff" />
                  <Text className="text-white font-semibold ml-2">
                    {processingId === report.id ? "Procesando..." : "Eliminar"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleReview(report)}
                  className="flex-1 flex-row items-center justify-center bg-blue-600 py-3 rounded-lg"
                  activeOpacity={0.8}
                >
                  <Eye size={18} color="#fff" />
                  <Text className="text-white font-semibold ml-2">Revisar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
