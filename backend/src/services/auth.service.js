import jwt from "jsonwebtoken";
import prisma from "../../config/prismaClient.js";
import { googleClient } from "../../config/googleClient.js";
import Joi from "joi";
import bcrypt from "bcrypt";

export async function verifyGoogleToken(idToken) {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID
  });
  return ticket.getPayload();
}

export async function findOrCreateUser(googleUser) {
  const { sub, email, name, picture } = googleUser;

  let user = await prisma.usuario.findUnique({
    where: { googleId: sub }
  });

  if (!user) {
    user = await prisma.usuario.create({
      data: {
        googleId: sub,
        email,
        esActivo: true,
        es_configurado: false
      }
    });

    // perfil basico
    await prisma.perfil.create({
      data: {
        usuarioId: user.id,
        nombreCompleto: name || "",
        fotoUrl: picture || "",
        telefono: ""
      }
    });
  }

  return user;
}

export function generateAppToken(user) {
  return jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export async function register(req, res) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).max(100).required(),
    telefono: Joi.string().optional()
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { email, password, name, telefono } = req.body;

  // Verifica si el usuario ya existe
  const exists = await prisma.usuario.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ error: "El email ya está registrado" });

  // Hashea la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crea el usuario
  const user = await prisma.usuario.create({
    data: {
      email,
      password: hashedPassword,
      esActivo: true,
      es_configurado: false,
      telefono
    }
  });

  // Crea el perfil
  await prisma.perfil.create({
    data: {
      usuarioId: user.id,
      nombreCompleto: name,
      telefono,
      fotoUrl: "",
    }
  });
  

  res.json({ user });
}
export async function getUserForSetup(userId) {
  const user = await prisma.usuario.findUnique({
    where: { id: userId },
    include: { perfil: true }
  });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  if (user.es_configurado) {
    throw new Error('El usuario ya está configurado');
  }

  return {
    userId: user.id,
    nombreCompleto: user.perfil.nombreCompleto,
    email: user.email,
    fotoUrl: user.perfil.fotoUrl,
    needsSetup: !user.es_configurado
  };
}