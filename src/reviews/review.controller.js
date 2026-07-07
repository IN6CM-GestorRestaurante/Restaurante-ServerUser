'use strict';

import {
  createReview,
  fetchReviewsByRestaurant,
  fetchMyReviews,
  updateOwnReview,
  deleteOwnReview,
} from './review.service.js';

export const postReview = async (req, res) => {
  try {
    const { restaurant, menuItem, rating, comment } = req.body;

    const review = await createReview({
      userId: req.user._id,
      restaurant,
      menuItem: menuItem || null,
      rating,
      comment,
    });

    return res.status(201).json({ success: true, data: review });
  } catch (error) {
    console.error('Error en postReview controller:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Error al crear la reseña',
    });
  }
};

export const getReviewsByBranch = async (req, res) => {
  try {
    const { branchId } = req.params;
    const { page, limit } = req.query;

    const result = await fetchReviewsByRestaurant(branchId, { page, limit });

    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error('Error en getReviewsByBranch controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener las reseñas',
      error: error.message,
    });
  }
};

export const getMyReviews = async (req, res) => {
  try {
    const reviews = await fetchMyReviews(req.user._id);
    return res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    console.error('Error en getMyReviews controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener tus reseñas',
      error: error.message,
    });
  }
};

export const putReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await updateOwnReview(id, req.user._id, { rating, comment });

    return res.status(200).json({ success: true, data: review });
  } catch (error) {
    console.error('Error en putReview controller:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Error al actualizar la reseña',
    });
  }
};

export const removeReview = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteOwnReview(id, req.user._id);

    return res.status(200).json({ success: true, message: 'Reseña eliminada' });
  } catch (error) {
    console.error('Error en removeReview controller:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Error al eliminar la reseña',
    });
  }
};
