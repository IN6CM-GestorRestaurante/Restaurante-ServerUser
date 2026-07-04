'use strict';

import {
  fetchMenus,
  fetchMenuById,
  fetchMenusByBranch,
  fetchCategories,
} from './menu.service.js';

/**
 * Obtener todos los platos con filtros de paginación, categoría y sucursal.
 */
export const getMenus = async (req, res) => {
  try {
    const { page = 1, limit = 10, branchId, category } = req.query;

    const { menus, pagination } = await fetchMenus({
      page,
      limit,
      branchId,
      category,
    });

    return res.status(200).json({
      success: true,
      data: menus,
      pagination,
    });
  } catch (error) {
    console.error('Error en getMenus controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los platos del menú',
      error: error.message,
    });
  }
};

/**
 * Obtener plato por ID.
 */
export const getMenuById = async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await fetchMenuById(id);

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: 'Plato del menú no encontrado',
      });
    }

    return res.status(200).json({
      success: true,
      data: menu,
    });
  } catch (error) {
    console.error('Error en getMenuById controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el detalle del plato',
      error: error.message,
    });
  }
};

/**
 * Obtener menú de una sucursal.
 */
export const getMenusByBranch = async (req, res) => {
  try {
    const { branchId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const { menus, pagination } = await fetchMenusByBranch(branchId, {
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      data: menus,
      pagination,
    });
  } catch (error) {
    console.error('Error en getMenusByBranch controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el menú de la sucursal',
      error: error.message,
    });
  }
};

/**
 * Obtener categorías distintas.
 */
export const getCategories = async (req, res) => {
  try {
    const categories = await fetchCategories();

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error en getCategories controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener las categorías del menú',
      error: error.message,
    });
  }
};
