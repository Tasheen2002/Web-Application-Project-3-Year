import express from 'express';
import {
  getAllCategories,
  getCategory,
  getCategoryTree
} from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', getAllCategories);
router.get('/tree', getCategoryTree);
router.get('/:id', getCategory);

export default router;