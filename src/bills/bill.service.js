'use strict';

import Bill from './bill.model.js';
import Order from '../orders/order.model.js';
import Branch from '../branches/branch.model.js';
import Table from '../tables/table.model.js';
import { User } from '../users/user.model.js';

export const createCheckoutBill = async ({ branchId, items, paymentMethod, total }, userId) => {
  const branch = branchId ? await Branch.findById(branchId) : null;
  const waiter = await User.findOne({ role: 'WAITER', status: true }) || await User.findOne({ role: 'ADMIN', status: true });
  const table = branchId ? await Table.findOne({ branch: branchId, isActive: true }) : await Table.findOne({ isActive: true });

  const computedTotal = total || items.reduce((acc, i) => acc + (i.price || 0) * (i.quantity || 1), 0);

  // 1. Crear pedido pagado en la base de datos
  const order = new Order({
    tables: table ? [table._id] : [],
    branch: branchId || (table ? table.branch : undefined),
    waiter: waiter ? waiter._id : userId,
    user: userId,
    items: (items || []).map(i => ({
      menuItem: i.menuItem,
      quantity: i.quantity || 1,
      modifiers: [],
      status: 'in-kitchen',
      notes: 'Pedido pagado desde App Móvil',
      priceAtTime: i.price || 0
    })),
    status: 'in-kitchen',
    total: computedTotal
  });

  await order.save();

  // 2. Crear factura en la colección 'invoices' compatible con ServerAdmin
  const invoiceNumber = `F-${Math.floor(100000 + Math.random() * 900000)}`;
  const subtotal = Number((computedTotal / 1.12).toFixed(2));
  const taxAmount = Number((computedTotal - subtotal).toFixed(2));
  const mappedMethod = paymentMethod === 'Tarjeta' ? 'CARD' : paymentMethod === 'Efectivo' ? 'CASH' : 'TRANSFER';

  const bill = new Bill({
    invoiceNumber,
    orderId: order._id,
    branchId: branchId || order.branch,
    companyId: branch?.companyId || branch?._id,
    billedBy: 'App Móvil (Autoservicio)',
    customerId: userId.toString(),
    user: userId,
    itemsSnapshot: (items || []).map(i => ({
      menuItemName: i.name || 'Platillo',
      quantity: i.quantity || 1,
      priceAtTime: i.price || 0,
      subtotal: (i.price || 0) * (i.quantity || 1)
    })),
    subtotal,
    taxRate: 0.12,
    taxAmount,
    totalAmount: computedTotal,
    total: computedTotal,
    paymentMethod: mappedMethod,
    status: 'COMMITTED',
    committedAt: new Date(),
    paidAt: new Date()
  });

  await bill.save();

  return { order, bill };
};

export const fetchUserBills = async (userId) => {
  const bills = await Bill.find({
    $or: [
      { user: userId },
      { customerId: userId.toString() }
    ]
  }).sort({ createdAt: -1 });

  return bills;
};

export const fetchBillById = async (billId, userId) => {
  const bill = await Bill.findOne({
    $or: [
      { _id: billId },
      { invoiceNumber: billId }
    ]
  });

  return bill;
};
