import { body, param } from 'express-validator';
import { validateJWT } from './validate-JWT.js';
import { checkValidators } from './handle-errors.js';

// Validaciones para crear pedido (POST /)
export const validateCreateOrder = [
  validateJWT,
  body('table')
    .notEmpty()
    .withMessage('El ID de la mesa es obligatorio')
    .isMongoId()
    .withMessage('table debe ser un ObjectId de MongoDB válido'),
  body('restaurant')
    .notEmpty()
    .withMessage('El ID del restaurante es obligatorio')
    .isMongoId()
    .withMessage('restaurant debe ser un ObjectId de MongoDB válido'),
  body('items')
    .notEmpty()
    .withMessage('Los ítems del pedido son obligatorios')
    .isArray()
    .withMessage('Los ítems deben ser un arreglo')
    .custom((value) => value.length > 0)
    .withMessage('El pedido debe tener al menos un ítem'),
  body('items.*.menuItem')
    .notEmpty()
    .withMessage('El ID del plato del menú es obligatorio')
    .isMongoId()
    .withMessage('ID de producto del menú no válido'),
  body('items.*.quantity')
    .notEmpty()
    .withMessage('La cantidad del plato es obligatoria')
    .isInt({ min: 1 })
    .withMessage('La cantidad mínima por producto es 1'),
  body('items.*.modifiers')
    .optional()
    .isArray()
    .withMessage('Los modificadores deben ser un arreglo de cadenas'),
  checkValidators,
];

// Validaciones para cancelar pedido (PUT /:id/cancel)
export const validateCancelOrder = [
  validateJWT,
  param('id')
    .isMongoId()
    .withMessage('ID de pedido debe ser un ObjectId válido de MongoDB'),
  checkValidators,
];
