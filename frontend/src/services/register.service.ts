import axios from "axios";
import { BASE_URL } from "./../../constants";

export const registerUserFinish = async (userData: any) => {
  const presenter = {
    userId: userData.userId,
    nombreCompleto: userData.nombreCompleto,
    direccion: userData.direccion,
    departamento: userData.departamento,
    telefono: userData.telefono,
    password: userData.password,
    tiene_whatsapp: userData.tiene_whatsapp,
    confirmPassword: userData.confirmPassword,
    fotoUrl: userData.fotoUrl,
  };
  try {
    const response = await axios.post(`${BASE_URL}/google/complete/`, presenter);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};
