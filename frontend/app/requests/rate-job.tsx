import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Star } from "lucide-react-native";
import { completeRequest } from "@/src/services/accepted-requests.service";
import { useRegister } from "../register/_register-context";
import { Image } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function RateJobScreen() {
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

  const requestId = params.requestId as string;
  const serviceTitle = params.serviceTitle as string;
  const clientName = params.clientName as string;
  const price = params.price as string;
  const location = params.location as string;
  const date = params.date as string;
  const category = params.category as string;
  const imageUrl = params.imageUrl as string;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingPress = (value: number) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    const token = setupData?.token;
    if (!token) {
      Alert.alert("Error", "No se pudo autenticar la solicitud.");
      return;
    }

    try {
      setIsSubmitting(true);
      await completeRequest(requestId, rating, comment, token);

      Alert.alert(
        "Servicio completado",
        "El servicio ha sido marcado como completado y tu calificación ha sido enviada.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      console.error("Error completing request:", error);
      Alert.alert("Error", error?.message || "No se pudo completar el servicio.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={headerOptions} />

      <KeyboardAwareScrollView
        className="flex-1 px-5 pt-6"
        contentContainerStyle={{ paddingBottom: 0 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={200}
      >
        {/* Client Name Header */}
        <View className="items-center mb-6 flex-row flex gap-x-4">
          <Image src={imageUrl} className="w-20 h-20 rounded-full" />
          <View>
            <Text className="text-xl font-poppinsSemiBold text-gray-900">{clientName}</Text>
            <Text className="text-sm text-gray-600 mt-1">{category}</Text>
          </View>
        </View>

        {/* Job Details Card */}
        <View className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-200">
          <Text className="text-lg font-poppinsSemiBold text-gray-900 mb-3">Detalles del Trabajo</Text>

          <View className="mb-2">
            <Text className="text-gray-700">
              <Text className="font-interSemiBold">Servicio: </Text>
              {serviceTitle}
            </Text>
          </View>

          <View className="mb-2">
            <Text className="text-gray-700">
              <Text className="font-interSemiBold">Fecha: </Text>
              {date}
            </Text>
          </View>

          {location && (
            <View className="mb-2">
              <Text className="text-gray-700">
                <Text className="font-interSemiBold">Ubicación: </Text>
                {location}
              </Text>
            </View>
          )}

          <View>
            <Text className="text-gray-700">
              <Text className="font-interSemiBold">Precio acordado: </Text>
              Bs. {price}
            </Text>
          </View>
        </View>

        {/* Rating Section */}
        <View className="mb-6">
          <Text className="text-center text-lg font-poppinsSemiBold text-gray-900 mb-4">
            Califica el servicio recibido
          </Text>

          {/* Star Rating */}
          <View className="flex-row justify-center items-center space-x-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => handleRatingPress(star)} activeOpacity={0.7}>
                <Star
                  size={40}
                  color={star <= rating ? "#FFA500" : "#D1D5DB"}
                  fill={star <= rating ? "#FFA500" : "none"}
                  strokeWidth={2}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text className="text-center text-sm text-gray-600">
            {rating === 0 && "Muy Malo"}
            {rating === 1 && "Muy Malo"}
            {rating === 2 && "Malo"}
            {rating === 3 && "Regular"}
            {rating === 4 && "Bueno"}
            {rating === 5 && "Excelente"}
          </Text>
        </View>

        {/* Comment Section */}
        <View className="mb-6">
          <Text className="text-base font-interSemiBold text-gray-900 mb-2">
            Describe tu experiencia con el trabajador (opcional)
          </Text>
          <TextInput
            className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 min-h-[120px] text-gray-800"
            placeholder="Escribe tu comentario aquí..."
            placeholderTextColor="#9CA3AF"
            multiline
            textAlignVertical="top"
            value={comment}
            onChangeText={setComment}
            maxLength={500}
          />
          <Text className="text-right text-xs text-gray-500 mt-1">{comment.length}/500</Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isSubmitting || rating === 0}
          className={`py-4 rounded-xl items-center ${isSubmitting || rating === 0 ? "bg-gray-400" : "bg-blue-600"}`}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <View className="flex-row items-center">
              <ActivityIndicator size="small" color="#fff" />
              <Text className="text-white text-lg font-poppinsSemiBold ml-2">Enviando...</Text>
            </View>
          ) : (
            <Text className="text-white text-lg font-poppinsSemiBold">
              {rating === 0 ? "Selecciona una calificación" : "Calificar"}
            </Text>
          )}
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
}
