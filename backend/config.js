import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  backendDomain: process.env.BACKEND_DOMAIN || 'http://localhost:5001',
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'darahitam_dev',
    user: process.env.DB_USER || 'darahitam',
    password: process.env.DB_PASSWORD || 'dev_password_2024',
    type: process.env.DB_TYPE || 'postgresql'
  },
  dbPath: process.env.DB_PATH || './database.sqlite', // Legacy support
  admin: {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'admin123'
  }
};

export default config;
