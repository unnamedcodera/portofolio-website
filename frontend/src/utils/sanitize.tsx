import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export const sanitizeHTML = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target'],
  });
};

/**
 * Sanitize text content (strips all HTML)
 */
export const sanitizeText = (text: string): string => {
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
};

/**
 * Escape HTML special characters
 */
export const escapeHTML = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

/**
 * Safe component to render user content
 */
export const SafeHTML: React.FC<{ html: string; className?: string }> = ({ 
  html, 
  className = '' 
}) => {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizeHTML(html) }}
    />
  );
};
