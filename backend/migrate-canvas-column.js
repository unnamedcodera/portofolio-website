import pg from 'pg'
import dotenv from 'dotenv'

const { Pool } = pg
dotenv.config()

// Get database connection from environment or use Docker defaults
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'darahitam_db',
  user: process.env.DB_USER || 'darahitam_user',
  password: process.env.DB_PASSWORD || 'darahitam_pass'
})

console.log('Connecting to PostgreSQL:', {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'darahitam_db',
  user: process.env.DB_USER || 'darahitam_user'
})

async function migrateCanvasColumn() {
  const client = await pool.connect()
  
  try {
    console.log('Starting canvas column migration...')
    
    // Check if canvas_data column exists
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'projects' 
      AND column_name = 'canvas_data'
    `)
    
    if (checkColumn.rows.length > 0) {
      console.log('Found canvas_data column, migrating to canvas_content...')
      
      // Start transaction
      await client.query('BEGIN')
      
      // Add canvas_content column if it doesn't exist
      await client.query(`
        ALTER TABLE projects 
        ADD COLUMN IF NOT EXISTS canvas_content TEXT
      `)
      console.log('✓ Added canvas_content column')
      
      // Copy data from canvas_data to canvas_content
      await client.query(`
        UPDATE projects 
        SET canvas_content = canvas_data 
        WHERE canvas_data IS NOT NULL
      `)
      console.log('✓ Copied data from canvas_data to canvas_content')
      
      // Drop the old column
      await client.query(`
        ALTER TABLE projects 
        DROP COLUMN canvas_data
      `)
      console.log('✓ Dropped canvas_data column')
      
      // Commit transaction
      await client.query('COMMIT')
      console.log('✅ Migration completed successfully!')
      
    } else {
      console.log('✓ canvas_data column not found, migration not needed')
      
      // Just make sure canvas_content exists
      await client.query(`
        ALTER TABLE projects 
        ADD COLUMN IF NOT EXISTS canvas_content TEXT
      `)
      console.log('✓ Ensured canvas_content column exists')
    }
    
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

// Run migration
migrateCanvasColumn()
  .then(() => {
    console.log('Migration script completed')
    process.exit(0)
  })
  .catch(error => {
    console.error('Migration script error:', error)
    process.exit(1)
  })
