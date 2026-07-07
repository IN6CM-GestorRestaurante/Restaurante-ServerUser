'use strict';

import {
  findOrCreateProfile,
  updateProfile,
  updateAvatarUrl,
  addAddress,
  removeAddress,
  setDefaultAddress,
  upsertUserFromAuthProfile,
} from './user.service.js';
import { enrichUserProfile } from '../../helpers/profile-enrichment.js';
import { uploadProfilePictureToAuth } from '../auth/auth-profile.service.js';

/**
 * Sincroniza (crea o actualiza) el registro local de un usuario recien
 * registrado en auth-node. Llamado servicio-a-servicio, protegido por
 * requireInternalSecret (no lleva JWT de usuario).
 */
export const syncUser = async (req, res) => {
  try {
    const { email, name, surname, username, phone, role } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'El email es obligatorio para sincronizar el usuario',
      });
    }

    const user = await upsertUserFromAuthProfile({
      email,
      name,
      surname,
      username,
      phone,
      role,
    });

    return res.status(200).json({
      success: true,
      message: 'Usuario sincronizado exitosamente',
      user,
    });
  } catch (error) {
    console.error('Error en syncUser controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al sincronizar el usuario',
      error: error.message,
    });
  }
};

/**
 * Obtener perfil del usuario autenticado.
 */
export const getMyProfile = async (req, res) => {
  try {
    const authId = req.postgresUserId; // ID numérico de Postgres
    const profile = await findOrCreateProfile(authId);
    const enrichedProfile = await enrichUserProfile(profile);

    return res.status(200).json({
      success: true,
      data: enrichedProfile,
    });
  } catch (error) {
    console.error('Error en getMyProfile controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener tu perfil de usuario',
      error: error.message,
    });
  }
};

/**
 * Actualizar perfil del propio usuario.
 */
export const updateMyProfile = async (req, res) => {
  try {
    const authId = req.postgresUserId;
    const { displayName, phone, favoriteCategories, defaultBranch } = req.body;

    const updatedProfile = await updateProfile(authId, {
      displayName,
      phone,
      favoriteCategories,
      defaultBranch: defaultBranch || null,
    });

    const enrichedProfile = await enrichUserProfile(updatedProfile);

    return res.status(200).json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: enrichedProfile,
    });
  } catch (error) {
    console.error('Error en updateMyProfile controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar tu perfil',
      error: error.message,
    });
  }
};

/**
 * Subir o actualizar foto de perfil en auth-service/auth-node.
 */
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se ha proporcionado ninguna imagen',
      });
    }

    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(401).json({
        success: false,
        message: 'No se proporcionó un token',
      });
    }

    // Subir la imagen al servicio de autenticación (auth-node)
    const authUser = await uploadProfilePictureToAuth(req.file, authorization);

    const authId = req.postgresUserId;
    const profilePictureUrl =
      authUser?.profilePicture || authUser?.avatar || '';

    // Sincronizar en el perfil de MongoDB
    const updatedProfile = await updateAvatarUrl(authId, profilePictureUrl);
    const enrichedProfile = await enrichUserProfile(updatedProfile);

    return res.status(200).json({
      success: true,
      message: 'Avatar actualizado exitosamente',
      data: enrichedProfile,
    });
  } catch (error) {
    console.error('Error en uploadAvatar controller:', error);
    return res.status(error.status || 500).json({
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        'Error al subir el avatar del usuario',
    });
  }
};

/**
 * Agregar dirección de entrega.
 */
export const addMyAddress = async (req, res) => {
  try {
    const authId = req.postgresUserId;
    const { label, street, city, reference, isDefault } = req.body;

    const profile = await addAddress(authId, {
      label,
      street,
      city,
      reference,
      isDefault: isDefault || false,
    });

    const enrichedProfile = await enrichUserProfile(profile);

    return res.status(200).json({
      success: true,
      message: 'Dirección agregada exitosamente',
      data: enrichedProfile,
    });
  } catch (error) {
    console.error('Error en addMyAddress controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al agregar dirección',
      error: error.message,
    });
  }
};

/**
 * Eliminar dirección de entrega.
 */
export const removeMyAddress = async (req, res) => {
  try {
    const authId = req.postgresUserId;
    const { id } = req.params;

    const profile = await removeAddress(authId, id);
    const enrichedProfile = await enrichUserProfile(profile);

    return res.status(200).json({
      success: true,
      message: 'Dirección eliminada exitosamente',
      data: enrichedProfile,
    });
  } catch (error) {
    console.error('Error en removeMyAddress controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar dirección',
      error: error.message,
    });
  }
};

/**
 * Establecer dirección como default.
 */
export const setAddressDefault = async (req, res) => {
  try {
    const authId = req.postgresUserId;
    const { id } = req.params;

    const profile = await setDefaultAddress(authId, id);
    const enrichedProfile = await enrichUserProfile(profile);

    return res.status(200).json({
      success: true,
      message: 'Dirección establecida como predeterminada',
      data: enrichedProfile,
    });
  } catch (error) {
    console.error('Error en setAddressDefault controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar dirección predeterminada',
      error: error.message,
    });
  }
};
