'use strict';

import { UserProfile } from './user.model.js';

/**
 * Obtener perfil por authId. Si no existe, lo crea automáticamente.
 */
export const findOrCreateProfile = async (authId) => {
  let profile = await UserProfile.findOne({ authId }).populate(
    'defaultBranch',
    'name address'
  );

  if (!profile) {
    profile = new UserProfile({ authId });
    await profile.save();
  }

  return profile;
};

/**
 * Actualizar datos del perfil del usuario.
 */
export const updateProfile = async (authId, updateData) => {
  return await UserProfile.findOneAndUpdate(
    { authId },
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate('defaultBranch', 'name address');
};

/**
 * Actualizar la URL del avatar en MongoDB.
 */
export const updateAvatarUrl = async (authId, avatarUrl) => {
  return await UserProfile.findOneAndUpdate(
    { authId },
    { $set: { avatar: avatarUrl } },
    { new: true }
  ).populate('defaultBranch', 'name address');
};

/**
 * Agregar una dirección al perfil del usuario.
 */
export const addAddress = async (authId, addressData) => {
  const profile = await findOrCreateProfile(authId);

  // Si es la primera dirección o se marca como default, acomodar otras
  if (addressData.isDefault || profile.addresses.length === 0) {
    addressData.isDefault = true;
    profile.addresses.forEach((addr) => {
      addr.isDefault = false;
    });
  }

  profile.addresses.push(addressData);
  await profile.save();
  return profile;
};

/**
 * Eliminar una dirección del perfil.
 */
export const removeAddress = async (authId, addressId) => {
  const profile = await findOrCreateProfile(authId);
  profile.addresses.pull({ _id: addressId });

  // Si eliminamos la default y quedan direcciones, marcar una nueva default
  const hasDefault = profile.addresses.some((addr) => addr.isDefault);
  if (!hasDefault && profile.addresses.length > 0) {
    profile.addresses[0].isDefault = true;
  }

  await profile.save();
  return profile;
};

/**
 * Establecer una dirección como predeterminada.
 */
export const setDefaultAddress = async (authId, addressId) => {
  const profile = await findOrCreateProfile(authId);

  profile.addresses.forEach((addr) => {
    if (String(addr._id) === String(addressId)) {
      addr.isDefault = true;
    } else {
      addr.isDefault = false;
    }
  });

  await profile.save();
  return profile;
};
