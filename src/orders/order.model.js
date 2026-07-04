'use strict';

import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table',
      required: [true, 'La mesa es obligatoria'],
    },
    waiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El mesero es obligatorio'],
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'El restaurante es obligatorio'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Opcional, para enlazar el pedido al cliente móvil
    },
    items: [
      {
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Menu',
          required: [true, 'El platillo es obligatorio'],
        },
        quantity: {
          type: Number,
          required: [true, 'La cantidad es obligatoria'],
          min: [1, 'La cantidad mínima es 1'],
        },
        modifiers: {
          type: [String],
          default: [],
        },
        status: {
          type: String,
          enum: ['EN_ESPERA', 'EN_COCINA', 'LISTO', 'SERVIDO'],
          default: 'EN_ESPERA',
        },
        notes: {
          type: String,
          default: '',
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ['ABIERTA', 'CERRADA', 'CANCELADA'],
      default: 'ABIERTA',
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Pre-save hook para calcular el total
orderSchema.pre('save', function (next) {
  if (this.items && this.items.length > 0) {
    this.total = this.items.reduce(
      (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
      0
    );
  } else {
    this.total = 0;
  }
  next();
});

const Order =
  mongoose.models.Order || mongoose.model('Order', orderSchema, 'orders');
export default Order;
