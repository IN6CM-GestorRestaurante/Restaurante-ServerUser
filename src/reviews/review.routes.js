'use strict';

import { Router } from 'express';
import {
  postReview,
  getReviewsByBranch,
  getMyReviews,
  putReview,
  removeReview,
} from './review.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router = Router();

// Pública: cualquiera puede ver las reseñas de un restaurante al explorarlo
router.get('/branch/:branchId', getReviewsByBranch);

// A partir de aquí requieren sesión iniciada
router.get('/me', authMiddleware, getMyReviews);
router.post('/', authMiddleware, postReview);
router.put('/:id', authMiddleware, putReview);
router.delete('/:id', authMiddleware, removeReview);

export default router;
