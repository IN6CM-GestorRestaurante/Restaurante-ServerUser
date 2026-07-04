'use strict';

import Restaurant from './branch.model.js';

/**
 * Servicio para manejar la lógica de datos de restaurantes (sucursales).
 */
export const fetchBranches = async ({
  page = 1,
  limit = 10,
  isActive = true,
}) => {
  const filter = { isActive };

  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  const branches = await Restaurant.find(filter)
    .limit(limitNumber)
    .skip((pageNumber - 1) * limitNumber)
    .sort({ createdAt: -1 });

  const total = await Restaurant.countDocuments(filter);

  return {
    branches,
    pagination: {
      currentPage: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      totalRecords: total,
      limit: limitNumber,
    },
  };
};

export const fetchBranchById = async (id) => {
  return await Restaurant.findById(id);
};
