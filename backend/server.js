import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config.js';
import { initDatabase } from './database-postgres.js';
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
      imgSrc: ["'self'", "data:", "blob:", "https:", config.backendDomain],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "data:"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// CORS - Dynamic origin handling
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://darahitam.com',
  'https://www.darahitam.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`⚠️  CORS blocked: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(cookieParser());
// Increase body size limit to handle base64 images and large canvas content (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from uploads directory with CORS headers
app.use('/uploads', (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) !== -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// CSRF token endpoint (public)
app.get('/csrf-token', getCsrfToken);

// CSRF protection for non-GET requests
app.use((req, res, next) => {
  // Skip CSRF for GET requests and auth routes
  if (req.method === 'GET' || req.path.startsWith('/auth')) {
    return next();
  }
  // Apply CSRF for POST, PUT, DELETE
  verifyCsrfToken(req, res, next);
});

// Routes
app.use('/auth', authRoutes);
app.use('/team', teamRoutes);
app.use('/projects', projectRoutes);
app.use('/slides', slideRoutes);
app.use('/upload', uploadRoutes);
app.use('/categories', categoryRoutes);
app.use('/inquiries', inquiryRoutes);
app.use('/settings', settingsRoutes);

// Health check
app.get('/health', (req, res) => {
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

// Start server with database initialization
const startServer = async () => {
  try {
    // Initialize PostgreSQL database
    await initDatabase();
    
    app.listen(config.port, () => {
      console.log(`
🚀 Server is running!
📡 Port: ${config.port}
🌍 Environment: ${config.nodeEnv}
�️  Database: PostgreSQL
�🔗 API: http://localhost:${config.port}
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
