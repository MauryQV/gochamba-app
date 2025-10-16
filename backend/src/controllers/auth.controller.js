import {
  verifyGoogleToken,
  findOrCreateGoogleUser,
  generateAppToken,
  completeGoogleRegistration as completeGoogleRegistrationService,
} from "../services/auth.service.js";
import { getGooglePrefill } from '../services/auth.service.js';


export const verifyGoogleAuth = async (req, res) => {
  try {
    const { id_token } = req.body;
    const payload = await verifyGoogleToken(id_token);
    const { user, wasCreated } = await findOrCreateGoogleUser(payload);

    const token = generateAppToken(user.id);

    return res.json({
      token,
      user,
      wasCreated,
      needsSetup: !user.es_configurado,
      message: wasCreated
        ? "Usuario registrado con Google exitosamente"
        : "Inicio de sesión con Google exitoso",
    });
  } catch (error) {
    res.status(500).json({ error: "Error verificando Google token" });
  }
};

export const completeGoogleRegistration = async (req, res) => {
  try {
    const updatedUser = await completeGoogleRegistrationService(req.body);
    return res.json({ message: "Perfil completado exitosamente", user: updatedUser });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Error completando registro" });
  }
};

export async function prefillByUserId(req, res) {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ ok: false, message: 'userId requerido' });

    const data = await getGooglePrefill(userId); // 👈 mismo nombre que en el service
    if (!data) return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('prefillByUserId error:', err);
    return res.status(500).json({ ok: false, message: 'Error interno' });
  }
}