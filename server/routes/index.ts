/**
 * APIルートインデックス
 * すべてのAPIルートを登録する
 * 
 * API Routes Index
 * Register all API routes here
 */

import express from 'express';
import implementationRouter from './implementation';
import knowledgeRouter from './knowledge';

const router = express.Router();

// Register API routes
// router.use('/trail-map', trailMapRouter);

// Implementation roadmap routes
router.use('/implementation', implementationRouter);

// Knowledge routes
router.use('/knowledge', knowledgeRouter);

// Add more routes here as needed
// router.use('/insights', insightsRouter);

export default router; 