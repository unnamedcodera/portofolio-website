import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'database.sqlite'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
const createTables = () => {
  // Team members table
  db.exec(`
    CREATE TABLE IF NOT EXISTS team_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      position TEXT NOT NULL,
      bio TEXT,
      icon TEXT,
      skills TEXT,
      email TEXT,
      phone TEXT,
      image_url TEXT,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Categories table
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Projects table
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE,
      description TEXT,
      content TEXT,
      category TEXT,
      author TEXT,
      banner_image TEXT,
      image_url TEXT,
      display_order INTEGER DEFAULT 0,
      is_featured BOOLEAN DEFAULT 0,
      views INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Banner slides table
  db.exec(`
    CREATE TABLE IF NOT EXISTS banner_slides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subtitle TEXT,
      description TEXT,
      image_url TEXT,
      button_text TEXT,
      button_link TEXT,
      display_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Admin users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    )
  `);

  // Project inquiries table
  db.exec(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_name TEXT NOT NULL,
      business_type TEXT,
      contact_person TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      whatsapp TEXT,
      project_type TEXT NOT NULL,
      budget TEXT,
      timeline TEXT,
      project_details TEXT NOT NULL,
      status TEXT DEFAULT 'new',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Settings table for footer and site configuration
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_name TEXT DEFAULT 'Darahitam Creative Lab',
      company_short TEXT DEFAULT 'DARAHITAM',
      tagline TEXT DEFAULT 'Creative Lab',
      description TEXT DEFAULT 'Transforming ideas into reality through creativity and innovation.',
      email TEXT,
      phone TEXT,
      address TEXT,
      quick_links TEXT DEFAULT '[]',
      services TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ Database tables created successfully');
};

// Migration function to add missing columns
const runMigrations = () => {
  console.log('Running database migrations...');
  
  try {
    // Check and add missing columns to projects table
    const tableInfo = db.prepare("PRAGMA table_info(projects)").all();
    const columnNames = tableInfo.map(col => col.name);
    
    // Add content column if missing
    if (!columnNames.includes('content')) {
      console.log('Adding content column to projects table...');
      db.exec('ALTER TABLE projects ADD COLUMN content TEXT');
    }
    
    // Add author column if missing
    if (!columnNames.includes('author')) {
      console.log('Adding author column to projects table...');
      db.exec('ALTER TABLE projects ADD COLUMN author TEXT');
    }
    
    // Add banner_image column if missing
    if (!columnNames.includes('banner_image')) {
      console.log('Adding banner_image column to projects table...');
      db.exec('ALTER TABLE projects ADD COLUMN banner_image TEXT');
    }
    
    // Add views column if missing
    if (!columnNames.includes('views')) {
      console.log('Adding views column to projects table...');
      db.exec('ALTER TABLE projects ADD COLUMN views INTEGER DEFAULT 0');
    }
    
    // Add slug column if missing
    if (!columnNames.includes('slug')) {
      console.log('Adding slug column to projects table...');
      db.exec('ALTER TABLE projects ADD COLUMN slug TEXT');
      
      // Generate slugs for existing projects
      const projects = db.prepare('SELECT id, title FROM projects WHERE slug IS NULL').all();
      const updateSlug = db.prepare('UPDATE projects SET slug = ? WHERE id = ?');
      
      projects.forEach(project => {
        let slug = project.title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '');
        
        if (!slug) {
          slug = `project-${project.id}`;
        }
        
        // Ensure uniqueness by appending id if needed
        const existing = db.prepare('SELECT id FROM projects WHERE slug = ? AND id != ?').get(slug, project.id);
        if (existing) {
          slug = `${slug}-${project.id}`;
        }
        
        updateSlug.run(slug, project.id);
      });
      
      console.log(`✅ Generated slugs for ${projects.length} existing projects`);
    }
    
    // Add canvas_content column if missing
    if (!columnNames.includes('canvas_content')) {
      console.log('Adding canvas_content column to projects table...');
      db.exec('ALTER TABLE projects ADD COLUMN canvas_content TEXT');
    }
    
    // Add social_media column to team_members if missing
    const teamTableInfo = db.prepare("PRAGMA table_info(team_members)").all();
    const teamColumnNames = teamTableInfo.map(col => col.name);
    
    if (!teamColumnNames.includes('social_media')) {
      console.log('Adding social_media column to team_members table...');
      db.exec('ALTER TABLE team_members ADD COLUMN social_media TEXT');
    }
    
    console.log('✅ Migrations completed successfully');
  } catch (error) {
    console.error('Migration error:', error);
  }
};

// Initialize database
createTables();
runMigrations();

// Seed categories if empty
const seedCategories = () => {
  const count = db.prepare('SELECT COUNT(*) as count FROM categories').get();
  if (count.count === 0) {
    const categories = [
      { name: 'Web Design', slug: 'web-design', description: 'Modern and responsive web designs' },
      { name: 'Branding', slug: 'branding', description: 'Brand identity and visual design' },
      { name: 'UI/UX Design', slug: 'ui-ux-design', description: 'User interface and experience design' },
      { name: 'Graphic Design', slug: 'graphic-design', description: 'Print and digital graphics' },
      { name: 'Illustration', slug: 'illustration', description: 'Custom illustrations and artwork' },
      { name: 'Photography', slug: 'photography', description: 'Professional photography services' },
    ];
    
    const stmt = db.prepare('INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)');
    categories.forEach(cat => stmt.run(cat.name, cat.slug, cat.description));
    console.log('✅ Categories seeded');
  }
};

seedCategories();

// Seed settings if empty
const seedSettings = () => {
  const count = db.prepare('SELECT COUNT(*) as count FROM settings').get();
  if (count.count === 0) {
    const defaultQuickLinks = JSON.stringify([
      { name: 'Home', url: '#' },
      { name: 'Services', url: '#' },
      { name: 'Team', url: '#team' },
      { name: 'Contact', url: '#contact' }
    ]);
    
    const defaultServices = JSON.stringify([
      'Manufacturing',
      'Branding',
      'Architecture',
      'Web Development'
    ]);
    
    const stmt = db.prepare(`
      INSERT INTO settings (
        company_name, company_short, tagline, description, 
        email, phone, address, quick_links, services
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      'Darahitam Creative Lab',
      'DARAHITAM',
      'Creative Lab',
      'Transforming ideas into reality through creativity and innovation.',
      'contact@darahitam.com',
      '+1 (555) 123-4567',
      '123 Main St, City',
      defaultQuickLinks,
      defaultServices
    );
    
    console.log('✅ Settings seeded with default values');
  }
};

