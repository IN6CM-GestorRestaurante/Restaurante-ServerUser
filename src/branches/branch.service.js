'use strict';

import Branch from './branch.model.js';

/**
 * Servicio para manejar la lógica de datos de sucursales (branches).
 */
export const fetchBranches = async ({
  page = 1,
  limit = 50,
  isActive = true,
  companyId,
  state,
}) => {
  const filter = {};
  
  if (isActive !== undefined && isActive !== null && isActive !== '') {
    filter.isActive = isActive === 'true' || isActive === true;
  }

  if (companyId) {
    filter.companyId = companyId;
  }

  if (state) {
    filter.state = state;
  } else {
    // Por defecto en la web del comensal no mostrar locales que fueron cerrados definitivamente en Admin
    filter.state = { $ne: 'Cerrada' };
  }

  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 50;

  const branches = await Branch.find(filter)
    .limit(limitNumber)
    .skip((pageNumber - 1) * limitNumber)
    .sort({ createdAt: -1 });

  const total = await Branch.countDocuments(filter);

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
  return await Branch.findById(id);
};
