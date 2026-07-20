import { Router } from 'express';
import {
  analyzeProperty, getRecommendations, chat,
  analyzeDocument, getDocumentAnalysis,
} from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/analyze-property', authenticate, analyzeProperty);
router.get('/recommendations', authenticate, getRecommendations);
router.post('/chat', authenticate, chat);
router.post('/analyze-document', authenticate, analyzeDocument);
router.get('/analyze-document/:id', authenticate, getDocumentAnalysis);

export default router;
