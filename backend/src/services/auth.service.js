import jwt from "jsonwebtoken";
import prisma from "../../config/prismaClient.js";
import { googleClient } from "../../config/googleClient.js";

export async function verifyGoogleToken(idToken) {

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID
  });
  return ticket.getPayload(); // {informacion del usuario del payload del token de google}
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
