import express from 'express';
import {
  getAllProducts,
  getProduct,
  getFeaturedProducts,
  getProductsByCategory,
  searchProducts,
  createProductReview,
  getProductReviews
} from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/search', searchProducts);
router.get('/category/:categoryId', getProductsByCategory);
router.get('/:id', getProduct);

router.get('/:id/reviews', getProductReviews);
router.post('/:id/reviews', protect, createProductReview);

export default router;