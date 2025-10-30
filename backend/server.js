import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config.js';
import authRoutes from './routes/auth.js';
import teamRoutes from './routes/team.js';
import projectRoutes from './routes/projects.js';
import slideRoutes from './routes/slides.js';
import uploadRoutes from './routes/upload.js';
import categoryRoutes from './routes/categories.js';
import inquiryRoutes from './routes/inquiries.js';
import settingsRoutes from './routes/settings.js';
import { getCsrfToken, verifyCsrfToken } from './middleware/csrf.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "data:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Limit login attempts
  message: 'Too many login attempts, please try again later.',
});

app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);

// CORS
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));
app.use(cookieParser());
// Increase body size limit to handle base64 images and large canvas content (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CSRF token endpoint (public)
app.get('/api/csrf-token', getCsrfToken);

// Routes (apply CSRF protection to protected routes)
app.use('/api/auth', authRoutes);
app.use('/api/team', verifyCsrfToken, teamRoutes);
app.use('/api/projects', verifyCsrfToken, projectRoutes);
app.use('/api/slides', verifyCsrfToken, slideRoutes);
app.use('/api/upload', verifyCsrfToken, uploadRoutes);
app.use('/api/categories', verifyCsrfToken, categoryRoutes);
app.use('/api/inquiries', inquiryRoutes); // Public POST, protected PUT/DELETE
app.use('/api/settings', settingsRoutes); // Public GET, protected PUT

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error occurred:');
  console.error('Path:', req.path);
  console.error('Method:', req.method);
  console.error('Body:', req.body);
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message,
    path: req.path
  });
});

// Start server
app.listen(config.port, () => {
  console.log(`
🚀 Server is running!
📡 Port: ${config.port}
🌍 Environment: ${config.nodeEnv}
🔗 API: http://localhost:${config.port}/api
  `);
});

export default app;
