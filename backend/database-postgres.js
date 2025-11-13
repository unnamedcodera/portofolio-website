import pkg from 'pg';
const { Pool } = pkg;

// Create PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'darahitam_dev',
  user: process.env.DB_USER || 'darahitam',
  password: process.env.DB_PASSWORD || 'dev_password',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL connected successfully');
    client.release();
  } catch (err) {
    console.error('❌ PostgreSQL connection failed:', err.message);
    process.exit(1);
  }
};

// Execute query helper
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text: text.substring(0, 50) + '...', duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Get single row
const getRow = async (text, params) => {
  const result = await query(text, params);
  return result.rows[0];
};

// Get all rows
const getRows = async (text, params) => {
  const result = await query(text, params);
  return result.rows;
};

// Execute transaction
const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Helper function to generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Create tables
const createTables = async () => {
  try {
    // Team members table
    await query(`
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
      )
    `);

    // Projects table
    await query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE,
        description TEXT,
        short_description TEXT,
        image_url TEXT,
        banner_image TEXT,
        category_id INTEGER,
        status VARCHAR(50) DEFAULT 'active',
        is_featured BOOLEAN DEFAULT false,
        display_order INTEGER DEFAULT 0,
        canvas_content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Categories table
    await query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Slides table
    await query(`
      CREATE TABLE IF NOT EXISTS slides (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url TEXT,
        display_order INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Settings table
    await query(`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(255) NOT NULL UNIQUE,
        value TEXT,
        type VARCHAR(50) DEFAULT 'text',
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Inquiries table
    await query(`
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
      )
    `);

    console.log('✅ All tables created successfully');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
};

// Initialize database
const initDatabase = async () => {
  await testConnection();
  await createTables();
};

// ==================== TEAM MEMBERS ====================
export const getTeamMembers = async () => {
  return await getRows(`
    SELECT * FROM team_members 
    ORDER BY display_order ASC, id ASC
  `);
};

export const getTeamMemberById = async (id) => {
  return await getRow('SELECT * FROM team_members WHERE id = $1', [id]);
};

export const createTeamMember = async (data) => {
  const { name, position, bio, icon, skills, email, phone, image_url, display_order = 0 } = data;
  const skillsJson = typeof skills === 'object' ? JSON.stringify(skills) : skills;
  
  const result = await query(`
    INSERT INTO team_members (name, position, bio, icon, skills, email, phone, image_url, display_order)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `, [name, position, bio, icon, skillsJson, email, phone, image_url, display_order]);
  
  return result.rows[0];
};

export const updateTeamMember = async (id, data) => {
  const { name, position, bio, icon, skills, email, phone, image_url, display_order } = data;
  const skillsJson = typeof skills === 'object' ? JSON.stringify(skills) : skills;
  
  const result = await query(`
    UPDATE team_members 
    SET name = $1, position = $2, bio = $3, icon = $4, skills = $5, 
        email = $6, phone = $7, image_url = $8, display_order = $9,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $10
    RETURNING *
  `, [name, position, bio, icon, skillsJson, email, phone, image_url, display_order, id]);
  
  return result.rows[0];
};

export const deleteTeamMember = async (id) => {
  const result = await query('DELETE FROM team_members WHERE id = $1', [id]);
  return result.rowCount > 0;
};

// ==================== PROJECTS ====================
export const getProjects = async () => {
  return await getRows(`
    SELECT p.*, c.name as category_name
    FROM projects p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.display_order ASC, p.id DESC
  `);
};

export const getProjectById = async (id) => {
  return await getRow(`
    SELECT p.*, c.name as category_name
    FROM projects p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = $1
  `, [id]);
};

export const getProjectBySlug = async (slug) => {
  return await getRow(`
    SELECT p.*, c.name as category_name
    FROM projects p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.slug = $1
  `, [slug]);
};

export const createProject = async (data) => {
  const { 
    title, description, short_description, image_url, banner_image, 
    category_id, category, author, status = 'active', is_featured = false, display_order = 0, canvas_content 
  } = data;
  
  // Generate slug from title if not provided
  let slug = data.slug || generateSlug(title);
  
  // Ensure slug is unique
  let finalSlug = slug;
  let counter = 1;
  while (true) {
    const existing = await getRow('SELECT id FROM projects WHERE slug = $1', [finalSlug]);
    if (!existing) break;
    finalSlug = `${slug}-${counter}`;
    counter++;
  }
  
  const result = await query(`
    INSERT INTO projects (title, slug, description, short_description, image_url, banner_image, 
                         category_id, category, author, status, is_featured, display_order, canvas_content)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *
  `, [title, finalSlug, description, short_description, image_url, banner_image, 
      category_id, category, author, status, is_featured, display_order, canvas_content]);
  
  return result.rows[0];
};

export const updateProject = async (id, data) => {
  const { 
    title, description, short_description, image_url, banner_image, 
    category_id, category, author, status, is_featured, display_order, canvas_content 
  } = data;
  
  // Get existing project to preserve slug if not provided
  const existing = await getRow('SELECT * FROM projects WHERE id = $1', [id]);
  if (!existing) {
    throw new Error('Project not found');
  }
  
  // Use provided slug or generate from title or keep existing
  let slug = data.slug;
  if (!slug) {
    if (title && title !== existing.title) {
      // Title changed, generate new slug
      slug = generateSlug(title);
      // Ensure slug is unique (excluding current project)
      let finalSlug = slug;
      let counter = 1;
      while (true) {
        const duplicate = await getRow(
          'SELECT id FROM projects WHERE slug = $1 AND id != $2', 
          [finalSlug, id]
        );
        if (!duplicate) break;
        finalSlug = `${slug}-${counter}`;
        counter++;
      }
      slug = finalSlug;
    } else {
      // Keep existing slug
      slug = existing.slug;
    }
  }
  
  const result = await query(`
    UPDATE projects 
    SET title = $1, slug = $2, description = $3, short_description = $4, image_url = $5, 
        banner_image = $6, category_id = $7, category = $8, author = $9, status = $10, 
        is_featured = $11, display_order = $12, canvas_content = $13, updated_at = CURRENT_TIMESTAMP
    WHERE id = $14
    RETURNING *
  `, [title || existing.title, slug, description || existing.description, 
      short_description || existing.short_description, image_url || existing.image_url, 
      banner_image || existing.banner_image, category_id || existing.category_id,
      category || existing.category, author || existing.author,
      status || existing.status, is_featured !== undefined ? is_featured : existing.is_featured, 
      display_order !== undefined ? display_order : existing.display_order, 
      canvas_content !== undefined ? canvas_content : existing.canvas_content, id]);
  
  return result.rows[0];
};

export const deleteProject = async (id) => {
  const result = await query('DELETE FROM projects WHERE id = $1', [id]);
  return result.rowCount > 0;
};

// ==================== CATEGORIES ====================
export const getCategories = async () => {
  return await getRows(`
    SELECT * FROM categories 
    ORDER BY display_order ASC, name ASC
  `);
};

export const getCategoryById = async (id) => {
  return await getRow('SELECT * FROM categories WHERE id = $1', [id]);
};

export const createCategory = async (data) => {
  const { name, slug, description, display_order = 0 } = data;
  
  const result = await query(`
    INSERT INTO categories (name, slug, description, display_order)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `, [name, slug, description, display_order]);
  
  return result.rows[0];
};

export const updateCategory = async (id, data) => {
  const { name, slug, description, display_order } = data;
  
  const result = await query(`
    UPDATE categories 
    SET name = $1, slug = $2, description = $3, display_order = $4, 
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $5
    RETURNING *
  `, [name, slug, description, display_order, id]);
  
  return result.rows[0];
};

export const deleteCategory = async (id) => {
  const result = await query('DELETE FROM categories WHERE id = $1', [id]);
  return result.rowCount > 0;
};

// ==================== SLIDES ====================
export const getBannerSlides = async () => {
  return await getRows(`
    SELECT * FROM slides 
    WHERE status = 'active'
    ORDER BY display_order ASC, id ASC
  `);
};

export const getBannerSlideById = async (id) => {
  return await getRow('SELECT * FROM slides WHERE id = $1', [id]);
};

export const createBannerSlide = async (data) => {
  const { title, description, image_url, display_order = 0, status = 'active' } = data;
  
  const result = await query(`
    INSERT INTO slides (title, description, image_url, display_order, status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `, [title, description, image_url, display_order, status]);
  
  return result.rows[0];
};

export const updateBannerSlide = async (id, data) => {
  const { title, description, image_url, display_order, status } = data;
  
  const result = await query(`
    UPDATE slides 
    SET title = $1, description = $2, image_url = $3, display_order = $4, 
        status = $5, updated_at = CURRENT_TIMESTAMP
    WHERE id = $6
    RETURNING *
  `, [title, description, image_url, display_order, status, id]);
  
  return result.rows[0];
};

export const deleteBannerSlide = async (id) => {
  const result = await query('DELETE FROM slides WHERE id = $1', [id]);
  return result.rowCount > 0;
};

// ==================== SETTINGS ====================
export const getSettings = async () => {
  const rows = await getRows('SELECT key, value, type FROM settings');
  const settings = {};
  rows.forEach(row => {
    if (row.type === 'json') {
      try {
        settings[row.key] = JSON.parse(row.value);
      } catch {
        settings[row.key] = row.value;
      }
    } else {
      settings[row.key] = row.value;
    }
  });
  return settings;
};

export const updateSettings = async (data) => {
  const results = [];
  
  for (const [key, value] of Object.entries(data)) {
    const settingValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    const settingType = typeof value === 'object' ? 'json' : 'text';
    
    const result = await query(`
      INSERT INTO settings (key, value, type, updated_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      ON CONFLICT (key) 
      DO UPDATE SET value = $2, type = $3, updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [key, settingValue, settingType]);
    
    results.push(result.rows[0]);
  }
  
  return results;
};

// ==================== INQUIRIES ====================
export const getAllInquiries = async () => {
  return await getRows(`
    SELECT * FROM inquiries 
    ORDER BY created_at DESC
  `);
};

// Alias for backward compatibility
export const getInquiries = getAllInquiries;

export const getInquiriesStats = async () => {
  const result = await getRow(`
    SELECT 
      COUNT(*) as total,
      COUNT(CASE WHEN status = 'new' THEN 1 END) as new,
      COUNT(CASE WHEN status = 'in-progress' THEN 1 END) as in_progress,
      COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
      COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled
    FROM inquiries
  `);
  return result;
};

export const getInquiriesByStatus = async (status) => {
  return await getRows(
    'SELECT * FROM inquiries WHERE status = $1 ORDER BY created_at DESC',
    [status]
  );
};

export const getInquiryById = async (id) => {
  return await getRow('SELECT * FROM inquiries WHERE id = $1', [id]);
};

export const createInquiry = async (data) => {
  const { 
    company_name, 
    business_type, 
    contact_person, 
    email, 
    phone, 
    whatsapp, 
    project_type, 
    budget, 
    timeline, 
    project_details,
    status = 'new' 
  } = data;
  
  const result = await query(`
    INSERT INTO inquiries (
      company_name, business_type, contact_person, email, phone, 
      whatsapp, project_type, budget, timeline, project_details, status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *
  `, [
    company_name, business_type, contact_person, email, phone, 
    whatsapp, project_type, budget, timeline, project_details, status
  ]);
  
  return result.rows[0];
};

export const updateInquiryStatus = async (id, status, notes) => {
  const result = await query(`
    UPDATE inquiries 
    SET status = $1, notes = $2, updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING *
  `, [status, notes, id]);
  
  return result.rows[0];
};

export const updateInquiry = async (id, data) => {
  const { status, notes } = data;
  return await updateInquiryStatus(id, status, notes);
};

export const deleteInquiry = async (id) => {
  const result = await query('DELETE FROM inquiries WHERE id = $1', [id]);
  return result.rowCount > 0;
};

// ==================== ADMIN/AUTH ====================
export const getAdminByUsername = async (username) => {
  // For now, use hardcoded admin credentials from config
  // In a real app, you'd have an admins table
  const config = await import('./config.js');
  if (username === config.default.admin.username) {
    return {
      id: 1,
      username: config.default.admin.username,
      password_hash: config.default.admin.password, // Will be compared with plaintext in auth
      last_login: null
    };
  }
  return null;
};

export const createAdmin = async (data) => {
  // This is a placeholder - in real app you'd insert into admins table
  console.log('Create admin called:', data);
  return { id: 1, ...data };
};

export const updateLastLogin = async (id) => {
  // This is a placeholder - in real app you'd update admins table
  console.log('Update last login called for admin:', id);
  return true;
};

// Export pool and helper functions
export { pool, query, getRow, getRows, transaction, initDatabase };

// Default export for backward compatibility
export default {
  // SQLite-style compatibility methods
  prepare: (sql) => ({
    get: async (params = []) => await getRow(sql, params),
    all: async (params = []) => await getRows(sql, params),
    run: async (params = []) => await query(sql, params)
  }),
  exec: async (sql) => await query(sql),
  // New PostgreSQL methods
  pool,
  query,
  getRow,
  getRows,
  transaction,
  initDatabase
};