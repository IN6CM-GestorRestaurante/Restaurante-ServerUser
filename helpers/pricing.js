'use strict';

/**
 * Calcula el precio efectivo de un platillo aplicando su promoción vigente
 * (si tiene una activa dentro de su ventana de fechas). Es la misma lógica
 * que usan los clientes para mostrar el precio con descuento, pero aquí es
 * la fuente de verdad: el precio que realmente se cobra en pedidos/reservas.
 */
export const computeEffectivePrice = (menuItem) => {
  const basePrice = Number(menuItem.price) || 0;
  const promotion = menuItem.promotion;

  if (!promotion?.isActive) return basePrice;

  const now = new Date();
  if (promotion.startsAt && now < new Date(promotion.startsAt)) return basePrice;
  if (promotion.endsAt && now > new Date(promotion.endsAt)) return basePrice;

  const value = Number(promotion.discountValue) || 0;
  let discounted = basePrice;

  switch (promotion.discountType) {
    case 'PERCENTAGE':
    case 'PORCENTAJE':
      discounted = basePrice - (basePrice * value) / 100;
      break;
    case 'FIXED_PRICE':
      discounted = value;
      break;
    case 'FIXED':
    case 'FIJO':
      discounted = basePrice - value;
      break;
    default:
      return basePrice;
  }

  discounted = Math.max(0, discounted);
  return discounted < basePrice ? discounted : basePrice;
};
