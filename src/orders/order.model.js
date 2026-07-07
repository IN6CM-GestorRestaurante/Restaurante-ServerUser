'use strict';

import mongoose from 'mongoose';

// Nombres de campo y enums alineados 1:1 con ServerAdmin/src/orders/order.model.js,
// ya que ambos servicios leen/escriben la misma colección 'orders' compartida.
const ORDER_STATUS = ['pending', 'in-kitchen', 'ready', 'delivered', 'paid', 'cancelled'];

const orderSchema = new mongoose.Schema(
  {
    tables: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table',
        required: [true, 'Al menos una mesa es obligatoria'],
      },
    ],
    waiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El mesero es obligatorio'],
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
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
          enum: ORDER_STATUS,
          default: 'pending',
        },
        notes: {
          type: String,
          default: '',
        },
        priceAtTime: {
          type: Number,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ORDER_STATUS,
      default: 'pending',
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
      (acc, item) => acc + (item.priceAtTime || 0) * (item.quantity || 1),
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
