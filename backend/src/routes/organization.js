import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.use(authenticate);

// Get Organization Details (includes threshold settings)
router.get('/me', async (req, res) => {
  try {
    const org = await prisma.organization.findUnique({
      where: { id: req.user.organizationId }
    });
    if (!org) return res.status(404).json({ error: 'Organization not found' });
    res.json(org);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch organization' });
  }
});

// Update Organization Settings
router.put('/me', async (req, res) => {
  try {
    const { globalLowStockThreshold } = req.body;
    
    const org = await prisma.organization.update({
      where: { id: req.user.organizationId },
      data: {
        globalLowStockThreshold: globalLowStockThreshold !== undefined ? parseInt(globalLowStockThreshold) : undefined
      }
    });
    res.json(org);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update organization' });
  }
});

export default router;
