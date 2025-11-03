import { query } from './database-postgres.js';

// Helper functions for seeding
async function createTeamMember(member) {
  return await query(
    `INSERT INTO team_members (name, position, bio, icon, skills, email, phone, image_url, display_order) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [member.name, member.position, member.bio, member.icon, member.skills, member.email, member.phone, member.image_url, member.display_order]
  );
}

async function createProject(project) {
  return await query(
    `INSERT INTO projects (title, description, image_url, category_id, display_order, status) 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [project.title, project.description, project.image_url, project.category_id, project.display_order, project.status]
  );
}

async function createBannerSlide(slide) {
  return await query(
    `INSERT INTO slides (title, description, image_url, display_order, status) 
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [slide.title, slide.description, slide.image_url, slide.display_order, slide.status]
  );
}

async function createCategory(category) {
  return await query(
    `INSERT INTO categories (name, slug, description, display_order) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [category.name, category.slug, category.description, category.display_order]
  );
}

// Seed data
const categories = [
  { name: "Fashion", slug: "fashion", description: "Fashion and apparel design", display_order: 1 },
  { name: "Branding", slug: "branding", description: "Brand identity and design", display_order: 2 },
  { name: "Digital", slug: "digital", description: "Digital design and web", display_order: 3 }
];

const teamMembers = [
  {
    name: "John Doe",
    position: "Creative Director",
    bio: "Leading our creative vision with 10+ years of experience in design and innovation.",
    icon: "🎨",
    skills: "Leadership, Creative Direction, Strategy",
    email: "john@example.com",
    phone: "+1-234-567-8901",
    image_url: "/img/placeholder-team.jpg",
    display_order: 1
  },
  {
    name: "Jane Smith",
    position: "Lead Designer",
    bio: "Passionate about creating beautiful and functional designs that tell stories.",
    icon: "✨",
    skills: "UI/UX Design, Branding, Illustration",
    email: "jane@example.com",
    phone: "+1-234-567-8902",
    image_url: "/img/placeholder-team.jpg",
    display_order: 2
  },
  {
    name: "Mike Johnson",
    position: "Developer",
    bio: "Full-stack developer with expertise in modern web technologies.",
    icon: "💻",
    skills: "React, Node.js, PostgreSQL",
    email: "mike@example.com",
    phone: "+1-234-567-8903",
    image_url: "/img/placeholder-team.jpg",
    display_order: 3
  }
];

const projects = [
  {
    title: "Modern Fashion Campaign",
    description: "A contemporary fashion campaign featuring bold designs and innovative styling.",
    image_url: "/img/placeholder-project.jpg",
    category_id: 1,
    display_order: 1,
    status: "active"
  },
  {
    title: "Brand Identity Design",
    description: "Complete brand identity package for a luxury fashion brand.",
    image_url: "/img/placeholder-project.jpg",
    category_id: 2,
    display_order: 2,
    status: "active"
  },
  {
    title: "E-commerce Platform",
    description: "Custom e-commerce platform with modern design and user experience.",
    image_url: "/img/placeholder-project.jpg",
    category_id: 3,
    display_order: 3,
    status: "active"
  }
];

const slides = [
  {
    title: "Welcome to Our Studio",
    description: "Creating exceptional designs that inspire and engage",
    image_url: "/img/placeholder-slide.jpg",
    display_order: 1,
    status: "active"
  },
  {
    title: "Our Latest Work",
    description: "Explore our portfolio of stunning creative projects",
    image_url: "/img/placeholder-slide.jpg",
    display_order: 2,
    status: "active"
  },
  {
    title: "Let's Work Together",
    description: "Ready to bring your vision to life? Get in touch",
    image_url: "/img/placeholder-slide.jpg",
    display_order: 3,
    status: "active"
  }
];

// Main seeding function
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await query('DELETE FROM slides');
    await query('DELETE FROM projects');
    await query('DELETE FROM team_members');
    await query('DELETE FROM categories');
    
    // Reset sequences
    await query('ALTER SEQUENCE categories_id_seq RESTART WITH 1');
    await query('ALTER SEQUENCE team_members_id_seq RESTART WITH 1');
    await query('ALTER SEQUENCE projects_id_seq RESTART WITH 1');
    await query('ALTER SEQUENCE slides_id_seq RESTART WITH 1');
    
    // Seed categories first
    console.log('📂 Seeding categories...');
    for (const category of categories) {
      await createCategory(category);
    }
    
    // Seed team members
    console.log('👥 Seeding team members...');
    for (const member of teamMembers) {
      await createTeamMember(member);
    }
    
    // Seed projects
    console.log('📋 Seeding projects...');
    for (const project of projects) {
      await createProject(project);
    }
    
    // Seed slides
    console.log('🖼️  Seeding banner slides...');
    for (const slide of slides) {
      await createBannerSlide(slide);
    }
    
    console.log('✅ Database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - ${categories.length} categories created`);
    console.log(`   - ${teamMembers.length} team members created`);
    console.log(`   - ${projects.length} projects created`);
    console.log(`   - ${slides.length} banner slides created`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();