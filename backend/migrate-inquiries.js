import pkg from 'pg';
const { Pool } = pkg;

// Create PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'darahitam_dev',
  user: process.env.DB_USER || 'darahitam',
  password: process.env.DB_PASSWORD || 'dev_password',
});

async function migrateInquiriesTable() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Starting inquiries table migration...');
    
    // Drop old table and create new one
    await client.query('DROP TABLE IF EXISTS inquiries CASCADE');
    console.log('✅ Dropped old inquiries table');
    
    await client.query(`
      CREATE TABLE inquiries (
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
    console.log('✅ Created new inquiries table with updated schema');
    
    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run migration
migrateInquiriesTable()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
