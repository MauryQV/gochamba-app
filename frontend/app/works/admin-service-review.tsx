import { usePendingServices } from "@/src/hooks/use-pending-services";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle, User, XCircle } from "lucide-react-native";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

type ServiceDetail = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  trabajador: string;
  profile_photo: string;
  images: { id: string; imagenUrl: string; orden: number }[];
};

export default function AdminServiceReview() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { approveService, rejectService } = usePendingServices();
  const [loading, setLoading] = useState(false);

  const headerOptions = {
    headerTitle: "GoChamba",
    headerStyle: { backgroundColor: "#2563eb" },
    headerTintColor: "#fff",
    headerTitleStyle: { fontFamily: "Poppins_900Black", fontSize: 30 },
    headerTitleAlign: "center" as const,
  };
  const service: ServiceDetail = params.service ? JSON.parse(params.service as string) : null;

  if (!service) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-600">No se encontró el servicio</Text>
      </View>
    );
  }

  const handleApprove = async () => {
    Alert.alert("Aprobar Servicio", "¿Estás seguro de que deseas aprobar esta publicación?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Aprobar",
        onPress: async () => {
          setLoading(true);
          const result = await approveService(service.id);
          setLoading(false);

          if (result.success) {
            Alert.alert("Éxito", "El servicio ha sido aprobado", [
              {
                text: "OK",
                onPress: () => router.back(),
              },
            ]);
          } else {
            Alert.alert("Error", result.error || "No se pudo aprobar el servicio");
          }
        },
      },
    ]);
  };

  const handleReject = async () => {
    Alert.alert("Rechazar Servicio", "¿Estás seguro de que deseas rechazar esta publicación?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Rechazar",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          const result = await rejectService(service.id);
          setLoading(false);

          if (result.success) {
            Alert.alert("Éxito", "El servicio ha sido rechazado", [
              {
                text: "OK",
                onPress: () => router.back(),
              },
            ]);
          } else {
            Alert.alert("Error", result.error || "No se pudo rechazar el servicio");
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={headerOptions} />

      {/* Header */}
      <View className="bg-white pt-6 pb-4 px-4">
        <Text className="text-black text-2xl font-poppinsBold">Revisar Publicación</Text>
      </View>

      <ScrollView className="flex-1">
        {/* Service Images */}
        {service.images && service.images.length > 0 && (
          <View className="bg-gray-100">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="p-4">
              {service.images.map((img) => (
                <Image
                  key={img.id}
                  source={{ uri: img.imagenUrl }}
                  className="w-80 h-60 rounded-lg mr-3"
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Service Details */}
        <View className="p-5">
          {/* Title */}
          <Text className="text-2xl font-bold text-gray-800 mb-2">{service.title}</Text>

          {/* Category */}
          <View className="bg-blue-50 px-3 py-2 rounded-lg mb-4 self-start">
            <Text className="text-blue-700 font-semibold">{service.category}</Text>
          </View>

          {/* Price */}
          <View className="bg-green-50 p-4 rounded-lg mb-4">
            <Text className="text-gray-600 text-sm mb-1">Precio</Text>
            <Text className="text-green-700 text-2xl font-bold">Bs. {service.price}</Text>
          </View>

          {/* Worker Info */}
          <View className="bg-gray-50 p-4 rounded-lg mb-4">
            <Text className="text-gray-700 font-semibold mb-3">Información del Trabajador</Text>
            <View className="flex-row items-center mb-2">
              <Image source={{ uri: service.profile_photo }} className="w-12 h-12 rounded-full mr-3" />
              <View className="flex-1">
                <View className="flex-row items-center mb-1">
                  <User size={16} color="#555" />
                  <Text className="text-gray-800 ml-2">{service.trabajador}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-gray-700 font-semibold text-lg mb-2">Descripción</Text>
            <Text className="text-gray-600 leading-6">{service.description}</Text>
          </View>

          {/* Admin Actions */}
          <View className="mb-8">
            <Text className="text-gray-700 font-semibold text-lg mb-4">Acciones de Administrador</Text>

            {/* Approve Button */}
            <TouchableOpacity
              onPress={handleApprove}
              disabled={loading}
              className={`flex-row items-center justify-center bg-green-600 py-4 rounded-lg mb-3 ${
                loading ? "opacity-50" : ""
              }`}
              activeOpacity={0.8}
            >
              <CheckCircle size={24} color="#fff" />
              <Text className="text-white font-bold text-lg ml-2">
                {loading ? "Procesando..." : "Aprobar Publicación"}
              </Text>
            </TouchableOpacity>

            {/* Reject Button */}
            <TouchableOpacity
              onPress={handleReject}
              disabled={loading}
              className={`flex-row items-center justify-center bg-red-600 py-4 rounded-lg ${
                loading ? "opacity-50" : ""
              }`}
              activeOpacity={0.8}
            >
              <XCircle size={24} color="#fff" />
              <Text className="text-white font-bold text-lg ml-2">
                {loading ? "Procesando..." : "Rechazar Publicación"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
