import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";

export default function SeeServiceScreen() {
  const params = useLocalSearchParams();

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
  });

  const [images, setImages] = useState<Array<{ id: string; url: string; orden: number }>>([]);

  // Initialize form with service data
  useEffect(() => {
    if (serviceData) {
      setData({
        titulo: serviceData.titulo || "",
        descripcion: serviceData.descripcion || "",
        precio: serviceData.precio?.toString() || "",
        categoria: serviceData.categoria || "",
      });

      setImages(serviceData.imagenes || []);
    }
  }, []);

  return (
    <View className="flex-1 bg-white relative">
      <Stack.Screen options={headerOptions} />

      {/* Círculos decorativos */}
      <View className="absolute bottom-0 right-0">
        <View className="w-40 h-40 bg-blue-600 rounded-full absolute -bottom-20 -right-10"></View>
        <View className="w-32 h-32 bg-orange-500 rounded-full absolute -bottom-16 right-20"></View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="flex-1 px-5 pt-4">
        {/* Título del formulario */}
        <Text className="text-xl font-poppinsBold text-gray-800 mb-4">Detalles del servicio</Text>

        {/* Título */}
        <View className="mb-5">
          <Text className="text-gray-600 text-sm font-interMedium mb-1">Título</Text>
          <View className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3">
            <Text className="text-gray-800">{data.titulo}</Text>
          </View>
        </View>

        {/* Descripción */}
        <View className="mb-5">
          <Text className="text-gray-600 text-sm font-interMedium mb-1">Descripción</Text>
          <View className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 min-h-[96px]">
            <Text className="text-gray-800">{data.descripcion}</Text>
          </View>
        </View>

        {/* Categoría */}
        <View className="mb-5">
          <Text className="text-gray-600 text-sm font-interMedium mb-1">Categoría</Text>
          <View className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3">
            <Text className="text-gray-800">{data.categoria}</Text>
          </View>
        </View>

        {/* Precio */}
        <View className="mb-5">
          <Text className="text-gray-600 text-sm font-interMedium mb-1">Precio</Text>
          <View className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3">
            <Text className="text-gray-800">Bs. {data.precio}</Text>
          </View>
        </View>

        {/* Imágenes */}
        {images.length > 0 && (
          <View className="mb-6">
            <Text className="text-gray-600 text-sm font-interMedium mb-2">Imágenes del servicio ({images.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              {images.map((img) => (
                <View key={img.id} className="mr-3">
                  <Image
                    source={{ uri: img.url }}
                    className="w-32 h-32 rounded-lg border border-gray-200"
                    style={{ width: 128, height: 128 }}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