seedSettings();

// Settings functions
export const getSettings = () => {
  const settings = db.prepare('SELECT * FROM settings WHERE id = 1').get();
  if (!settings) {
    // Return default if not found
    return {
      id: 1,
      company_name: 'Darahitam Creative Lab',
      company_short: 'DARAHITAM',
      tagline: 'Creative Lab',
      description: 'Transforming ideas into reality through creativity and innovation.',
      email: '',
      phone: '',
      address: '',
      quick_links: '[]',
      services: '[]'
    };
  }
  return settings;
};

export const updateSettings = (data) => {
  const stmt = db.prepare(`
    UPDATE settings 
    SET company_name = ?, company_short = ?, tagline = ?, description = ?,
        email = ?, phone = ?, address = ?, quick_links = ?, services = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = 1
  `);
  return stmt.run(
    data.company_name,
    data.company_short,
    data.tagline,
    data.description,
    data.email || null,
    data.phone || null,
    data.address || null,
    data.quick_links,
    data.services
  );
};

// Category functions
export const getCategories = () => {
  return db.prepare('SELECT * FROM categories ORDER BY name').all();
};

export const getCategoryById = (id) => {
  return db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
};

export const createCategory = (data) => {
  const stmt = db.prepare('INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)');
  return stmt.run(data.name, data.slug, data.description);
};

