import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { ChevronDown, ImagePlus } from "lucide-react-native";
import { Stack, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useRegister } from "../register/_register-context";
import { createPublication } from "@/src/services/works.service";
import { useJobs } from "@/src/hooks/use-jobs";

export default function PublishServiceScreen() {
  const headerOptions = {
    headerTitle: "GoChamba",
    headerStyle: { backgroundColor: "#2563eb" },
    headerTintColor: "#fff",
    headerTitleStyle: { fontFamily: "Poppins_900Black", fontSize: 30 },
    headerTitleAlign: "center" as const,
  };

  const [titulo, setTitulo] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [categoria, setCategoria] = useState<string>("Seleccionar categoría");
  const [showCategorias, setShowCategorias] = useState<boolean>(false);
  const [contacto, setContacto] = useState<string>("");

  const { jobs, jobString } = useJobs();
  const categorias = jobString.length ? jobString : ["Plomería", "Electricidad", "Carpintería", "Limpieza", "Jardinería"];

  const { setupData } = useRegister();
  const router = useRouter();
  const [imagenes, setImagenes] = useState<Array<{ uri: string; name: string; type: string }>>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // pick up to maxToPick images and append to current images (respecting max 3)
  const pickImages = async (maxToPick = 3) => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permiso denegado", "Necesitamos acceso a tus imágenes para poder seleccionar fotos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: maxToPick > 1,
        selectionLimit: maxToPick,
        quality: 0.7,
      } as any);

      const wasCanceled = (result as any).canceled ?? (result as any).cancelled;
      if (wasCanceled) return;

      const assets = (result as any).assets || [{ uri: (result as any).uri }];

      const picked = assets.map((a: any, idx: number) => {
        const uri: string = a.uri;
        const name = uri.split("/").pop() || `image_${Date.now()}_${idx}.jpg`;
        const ext = name.includes(".") ? name.split('.').pop() : 'jpg';
        const mime = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
        return { uri, name, type: mime };
      });

      const remaining = 3 - imagenes.length;
      const toAdd = picked.slice(0, Math.min(remaining, picked.length));
      setImagenes((prev) => [...prev, ...toAdd].slice(0, 3));
    } catch (err) {
      console.error("Error picking images", err);
      Alert.alert("Error", "No se pudo seleccionar imágenes.");
    }
  };

  // replace a single image at index
  const replaceImageAt = async (index: number) => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permiso denegado", "Necesitamos acceso a tus imágenes para poder seleccionar fotos.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        quality: 0.7,
      } as any);
      const wasCanceled = (result as any).canceled ?? (result as any).cancelled;
      if (wasCanceled) return;
      const asset = (result as any).assets ? (result as any).assets[0] : { uri: (result as any).uri };
      const uri: string = asset.uri;
      const name = uri.split('/').pop() || `image_${Date.now()}.jpg`;
      const ext = name.includes('.') ? name.split('.').pop() : 'jpg';
      const mime = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
      setImagenes((prev) => {
        const copy = [...prev];
        copy[index] = { uri, name, type: mime };
        return copy.slice(0, 3);
      });
    } catch (err) {
      console.error('Error replacing image', err);
      Alert.alert('Error', 'No se pudo reemplazar la imagen.');
    }
  };

  const handlePublicar = async () => {
    if (!titulo || !descripcion || categoria === "Seleccionar categoría") {
      Alert.alert("Campos incompletos", "Por favor llena todos los campos requeridos.");
      return;
    }
    if (imagenes.length < 1) {
      Alert.alert("Imágenes", "Selecciona al menos una imagen (máx. 3).");
      return;
    }

    const token = setupData?.token;
    if (!token) {
      Alert.alert("Autenticación", "Debes iniciar sesión para publicar.");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("descripcion", descripcion);
      formData.append("precio", "0");
      // map categoria to oficioId if available
      let oficioToSend = "1";
      if (selectedJobId) {
        oficioToSend = selectedJobId;
        formData.append("oficioId", selectedJobId);
      } else {
        const found = jobs.find((j: any) => j.nombre === categoria);
        oficioToSend = found ? found.id : "1";
        formData.append("oficioId", oficioToSend);
      }

      imagenes.forEach((img, i) => {
        // @ts-ignore
        formData.append("imagenes", {
          uri: img.uri,
          name: img.name,
          type: img.type,
        } as any);
      });

      // Debug: mostrar un resumen antes de enviar para ayudar a depurar 400
      console.log("Preparando publicación:", {
        titulo,
        descripcion,
        precio: "0",
        oficioId: oficioToSend,
        imagenesCount: imagenes.length,
      });

      const resp = await createPublication(formData, token);
      console.log("Publicación creada:", resp);
      Alert.alert("Éxito", "Tu servicio ha sido publicado y está en revisión.");
      router.push("/(tabs)/worker");
    } catch (error: any) {
      // Mostrar todo el objeto de error para diagnóstico (no stringify que puede devolver undefined)
      console.error("Error publicando servicio:", error);
      const backend = error?.response?.data ?? error?.response ?? null;
      const msg = backend?.error || backend?.message || error?.message || "Error al publicar";
      Alert.alert("Error", typeof msg === "string" ? msg : JSON.stringify(msg));
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
          <Text className="text-white mt-3">Subiendo publicación...</Text>
        </View>
      )}
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
                    const found = jobs.find((j: any) => j.nombre === cat);
                    if (found) setSelectedJobId(found.id);
                    else setSelectedJobId(null);
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
        <Text className="text-gray-700 mb-2">Imágenes (Selecciona al menos una imagen)</Text>

        <View className="flex-row justify-between bg-gray-50 border border-gray-300 rounded-xl p-3 mb-6">
          {[0, 1, 2].map((i) => {
            const img = imagenes[i];
            return (
              <TouchableOpacity
                key={i}
                className="w-24 h-24 bg-gray-100 rounded-lg items-center justify-center border border-dashed border-gray-400 overflow-hidden"
                onPress={() => (img ? replaceImageAt(i) : pickImages(3 - imagenes.length))}
                onLongPress={() => {
                  if (!img) return;
                  Alert.alert("Eliminar imagen", "¿Deseas eliminar esta imagen?", [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Eliminar", style: "destructive", onPress: () => setImagenes((prev) => prev.filter((_, idx) => idx !== i)) },
                  ]);
                }}
              >
                {img ? <Image source={{ uri: img.uri }} style={{ width: 96, height: 96 }} /> : <ImagePlus color="#9ca3af" size={32} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Botón Publicar */}
        <TouchableOpacity className="bg-blue-700 py-3 rounded-lg items-center mb-10" onPress={handlePublicar}>
          <Text className="text-white text-lg font-semibold">Publicar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
