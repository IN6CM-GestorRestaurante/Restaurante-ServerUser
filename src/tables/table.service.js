'use strict';

import Table from './table.model.js';

/**
 * Servicio de solo lectura para mesas (gestionadas desde ServerAdmin).
 */
export const fetchTablesByBranch = async (branchId) => {
  return await Table.find({ branch: branchId, isActive: true }).sort({ number: 1 });
};

export const fetchTableById = async (id) => {
  return await Table.findById(id);
};
