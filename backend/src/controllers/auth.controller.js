import { verifyGoogleToken, findOrCreateUser, generateAppToken } from "../services/auth.service.js";
import Joi from "joi";

export async function googleAuth(req, res) {
  try {
    // 1. Validar el id_token que llega desde el cliente
    const schema = Joi.object({
      id_token: Joi.string().required().messages({
        "string.empty": "El id_token es obligatorio"
      }),
      // 🔹 Campos adicionales opcionales (en caso quieras probar con criterios propios)
      phone: Joi.string().pattern(/^[0-9]{8}$/).optional().messages({
        "string.pattern.base": "El teléfono debe tener 8 dígitos"
      }),
      age: Joi.number().integer().min(18).optional().messages({
        "number.min": "Debes ser mayor de edad"
      })
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        errors: error.details.map((err) => err.message)
      });
    }

    const { id_token, phone, age } = req.body;

    // 2. Verificar token con Google
    const googleUser = await verifyGoogleToken(id_token);
    console.log("googleUser:", googleUser);

    // 3. Validar datos recibidos desde Google
    const userSchema = Joi.object({
      sub: Joi.string().required().messages({
        "any.required": "El ID de Google es obligatorio"
      }),
      email: Joi.string().email().required().messages({
        "string.email": "El email de Google no es válido"
      }),
      name: Joi.string().min(2).max(100).required().messages({
        "string.min": "El nombre debe tener al menos 2 caracteres",
        "string.max": "El nombre no debe superar 100 caracteres"
      }),
      picture: Joi.string().uri().allow("").optional()
    }).unknown(true); // Permite campos extra de Google

    const { error: userError } = userSchema.validate(googleUser, { abortEarly: false });
    if (userError) {
      return res.status(400).json({
        errors: userError.details.map((err) => err.message)
      });
    }

    // 🔹 Podemos agregar los campos adicionales al objeto de usuario
    const userData = {
      ...googleUser,
      phone,
      age
    };

    // 4. Buscar o crear el usuario en la BD
    const user = await findOrCreateUser(userData);

    // 5. Generar token JWT
    const token = generateAppToken(user);

    res.json({
      message: "Usuario autenticado y validado con éxito",
      token,
      user
    });

  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Invalid Google token" });
  }
}
