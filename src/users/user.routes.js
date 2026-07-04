'use strict';

import { Router } from 'express';
import {
  getMyProfile,
  updateMyProfile,
  uploadAvatar,
  addMyAddress,
  removeMyAddress,
  setAddressDefault,
} from './user.controller.js';
import { uploadProfileImage } from '../../middlewares/file-uploader.js';

const router = Router();

// Todas las rutas de perfil requieren autenticación previa vía app.js
router.get('/profile', getMyProfile);
router.put('/profile', updateMyProfile);
router.post(
  '/profile/avatar',
  uploadProfileImage.single('avatar'),
  uploadAvatar
);

// Direcciones
router.post('/profile/addresses', addMyAddress);
router.delete('/profile/addresses/:id', removeMyAddress);
router.patch('/profile/addresses/:id/default', setAddressDefault);

export default router;
