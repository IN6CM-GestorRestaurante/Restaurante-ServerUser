import { body, param } from 'express-validator';
import { validateJWT } from './validate-JWT.js';
import { checkValidators } from './handle-errors.js';
import { validateFutureDate } from '../helpers/validation-helpers.js';

// Validaciones para crear reservación (POST /)
export const validateCreateReservation = [
  validateJWT,
  body('restaurant')
    .notEmpty()
    .withMessage('El ID del restaurante es obligatorio')
    .isMongoId()
    .withMessage('restaurant debe ser un ObjectId de MongoDB válido'),
  body('type')
    .notEmpty()
    .withMessage('El tipo de reservación es obligatorio')
    .isIn(['En Mesa', 'Para llevar', 'A domicilio'])
    .withMessage('Tipo de reservación no válido'),
  body('date')
    .notEmpty()
    .withMessage('La fecha y hora son obligatorias')
    .isISO8601()
    .withMessage('date debe ser una fecha ISO8601 válida')
    .custom(validateFutureDate),
  body('table')
    .if(body('type').equals('En Mesa'))
    .notEmpty()
    .withMessage('La mesa es obligatoria para reservaciones en el local')
    .isMongoId()
    .withMessage('No es un ID de mesa válido'),
  body('deliveryAddress')
    .if(body('type').equals('A domicilio'))
    .notEmpty()
    .withMessage(
      'La dirección de entrega es obligatoria para pedidos a domicilio'
    )
    .trim(),
  body('items')
    .optional()
    .isArray()
    .withMessage('Los ítems deben ser un arreglo'),
  body('items.*.menuItem')
    .if(body('items').exists())
    .isMongoId()
    .withMessage('ID de producto del menú no válido'),
  body('items.*.quantity')
    .if(body('items').exists())
    .isInt({ min: 1 })
    .withMessage('La cantidad mínima por producto es 1'),
  checkValidators,
];

// Validaciones para cancelar reservación (PUT /:id/cancel)
export const validateCancelReservation = [
  validateJWT,
  param('id')
    .isMongoId()
    .withMessage('ID debe ser un ObjectId válido de MongoDB'),
  checkValidators,
];
