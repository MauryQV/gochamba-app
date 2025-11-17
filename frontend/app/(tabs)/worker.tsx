import Spinner from "@/components/Spinner";
import { useClientRequests } from "@/src/hooks/use-client-requests";
import { useRegister } from "@/app/register/_register-context";
import { approveRequest, rejectRequest } from "@/src/services/requests.service";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View, RefreshControl } from "react-native";
import { ArrowRight } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function WorkerTab() {
  const { requests, isLoading, refetch } = useClientRequests();
  const { setupData } = useRegister();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleApprove = async (requestId: string) => {
    const token = setupData?.token;
    if (!token) {
      Alert.alert("Error", "No se pudo autenticar la solicitud.");
      return;
    }

    Alert.alert("Aceptar solicitud", "¿Estás seguro de que deseas aceptar esta solicitud?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Aceptar",
        onPress: async () => {
          try {
            setProcessingId(requestId);
            await approveRequest(requestId, token);
            Alert.alert("Éxito", "La solicitud ha sido aceptada.");
            await refetch();
          } catch (error: any) {
            console.error("Error approving request:", error);
            Alert.alert("Error", error?.message || "No se pudo aceptar la solicitud.");
          } finally {
            setProcessingId(null);
          }
        },
      },
    ]);
  };

  const handleReject = async (requestId: string) => {
    const token = setupData?.token;
    if (!token) {
      Alert.alert("Error", "No se pudo autenticar la solicitud.");
      return;
    }

    Alert.alert("Rechazar solicitud", "¿Estás seguro de que deseas rechazar esta solicitud?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Rechazar",
        style: "destructive",
        onPress: async () => {
          try {
            setProcessingId(requestId);
            await rejectRequest(requestId, token);
            Alert.alert("Éxito", "La solicitud ha sido rechazada.");
            await refetch();
          } catch (error: any) {
            console.error("Error rejecting request:", error);
            Alert.alert("Error", error?.message || "No se pudo rechazar la solicitud.");
          } finally {
            setProcessingId(null);
          }
        },
      },
    ]);
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "PENDIENTE":
        return { text: "PENDIENTE", bg: "bg-yellow-100", textColor: "text-yellow-700" };
      case "ACEPTADA":
        return { text: "ACEPTADA", bg: "bg-green-100", textColor: "text-green-700" };
      case "RECHAZADA":
        return { text: "RECHAZADA", bg: "bg-red-100", textColor: "text-red-700" };
      case "COMPLETADA":
        return { text: "COMPLETADA", bg: "bg-blue-100", textColor: "text-blue-700" };
      default:
        return { text: estado, bg: "bg-gray-100", textColor: "text-gray-700" };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className=" px-5 pt-4 pb-4">
        <Text className="text-black text-2xl font-interBold mt-1">Solicitudes de Clientes</Text>
        <TouchableOpacity
          onPress={() => router.push("/works/get-own-services")}
          className={`flex flex-row justify-center mt-2 py-3 rounded-lg items-center bg-blue-600 gap-x-2`}
          activeOpacity={0.8}
        >
          <Text className="text-white font-interSemiBold">Ver servicios ofrecidos</Text>
          <ArrowRight size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {isLoading ? (
          <View className="mt-10 flex flex-col items-center justify-center">
            <Spinner h={36} w={36} />
            <Text className="text-center text-xs mt-4 text-gray-600">Cargando solicitudes...</Text>
          </View>
        ) : !requests || requests.length === 0 ? (
          <View className="mt-10 flex flex-col items-center justify-center">
            <Text className="text-center text-lg mt-4 text-gray-600">No tienes solicitudes.</Text>
          </View>
        ) : (
          requests.map((solicitud) => {
            const statusBadge = getStatusBadge(solicitud.estado);
            const isProcessing = processingId === solicitud.id;

            return (
              <View key={solicitud.id} className="bg-white border border-gray-200 rounded-2xl p-4 my-3 shadow-sm">
                {/* Client Info Header */}
                <View className="flex-row items-center mb-3">
                  <View className="rounded-full overflow-hidden border-2 border-blue-500 mr-3">
                    <Image
                      source={{ uri: solicitud.cliente.perfil.fotoUrl }}
                      className="w-12 h-12"
                      style={{ width: 48, height: 48 }}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-poppinsSemiBold text-gray-900">
                      {solicitud.cliente.perfil.nombreCompleto}
                    </Text>
                    <View className={`${statusBadge.bg} px-2 py-1 rounded-full self-start mt-1`}>
                      <Text className={`${statusBadge.textColor} text-xs font-interSemiBold`}>{statusBadge.text}</Text>
                    </View>
                  </View>
                </View>

                {/* Service Title */}
                <View className="mb-2">
                  <Text className="text-lg font-poppinsSemiBold text-blue-600">{solicitud.servicio.titulo}</Text>
                </View>

                {/* Service Description */}
                <View className="mb-2">
                  <Text className="text-gray-700 text-sm">
                    <Text className="font-interSemiBold">Descripción: </Text>
                    {solicitud.servicio.descripcion}
                  </Text>
                </View>

                {/* Price */}
                <View className="mb-3">
                  <Text className="text-gray-700 text-sm">
                    <Text className="font-interSemiBold">Presupuesto ofrecido: </Text>
                    Bs. {solicitud.servicio.precio}
                  </Text>
                </View>

                {/* Request Date */}
                <View className="mb-3">
                  <Text className="text-gray-600 text-xs">Fecha solicitada: {formatDate(solicitud.creadoEn)}</Text>
                </View>

                {/* Action Buttons - Only show for PENDIENTE status */}
                {solicitud.estado === "PENDIENTE" && (
                  <View className="flex flex-row gap-x-3">
                    <TouchableOpacity
                      onPress={() => handleApprove(solicitud.id)}
                      disabled={isProcessing}
                      className={`flex-1 py-3 rounded-lg items-center ${isProcessing ? "bg-gray-400" : "bg-blue-600"}`}
                      activeOpacity={0.8}
                    >
                      <Text className="text-white font-interSemiBold">
                        {isProcessing ? "Procesando..." : "Aceptar"}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleReject(solicitud.id)}
                      disabled={isProcessing}
                      className={`flex-1 py-3 rounded-lg items-center border ${
                        isProcessing ? "bg-gray-100 border-gray-300" : "bg-white border-gray-300"
                      }`}
                      activeOpacity={0.8}
                    >
                      <Text className={`font-interSemiBold ${isProcessing ? "text-gray-400" : "text-gray-700"}`}>
                        {isProcessing ? "Procesando..." : "Rechazar"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
