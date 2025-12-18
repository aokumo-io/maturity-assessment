/**
 * @file ai-routes.ts
 * @description AIに関連するルート定義
 * AIエンドポイントへのルーティングを設定します。
 */

import express, { Router } from 'express';
import AIController from '../controllers/ai-controller';
import { requireValidSession } from '../middleware/session';
import { csrfProtection } from '../middleware/csrf';

const router: Router = express.Router();

// Apply authentication middleware to all AI routes
router.use(requireValidSession);

// AI routes with CSRF protection for POST endpoints
router.post('/prompt', csrfProtection, AIController.handlePrompt);
router.post('/educational-content', csrfProtection, AIController.handleEducationalContent);
router.post('/executive-summary', csrfProtection, AIController.handleExecutiveSummary);
router.post('/trail-map-milestones', csrfProtection, AIController.handleTrailMapMilestones);
router.post('/prioritized-focus-areas', csrfProtection, AIController.handlePrioritizedFocusAreas);
router.get('/status', AIController.checkAPIKeys);

export default router; 