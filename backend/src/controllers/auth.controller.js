import { verifyGoogleToken, findOrCreateUser, generateAppToken } from "../services/auth.service.js";

export async function googleAuth(req, res) {
  try {
    const { id_token } = req.body;
    if (!id_token) {
      return res.status(400).json({ error: "id_token is required" });
    }

    // 1. Verificar token con Google
    const googleUser = await verifyGoogleToken(id_token);

    // 2. Buscar o crear usuario
    const user = await findOrCreateUser(googleUser);

    // 3. Generar tu JWT
    const token = generateAppToken(user);

    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Invalid Google token" });
  }
}
