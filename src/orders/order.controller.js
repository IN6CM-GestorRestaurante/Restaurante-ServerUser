'use strict';

import {
  createOrder,
  fetchUserOrders,
  fetchOrderById,
  cancelOrder,
} from './order.service.js';

/**
 * Crear un nuevo pedido.
 */
export const createOrderController = async (req, res) => {
  try {
    const userId = req.user._id; // MongoDB ObjectId
    const order = await createOrder(req.body, userId);

    return res.status(201).json({
      success: true,
      message: 'Pedido creado exitosamente',
      data: order,
    });
  } catch (error) {
    console.error('Error en createOrder controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al procesar el pedido',
      error: error.message,
    });
  }
};

/**
 * Obtener historial de pedidos del usuario autenticado.
 */
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, status } = req.query;

    const { orders, pagination } = await fetchUserOrders(userId, {
      page,
      limit,
      status,
    });

    return res.status(200).json({
      success: true,
      data: orders,
      pagination,
    });
  } catch (error) {
    console.error('Error en getMyOrders controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener tus pedidos',
      error: error.message,
    });
  }
};

/**
 * Obtener detalles de un pedido.
 */
export const getOrderDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const order = await fetchOrderById(id, userId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado o no pertenece a tu usuario',
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Error en getOrderDetails controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los detalles del pedido',
      error: error.message,
    });
  }
};

/**
 * Cancelar un pedido propio.
 */
export const cancelOrderController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const order = await cancelOrder(id, userId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado o no pertenece a tu usuario',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Pedido cancelado exitosamente',
      data: order,
    });
  } catch (error) {
    console.error('Error en cancelOrder controller:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Error al cancelar el pedido',
    });
  }
};
