import Spinner from "@/components/Spinner";
import { usePublicationsWorker } from "@/src/hooks/use-publications-worker";
import { useRouter, Stack } from "expo-router";
import { ChevronDown, DeleteIcon, Eye, Pencil } from "lucide-react-native";
import { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function OwnServices() {
  const [selectedCategory, setSelectedCategory] = useState("Seleccionar Categoria");
  const [ShowCategories, setShowCategories] = useState(false);
  const [price, setPrice] = useState("");
  const router = useRouter();
  const headerOptions = {
    headerTitle: "GoChamba",
    headerStyle: { backgroundColor: "#2563eb" },
    headerTintColor: "#fff",
    headerTitleStyle: { fontFamily: "Poppins_900Black", fontSize: 30 },
    headerTitleAlign: "center" as const,
  };

  const { listServices, categories } = usePublicationsWorker();

  const handlePublicarServicio = () => {
    // usar router.push para navegar con expo-router
    router.push("/works/PublishServiceScreen");
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={headerOptions} />
      {/* Filtros */}
      <Text className="text-xl px-5 mt-4 space-x-3 font-poppinsBold text-gray-800 mb-4">Servicios ofrecidos</Text>
      <View className="flex-row px-4 space-x-3">
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
      </View>

      {/* Lista de servicios */}
      <ScrollView className="mt-6 px-4">
        {!listServices ? (
          <View className=" mt-10 flex flex-col items-center justify-center">
            <Spinner h={36} w={36} />
            <Text className="text-center text-xs mt-4 text-gray-600">Cargando servicios disponibles</Text>
          </View>
        ) : listServices.length > 0 ? (
          listServices.map((s) => (
            <View key={s.id} className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 shadow-sm">
              {/* Header */}
              <View className="flex-row items-center mb-3">
                <View>
                  <View className="flex flex-row items-center justify-between">
                    <Text className="text-lg font-semibold text-blue-600 w-[100%]">{s.title}</Text>
                  </View>
                  <Text className="text-gray-700 text-sm">Categoría: {s.category}</Text>
                  {s.description && (
                    <Text className="text-gray-700 text-sm" numberOfLines={2} ellipsizeMode="tail">
                      <Text className="font-semibold">Descripción: </Text>
                      {s.description}
                    </Text>
                  )}
                </View>
              </View>

              {/* Botón */}
              <View className="space-y-2 flex flex-row w-full justify-between">
                <TouchableOpacity
                  onPress={() => {
                    // Navigate to edit screen with service data
                    const serviceToEdit = {
                      id: s.id,
                      titulo: s.title,
                      descripcion: s.description,
                      precio: s.price || 0,
                      oficioId: s.jobId || "",
                      categoria: s.category,
                      imagenes: s.images,
                    };
                    router.push({
                      pathname: "/works/edit-service-screen",
                      params: { service: JSON.stringify(serviceToEdit) },
                    });
                  }}
                  className="flex gap-x-2 flex-row justify-center bg-blue-600 py-2 rounded-lg items-center w-[30%]"
                >
                  <Pencil color="white" height={15} width={15} />
                  <Text className="text-white font-semibold">Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    // Navigate to view screen with service data
                    const serviceToView = {
                      id: s.id,
                      titulo: s.title,
                      descripcion: s.description,
                      precio: s.price || 0,
                      categoria: s.category,
                      imagenes: s.images,
                    };
                    router.push({
                      pathname: "/works/see-service-screen",
                      params: { service: JSON.stringify(serviceToView) },
                    });
                  }}
                  className="flex gap-x-2 flex-row justify-center bg-blue-600 py-2 rounded-lg items-center w-[30%]"
                >
                  <Eye color="white" height={20} width={20} />
                  <Text className="text-white font-semibold">Ver</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-red-600 py-2 rounded-lg items-center w-[30%]">
                  <Text className="text-white font-semibold">Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View className=" mt-10 flex flex-col items-center justify-center">
            <Text className="text-center text-lg mt-4 text-gray-600">No tienes publicaciones.</Text>
          </View>
        )}
      </ScrollView>

      {/*Botón flotante Publicar Servicio */}
      <TouchableOpacity
        className="bg-blue-600 w-16 h-16 rounded-full items-center justify-center absolute bottom-8 right-6 shadow-lg"
        onPress={handlePublicarServicio}
      >
        <Text className="text-white text-2xl font-bold">+</Text>
      </TouchableOpacity>
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
