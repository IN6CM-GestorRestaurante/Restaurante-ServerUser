'use strict';

import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  billedBy: { type: String, default: 'App Móvil' },
  customerId: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  itemsSnapshot: [
    {
      menuItemName: { type: String },
      quantity: { type: Number },
      priceAtTime: { type: Number },
      subtotal: { type: Number },
    },
  ],
  subtotal: { type: Number, default: 0 },
  taxRate: { type: Number, default: 0.12 },
  taxAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  paymentMethod: { type: String, default: 'CARD' },
  status: { type: String, default: 'COMMITTED' },
  committedAt: { type: Date, default: Date.now },
  paidAt: { type: Date, default: Date.now },
}, { timestamps: true, versionKey: false });

const Bill = mongoose.models.Invoice || mongoose.model('Invoice', billSchema, 'invoices');
export default Bill;
