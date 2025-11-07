import { StyleSheet } from "react-native";

import Spinner from "@/components/Spinner";
import { useServices } from "@/src/hooks/use-services";
import { ChevronDown } from "lucide-react-native";
import { useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

export default function TabOneScreen() {
  const [selectedCategory, setSelectedCategory] = useState("Seleccionar Categoria");
  const [ShowCategories, setShowCategories] = useState(false);
  const [price, setPrice] = useState("");
  const { listServices, categories } = useServices();
  const router = useRouter();

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
              {categories.map((cat, idx) => (
                <TouchableOpacity
                  key={idx}
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
        {/* Precio */}
        <TextInput
          className="w-28 h-12 bg-gray-100 border border-gray-300 rounded-lg px-3"
          placeholder="Precio"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
      </View>
      {/* Lista de servicios */}
      <ScrollView className="mt-6 px-4">
        {!listServices ? (
          <View className=" mt-10 flex flex-col items-center justify-center">
            <Spinner h={36} w={36} />
            <Text className="text-center text-xs mt-4 text-gray-600">Cargando servicios disponibles</Text>
          </View>
        ) : (
          listServices.map((s) => (
            <TouchableOpacity
              key={s.id}
              className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 shadow-sm"
              onPress={() => {
                // Navigate to service detail screen
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
                  pathname: "/works/service-detail-screen",
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
              <View className="bg-blue-50 px-3 py-2 rounded-lg">
                <Text className="text-blue-700 font-semibold text-center">Toca para ver detalles y solicitar</Text>
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
