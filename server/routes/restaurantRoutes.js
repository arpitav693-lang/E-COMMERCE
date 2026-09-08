import express from 'express';
import {
  getRestaurants,
  getRestaurantById,
  getCategories,
  createRestaurant,
  addMenuItem
} from '../controllers/restaurantController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/categories', getCategories);
router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);

// Protected Admin / Partner routes
router.post('/', protect, adminOnly, createRestaurant);
router.post('/menu-item', protect, adminOnly, addMenuItem);

export default router;

