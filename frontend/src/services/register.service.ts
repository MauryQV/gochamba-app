import axios from "axios";
import { BASE_URL } from "./../../constants";

export const registerUserFinish = async (userData: any) => {
  const presenter = {
    userId: userData.userId,
    nombreCompleto: userData.nombreCompleto,
    direccion: userData.direccion,
    departamento: userData.departamento,
    telefono: userData.telefono,
    email: userData.email,
    password: userData.password,
    tiene_whatsapp: userData.tiene_whatsapp,
    confirmPassword: userData.password,
    fotoUrl: userData.fotoUrl,
    googleId: userData.googleId || null,
  };
  try {
    let response;
    if (presenter.googleId === null) {
      delete presenter.userId;
      delete presenter.googleId;
      response = await axios.post(`${BASE_URL}/user/create-user/`, presenter);
    } else {
      delete presenter.email;
      delete presenter.googleId;

      response = await axios.post(`${BASE_URL}/google/complete/`, presenter);
    }
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};
