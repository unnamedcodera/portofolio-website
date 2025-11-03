import express from 'express';
import {
  getProjects,
  getProjectById,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject
} from '../database-postgres.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', async (req, res) => {
  try {
    const projects = await getProjects();
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    let project;
    
    // Check if it's a slug (contains non-numeric characters) or ID (numeric only)
    if (/^\d+$/.test(req.params.id)) {
      // It's a numeric ID
      project = await getProjectById(parseInt(req.params.id));
    } else {
      // It's a slug
      project = await getProjectBySlug(req.params.id);
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
router.post('/', authMiddleware, async (req, res) => {
  try {
    console.log('Creating project with data:', req.body);
    const result = await createProject(req.body);
    res.status(201).json({ success: true, id: result.id });
  } catch (error) {
    console.error('Error creating project:', error);
    console.error('Error stack:', error.stack);
    console.error('Request body:', req.body);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    console.log('Updating project:', req.params.id, 'with data:', req.body);
    const result = await updateProject(req.params.id, req.body);
    if (!result) {
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

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await deleteProject(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
