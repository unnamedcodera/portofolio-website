import express from 'express';
import { getSettings, updateSettings } from '../database-postgres.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Public route - Get settings
router.get('/', async (req, res) => {
  try {
    const settings = await getSettings();
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Protected route - Update settings
router.put('/', authMiddleware, async (req, res) => {
  try {
    await updateSettings(req.body);
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
