import { StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
import { useState } from "react";

import { ChevronDown } from "lucide-react-native";
export default function WorkerTab() {
  const [selectedCategory, setSelectedCategory] = useState("Seleccionar Categoria");
  const [ShowCategories, setShowCategories] = useState(false);
  const [price, setPrice] = useState("");
  const categories = ["Plomería", "Electricidad", "Carpintería", "Limpieza", "Jardinería"];
  const servicios = [
    {
      id: 1,
      title: "Reparación de Fugas",
      category: "Plomería",
      trabajador: "Juan Pérez",
      ubicacion: "Av. Principal 123, Cochabamba",
      //imagenes: [
      // require("./../frontend/assets/plomeria1.jpg"),
      // require("./../frontend/assets/plomeria2.jpg"),
      // ],
    },
    {
      id: 2,
      title: "Instalación Eléctrica",
      category: "Electricidad",
      trabajador: "María López",
      ubicacion: "Calle Aroma, esquina con Av. Siempre Viva",
      //imagenes: [
      //require("../../assets/electricidad1.jpg"),
      //require("../../assets/electricidad2.jpg"),
      //],
    },
  ];
  return (
    <View className="flex-1 bg-white">
      {/* Decorative circles at bottom */}
      <View className="absolute bottom-0 right-0">
        <View className="w-40 h-40 bg-blue-600 rounded-full absolute -bottom-20 -right-10"></View>
        <View className="w-32 h-32 bg-orange-500 rounded-full absolute -bottom-16 right-20"></View>
      </View>
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
            <View className="absolute w-full bg-white rounded-lg border border-gray-300 mt-1 z-10">
              {categories.map((cat, idx) => (
                <TouchableOpacity
                  key={idx}
                  className="px-3 py-2 border-b border-gray-200"
                  onPress={() => {
                    setSelectedCategory(cat);
                    setShowCategories(false);
                  }}
                >
                  <Text>{cat}</Text>
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
        {servicios.map((s) => (
          <View key={s.id} className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 shadow-sm">
            {/* Header */}
            <View className="flex-row items-center mb-3">
              <View>
                <Text className="text-lg font-semibold text-blue-600">{s.title}</Text>
                <Text className="text-gray-700 text-sm">Categoría: {s.category}</Text>
                {s.trabajador && <Text className="text-gray-700 text-sm">Trabajador: {s.trabajador}</Text>}
                {s.ubicacion && <Text className="text-gray-700 text-sm">Ubicación: {s.ubicacion}</Text>}
              </View>
            </View>

            {/* Botón */}
            <TouchableOpacity className="bg-blue-600 py-2 rounded-lg items-center">
              <Text className="text-white font-semibold">Solicitar servicio</Text>
            </TouchableOpacity>
          </View>
        ))}
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
