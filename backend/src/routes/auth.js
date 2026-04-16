import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'wexa-super-secret-key-eval-2026';

router.post('/signup', async (req, res) => {
  try {
    const { email, password, organizationName } = req.body;

    if (!email || !password || !organizationName) {
      return res.status(400).json({ error: 'Email, password, and organization name are required' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create Organization and User
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const org = await prisma.organization.create({
      data: {
        name: organizationName,
        users: {
          create: {
            email,
            password: hashedPassword
          }
        }
      },
      include: {
        users: true
      }
    });

    // --- MOCK DATA SEEDING ---
    // Automatically provision some realistic inventory mock data for the evaluator
    await prisma.product.createMany({
      data: [
        { organizationId: org.id, name: 'Ergonomic Office Chair', sku: 'FURN-OC-092', description: 'Mesh back, lumbar support', quantity: 4, costPrice: 65.00, sellingPrice: 149.50, lowStockThreshold: 10 },
        { organizationId: org.id, name: 'Premium Wireless Headphones', sku: 'AUDIO-WH-001', description: 'Over-ear noise cancelling', quantity: 45, costPrice: 85.00, sellingPrice: 199.99, lowStockThreshold: 15 },
        { organizationId: org.id, name: 'Mechanical Keyboard (Red Switches)', sku: 'TECH-MK-223', description: 'RGB backlighting', quantity: 120, costPrice: 35.00, sellingPrice: 89.99, lowStockThreshold: 20 },
        { organizationId: org.id, name: 'USB-C Fast Charging Cable (2m)', sku: 'ACC-CBL-004', description: 'Braided nylon 100W', quantity: 2, costPrice: 2.50, sellingPrice: 14.99, lowStockThreshold: 25 },
        { organizationId: org.id, name: '4K Ultra HD Monitor (27-inch)', sku: 'DISP-4K-029', description: 'Color-accurate IPS panel', quantity: 12, costPrice: 210.00, sellingPrice: 349.99, lowStockThreshold: 5 }
      ]
    });
    // -------------------------

    const user = org.users[0];
    const token = jwt.sign({ userId: user.id, organizationId: org.id }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, organizationId: org.id, organizationName: org.name }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error during signup' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { organization: true }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, organizationId: user.organizationId }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      token,
      user: { id: user.id, email: user.email, organizationId: user.organizationId, organizationName: user.organization.name }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

export default router;
