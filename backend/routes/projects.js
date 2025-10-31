import express from 'express';
import {
  getProjects,
  getProjectById,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject
} from '../database.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', (req, res) => {
  try {
    const projects = getProjects();
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', (req, res) => {
  try {
    let project;
    
    // Check if it's a slug (contains non-numeric characters) or ID (numeric only)
    if (/^\d+$/.test(req.params.id)) {
      // It's a numeric ID
      project = getProjectById(req.params.id);
    } else {
      // It's a slug
      project = getProjectBySlug(req.params.id);
    }
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Protected routes (require authentication)
router.post('/', authMiddleware, (req, res) => {
  try {
    console.log('Creating project with data:', req.body);
    const result = createProject(req.body);
    res.status(201).json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error creating project:', error);
    console.error('Error stack:', error.stack);
    console.error('Request body:', req.body);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

router.put('/:id', authMiddleware, (req, res) => {
  try {
    console.log('Updating project:', req.params.id, 'with data:', req.body);
    const result = updateProject(req.params.id, req.body);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating project:', error);
    console.error('Error stack:', error.stack);
    console.error('Request body:', req.body);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const result = deleteProject(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
