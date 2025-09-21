import { StatusBar } from "expo-status-bar";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useEffect, useState } from "react";
import "./global.css";
export default function App() {
  useEffect(() => {
    console.log("App mounted");
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = () => {
    Alert.alert("Login Info", `Email: ${email}\nPassword: ${password}`);
  };
  return (
    <View className="flex-1 bg-gray-50 justify-center px-8">
      {/* Logo / Header */}
      <Text className="text-3xl font-bold text-center text-gray-800 mb-8">Bienvenido</Text>

      {/* Email Input */}
      <Text className="text-gray-700 mb-2">Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Ingresa tu email"
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4 bg-white"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password Input */}
      <Text className="text-gray-700 mb-2">Contraseña</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Ingresa tu contraseña"
        className="border border-gray-300 rounded-lg px-4 py-3 mb-6 bg-white"
        secureTextEntry
      />

      {/* Login Button */}
      <TouchableOpacity onPress={handleLogin} className="bg-blue-600 rounded-lg py-3 mb-4">
        <Text className="text-white text-center font-semibold text-lg">Ingresar</Text>
      </TouchableOpacity>

      {/* Footer */}
      <TouchableOpacity>
        <Text className="text-center text-blue-600 font-medium">¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
    </View>
  );
}
