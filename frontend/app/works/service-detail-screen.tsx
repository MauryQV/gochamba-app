import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { requestService } from "@/src/services/works.service";
import { useRegister } from "../register/_register-context";

export default function ServiceDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { setupData } = useRegister();

  const headerOptions = {
    headerTitle: "GoChamba",
    headerStyle: { backgroundColor: "#2563eb" },
    headerTintColor: "#fff",
    headerTitleStyle: { fontFamily: "Poppins_900Black", fontSize: 30 },
    headerTitleAlign: "center" as const,
  };

  // Parse service data from params
  const serviceData = params.service ? JSON.parse(params.service as string) : null;

  const [data, setData] = useState({
    titulo: "",
    descripcion: "",
    precio: "",
    categoria: "",
    trabajador: "",
    profilePhoto: "",
  });

  const [images, setImages] = useState<string[]>([]);
  const [isRequesting, setIsRequesting] = useState(false);

  // Initialize with service data
  useEffect(() => {
    if (serviceData) {
      setData({
        titulo: serviceData.titulo || serviceData.title || "",
        descripcion: serviceData.descripcion || serviceData.description || "",
        precio: serviceData.precio?.toString() || serviceData.price?.toString() || "",
        categoria: serviceData.categoria || serviceData.category || "",
        trabajador: serviceData.trabajador || "",
        profilePhoto: serviceData.profile_photo || "",
      });

      setImages(serviceData.imagenes || serviceData.images || []);
    }
  }, []);

  const handleSolicitarServicio = async () => {
    if (!serviceData?.id) {
      Alert.alert("Error", "No se pudo identificar el servicio.");
      return;
    }

    const token = setupData?.token;
    if (!token) {
      Alert.alert("Autenticación requerida", "Debes iniciar sesión para solicitar un servicio.");
      return;
    }

    try {
      setIsRequesting(true);
      await requestService(serviceData.id, token);

      Alert.alert(
        "Solicitud enviada",
        "Tu solicitud de servicio ha sido enviada exitosamente. El trabajador se pondrá en contacto contigo pronto.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      console.error("Error requesting service:", error);
      const message = error?.message || "No se pudo enviar la solicitud";
      Alert.alert("Error", message);
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <View className="flex-1 bg-white relative">
      <Stack.Screen options={headerOptions} />

      {/* Círculos decorativos */}
      <View className="absolute bottom-0 right-0 pointer-events-none">
        <View className="w-40 h-40 bg-blue-600 rounded-full absolute -bottom-20 -right-10"></View>
        <View className="w-32 h-32 bg-orange-500 rounded-full absolute -bottom-16 right-20"></View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} className="flex-1 px-5 pt-4">
        {/* Información del trabajador */}
        {data.trabajador && (
          <View className="flex-row items-center mb-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <View className="rounded-full overflow-hidden mr-3 border-2 border-blue-500">
              <Image source={{ uri: data.profilePhoto }} className="w-16 h-16" style={{ width: 64, height: 64 }} />
            </View>
            <View>
              <Text className="text-gray-600 text-xs font-interMedium">Trabajador</Text>
              <Text className="text-gray-900 text-lg font-poppinsSemiBold">{data.trabajador}</Text>
            </View>
          </View>
        )}

        {/* Título */}
        <Text className="text-2xl font-poppinsBold text-gray-900 mb-2">{data.titulo}</Text>

        {/* Categoría */}
        <View className="flex-row items-center mb-4">
          <View className="bg-blue-100 px-3 py-1 rounded-full">
            <Text className="text-blue-700 font-interSemiBold text-sm">{data.categoria}</Text>
          </View>
        </View>

        {/* Precio */}
        <View className="mb-5 bg-green-50 p-4 rounded-xl border border-green-200">
          <Text className="text-gray-600 text-sm font-interMedium mb-1">Precio del servicio</Text>
          <Text className="text-green-700 text-3xl font-poppinsBold">Bs. {data.precio}</Text>
        </View>

        {/* Imágenes del servicio */}
        {images.length > 0 && (
          <View className="mb-6">
            <Text className="text-gray-800 text-lg font-poppinsSemiBold mb-3">
              Galería ({images.length} {images.length === 1 ? "imagen" : "imágenes"})
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row -mx-1">
              {images.map((img, index) => (
                <View key={index + img} className="mx-1">
                  <Image
                    source={{ uri: img }}
                    className="rounded-xl border border-gray-200"
                    style={{ width: 200, height: 200 }}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Descripción */}
        <View className="mb-6">
          <Text className="text-gray-800 text-lg font-poppinsSemiBold mb-2">Descripción del servicio</Text>
          <View className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <Text className="text-gray-700 text-base leading-6">{data.descripcion}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Botón fijo en la parte inferior */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 py-4">
        <TouchableOpacity
          className={`py-4 rounded-xl items-center ${isRequesting ? "bg-gray-400" : "bg-blue-600"} shadow-lg`}
          onPress={handleSolicitarServicio}
          disabled={isRequesting}
          activeOpacity={0.8}
        >
          {isRequesting ? (
            <View className="flex-row items-center">
              <ActivityIndicator size="small" color="#fff" />
              <Text className="text-white text-lg font-poppinsSemiBold ml-2">Enviando solicitud...</Text>
            </View>
          ) : (
            <Text className="text-white text-lg font-poppinsSemiBold">Solicitar servicio</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
