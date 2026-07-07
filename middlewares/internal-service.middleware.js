'use strict';

// Protege endpoints de uso exclusivo servicio-a-servicio (ej. el sync que llama
// auth-node al registrar un usuario). No hay un JWT de usuario en ese momento,
// asi que se valida con el mismo secreto compartido que ya usan todos los
// servicios Node de este ecosistema para firmar/verificar JWT.
export const requireInternalSecret = (req, res, next) => {
  const secret = process.env.SECRETORPRIVATEKEY;
  const provided = req.header('x-internal-secret');

  if (!secret) {
    console.error('Error de configuración: SECRETORPRIVATEKEY no está definido');
    return res.status(500).json({
      success: false,
      message: 'Configuración del servidor inválida',
    });
  }

  if (!provided || provided !== secret) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado para este endpoint interno',
    });
  }

  next();
};
