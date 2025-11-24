import { View, Alert, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { X, Check } from "lucide-react-native";
import Dropdown from "@/components/Dropdown";
import { useJobs } from "@/src/hooks/use-jobs";
import { useRegisterWorker } from "@/src/hooks/use-register-worker";
import { useRegister } from "./register/_register-context";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default function RegisterWorkerScreen() {
  const router = useRouter();
  const { setupData, setSetupData } = useRegister();
  const [ci, setCI] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [selectedOficios, setSelectedOficios] = useState<string[]>([]);

  const signout = async () => {
    try {
      await GoogleSignin.signOut();
      setSetupData(null);
      router.push("/");
      console.log("signed out");
    } catch (error) {
      alert("Error: Intente de nuevo");
      console.error("Error signing out: ", error);
    }
  };

  // Error states
  const [ciError, setCiError] = useState("");
  const [descripcionError, setDescripcionError] = useState("");
  const [oficiosError, setOficiosError] = useState("");

  const { jobs, jobString } = useJobs();
  const { registerNewWorker } = useRegisterWorker(jobs);

  const validateForm = (): boolean => {
    let isValid = true;

    // Reset errors
    setCiError("");
    setDescripcionError("");
    setOficiosError("");

    // Validate CI (carnetIdentidad)
    if (!ci.trim()) {
      setCiError("El carnet de identidad es obligatorio.");
      isValid = false;
    } else if (ci.trim().length < 5) {
      setCiError("El carnet de identidad debe tener al menos 5 caracteres.");
      isValid = false;
    } else if (ci.trim().length > 20) {
      setCiError("El carnet de identidad no puede superar los 20 caracteres.");
      isValid = false;
    }

    // Validate descripcion
    if (!descripcion.trim()) {
      setDescripcionError("La descripción es obligatoria.");
      isValid = false;
    } else if (descripcion.trim().length < 10) {
      setDescripcionError("La descripción debe tener al menos 10 caracteres.");
      isValid = false;
    } else if (descripcion.trim().length > 500) {
      setDescripcionError("La descripción no puede superar los 500 caracteres.");
      isValid = false;
    }

    // Validate oficios
    if (selectedOficios.length === 0) {
      setOficiosError("Debes seleccionar al menos un oficio.");
      isValid = false;
    } else if (selectedOficios.length > 3) {
      setOficiosError("Solo puedes seleccionar hasta 3 oficios.");
      isValid = false;
    }

    return isValid;
  };

  const handleAddOficio = (oficio: string) => {
    if (!selectedOficios.includes(oficio)) {
      if (selectedOficios.length >= 3) {
        setOficiosError("Solo puedes seleccionar hasta 3 oficios.");
        return;
      }
      setSelectedOficios([...selectedOficios, oficio]);
      setOficiosError(""); // Clear error when adding
    }
  };

  const handleRemoveOficio = (oficio: string) => {
    setSelectedOficios(selectedOficios.filter((o) => o !== oficio));
    setOficiosError(""); // Clear error when removing
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      await registerNewWorker({ carnetIdentidad: ci, descripcion, oficios: selectedOficios }, setupData?.token);
      Alert.alert("Éxito", "Vuelve a iniciar sesión para continuar.");
      console.log("Worker registered successfully:");
      await signout();
    } catch (error) {
      alert("Error registering worker:");
      console.error("Error registering worker:", error);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="absolute bottom-0 right-0">
        <View className="w-40 h-40 bg-blue-600 rounded-full absolute -bottom-20 -right-10"></View>
        <View className="w-32 h-32 bg-orange-500 rounded-full absolute -bottom-16 right-20"></View>
      </View>

      <ScrollView className="flex-1 px-6 pt-8 " showsVerticalScrollIndicator={false}>
        <View className="mx-auto">
          <Text className="text-4xl font-poppinsSemiBold text-black mb-">Registrarse en</Text>
          <Text className="text-5xl font-poppinsBlack text-black mb-1">GoChamba</Text>
          <Text className="text-4xl font-bebasNeue text-orange-500 mb-8">TRABAJADORES</Text>
        </View>
        <View className="mb-6">
          <Text className="text-gray-700 text-sm font-interMedium mb-2">CI</Text>
          <TextInput
            className="w-full h-12 bg-white rounded-lg px-4 text-black border"
            style={{ borderColor: ciError ? "#EF4444" : "#D1D5DB" }}
            placeholder=""
            value={ci}
            onChangeText={(text) => {
              setCI(text);
              setCiError(""); // Clear error on input
            }}
            keyboardType="numeric"
          />
          {ciError && <Text className="text-red-500 text-xs font-interMedium mt-1">{ciError}</Text>}
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 text-sm font-interMedium mb-2">Descripción</Text>
          <TextInput
            className="w-full h-24 bg-white rounded-lg px-4 py-3 text-black border"
            style={{ borderColor: descripcionError ? "#EF4444" : "#D1D5DB" }}
            placeholder=""
            value={descripcion}
            onChangeText={(text) => {
              setDescripcion(text);
              setDescripcionError(""); // Clear error on input
            }}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {descripcionError && <Text className="text-red-500 text-xs font-interMedium mt-1">{descripcionError}</Text>}
        </View>

        <View className="mb-6">
          <Dropdown
            label="Oficios"
            placeholder="Seleccione su oficio"
            value=""
            options={jobString}
            onSelect={(oficio) => handleAddOficio(oficio)}
            className=""
            error={!!oficiosError}
          />
          {oficiosError && <Text className="text-red-500 text-xs font-interMedium mt-1">{oficiosError}</Text>}
          {selectedOficios.length > 0 && (
            <View className="flex-row flex-wrap mt-3">
              {/* Show first badge */}
              <View className="bg-orange-500 rounded-full px-4 py-2 flex-row items-center mr-2 mb-2">
                <Text className="text-white text-sm font-interMedium mr-2">{selectedOficios[0]}</Text>
                <TouchableOpacity onPress={() => handleRemoveOficio(selectedOficios[0])}>
                  <X size={16} color="white" strokeWidth={3} />
                </TouchableOpacity>
              </View>
              {selectedOficios.length > 1 && (
                <View className="bg-orange-500 rounded-full px-4 py-2 flex-row items-center mr-2 mb-2">
                  <Text className="text-white text-sm font-interMedium mr-2">{selectedOficios[1]}</Text>
                  <TouchableOpacity onPress={() => handleRemoveOficio(selectedOficios[1])}>
                    <X size={16} color="white" strokeWidth={3} />
                  </TouchableOpacity>
                </View>
              )}

              {/* Show +X badge if more than 1 */}
              {selectedOficios.length > 2 && (
                <View className="bg-gray-400 rounded-full px-4 py-2 flex-row items-center mr-2 mb-2">
                  <Text className="text-white text-sm font-interMedium">+{selectedOficios.length - 2}</Text>
                </View>
              )}
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={handleRegister}
          className="w-full h-12 bg-blue-600 rounded-lg flex-row items-center justify-center mt-4 mb-8"
          activeOpacity={0.8}
        >
          <Text className="text-white font-poppinsSemiBold text-base mr-2">Registrarse</Text>
          <Check size={20} color="white" className="transform rotate-180" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