export const updateCategory = (id, data) => {
  const stmt = db.prepare('UPDATE categories SET name = ?, slug = ?, description = ? WHERE id = ?');
  return stmt.run(data.name, data.slug, data.description, id);
};

export const deleteCategory = (id) => {
  return db.prepare('DELETE FROM categories WHERE id = ?').run(id);
};

// Helper functions
export const getTeamMembers = () => {
  return db.prepare('SELECT * FROM team_members ORDER BY display_order').all();
};

export const getTeamMemberById = (id) => {
  return db.prepare('SELECT * FROM team_members WHERE id = ?').get(id);
};

export const createTeamMember = (data) => {
  const stmt = db.prepare(`
    INSERT INTO team_members (name, position, bio, icon, skills, social_media, email, phone, image_url, display_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(
    data.name,
    data.position,
    data.bio,
    data.icon,
    data.skills,
    data.social_media || '[]',
    data.email,
    data.phone,
    data.image_url,
    data.display_order || 0
  );
};

export const updateTeamMember = (id, data) => {
  const stmt = db.prepare(`
    UPDATE team_members
    SET name = ?, position = ?, bio = ?, icon = ?, skills = ?, social_media = ?, email = ?, phone = ?, image_url = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  return stmt.run(
    data.name,
    data.position,
    data.bio,
    data.icon,
    data.skills,
    data.social_media || '[]',
    data.email,
    data.phone,
    data.image_url,
    data.display_order || 0,
    id
  );
};

export const deleteTeamMember = (id) => {
  return db.prepare('DELETE FROM team_members WHERE id = ?').run(id);
};

// Projects
export const getProjects = () => {
  return db.prepare('SELECT * FROM projects ORDER BY display_order').all();
};

export const getProjectById = (id) => {
  return db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
};

export const getProjectBySlug = (slug) => {
  return db.prepare('SELECT * FROM projects WHERE slug = ?').get(slug);
};

export const createProject = (data) => {
  // Generate slug from title
  let slug = data.title 
    ? data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
    : `project-${Date.now()}`;
  
  // Check for existing slug and make it unique
  let uniqueSlug = slug;
  let counter = 1;
  while (db.prepare('SELECT id FROM projects WHERE slug = ?').get(uniqueSlug)) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
  
  const stmt = db.prepare(`
    INSERT INTO projects (title, slug, description, content, canvas_content, category, author, banner_image, image_url, display_order, is_featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  return stmt.run(
    data.title || '',
    uniqueSlug,
    data.description || '',
    data.content || '',
    data.canvas_content || '',
    data.category || '',
    data.author || '',
    data.banner_image || '',
    data.image_url || '',
    data.display_order || 0,
    data.is_featured ? 1 : 0
  );
};

export const updateProject = (id, data) => {
  // Get current project
  const currentProject = db.prepare('SELECT slug FROM projects WHERE id = ?').get(id);
  
  // Generate slug from title
  let slug = data.title 
    ? data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
    : `project-${Date.now()}`;
  
  // Check for existing slug (excluding current project)
  let uniqueSlug = slug;
  let counter = 1;
  while (true) {
    const existing = db.prepare('SELECT id FROM projects WHERE slug = ? AND id != ?').get(uniqueSlug, id);
    if (!existing) break;
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
  
  const stmt = db.prepare(`
    UPDATE projects
    SET title = ?, 
        slug = ?,
        description = ?, 
        content = ?, 
        canvas_content = ?,
        category = ?, 
        author = ?, 
        banner_image = ?, 
        image_url = ?, 
        display_order = ?, 
        is_featured = ?, 
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  
  return stmt.run(
    data.title || '',
    uniqueSlug,
    data.description || '',
    data.content || '',
    data.canvas_content || '',
    data.category || '',
    data.author || '',
    data.banner_image || '',
    data.image_url || '',
    data.display_order || 0,
    data.is_featured ? 1 : 0,
    id
  );
};

export const deleteProject = (id) => {
  return db.prepare('DELETE FROM projects WHERE id = ?').run(id);
};

// Banner Slides
export const getBannerSlides = () => {
  return db.prepare('SELECT * FROM banner_slides WHERE is_active = 1 ORDER BY display_order').all();
};

export const getBannerSlideById = (id) => {
  return db.prepare('SELECT * FROM banner_slides WHERE id = ?').get(id);
};

export const createBannerSlide = (data) => {
  const stmt = db.prepare(`
    INSERT INTO banner_slides (title, subtitle, description, image_url, button_text, button_link, display_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(
    data.title,
    data.subtitle,
    data.description,
    data.image_url,
    data.button_text,
    data.button_link,
    data.display_order || 0,
    data.is_active !== undefined ? data.is_active : 1
  );
};

export const updateBannerSlide = (id, data) => {
  const stmt = db.prepare(`
    UPDATE banner_slides
    SET title = ?, subtitle = ?, description = ?, image_url = ?, button_text = ?, button_link = ?, display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  return stmt.run(
    data.title,
    data.subtitle,
    data.description,
    data.image_url,
    data.button_text,
    data.button_link,
    data.display_order || 0,
    data.is_active !== undefined ? data.is_active : 1,
    id
  );
};

export const deleteBannerSlide = (id) => {
  return db.prepare('DELETE FROM banner_slides WHERE id = ?').run(id);
};

// Admin Users
export const getAdminByUsername = (username) => {
  return db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username);
};

export const createAdmin = (username, passwordHash) => {
  const stmt = db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)');
  return stmt.run(username, passwordHash);
};

export const updateLastLogin = (id) => {
  return db.prepare('UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(id);
};

// ==================== INQUIRIES ====================

export const getAllInquiries = () => {
  return db.prepare('SELECT * FROM inquiries ORDER BY created_at DESC').all();
};

export const getInquiryById = (id) => {
  return db.prepare('SELECT * FROM inquiries WHERE id = ?').get(id);
};

export const createInquiry = (data) => {
  const stmt = db.prepare(`
    INSERT INTO inquiries (
      company_name, business_type, contact_person, email, phone, whatsapp,
      project_type, budget, timeline, project_details, status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  return stmt.run(
    data.company_name,
    data.business_type,
    data.contact_person,
    data.email,
    data.phone,
    data.whatsapp || data.phone,
    data.project_type, // Already JSON string from frontend
    data.budget,
    data.timeline,
    data.project_details,
    'new'
  );
};

export const updateInquiryStatus = (id, status, notes = null) => {
  const stmt = db.prepare(`
    UPDATE inquiries
    SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  return stmt.run(status, notes, id);
};

export const deleteInquiry = (id) => {
  return db.prepare('DELETE FROM inquiries WHERE id = ?').run(id);
};

export const getInquiriesByStatus = (status) => {
  return db.prepare('SELECT * FROM inquiries WHERE status = ? ORDER BY created_at DESC').all(status);
};

export const getInquiriesStats = () => {
  const total = db.prepare('SELECT COUNT(*) as count FROM inquiries').get();
  const newCount = db.prepare("SELECT COUNT(*) as count FROM inquiries WHERE status = 'new'").get();
  const inProgressCount = db.prepare("SELECT COUNT(*) as count FROM inquiries WHERE status = 'in-progress'").get();
  const completedCount = db.prepare("SELECT COUNT(*) as count FROM inquiries WHERE status = 'completed'").get();
  
  return {
    total: total.count,
    new: newCount.count,
    inProgress: inProgressCount.count,
    completed: completedCount.count
  };
};

export default db;
