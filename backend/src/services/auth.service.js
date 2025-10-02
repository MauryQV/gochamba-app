import jwt from "jsonwebtoken";
import prisma from "../../config/prismaClient.js";
import { googleClient } from "../../config/googleClient.js";

export async function verifyGoogleToken(idToken) {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID
  });
  return ticket.getPayload(); // {sub, email, name, picture, ...}
}

export async function findOrCreateUser(googleUser) {
  const { sub, email, name, picture } = googleUser;

  let user = await prisma.usuarios.findUnique({ where: { googleId: sub } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        googleId: sub,
        email,
        name,
        picture
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
