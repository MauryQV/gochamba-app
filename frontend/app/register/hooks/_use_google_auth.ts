import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../constants";
import { useRegister } from "../_register-context";
import { Alert } from "react-native";

type Rol = {
  id: string;
  usuarioId: string;
  rol: string;
};
export const useGoogleAuth = () => {
  const router = useRouter();
  const { setSetupData } = useRegister();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sendTokenToBackend = async (idToken: string) => {
    try {
      const response = await axios.post(`http://pipexapp.com:8100/api/google/verify`, {
        id_token: idToken,
      });
      return response.data;
    } catch (error) {
      console.error(" Error enviando token al backend:", error);
      throw error;
    }
  };
  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const { idToken, user } = response.data;
        const res = await sendTokenToBackend(idToken || "");
        console.log("Response, lol", JSON.stringify(res?.user?.roles?.map((item: Rol) => item.rol)));
        if (res?.needsSetup) {
          setSetupData({ ...res, token: res?.token, rol: res?.user?.roles?.map((item: Rol) => item.rol) });
          router.push({
            pathname: "/register/one",
            params: { setup: JSON.stringify(res) },
          });
        } else {
          setSetupData({ token: res?.token, rol: res?.user?.roles?.map((item: Rol) => item.rol) });
          router.push("/one");
        }
      } else {
        console.log("Inicio de sesión con Google cancelado");
      }
    } catch (error) {
      Alert.alert("Error inesperado durante el inicio de sesión con Google. Por favor, inténtelo de nuevo.");

      console.error("Error en Google Sign-In:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleGoogleSignIn, isSubmitting };
};
