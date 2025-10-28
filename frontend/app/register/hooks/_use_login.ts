import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/constants";
import { useRouter } from "expo-router";
import { useRegister } from "../_register-context";

type Rol = {
  id: string;
  usuarioId: string;
  rol: string;
};
export const useLogin = () => {
  const router = useRouter();
  const { setSetupData } = useRegister();
  const [errors, setErrors] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    try {
      console.log("ya pe oy");

      setIsSubmitting(true);
      const res = await axios.post(`${BASE_URL}/user/login`, { email: email, password: password });
      const rolArray = res?.data?.user?.roles?.map((item: Rol) => item.rol);
      setSetupData({
        ...res.data,
        token: res.data.token,
        rol: rolArray,
      });
      router.replace("/one");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Error de Axios durante el inicio de sesión:", error.response?.data.error);
        if (
          error.response?.data.error === "Contraseña incorrecta." ||
          error.response?.data.error === "Credenciales inválidas. El usuario no existe."
        ) {
          setErrors("Correo electrónico o contraseña incorrectos.");
        } else if (error.response?.data.error === '"email" must be a valid email') {
          setErrors("El correo electrónico no es válido.");
        } else {
          setErrors(error.response?.data.error || "Error desconocido");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return { handleLogin, isSubmitting, errors, setErrors };
};
