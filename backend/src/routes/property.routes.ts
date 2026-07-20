import { Router } from 'express';
import {
  getProperties, getProperty, createProperty,
  updateProperty, deleteProperty,
  getPropertyReviews, addReview, saveProperty,
} from '../controllers/property.controller';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/', getProperties);
router.get('/:id', optionalAuth, getProperty);
router.post('/', authenticate, createProperty);
router.put('/:id', authenticate, updateProperty);
router.delete('/:id', authenticate, deleteProperty);
router.get('/:id/reviews', getPropertyReviews);
router.post('/:id/reviews', authenticate, addReview);
router.post('/:id/save', authenticate, saveProperty);

export default router;
