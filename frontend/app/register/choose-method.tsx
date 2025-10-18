import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { Link, useRouter } from "expo-router";
import { Mail } from "lucide-react-native";
import { useGoogleAuth } from "./hooks/_use_google_auth";
export default function RegisterMainScreen() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);

  const { handleGoogleSignIn, isSubmitting } = useGoogleAuth();
  const handleGoogleSignUp = () => {
    handleGoogleSignIn();
  };

  const handleEmailSignUp = () => {
    // Navigate to email registration flow
    router.push("/register/one");
  };

  return (
    <View className="flex-1 bg-white">
      {/* Decorative circles at bottom */}
      <View className="absolute bottom-0 right-0">
        <View className="w-40 h-40 bg-blue-600 rounded-full absolute -bottom-20 -right-10"></View>
        <View className="w-32 h-32 bg-orange-500 rounded-full absolute -bottom-16 right-20"></View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className={`flex-1 px-8 pt-8 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          {/* Title */}
          <View className="mb-28 mx-auto ">
            <Text className="text-3xl text-black font-poppinsSemiBold">Registrarse en</Text>
            <Text className="text-5xl text-black font-poppinsBlack">GoChamba</Text>
          </View>

          {/* Sign Up Options */}
          <View className="space-y-4 mb-8">
            {/* Google Sign Up Button */}
            <TouchableOpacity
              onPress={handleGoogleSignUp}
              className="w-full h-12 bg-white border-2 border-blue-600 rounded-lg flex-row items-center justify-center mb-4"
            >
              <Image source={require("./../../assets/logo-google.png")} style={{ width: 17, height: 17 }} />
              <Text className="text-blue-600 font-interMedium ml-3">Continuar con Google</Text>
            </TouchableOpacity>

            {/* Email Sign Up Button */}
            <TouchableOpacity
              onPress={handleEmailSignUp}
              className="w-full h-12 bg-white border-2 border-blue-600 rounded-lg flex-row items-center justify-center"
            >
              <Mail color="#2563eb" height={18} width={18} className="mr-8" />
              <Text className="text-blue-600 font-interMedium ml-3 ">Continuar con correo</Text>
            </TouchableOpacity>
          </View>

          {/* Illustration */}
          <View className="flex-1 items-center justify-center mt-8">
            <Image
              source={require("./../../assets/clients-register.png")}
              style={{ width: 240, height: 240 }}
              resizeMode="contain"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
