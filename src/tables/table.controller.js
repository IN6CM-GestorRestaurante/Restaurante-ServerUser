'use strict';

import { fetchTablesByBranch, fetchTableById } from './table.service.js';

/**
 * Lista las mesas activas de una sucursal (para elegir mesa al reservar).
 */
export const getTablesByBranch = async (req, res) => {
  try {
    const { branchId } = req.params;
    const tables = await fetchTablesByBranch(branchId);

    return res.status(200).json({
      success: true,
      data: tables,
    });
  } catch (error) {
    console.error('Error en getTablesByBranch controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener las mesas de la sucursal',
      error: error.message,
    });
  }
};

export const getTableById = async (req, res) => {
  try {
    const { id } = req.params;
    const table = await fetchTableById(id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Mesa no encontrada',
      });
    }

    return res.status(200).json({
      success: true,
      data: table,
    });
  } catch (error) {
    console.error('Error en getTableById controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener la mesa',
      error: error.message,
    });
  }
};
