import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { ChevronDown, ImagePlus } from "lucide-react-native";
import { Stack } from "expo-router";

export default function PublishServiceScreen() {
  // header
  const headerOptions = {
    headerTitle: "GoChamba",
    headerStyle: {
      backgroundColor: "#2563eb",
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontFamily: "Poppins_900Black",
      fontSize: 30,
    },
    headerTitleAlign: "center" as const,
  };
  const [titulo, setTitulo] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [categoria, setCategoria] = useState<string>("Seleccionar categoría");
  const [showCategorias, setShowCategorias] = useState<boolean>(false);
  const [contacto, setContacto] = useState<string>("");
  const [imagenes, setImagenes] = useState<string[]>([]);

  const categorias: string[] = [
    "Plomería",
    "Electricidad",
    "Carpintería",
    "Limpieza",
    "Jardinería",
  ];

  const handlePublicar = () => {
    if (!titulo || !descripcion || categoria === "Seleccionar categoría") {
      Alert.alert("Campos incompletos", "Por favor llena todos los campos requeridos.");
      return;
    }

    console.log({
      titulo,
      descripcion,
      categoria,
      contacto,
      imagenes,
    });

    Alert.alert("Éxito", "Tu servicio ha sido publicado exitosamente.");
  };

  return (
    <View className="flex-1 bg-white relative">
      <Stack.Screen options={headerOptions} />
      {/* Círculos decorativos */}
      <View className="absolute bottom-0 right-0">
        <View className="w-40 h-40 bg-blue-600 rounded-full absolute -bottom-20 -right-10"></View>
        <View className="w-32 h-32 bg-orange-500 rounded-full absolute -bottom-16 right-20"></View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        className="flex-1 px-5 pt-4"
      >
        {/* Título del formulario */}
        <Text className="text-xl font-semibold text-gray-800 mb-4">
          Publicar un nuevo servicio
        </Text>

        {/*Título */}
        <TextInput
          className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 mb-4"
          placeholder="Título"
          value={titulo}
          onChangeText={setTitulo}
        />

        {/*Descripción */}
        <TextInput
          className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 mb-4"
          placeholder="Descripción"
          multiline
          numberOfLines={4}
          value={descripcion}
          onChangeText={setDescripcion}
        />

        {/*Categoría */}
        <View className="mb-4 relative">
          <TouchableOpacity
            className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 flex-row justify-between items-center"
            onPress={() => setShowCategorias(!showCategorias)}
          >
            <Text className="text-gray-700">{categoria}</Text>
            <ChevronDown size={20} color="#555" />
          </TouchableOpacity>

          {showCategorias && (
            <View className="absolute top-14 left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-md z-10">
              {categorias.map((cat, index) => (
                <TouchableOpacity
                  key={index}
                  className="px-4 py-3 border-b border-gray-200"
                  onPress={() => {
                    setCategoria(cat);
                    setShowCategorias(false);
                  }}
                >
                  <Text>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Número de contacto */}
        <TextInput
          className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 mb-4"
          placeholder="Número de contacto"
          keyboardType="phone-pad"
          value={contacto}
          onChangeText={setContacto}
        />

        {/* Imágenes */}
        <Text className="text-gray-700 mb-2">
          Imágenes (Selecciona al menos una imagen)
        </Text>

        <View className="flex-row justify-between bg-gray-50 border border-gray-300 rounded-xl p-3 mb-6">
          {[1, 2, 3].map((i) => (
            <TouchableOpacity
              key={i}
              className="w-24 h-24 bg-gray-100 rounded-lg items-center justify-center border border-dashed border-gray-400"
              onPress={() => Alert.alert("Seleccionar imagen", "Abrir selector de imágenes")}
            >
              <ImagePlus color="#9ca3af" size={32} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Botón Publicar */}
        <TouchableOpacity
          className="bg-blue-700 py-3 rounded-lg items-center mb-10"
          onPress={handlePublicar}
        >
          <Text className="text-white text-lg font-semibold">Publicar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
