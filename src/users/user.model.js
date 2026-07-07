import mongoose from 'mongoose';

// Modelo User (compartido y sincronizado con PostgreSQL)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ['ADMIN', 'CLIENT', 'WAITER'],
    default: 'CLIENT',
  },
  status: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  user.uid = user._id;
  delete user._id;
  delete user.__v;
  return user;
};

export const User =
  mongoose.models.User || mongoose.model('User', userSchema, 'users');

// Modelo UserProfile (específico de la app móvil en MongoDB para datos extendidos)
const userProfileSchema = new mongoose.Schema(
  {
    authId: {
      type: String,
      required: [true, 'El ID de autenticación es requerido'],
      unique: true,
      index: true,
    },
    displayName: {
      type: String,
      trim: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    favoriteCategories: {
      type: [String],
      default: [],
    },
    defaultBranch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      default: null,
    },
    addresses: [
      {
        label: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        reference: { type: String, default: '' },
        isDefault: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const UserProfile =
  mongoose.models.UserProfile ||
  mongoose.model('UserProfile', userProfileSchema, 'userprofiles');
