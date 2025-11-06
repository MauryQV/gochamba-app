import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image, ActivityIndicator } from "react-native";
import { ChevronDown, ImagePlus, X } from "lucide-react-native";
import { Stack, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useJobs } from "@/src/hooks/use-jobs";
import { uploadServiceImages, createPublication } from "@/src/services/works.service";
import { useRegister } from "../register/_register-context";

export default function PublishServiceScreen() {
  const headerOptions = {
    headerTitle: "GoChamba",
    headerStyle: { backgroundColor: "#2563eb" },
    headerTintColor: "#fff",
    headerTitleStyle: { fontFamily: "Poppins_900Black", fontSize: 30 },
    headerTitleAlign: "center" as const,
  };

  const [data, setData] = useState({
    titulo: "",
    descripcion: "",
    precio: "",
    oficioId: "",
    imagenesUrls: [] as string[],
  });

  const [showCategorias, setShowCategorias] = useState<boolean>(false);
  const [selectedCategoria, setSelectedCategoria] = useState<string>("Seleccionar categoría");
  const [selectedImages, setSelectedImages] = useState<Array<{ uri: string; name: string; type: string }>>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { jobs, jobString } = useJobs();
  const { setupData } = useRegister();
  const categorias = jobString.length
    ? jobString
    : ["Plomería", "Electricidad", "Carpintería", "Limpieza", "Jardinería"];

  const router = useRouter();

  const pickImages = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permiso denegado", "Necesitamos acceso a tus imágenes para poder seleccionar fotos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: 10,
        quality: 0.7,
      } as any);

      const wasCanceled = (result as any).canceled ?? (result as any).cancelled;
      if (wasCanceled) return;

      const assets = (result as any).assets || [];

      const picked = assets.map((asset: any, idx: number) => {
        const uri: string = asset.uri;
        const name = uri.split("/").pop() || `image_${Date.now()}_${idx}.jpg`;
        const ext = name.includes(".") ? name.split(".").pop() : "jpg";
        const mime = `image/${ext === "jpg" ? "jpeg" : ext}`;
        return { uri, name, type: mime };
      });

      setSelectedImages(picked.slice(0, 10)); // Max 10 images
    } catch (err) {
      console.error("Error picking images", err);
      Alert.alert("Error", "No se pudo seleccionar imágenes.");
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePublicar = async () => {
    // Validate form
    if (!data.titulo || !data.descripcion || !data.oficioId || !data.precio) {
      Alert.alert("Campos incompletos", "Por favor llena todos los campos requeridos.");
      return;
    }

    if (selectedImages.length === 0) {
      Alert.alert("Imágenes requeridas", "Debes seleccionar al menos una imagen.");
      return;
    }

    const token = setupData?.token;
    if (!token) {
      Alert.alert("Autenticación", "Debes iniciar sesión para publicar.");
      return;
    }

    try {
      setIsUploading(true);

      // Step 1: Upload images
      const imageFormData = new FormData();
      selectedImages.forEach((img) => {
        // @ts-ignore
        imageFormData.append("imagenes", {
          uri: img.uri,
          name: img.name,
          type: img.type,
        } as any);
      });

      const imageUrls = await uploadServiceImages(imageFormData, token);

      // Step 2: Create publication with image URLs
      console.log("imageUrls", imageUrls);
      const publicationData = {
        ...data,
        imagenesUrls: imageUrls,
      };

      const response = await createPublication(publicationData, token);

      Alert.alert("Éxito", "Tu servicio ha sido publicado exitosamente.");
      router.push("/(tabs)/worker");
    } catch (error: any) {
      console.error("Error publicando servicio:", error);
      const message = error?.message || "Error al publicar el servicio";
      Alert.alert("Error", message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View className="flex-1 bg-white relative">
      <Stack.Screen options={headerOptions} />

      {isUploading && (
        <View className="absolute inset-0 bg-black/40 items-center justify-center z-50">
          <ActivityIndicator size="large" color="#fff" />
          <Text className="text-white mt-3 font-interMedium">Publicando servicio...</Text>
        </View>
      )}

      {/* Círculos decorativos */}
      <View className="absolute bottom-0 right-0">
        <View className="w-40 h-40 bg-blue-600 rounded-full absolute -bottom-20 -right-10"></View>
        <View className="w-32 h-32 bg-orange-500 rounded-full absolute -bottom-16 right-20"></View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="flex-1 px-5 pt-4">
        {/* Título del formulario */}
        <Text className="text-xl font-semibold text-gray-800 mb-4">Publicar un nuevo servicio</Text>

        {/*Título */}
        <TextInput
          className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 mb-4"
          placeholder="Título"
          value={data.titulo}
          onChangeText={(text) => setData({ ...data, titulo: text })}
        />

        {/*Descripción */}
        <TextInput
          className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 mb-4"
          placeholder="Descripción"
          multiline
          numberOfLines={4}
          value={data.descripcion}
          onChangeText={(text) => setData({ ...data, descripcion: text })}
        />

        {/*Categoría */}
        <View className="mb-4 relative">
          <TouchableOpacity
            className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 flex-row justify-between items-center"
            onPress={() => setShowCategorias(!showCategorias)}
          >
            <Text className="text-gray-700">{selectedCategoria}</Text>
            <ChevronDown size={20} color="#555" />
          </TouchableOpacity>

          {showCategorias && (
            <View className="absolute top-14 left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-md z-10">
              {categorias.map((cat, index) => (
                <TouchableOpacity
                  key={index}
                  className="px-4 py-3 border-b border-gray-200"
                  onPress={() => {
                    setSelectedCategoria(cat);
                    setShowCategorias(false);
                    const found = jobs.find((j: any) => j.nombre === cat);
                    setData({ ...data, oficioId: found ? found.id : "" });
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
          className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 mb-4"
          placeholder="Precio"
          keyboardType="numeric"
          value={data.precio}
          onChangeText={(text) => setData({ ...data, precio: text })}
        />

        {/* Imágenes */}
        <Text className="text-gray-700 mb-2 font-interMedium">Imágenes del servicio (hasta 10)</Text>

        {/* Button to add images */}
        <TouchableOpacity
          className="bg-gray-50 border border-gray-300 border-dashed rounded-xl p-4 mb-4 flex-row items-center justify-center"
          onPress={pickImages}
          activeOpacity={0.7}
        >
          <ImagePlus color="#2563eb" size={24} />
          <Text className="text-blue-600 font-interSemiBold ml-2">Agregar imágenes</Text>
        </TouchableOpacity>

        {/* Display selected images */}
        {selectedImages.length > 0 && (
          <View className="mb-6">
            <Text className="text-gray-600 text-sm mb-2 font-interMedium">
              {selectedImages.length} {selectedImages.length === 1 ? "imagen seleccionada" : "imágenes seleccionadas"}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              {selectedImages.map((img, index) => (
                <View key={index} className="mr-3 relative">
                  <Image source={{ uri: img.uri }} className="w-24 h-24 rounded-lg" style={{ width: 96, height: 96 }} />
                  <TouchableOpacity
                    onPress={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                    activeOpacity={0.8}
                  >
                    <X size={16} color="white" strokeWidth={3} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Botón Publicar */}
        <TouchableOpacity
          className={`py-3 rounded-lg items-center mb-10 ${isUploading ? "bg-gray-400" : "bg-blue-700"}`}
          onPress={handlePublicar}
          disabled={isUploading}
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-semibold">{isUploading ? "Publicando..." : "Publicar"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
