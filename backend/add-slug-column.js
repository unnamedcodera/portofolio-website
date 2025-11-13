import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'darahitam_dev',
  user: process.env.DB_USER || 'darahitam',
  password: process.env.DB_PASSWORD || 'dev_password',
});

// Function to generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

async function addSlugColumn() {
  const client = await pool.connect();
  
  try {
    // Check if slug column exists
    const columnCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'projects' AND column_name = 'slug'
    `);

    if (columnCheck.rows.length === 0) {
      console.log('Adding slug column to projects table...');
      
      // Add slug column
      await client.query(`
        ALTER TABLE projects 
        ADD COLUMN slug VARCHAR(255) UNIQUE
      `);
      
      console.log('✅ Slug column added successfully');
    } else {
      console.log('ℹ️ Slug column already exists');
    }

    // Get all projects without slugs
    const projects = await client.query(`
      SELECT id, title, slug 
      FROM projects 
      WHERE slug IS NULL OR slug = ''
    `);

    if (projects.rows.length > 0) {
      console.log(`Found ${projects.rows.length} projects without slugs. Generating...`);
      
      for (const project of projects.rows) {
        const slug = generateSlug(project.title);
        
        // Check if slug already exists
        let finalSlug = slug;
        let counter = 1;
        while (true) {
          const existing = await client.query(
            'SELECT id FROM projects WHERE slug = $1 AND id != $2',
            [finalSlug, project.id]
          );
          
          if (existing.rows.length === 0) {
            break;
          }
          
          finalSlug = `${slug}-${counter}`;
          counter++;
        }
        
        await client.query(
          'UPDATE projects SET slug = $1 WHERE id = $2',
          [finalSlug, project.id]
        );
        
        console.log(`  ✓ Generated slug for "${project.title}": ${finalSlug}`);
      }
      
      console.log('✅ All slugs generated successfully');
    } else {
      console.log('ℹ️ All projects already have slugs');
    }

  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run migration
addSlugColumn()
  .then(() => {
    console.log('\n✅ Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });
