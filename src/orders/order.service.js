'use strict';

import Order from './order.model.js';
import Menu from '../src/menus/menu.model.js';
import { User } from '../src/users/user.model.js';

/**
 * Crear un nuevo pedido de restaurante.
 */
export const createOrder = async (orderData, userId) => {
  // 1. Validar y calcular precios unitarios y subtotales desde los platos de la base de datos
  const itemsToCreate = [];
  let computedTotal = 0;

  for (const item of orderData.items) {
    const menuItem = await Menu.findById(item.menuItem);
    if (!menuItem || !menuItem.isActive) {
      throw new Error(`Plato de menú no disponible: ${item.menuItem}`);
    }

    const price = menuItem.price;
    const quantity = parseInt(item.quantity, 10) || 1;
    computedTotal += price * quantity;

    itemsToCreate.push({
      menuItem: item.menuItem,
      quantity,
      modifiers: item.modifiers || [],
      status: 'EN_ESPERA',
      notes: item.notes || '',
      price,
    });
  }

  // 2. Resolver un mesero activo por defecto para satisfacer la validación del esquema
  const defaultWaiter =
    (await User.findOne({ role: 'WAITER', status: true })) ||
    (await User.findOne({ role: 'ADMIN', status: true }));

  if (!defaultWaiter) {
    throw new Error(
      'No hay ningún mesero o administrador activo disponible en el sistema para asignar el pedido.'
    );
  }

  const order = new Order({
    table: orderData.table,
    restaurant: orderData.restaurant,
    waiter: defaultWaiter._id,
    user: userId, // Enlaza el pedido con el cliente móvil
    items: itemsToCreate,
    status: 'ABIERTA',
    total: computedTotal,
  });

  await order.save();
  return order;
};

/**
 * Obtener pedidos de un usuario.
 */
export const fetchUserOrders = async (
  userId,
  { page = 1, limit = 10, status } = {}
) => {
  const filter = { user: userId };
  if (status) filter.status = status;

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  const orders = await Order.find(filter)
    .populate('restaurant', 'name address')
    .populate('table', 'number')
    .populate('items.menuItem', 'name price image')
    .limit(limitNumber)
    .skip((pageNumber - 1) * limitNumber)
    .sort({ createdAt: -1 });

  const total = await Order.countDocuments(filter);

  return {
    orders,
    pagination: {
      currentPage: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      totalRecords: total,
      limit: limitNumber,
    },
  };
};

/**
 * Obtener detalle de un pedido por ID.
 */
export const fetchOrderById = async (orderId, userId) => {
  return await Order.findOne({ _id: orderId, user: userId })
    .populate('restaurant', 'name address')
    .populate('table', 'number')
    .populate('items.menuItem', 'name price image');
};

/**
 * Cancelar un pedido si está abierta.
 */
export const cancelOrder = async (orderId, userId) => {
  const order = await Order.findOne({ _id: orderId, user: userId });

  if (!order) return null;

  if (order.status !== 'ABIERTA') {
    throw new Error(
      `No se puede cancelar un pedido con estado ${order.status}`
    );
  }

  // Verificar si alguno de los platillos ya está en cocina o listo
  const cannotCancel = order.items.some((item) =>
    ['EN_COCINA', 'LISTO', 'SERVIDO'].includes(item.status)
  );

  if (cannotCancel) {
    throw new Error(
      'El pedido ya está en preparación en cocina y no puede cancelarse.'
    );
  }

  order.status = 'CANCELADA';
  await order.save();

  return order;
};
