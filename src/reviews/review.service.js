'use strict';

import mongoose from 'mongoose';
import Review from './review.model.js';

export const createReview = async ({ userId, restaurant, menuItem = null, rating, comment }) => {
  const exists = await Review.findOne({ user: userId, restaurant, menuItem });
  if (exists) {
    const err = new Error('Ya calificaste esto anteriormente. Puedes editar tu reseña existente.');
    err.statusCode = 409;
    throw err;
  }

  return await Review.create({ user: userId, restaurant, menuItem, rating, comment });
};

export const fetchReviewsByRestaurant = async (restaurantId, { page = 1, limit = 20 } = {}) => {
  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 20;

  const filter = { restaurant: restaurantId };

  const [reviews, total, averageAgg] = await Promise.all([
    Review.find(filter)
      .populate('user', 'name surname username')
      .populate('menuItem', 'name')
      .sort({ createdAt: -1 })
      .limit(limitNumber)
      .skip((pageNumber - 1) * limitNumber),
    Review.countDocuments(filter),
    Review.aggregate([
      { $match: { restaurant: new mongoose.Types.ObjectId(restaurantId) } },
      { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]),
  ]);

  return {
    reviews,
    averageRating: averageAgg[0]?.average || 0,
    totalReviews: averageAgg[0]?.count || 0,
    pagination: {
      currentPage: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      totalRecords: total,
      limit: limitNumber,
    },
  };
};

export const fetchMyReviews = async (userId) => {
  return await Review.find({ user: userId })
    .populate('restaurant', 'name address photos')
    .populate('menuItem', 'name')
    .sort({ createdAt: -1 });
};

export const updateOwnReview = async (id, userId, { rating, comment }) => {
  const review = await Review.findOne({ _id: id, user: userId });
  if (!review) {
    const err = new Error('Reseña no encontrada');
    err.statusCode = 404;
    throw err;
  }

  if (rating !== undefined) review.rating = rating;
  if (comment !== undefined) review.comment = comment;
  review.updatedAt = new Date();

  await review.save();
  return review;
};

export const deleteOwnReview = async (id, userId) => {
  const review = await Review.findOneAndDelete({ _id: id, user: userId });
  if (!review) {
    const err = new Error('Reseña no encontrada');
    err.statusCode = 404;
    throw err;
  }
  return review;
};
