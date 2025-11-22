import { StyleSheet } from "react-native";

import Spinner from "@/components/Spinner";
import { usePendingServices } from "@/src/hooks/use-pending-services";
import { useRouter } from "expo-router";
import { ArrowRight, ChevronDown } from "lucide-react-native";
import { useState } from "react";
import { Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function TabOneScreen() {
  const [selectedCategory, setSelectedCategory] = useState("Seleccionar Categoria");
  const [ShowCategories, setShowCategories] = useState(false);
  const { pendingServices, refetch } = usePendingServices();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Extract unique categories from pending services
  const categories = pendingServices
    ? Array.from(new Set(pendingServices.map((s) => s.category))).map((name, index) => ({
        id: String(index),
        name,
      }))
    : [];

  const filteredServices =
    selectedCategory === "Seleccionar Categoria"
      ? pendingServices
      : pendingServices?.filter((s) => s.category === selectedCategory);

  return (
    <View className="flex-1 bg-white">
      {/* Filtros */}
      <View className="flex-row px-4 mt-4 space-x-3">
        {/* Categoría */}
        <View className="flex-1 relative">
          <TouchableOpacity
            className="h-12 bg-gray-100 border border-gray-300 rounded-lg flex-row items-center justify-between px-3"
            onPress={() => setShowCategories(!ShowCategories)}
          >
            <Text className="text-gray-700">{selectedCategory}</Text>
            <ChevronDown size={18} color="#555" />
          </TouchableOpacity>

          {ShowCategories && (
            <View className="absolute w-full bg-white rounded-lg border border-gray-300 mt-14 z-10">
              {/*Mostrar todos*/}
              <TouchableOpacity
                className="px-3 py-2 border-b border-gray-300 bg-gray-100"
                onPress={() => {
                  setSelectedCategory("Seleccionar Categoria");
                  setShowCategories(false);
                }}
              >
                <Text className="font-semibold text-gray-700">Todas las categorías</Text>
              </TouchableOpacity>

              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  className="px-3 py-2 border-b border-gray-200"
                  onPress={() => {
                    setSelectedCategory(cat.name);
                    setShowCategories(false);
                  }}
                >
                  <Text>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Button for pending services */}
      <View className=" px-5 pt-4 pb-4">
        <TouchableOpacity
          onPress={() => router.push("/admin/get-reported-publications")}
          className={`flex flex-row justify-center mt-2 py-3 rounded-lg items-center bg-blue-600 gap-x-2`}
          activeOpacity={0.8}
        >
          <Text className="text-white font-interSemiBold">Ver publicaciones reportadas</Text>
          <ArrowRight size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Lista de servicios */}
      <ScrollView
        className="mt-6 px-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {!filteredServices ? (
          <View className=" mt-10 flex flex-col items-center justify-center">
            <Spinner h={36} w={36} />
            <Text className="text-center text-xs mt-4 text-gray-600">Cargando servicios pendientes</Text>
          </View>
        ) : filteredServices.length === 0 ? (
          <View className="mt-10 flex flex-col items-center justify-center">
            <Text className="text-center text-gray-600">No hay servicios pendientes de revisión</Text>
          </View>
        ) : (
          filteredServices.map((s) => (
            <TouchableOpacity
              key={s.id}
              className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 shadow-sm"
              onPress={() => {
                // Navigate to admin service review screen
                const serviceToView = {
                  id: s.id,
                  title: s.title,
                  description: s.description,
                  price: s.price || 0,
                  category: s.category,
                  trabajador: s.trabajador,
                  profile_photo: s.profile_photo,
                  images: s.images,
                };
                router.push({
                  pathname: "/works/admin-service-review",
                  params: { service: JSON.stringify(serviceToView) },
                });
              }}
              activeOpacity={0.7}
            >
              {/* Header */}
              <View className="flex-row items-center mb-3">
                <View className="flex-1">
                  <View className="flex flex-row items-center justify-between">
                    <Text className="text-lg font-semibold text-blue-600 w-[80%]">{s.title}</Text>
                    <View className="rounded-full overflow-hidden">
                      <Image src={s.profile_photo} width={40} height={40} />
                    </View>
                  </View>
                  <Text className="text-gray-700 text-sm">Categoría: {s.category}</Text>
                  {s.trabajador && <Text className="text-gray-700 text-sm">Trabajador: {s.trabajador}</Text>}
                </View>
              </View>

              {/* Info adicional */}
              <View className="bg-orange-50 px-3 py-2 rounded-lg">
                <Text className="text-orange-700 font-semibold text-center">Toca para revisar y aprobar/rechazar</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
