import { body, validationResult } from 'express-validator';

// Validation middleware
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }
  next();
};

// Sanitize string - prevent XSS
export const sanitizeString = (str) => {
  if (!str) return str;
  return str
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Team member validation rules
export const teamValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name too long')
    .customSanitizer(sanitizeString),
  body('position')
    .trim()
    .notEmpty().withMessage('Position is required')
    .isLength({ max: 100 }).withMessage('Position too long')
    .customSanitizer(sanitizeString),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Bio too long')
    .customSanitizer(sanitizeString),
  body('icon')
    .optional()
    .trim(),
  body('skills')
    .optional()
    .trim(),
  body('image_url')
    .optional()
    .trim(),
  body('display_order')
    .optional()
    .isInt({ min: 0 }).withMessage('Invalid display order'),
  body('social_media')
    .optional()
    .trim(),
];

// Project validation rules
export const projectValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title too long')
    .customSanitizer(sanitizeString),
  body('slug')
    .optional()
    .trim()
    .matches(/^[a-z0-9-]*$/).withMessage('Invalid slug format'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description too long')
    .customSanitizer(sanitizeString),
  body('content')
    .optional()
    .trim(),
  body('category')
    .optional()
    .trim()
    .customSanitizer(sanitizeString),
  body('author')
    .optional()
    .trim()
    .customSanitizer(sanitizeString),
  body('banner_image')
    .optional()
    .trim(),
  body('image_url')
    .optional()
    .trim(),
  body('display_order')
    .optional()
    .isInt({ min: 0 }).withMessage('Invalid display order'),
  body('is_featured')
    .optional()
    .isBoolean().withMessage('is_featured must be boolean'),
];

// Inquiry validation rules
export const inquiryValidation = [
  body('company_name')
    .trim()
    .notEmpty().withMessage('Company name is required')
    .isLength({ max: 200 }).withMessage('Company name too long')
    .customSanitizer(sanitizeString),
  body('contact_person')
    .trim()
    .notEmpty().withMessage('Contact person is required')
    .isLength({ max: 100 }).withMessage('Contact person name too long')
    .customSanitizer(sanitizeString),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone is required')
    .matches(/^[0-9+\-\s()]+$/).withMessage('Invalid phone format'),
  body('business_type')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Business type too long')
    .customSanitizer(sanitizeString),
  body('project_type')
    .trim()
    .notEmpty().withMessage('Project type is required')
    .isLength({ max: 100 }).withMessage('Project type too long')
    .customSanitizer(sanitizeString),
  body('project_details')
    .trim()
    .notEmpty().withMessage('Project details required')
    .isLength({ max: 5000 }).withMessage('Project details too long')
    .customSanitizer(sanitizeString),
  body('timeline')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Timeline too long')
    .customSanitizer(sanitizeString),
];

// Category validation rules
export const categoryValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ max: 100 }).withMessage('Category name too long')
    .customSanitizer(sanitizeString),
];

// Slide validation rules
export const slideValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title too long')
    .customSanitizer(sanitizeString),
  body('subtitle')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Subtitle too long')
    .customSanitizer(sanitizeString),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description too long')
    .customSanitizer(sanitizeString),
  body('image_url')
    .optional()
    .trim(),
  body('button_text')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Button text too long')
    .customSanitizer(sanitizeString),
  body('button_link')
    .optional()
    .trim(),
  body('display_order')
    .optional()
    .isInt({ min: 0 }).withMessage('Invalid display order'),
  body('is_active')
    .optional()
    .isBoolean().withMessage('is_active must be boolean'),
];

// Settings validation rules
export const settingsValidation = [
  body('company_name')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Company name too long')
    .customSanitizer(sanitizeString),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('phone')
    .optional()
    .trim()
    .matches(/^[0-9+\-\s()]*$/).withMessage('Invalid phone format'),
];
