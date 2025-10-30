import pkg from 'sqlite3';
const { verbose } = pkg;
const db = new verbose().Database('./database.db');

const content = '<h1>This is a Pure Rich Text Project</h1><p>This project uses <strong>Rich Text Editor</strong> only, no Canvas content at all.</p><p>Canvas Viewer should NOT appear here!</p>';

db.run(
  'INSERT INTO projects (title, description, content, category, author, banner_image, image_url, display_order, is_featured, slug) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  [
    'Pure Rich Text Project',
    'Testing rich text content only',
    content,
    'Web Design',
    'Test Author',
    'http://localhost:5001/uploads/default.jpg',
    'http://localhost:5001/uploads/default.jpg',
    99,
    0,
    'pure-rich-text-project'
  ],
  (err) => {
    if (err) {
      console.error('❌ Error:', err);
    } else {
      console.log('✅ Rich Text project created!');
    }
    db.close();
  }
);
