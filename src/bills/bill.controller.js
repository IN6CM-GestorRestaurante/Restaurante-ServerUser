'use strict';

import { createCheckoutBill, fetchUserBills, fetchBillById } from './bill.service.js';

export const checkoutController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { branchId, items, paymentMethod, total } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El carrito no puede estar vacío para procesar el pago',
      });
    }

    const result = await createCheckoutBill({ branchId, items, paymentMethod, total }, userId);

    return res.status(201).json({
      success: true,
      message: 'Pago procesado exitosamente y factura generada',
      data: result,
    });
  } catch (error) {
    console.error('Error en checkoutController:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al procesar el pago y generar factura',
      error: error.message,
    });
  }
};

export const getMyBillsController = async (req, res) => {
  try {
    const userId = req.user._id;
    const bills = await fetchUserBills(userId);

    return res.status(200).json({
      success: true,
      data: bills,
    });
  } catch (error) {
    console.error('Error en getMyBillsController:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el historial de facturas',
      error: error.message,
    });
  }
};

export const getBillByIdController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const bill = await fetchBillById(id, userId);
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Factura no encontrada',
      });
    }

    return res.status(200).json({
      success: true,
      data: bill,
    });
  } catch (error) {
    console.error('Error en getBillByIdController:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el detalle de la factura',
      error: error.message,
    });
  }
};
