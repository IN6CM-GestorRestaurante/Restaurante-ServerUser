'use strict';

import jwt from 'jsonwebtoken';
import { User } from '../src/users/user.model.js';

export const validateJWT = async (req, res, next) => {
  const secret = process.env.SECRETORPRIVATEKEY;

  if (!secret) {
    console.error(
      'Error de validación JWT: SECRETORPRIVATEKEY no está definido'
    );
    return res.status(500).json({
      success: false,
      message: 'Configuración del servidor inválida: falta SECRETORPRIVATEKEY',
    });
  }

  const token =
    req.header('x-token') ||
    req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No se proporcionó un token',
      error: 'MISSING_TOKEN',
    });
  }

  try {
    const decoded = jwt.verify(token, secret);

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

    const mongoUser = await User.findOne({ email: userEmail });

    if (!mongoUser || !mongoUser.status) {
      return res.status(401).json({
        success: false,
        message: 'Token no válido - Usuario no existe o está inactivo',
      });
    }

    req.user = mongoUser;
    req.postgresUserId = decoded.sub;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    console.error('Error de validación JWT:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'El token ha expirado',
        error: 'TOKEN_EXPIRED',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido',
        error: 'INVALID_TOKEN',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al validar el token',
      error: 'TOKEN_VALIDATION_ERROR',
    });
  }
};
