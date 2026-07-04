'use strict';

export const validateFutureDate = (dateValue) => {
  const inputDate = new Date(dateValue);
  const now = new Date();

  if (inputDate < now) {
    throw new Error('La fecha no puede estar en el pasado');
  }

  return true;
};
