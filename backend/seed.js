import {
  createTeamMember,
  createProject,
  createBannerSlide
} from './database.js';

// Seed team members
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
    bio: "Crafting beautiful and functional designs that bring ideas to life.",
    icon: "✨",
    skills: "UI/UX Design, Graphic Design, Branding",
    email: "jane@example.com",
    phone: "+1-234-567-8902",
    image_url: "/img/placeholder-team.jpg",
    display_order: 2
  },
  {
    name: "Mike Johnson",
    position: "Tech Lead",
    bio: "Building robust solutions with cutting-edge technology and best practices.",
    icon: "💻",
    skills: "Full Stack Development, DevOps, Architecture",
    email: "mike@example.com",
    phone: "+1-234-567-8903",
    image_url: "/img/placeholder-team.jpg",
    display_order: 3
  },
  {
    name: "Sarah Williams",
    position: "UI/UX Designer",
    bio: "Creating beautiful user experiences with passion and precision.",
    icon: "🎭",
    skills: "User Research, Prototyping, Visual Design",
    email: "sarah@example.com",
    phone: "+1-234-567-8904",
    image_url: "/img/placeholder-team.jpg",
    display_order: 4
  },
  {
    name: "David Chen",
    position: "Brand Strategist",
    bio: "Building powerful brands that resonate with audiences.",
    icon: "🎯",
    skills: "Brand Strategy, Marketing, Content Creation",
    email: "david@example.com",
    phone: "+1-234-567-8905",
    image_url: "/img/placeholder-team.jpg",
    display_order: 5
  },
  {
    name: "Emily Rodriguez",
    position: "Marketing Manager",
    bio: "Driving growth through innovative marketing strategies.",
    icon: "📊",
    skills: "Digital Marketing, Analytics, Campaign Management",
    email: "emily@example.com",
    phone: "+1-234-567-8906",
    image_url: "/img/placeholder-team.jpg",
    display_order: 6
  },
  {
    name: "Alex Turner",
    position: "Product Manager",
    bio: "Transforming ideas into successful products.",
    icon: "🚀",
    skills: "Product Strategy, Agile, Stakeholder Management",
    email: "alex@example.com",
    phone: "+1-234-567-8907",
    image_url: "/img/placeholder-team.jpg",
    display_order: 7
  },
  {
    name: "Lisa Anderson",
    position: "Operations Lead",
    bio: "Ensuring smooth operations and exceptional delivery.",
    icon: "⚙️",
    skills: "Operations Management, Process Optimization, Leadership",
    email: "lisa@example.com",
    phone: "+1-234-567-8908",
    image_url: "/img/placeholder-team.jpg",
    display_order: 8
  }
];

// Seed projects
const projects = [
  {
    title: "Fashion Collection 2024",
    description: "A stunning collection showcasing modern elegance and timeless style.",
    category: "Fashion",
    image_url: "/images/projects/fashion.jpg",
    gradient: "from-rose-500/20 via-pink-500/20 to-purple-500/20",
    display_order: 1,
    is_featured: 1
  },
  {
    title: "Brand Identity Redesign",
    description: "Complete rebrand for a leading tech startup, including logo and visual system.",
    category: "Branding",
    image_url: "/images/projects/branding.jpg",
    gradient: "from-blue-500/20 via-cyan-500/20 to-teal-500/20",
    display_order: 2,
    is_featured: 1
  },
  {
    title: "E-commerce Platform",
    description: "Full-stack web application with seamless shopping experience.",
    category: "Web Design",
    image_url: "/images/projects/ecommerce.jpg",
    gradient: "from-orange-500/20 via-amber-500/20 to-yellow-500/20",
    display_order: 3,
    is_featured: 0
  },
  {
    title: "Sustainable Packaging",
    description: "Eco-friendly packaging solution for organic food brand.",
    category: "Packaging",
    image_url: "/images/projects/packaging.jpg",
    gradient: "from-green-500/20 via-emerald-500/20 to-lime-500/20",
    display_order: 4,
    is_featured: 0
  },
  {
    title: "Editorial Magazine",
    description: "Modern magazine layout with bold typography and stunning visuals.",
    category: "Editorial",
    image_url: "/images/projects/editorial.jpg",
    gradient: "from-purple-500/20 via-violet-500/20 to-indigo-500/20",
    display_order: 5,
    is_featured: 1
  },
  {
    title: "Product Photography",
    description: "Professional product shots with creative lighting and composition.",
    category: "Photography",
    image_url: "/images/projects/photography.jpg",
    gradient: "from-slate-500/20 via-gray-500/20 to-zinc-500/20",
    display_order: 6,
    is_featured: 0
  }
];

// Seed banner slides
const bannerSlides = [
  {
    title: "Manufacturing Excellence",
    subtitle: "Quality in Every Detail",
    description: "Premium quality production with attention to every detail",
    image_url: "/img/placeholder-slide.jpg",
    button_text: "Learn More",
    button_link: "#",
    display_order: 1,
    is_active: 1
  },
  {
    title: "Brand Identity",
    subtitle: "Stand Out from the Crowd",
    description: "Creating memorable brands that stand out",
    image_url: "/img/placeholder-slide.jpg",
    button_text: "View Projects",
    button_link: "#projects",
    display_order: 2,
    is_active: 1
  },
  {
    title: "Architecture & Design",
    subtitle: "Spaces That Inspire",
    description: "Innovative spaces that inspire and function beautifully",
    image_url: "/img/placeholder-slide.jpg",
    button_text: "Explore",
    button_link: "#",
    display_order: 3,
    is_active: 1
  },
  {
    title: "Web Development",
    subtitle: "Digital Solutions",
    description: "Modern, responsive websites that drive results",
    image_url: "/img/placeholder-slide.jpg",
    button_text: "Get Started",
    button_link: "#contact",
    display_order: 4,
    is_active: 1
  },
  {
    title: "Motion Graphics",
    subtitle: "Bring Ideas to Life",
    description: "Dynamic animations that captivate and engage",
    image_url: "/img/placeholder-slide.jpg",
    button_text: "Watch Demo",
    button_link: "#",
    display_order: 5,
    is_active: 1
  }
];

// Seed function
const seedDatabase = () => {
  try {
    console.log('🌱 Seeding database...\n');

    // Seed team members
    console.log('📝 Adding team members...');
    teamMembers.forEach((member) => {
      createTeamMember(member);
      console.log(`  ✓ Added ${member.name}`);
    });

    // Seed projects
    console.log('\n📝 Adding projects...');
    projects.forEach((project) => {
      createProject(project);
      console.log(`  ✓ Added ${project.title}`);
    });

    // Seed banner slides
    console.log('\n📝 Adding banner slides...');
    bannerSlides.forEach((slide) => {
      createBannerSlide(slide);
      console.log(`  ✓ Added ${slide.title}`);
    });

    console.log('\n✅ Database seeded successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
