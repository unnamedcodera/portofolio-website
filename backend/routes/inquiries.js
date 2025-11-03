import express from 'express';
import * as db from '../database-postgres.js';
import { authenticateToken } from '../middleware/auth.js';
import { inquiryValidation, validateRequest } from '../middleware/validation.js';

const router = express.Router();

// GET all inquiries (protected)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const inquiries = await db.getAllInquiries();
    res.json(inquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

// GET inquiries statistics (protected)
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const stats = await db.getInquiriesStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching inquiry stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// GET inquiries by status (protected)
router.get('/status/:status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.params;
    const inquiries = await db.getInquiriesByStatus(status);
    res.json(inquiries);
  } catch (error) {
    console.error('Error fetching inquiries by status:', error);
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

// GET single inquiry (protected)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const inquiry = await db.getInquiryById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }
    res.json(inquiry);
  } catch (error) {
    console.error('Error fetching inquiry:', error);
    res.status(500).json({ error: 'Failed to fetch inquiry' });
  }
});

// POST new inquiry (public - no auth required, but validated)
router.post('/', inquiryValidation, validateRequest, (req, res) => {
  try {
    const {
      companyName,
      businessType,
      contactPerson,
      email,
      phone,
      whatsapp,
      projectType, // Array of strings
      budget,
      timeline,
      projectDetails
    } = req.body;

    // Validation
    if (!companyName || !contactPerson || !email || !phone || !projectType || !projectDetails) {
      return res.status(400).json({ 
        error: 'Missing required fields: companyName, contactPerson, email, phone, projectType, projectDetails' 
      });
    }

    // Convert projectType array to JSON string for storage
    const projectTypeStr = Array.isArray(projectType) 
      ? JSON.stringify(projectType) 
      : projectType;

    const data = {
      company_name: companyName,
      business_type: businessType,
      contact_person: contactPerson,
      email,
      phone,
      whatsapp: whatsapp || phone,
      project_type: projectTypeStr,
      budget,
      timeline,
      project_details: projectDetails
    };

    const result = db.createInquiry(data);
    
    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      id: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({ 
      error: 'Failed to submit inquiry',
      details: error.message 
    });
  }
});

// PUT update inquiry status (protected)
router.put('/:id/status', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const validStatuses = ['new', 'in-progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be one of: new, in-progress, completed, cancelled' 
      });
    }

    const result = db.updateInquiryStatus(id, status, notes);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    res.json({ 
      success: true, 
      message: 'Inquiry status updated successfully' 
    });
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    res.status(500).json({ error: 'Failed to update inquiry status' });
  }
});

// DELETE inquiry (protected)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const result = db.deleteInquiry(req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    res.json({ 
      success: true, 
      message: 'Inquiry deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    res.status(500).json({ error: 'Failed to delete inquiry' });
  }
});

export default router;
