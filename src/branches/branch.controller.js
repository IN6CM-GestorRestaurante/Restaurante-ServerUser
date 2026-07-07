'use strict';

import { fetchBranches, fetchBranchById } from './branch.service.js';

/**
 * Obtener todos los restaurantes con paginación y filtros.
 */
export const getBranches = async (req, res) => {
  try {
    const { page = 1, limit = 50, isActive = true, companyId, state } = req.query;

    const { branches, pagination } = await fetchBranches({
      page,
      limit,
      isActive,
      companyId,
      state,
    });

    return res.status(200).json({
      success: true,
      data: branches,
      pagination,
    });
  } catch (error) {
    console.error('Error en getBranches controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener las sucursales',
      error: error.message,
    });
  }
};

/**
 * Obtener sucursal por ID.
 */
export const getBranchById = async (req, res) => {
  try {
    const { id } = req.params;
    const branch = await fetchBranchById(id);

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Sucursal no encontrada',
      });
    }

    return res.status(200).json({
      success: true,
      data: branch,
    });
  } catch (error) {
    console.error('Error en getBranchById controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el detalle de la sucursal',
      error: error.message,
    });
  }
};
