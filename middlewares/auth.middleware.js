'use strict';

import jwt from 'jsonwebtoken';
import { User } from '../src/users/user.model.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado',
      });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verificar token con el secreto compartido (SECRETORPRIVATEKEY en restaurantes)
    const secret = process.env.SECRETORPRIVATEKEY;
    if (!secret) {
      console.error(
        'Error de autenticación: SECRETORPRIVATEKEY no está definido'
      );
      return res.status(500).json({
        success: false,
        message: 'Configuración del servidor inválida',
      });
    }

    const decoded = jwt.verify(token, secret);

    // .NET almacena el email en claim estándar, pero a veces usa esquemas completos.
    const userEmail =
      decoded.email ||
      decoded[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
      ];

    if (!userEmail) {
      return res.status(401).json({
        success: false,
        message: 'Token no válido - Faltan claims de identidad',
      });
    }

    // Buscar el perfil de usuario en MongoDB usando el correo
    const mongoUser = await User.findOne({ email: userEmail });

    if (!mongoUser || !mongoUser.status) {
      return res.status(401).json({
        success: false,
        message:
          'Token no válido - Perfil de usuario inactivo o no existe en DB',
      });
    }

    // Inyectar el usuario en la request
    req.user = mongoUser;

    // Inyectar el ID de PostgreSQL y rol decodificados
    req.postgresUserId = decoded.sub;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    console.error('Error de autenticación JWT:', error.message);

    let message = 'Token inválido o expirado';
    if (error.name === 'TokenExpiredError') {
      message = 'El token ha expirado';
    }

    return res.status(401).json({
      success: false,
      message,
    });
  }
};
