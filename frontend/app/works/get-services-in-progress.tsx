import Spinner from "@/components/Spinner";
import { useAcceptedRequests } from "@/src/hooks/use-accepted-requests";
import { useRouter, Stack, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View, RefreshControl } from "react-native";

export default function ServicesInProgress() {
  const { requests, isLoading, refetch } = useAcceptedRequests();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const headerOptions = {
    headerTitle: "GoChamba",
    headerStyle: { backgroundColor: "#2563eb" },
    headerTintColor: "#fff",
    headerTitleStyle: { fontFamily: "Poppins_900Black", fontSize: 30 },
    headerTitleAlign: "center" as const,
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
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
      <Stack.Screen options={headerOptions} />

      {/* Header */}
      <View className="px-5 pt-4 pb-4">
        <Text className="text-black text-2xl font-interBold mt-1">Servicios en Curso</Text>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {isLoading ? (
          <View className="mt-10 flex flex-col items-center justify-center">
            <Spinner h={36} w={36} />
            <Text className="text-center text-xs mt-4 text-gray-600">Cargando servicios...</Text>
          </View>
        ) : !requests || requests.length === 0 ? (
          <View className="mt-10 flex flex-col items-center justify-center">
            <Text className="text-center text-lg mt-4 text-gray-600">No tienes servicios en curso.</Text>
          </View>
        ) : (
          requests.map((solicitud) => (
            <View key={solicitud.id} className="bg-white border border-gray-200 rounded-2xl p-4 my-3 shadow-sm">
              {/* Client Info Header */}
              <View className="flex-row mb-2">
                <View className="flex-1 flex-row flex gap-x-3">
                  <Image src={solicitud.cliente.imagenUrl || ""} className="w-14 h-14 rounded-full" />
                  <View className="mb-2">
                    <Text className="text-lg font-poppinsSemiBold text-blue-600">{solicitud.servicio.titulo}</Text>
                    <View className="bg-green-100 px-2 py-1 rounded-full self-start">
                      <Text className="text-green-700 text-xs font-interSemiBold">ACEPTADA</Text>
                    </View>
                  </View>
                </View>
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
                  <Text className="font-interSemiBold">Precio acordado: </Text>
                  Bs. {solicitud.servicio.precio}
                </Text>
              </View>

              {/* Location */}
              {solicitud.cliente.departamento && (
                <View className="mb-3">
                  <Text className="text-gray-700 text-sm">
                    <Text className="font-interSemiBold">Ubicación: </Text>
                    {solicitud.cliente.departamento}
                  </Text>
                </View>
              )}

              {/* Request Date */}
              <View className="mb-3">
                <Text className="text-gray-600 text-xs">Fecha aceptada: {formatDate(solicitud.actualizadoEn)}</Text>
              </View>

              {/* Mark as Complete Button */}
              <TouchableOpacity
                onPress={() => {
                  router.push({
                    pathname: "/requests/rate-job",
                    params: {
                      requestId: solicitud.id,
                      serviceTitle: solicitud.servicio.titulo,
                      clientName: solicitud.servicio.trabajador.nombreCompleto,
                      category: solicitud.servicio.categoria,
                      price: solicitud.servicio.precio.toString(),
                      imageUrl: solicitud.cliente.imagenUrl || "",
                      location: solicitud.cliente.departamento || "",
                      date: formatDate(solicitud.creadoEn),
                    },
                  });
                }}
                className="py-3 rounded-lg items-center bg-blue-600"
                activeOpacity={0.8}
              >
                <Text className="text-white font-interSemiBold">Marcar como acabado</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
