// src/services/auth.service.js
import  prisma  from "../../config/prismaClient.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET; 

// verificamos el token de google
export const verifyGoogleToken = async (id_token) => {
  const ticket = await client.verifyIdToken({
    idToken: id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  return ticket.getPayload();
};

// creamos o buscamos el usuaario en la base de datos
export const findOrCreateGoogleUser = async (payload) => {
  const { email, sub, name, picture } = payload;

  let user = await prisma.usuario.findUnique({
    where: { email },
    include: { perfil: true },
  });

  let wasCreated = false;

  if (!user) {
    user = await prisma.usuario.create({
      data: {
        email,
        googleId: sub,
        perfil: {
          create: {
            nombreCompleto: name || "Usuario sin nombre",
            fotoUrl: picture || "",
            telefono: "",
          },
        },
      },
      include: { perfil: true },
    });
    wasCreated = true;
  }

  return { user, wasCreated };
};

//generar token jwt
export const generateAppToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

// finalizar el registro del usuario
export const completeGoogleRegistration = async (data) => {
  const {
    userId,
    nombreCompleto,
    direccion,
    departamento,
    telefono,
    password,
    confirmPassword,
    fotoUrl,
  } = data;

  if (password && password !== confirmPassword) {
    throw new Error("Las contraseñas no coinciden");
  }

  const user = await prisma.usuario.findUnique({ where: { id: userId }, include: { perfil: true } });
  if (!user) throw new Error("Usuario no encontrado");

  // Hash de contraseña si se ingresó
  const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;

  const updatedUser = await prisma.usuario.update({
    where: { id: userId },
    data: {
      telefono,
      departamento,
      password: hashedPassword,
      es_configurado: true,
      perfil: {
        update: {
          nombreCompleto,
          direccion,
          telefono,
          fotoUrl,
        },
      },
    },
    include: { perfil: true },
  });

  return updatedUser;
};

