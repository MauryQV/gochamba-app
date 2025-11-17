import React from "react";
import { View, Text, ScrollView, Image, RefreshControl } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useRegister } from "../register/_register-context";
import { useWorkerReviews } from "@/src/hooks/use-worker-reviews";
import { Star } from "lucide-react-native";
import Spinner from "@/components/Spinner";
import { useState } from "react";

export default function WorkerProfileScreen() {
  const { setupData } = useRegister();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const headerOptions = {
    headerTitle: "GoChamba",
    headerStyle: { backgroundColor: "#2563eb" },
    headerTintColor: "#fff",
    headerTitleStyle: { fontFamily: "Poppins_900Black", fontSize: 30 },
    headerTitleAlign: "center" as const,
  };

  const userId = setupData?.user?.perfil?.usuarioId || "";
  const workerName = setupData?.user?.perfil?.nombreCompleto || "Trabajador";
  const workerPhoto = setupData?.user?.perfil?.fotoUrl || "";
  const workerDescription = setupData?.user?.perfil?.perfilTrabajador?.descripcion || "Trabajador profesional";

  const { reviews, averageRating, totalReviews, isLoading, refetch } = useWorkerReviews(userId);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const renderStars = (rating: number, size: number = 16) => {
    return (
      <View className="flex-row">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            color={star <= rating ? "#FFA500" : "#D1D5DB"}
            fill={star <= rating ? "#FFA500" : "none"}
            strokeWidth={2}
          />
        ))}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={headerOptions} />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View className="px-5 pt-4 pb-4">
          <Text className="text-black text-2xl font-interBold">Mis reseñas</Text>
        </View>

        {/* Profile Card */}
        <View className="px-5 mb-6">
          <View className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <View className="flex-row items-center">
              <View className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500 mr-4">
                {workerPhoto ? (
                  <Image source={{ uri: workerPhoto }} className="w-full h-full" />
                ) : (
                  <View className="w-full h-full bg-blue-100 items-center justify-center">
                    <Text className="text-3xl text-blue-600 font-poppinsBold">
                      {workerName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
              <View className="flex-1">
                <Text className="text-xl font-poppinsSemiBold text-gray-900">{workerName}</Text>
                <Text className="text-sm text-gray-600 mt-1">{workerDescription}</Text>
                <View className="flex-row items-center mt-2">
                  {renderStars(Math.round(averageRating), 18)}
                  <Text className="text-gray-600 text-sm ml-2">
                    ({totalReviews} {totalReviews === 1 ? "reseña" : "reseñas"})
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Reviews List */}
        <View className="px-5">
          {isLoading ? (
            <View className="mt-10 flex flex-col items-center justify-center">
              <Spinner h={36} w={36} />
              <Text className="text-center text-xs mt-4 text-gray-600">Cargando reseñas...</Text>
            </View>
          ) : !reviews || reviews.length === 0 ? (
            <View className="mt-10 flex flex-col items-center justify-center">
              <Text className="text-center text-lg mt-4 text-gray-600">No tienes reseñas aún.</Text>
            </View>
          ) : (
            reviews.map((review) => (
              <View key={review.id} className="bg-white border border-gray-200 rounded-2xl p-4 mb-4 shadow-sm">
                {/* Reviewer Info */}
                <View className="flex-row items-center mb-3">
                  <View className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300 mr-3">
                    {review.autor.perfil.fotoUrl ? (
                      <Image source={{ uri: review.autor.perfil.fotoUrl }} className="w-full h-full" />
                    ) : (
                      <View className="w-full h-full bg-gray-200 items-center justify-center">
                        <Text className="text-lg text-gray-600 font-poppinsBold">
                          {review.autor.perfil.nombreCompleto.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-poppinsSemiBold text-gray-900">
                      {review.autor.perfil.nombreCompleto}
                    </Text>
                    <Text className="text-xs text-gray-500">{formatDate(review.creadoEn)}</Text>
                  </View>
                </View>

                {/* Rating */}
                <View className="mb-2">{renderStars(review.calificacion, 16)}</View>

                {/* Comment */}
                {review.comentario && (
                  <View className="bg-gray-50 rounded-lg p-3">
                    <Text className="text-gray-700 text-sm leading-5">{review.comentario}</Text>
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
