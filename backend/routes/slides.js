import express from 'express';
import {
  getBannerSlides,
  getBannerSlideById,
  createBannerSlide,
  updateBannerSlide,
  deleteBannerSlide
} from '../database.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', (req, res) => {
  try {
    const slides = getBannerSlides();
    res.json(slides);
  } catch (error) {
    console.error('Error fetching banner slides:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const slide = getBannerSlideById(req.params.id);
    if (!slide) {
      return res.status(404).json({ error: 'Banner slide not found' });
    }
    res.json(slide);
  } catch (error) {
    console.error('Error fetching banner slide:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Protected routes (require authentication)
router.post('/', authMiddleware, (req, res) => {
  try {
    const result = createBannerSlide(req.body);
    res.status(201).json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error creating banner slide:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authMiddleware, (req, res) => {
  try {
    const result = updateBannerSlide(req.params.id, req.body);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Banner slide not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating banner slide:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const result = deleteBannerSlide(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Banner slide not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting banner slide:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
