import csrf from 'csrf';

const tokens = new csrf();
const csrfSecret = process.env.CSRF_SECRET || 'your-csrf-secret-key-change-in-production';

// Generate CSRF token
export const generateCsrfToken = (req, res, next) => {
  const token = tokens.create(csrfSecret);
  req.csrfToken = token;
  next();
};

// Verify CSRF token
export const verifyCsrfToken = (req, res, next) => {
  // Skip CSRF for GET requests
  if (req.method === 'GET') {
    return next();
  }

  const token = req.headers['x-csrf-token'];
  
  if (!token) {
    return res.status(403).json({ error: 'CSRF token missing' });
  }

  if (!tokens.verify(csrfSecret, token)) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  next();
};

// Endpoint to get CSRF token
export const getCsrfToken = (req, res) => {
  const token = tokens.create(csrfSecret);
  res.json({ csrfToken: token });
};
