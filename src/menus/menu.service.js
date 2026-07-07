'use strict';

import Menu from './menu.model.js';

/**
 * Listar platos de menú con filtros y paginación.
 */
export const fetchMenus = async ({
  page = 1,
  limit = 50,
  branchId,
  category,
}) => {
  const filter = { isActive: true };
  if (branchId) filter.restaurant = branchId;
  if (category) filter.category = category;

  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 50;

  const menus = await Menu.find(filter)
    .populate('restaurant', 'name address category openingTime closingTime companyId state isActive email phoneNumber')
    .limit(limitNumber)
    .skip((pageNumber - 1) * limitNumber)
    .sort({ createdAt: -1 });

  const total = await Menu.countDocuments(filter);

  return {
    menus,
    pagination: {
      currentPage: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      totalRecords: total,
      limit: limitNumber,
    },
  };
};

/**
 * Obtener un plato de menú por ID.
 */
export const fetchMenuById = async (id) => {
  return await Menu.findById(id).populate(
    'restaurant',
    'name address openingTime closingTime'
  );
};

/**
 * Obtener platos de menú por sucursal específica.
 */
export const fetchMenusByBranch = async (
  branchId,
  { page = 1, limit = 10 } = {}
) => {
  return await fetchMenus({ page, limit, branchId });
};

/**
 * Obtener categorías distintas de platos.
 */
export const fetchCategories = async () => {
  return await Menu.distinct('category', { isActive: true });
};
