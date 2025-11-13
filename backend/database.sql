-- PostgreSQL Database Initialization Script
-- This script will be run automatically when the PostgreSQL container starts for the first time

-- Create database (already done by docker, but for reference)
-- CREATE DATABASE darahitam_db;

-- ==================== TEAM MEMBERS ====================
CREATE TABLE IF NOT EXISTS team_members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  bio TEXT,
  icon VARCHAR(255),
  skills TEXT,
  email VARCHAR(255),
  phone VARCHAR(255),
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== CATEGORIES ====================
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== PROJECTS ====================
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  short_description TEXT,
  image_url TEXT,
  banner_image TEXT,
  category_id INTEGER,
  category VARCHAR(255),
  content TEXT,
  canvas_content TEXT,
  slug VARCHAR(255) UNIQUE,
  author VARCHAR(255),
  tags TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- ==================== BANNER SLIDES ====================
CREATE TABLE IF NOT EXISTS banner_slides (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  button_text VARCHAR(100),
  button_link VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== SETTINGS ====================
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) NOT NULL UNIQUE,
  value TEXT,
  type VARCHAR(50) DEFAULT 'text',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== INQUIRIES ====================
CREATE TABLE IF NOT EXISTS inquiries (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  business_type VARCHAR(255),
  contact_person VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  whatsapp VARCHAR(50),
  project_type TEXT NOT NULL,
  budget VARCHAR(100),
  timeline VARCHAR(100),
  project_details TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== CREATE INDEXES ====================
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON inquiries(email);
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);

-- ==================== INSERT DEFAULT DATA ====================

-- Default Settings
INSERT INTO settings (key, value, type, description) VALUES
('company_name', 'Darahitam Creative Lab', 'text', 'Full company name'),
('company_short', 'DARAHITAM', 'text', 'Short company name for logo'),
('tagline', 'Creative Lab', 'text', 'Company tagline'),
('description', 'Transforming ideas into reality through creativity and innovation.', 'text', 'Company description'),
('email', 'contact@darahitam.com', 'text', 'Contact email'),
('phone', '+62 895 0000 0000', 'text', 'Contact phone'),
('address', 'Jakarta, Indonesia', 'text', 'Company address'),
('quick_links', '[]', 'json', 'Footer quick links'),
('services', '["Web Development", "Mobile Apps", "UI/UX Design", "Brand Identity", "Digital Marketing"]', 'json', 'List of services')
ON CONFLICT (key) DO NOTHING;

-- Default Categories
INSERT INTO categories (name, slug, description, display_order) VALUES
('Web Development', 'web-development', 'Custom web applications and websites', 1),
('Mobile Apps', 'mobile-apps', 'iOS and Android mobile applications', 2),
('UI/UX Design', 'ui-ux-design', 'User interface and experience design', 3),
('Branding', 'branding', 'Brand identity and visual design', 4),
('Digital Marketing', 'digital-marketing', 'SEO, social media, and online marketing', 5)
ON CONFLICT (slug) DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Database initialization completed successfully!';
END $$;
