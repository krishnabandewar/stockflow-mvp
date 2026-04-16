import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// All product routes strictly scoped by organization ID
router.use(authenticate);

// Get all products for the org
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { organizationId: req.user.organizationId },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Create a new product
router.post('/', async (req, res) => {
  try {
    const { name, sku, description, quantity, costPrice, sellingPrice, lowStockThreshold } = req.body;
    
    const existingSku = await prisma.product.findFirst({
      where: { organizationId: req.user.organizationId, sku }
    });
    
    if (existingSku) return res.status(400).json({ error: 'SKU must be unique within your organization.' });

    const product = await prisma.product.create({
      data: {
        organizationId: req.user.organizationId,
        name,
        sku,
        description,
        quantity: parseInt(quantity) || 0,
        costPrice: costPrice ? parseFloat(costPrice) : null,
        sellingPrice: sellingPrice ? parseFloat(sellingPrice) : null,
        lowStockThreshold: lowStockThreshold !== '' && lowStockThreshold != null ? parseInt(lowStockThreshold) : null
      }
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sku, description, quantity, costPrice, sellingPrice, lowStockThreshold } = req.body;

    // Validate ownership before update
    const existing = await prisma.product.findFirst({
      where: { id, organizationId: req.user.organizationId }
    });
    if (!existing) return res.status(404).json({ error: 'Product not found or unauthorized' });

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        sku,
        description,
        quantity: quantity !== undefined ? parseInt(quantity) : undefined,
        costPrice: costPrice !== undefined ? parseFloat(costPrice) : null,
        sellingPrice: sellingPrice !== undefined ? parseFloat(sellingPrice) : null,
        lowStockThreshold: lowStockThreshold !== '' && lowStockThreshold != null ? parseInt(lowStockThreshold) : null
      }
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Ensure ownership
    const existing = await prisma.product.findFirst({
      where: { id, organizationId: req.user.organizationId }
    });
    if (!existing) return res.status(404).json({ error: 'Product not found or unauthorized' });

    await prisma.product.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
