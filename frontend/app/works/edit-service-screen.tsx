import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image, ActivityIndicator } from "react-native";
import { ChevronDown, ImagePlus, X } from "lucide-react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useJobs } from "@/src/hooks/use-jobs";
import { uploadServiceImages, updateService, addServiceImages, deleteServiceImage } from "@/src/services/works.service";
import { useRegister } from "../register/_register-context";

export default function EditServiceScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { setupData } = useRegister();
  const { jobs, jobString } = useJobs();

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
    oficioId: "",
  });

  const [showCategorias, setShowCategorias] = useState<boolean>(false);
  const [selectedCategoria, setSelectedCategoria] = useState<string>("Seleccionar categoría");

  // Existing images from the service
  const [existingImages, setExistingImages] = useState<Array<{ id: string; url: string; orden: number }>>([]);

  // New images to be uploaded
  const [newImages, setNewImages] = useState<Array<{ uri: string; name: string; type: string }>>([]);

  const [isUploading, setIsUploading] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);

  const categorias = jobString.length
    ? jobString
    : ["Plomería", "Electricidad", "Carpintería", "Limpieza", "Jardinería"];

  // Initialize form with service data
  useEffect(() => {
    if (serviceData) {
      setData({
        titulo: serviceData.titulo || "",
        descripcion: serviceData.descripcion || "",
        precio: serviceData.precio?.toString() || "",
        oficioId: serviceData.oficioId || "",
      });

      setSelectedCategoria(serviceData.categoria || "Seleccionar categoría");
      setExistingImages(serviceData.imagenes || []);
    }
  }, []);

  const pickImages = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permiso denegado", "Necesitamos acceso a tus imágenes para poder seleccionar fotos.");
        return;
      }

      const totalImages = existingImages.length + newImages.length;
      const remaining = 10 - totalImages;

      if (remaining <= 0) {
        Alert.alert("Límite alcanzado", "Ya tienes 10 imágenes. Elimina algunas para agregar nuevas.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: remaining,
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

      setNewImages((prev) => [...prev, ...picked].slice(0, remaining));
    } catch (err) {
      console.error("Error picking images", err);
      Alert.alert("Error", "No se pudo seleccionar imágenes.");
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const deleteExistingImage = async (imageId: string) => {
    const token = setupData?.token;
    if (!token || !serviceData?.id) {
      Alert.alert("Error", "No se pudo autenticar la solicitud.");
      return;
    }

    Alert.alert("Eliminar imagen", "¿Estás seguro de que deseas eliminar esta imagen?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            setDeletingImageId(imageId);
            await deleteServiceImage(serviceData.id, imageId, token);
            setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
            Alert.alert("Éxito", "Imagen eliminada correctamente.");
          } catch (error: any) {
            console.error("Error deleting image:", error);
            Alert.alert("Error", error?.message || "No se pudo eliminar la imagen.");
          } finally {
            setDeletingImageId(null);
          }
        },
      },
    ]);
  };

  const handleActualizar = async () => {
    // Validate form
    if (!data.titulo || !data.descripcion || !data.oficioId || !data.precio) {
      Alert.alert("Campos incompletos", "Por favor llena todos los campos requeridos.");
      return;
    }

    const totalImages = existingImages.length + newImages.length;
    if (totalImages === 0) {
      Alert.alert("Imágenes requeridas", "Debes tener al menos una imagen.");
      return;
    }

    const token = setupData?.token;
    if (!token || !serviceData?.id) {
      Alert.alert("Autenticación", "Debes iniciar sesión para actualizar.");
      return;
    }

    try {
      setIsUploading(true);

      // Step 1: Upload new images if any
      let newImageUrls: string[] = [];
      if (newImages.length > 0) {
        const imageFormData = new FormData();
        newImages.forEach((img) => {
          // @ts-ignore
          imageFormData.append("imagenes", {
            uri: img.uri,
            name: img.name,
            type: img.type,
          } as any);
        });

        newImageUrls = await uploadServiceImages(imageFormData, token);

        // Step 2: Add new images to service
        await addServiceImages(serviceData.id, newImageUrls, token);
      }

      // Step 3: Update service data
      const updateData = {
        titulo: data.titulo,
        descripcion: data.descripcion,
        precio: parseFloat(data.precio),
        oficioId: data.oficioId,
      };

      await updateService(serviceData.id, updateData, token);

      Alert.alert("Éxito", "Tu servicio ha sido actualizado exitosamente.", [
        {
          text: "OK",
          onPress: () => router.push("/(tabs)/worker"),
        },
      ]);
    } catch (error: any) {
      console.error("Error actualizando servicio:", error);
      const message = error?.message || "Error al actualizar el servicio";
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
          <Text className="text-white mt-3 font-interMedium">Actualizando servicio...</Text>
        </View>
      )}

      {/* Círculos decorativos */}
      <View className="absolute bottom-0 right-0">
        <View className="w-40 h-40 bg-blue-600 rounded-full absolute -bottom-20 -right-10"></View>
        <View className="w-32 h-32 bg-orange-500 rounded-full absolute -bottom-16 right-20"></View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="flex-1 px-5 pt-4">
        {/* Título del formulario */}
        <Text className="text-xl font-poppinsBold text-gray-800 mb-4">Editar servicio</Text>

        {/*Título */}
        <TextInput
          className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 mb-5 placeholder:text-gray-400"
          placeholder="Título"
          value={data.titulo}
          onChangeText={(text) => setData({ ...data, titulo: text })}
        />

        {/*Descripción */}
        <TextInput
          className="bg-gray-100 border border-gray-300 h-24 rounded-lg px-4 py-3 mb-5 placeholder:text-gray-400"
          placeholder="Descripción"
          multiline
          textAlignVertical="top"
          numberOfLines={4}
          value={data.descripcion}
          onChangeText={(text) => setData({ ...data, descripcion: text })}
        />

        {/*Categoría */}
        <View className="mb-5 relative">
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
          className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 mb-5 placeholder:text-gray-400"
          placeholder="Precio"
          keyboardType="numeric"
          value={data.precio}
          onChangeText={(text) => setData({ ...data, precio: text })}
        />

        {/* Imágenes */}
        <Text className="text-gray-700 mb-2 font-interMedium">
          Imágenes del servicio ({existingImages.length + newImages.length}/10)
        </Text>

        {/* Display existing images */}
        {existingImages.length > 0 && (
          <View className="mb-4">
            <Text className="text-gray-600 text-sm mb-2 font-interMedium">Imágenes actuales</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              {existingImages.map((img) => (
                <View key={img.id} className="mr-3 relative">
                  <Image source={{ uri: img.url }} className="w-24 h-24 rounded-lg" style={{ width: 96, height: 96 }} />
                  {deletingImageId === img.id ? (
                    <View className="absolute inset-0 bg-black/50 items-center justify-center rounded-lg">
                      <ActivityIndicator size="small" color="#fff" />
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => deleteExistingImage(img.id)}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                      activeOpacity={0.8}
                    >
                      <X size={16} color="white" strokeWidth={3} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Display new images */}
        {newImages.length > 0 && (
          <View className="mb-4">
            <Text className="text-gray-600 text-sm mb-2 font-interMedium">Nuevas imágenes</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              {newImages.map((img, index) => (
                <View key={index} className="mr-3 relative">
                  <Image source={{ uri: img.uri }} className="w-24 h-24 rounded-lg" style={{ width: 96, height: 96 }} />
                  <TouchableOpacity
                    onPress={() => removeNewImage(index)}
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

        {/* Button to add images */}
        {existingImages.length + newImages.length < 10 && (
          <TouchableOpacity
            className="bg-gray-50 border border-gray-300 border-dashed rounded-xl p-4 mb-4 flex-row items-center justify-center"
            onPress={pickImages}
            activeOpacity={0.7}
          >
            <ImagePlus color="#2563eb" size={24} />
            <Text className="text-blue-600 font-interSemiBold ml-2">Agregar más imágenes</Text>
          </TouchableOpacity>
        )}

        {/* Botón Actualizar */}
        <TouchableOpacity
          className={`py-3 rounded-lg items-center mb-10 ${isUploading ? "bg-gray-400" : "bg-blue-700"}`}
          onPress={handleActualizar}
          disabled={isUploading}
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-semibold">
            {isUploading ? "Actualizando..." : "Actualizar servicio"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
