/**
 * Utility functions for preserving HTML structure in rich text editors
 */

/**
 * Preserves the structure of email signature HTML
 * @param {string} html - The HTML content to preserve
 * @returns {string} - The preserved HTML content
 */
export const preserveEmailSignatureHtml = (html) => {
  if (!html) return '';

  // Handle pasted content from Microsoft Outlook or other email clients
  // which might include extra markup or styles
  const cleanHtml = cleanPastedHtml(html);

  // Don't process if it's not a signature template
  if (!cleanHtml.includes('class="email-signature"') &&
      !cleanHtml.includes("class='email-signature'") &&
      !cleanHtml.includes('class=email-signature')) {
    // If it doesn't have the email-signature class, but looks like a signature,
    // try to wrap it in our signature container
    if (looksLikeSignature(cleanHtml)) {
      return wrapAsSignature(cleanHtml);
    }
    return cleanHtml;
  }

  // Create a temporary div to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = cleanHtml;

  // Find the email signature container
  const signatureDiv = tempDiv.querySelector('.email-signature') || tempDiv;

  // Preserve table structure
  const tables = signatureDiv.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure tables have proper email client compatibility styles
    if (!table.style.borderCollapse) {
      table.style.borderCollapse = 'collapse';
    }

    // Ensure cellpadding and cellspacing are preserved
    if (!table.hasAttribute('cellpadding')) {
      table.setAttribute('cellpadding', '0');
    }

    if (!table.hasAttribute('cellspacing')) {
      table.setAttribute('cellspacing', '0');
    }

    if (!table.hasAttribute('border')) {
      table.setAttribute('border', '0');
    }
  });

  // Preserve image dimensions and styles
  const images = signatureDiv.querySelectorAll('img');
  images.forEach(img => {
    // Ensure images have width and height
    if (img.style.width && !img.hasAttribute('width')) {
      img.setAttribute('width', img.style.width);
    }

    if (img.style.height && !img.hasAttribute('height')) {
      img.setAttribute('height', img.style.height);
    }

    // Fix image paths if they're relative
    if (img.src && img.src.startsWith('cid:')) {
      // For embedded images in emails (Content-ID), we can't display these
      // Replace with a placeholder
      img.setAttribute('data-original-src', img.src);
      img.src = 'https://via.placeholder.com/150x50?text=Embedded+Image';
    } else if (img.src && !img.src.startsWith('http') && !img.src.startsWith('data:')) {
      // For relative paths, we can't display these either
      img.setAttribute('data-original-src', img.src);
      img.src = 'https://via.placeholder.com/150x50?text=Image';
    }

    // For base64 images, they should work as-is
  });

  // Preserve link styles
  const links = signatureDiv.querySelectorAll('a');
  links.forEach(link => {
    if (!link.style.textDecoration) {
      link.style.textDecoration = 'none';
    }
  });

  return tempDiv.innerHTML;
};

/**
 * Cleans HTML pasted from email clients like Outlook
 * @param {string} html - The pasted HTML content
 * @returns {string} - Cleaned HTML content
 */
const cleanPastedHtml = (html) => {
  if (!html) return '';

  // Remove common problematic elements from Outlook and other email clients
  let cleaned = html;

  // Remove MS Office namespace elements and attributes
  cleaned = cleaned.replace(/<\/?o:[^>]+>/gi, ''); // Remove Office namespace tags
  cleaned = cleaned.replace(/<\/?m:[^>]+>/gi, ''); // Remove Math namespace tags
  cleaned = cleaned.replace(/<\/?v:[^>]+>/gi, ''); // Remove VML namespace tags
  cleaned = cleaned.replace(/<\/?w:[^>]+>/gi, ''); // Remove Word namespace tags

  // Remove MS Office specific attributes
  cleaned = cleaned.replace(/\s+class="?Mso[a-zA-Z]+"?/gi, ''); // Remove Mso classes
  cleaned = cleaned.replace(/\s+style="mso-[^"]*"/gi, ''); // Remove mso- style attributes

  // Remove HTML comments
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');

  // Remove excessive whitespace
  cleaned = cleaned.replace(/\s{2,}/g, ' ');

  return cleaned;
};

/**
 * Checks if HTML content looks like an email signature
 * @param {string} html - The HTML content to check
 * @returns {boolean} - True if it looks like a signature
 */
const looksLikeSignature = (html) => {
  if (!html) return false;

  // Common patterns found in email signatures
  const signaturePatterns = [
    /<table[^>]*>/i, // Contains tables
    /mailto:/i, // Contains email links
    /tel:/i, // Contains phone links
    /<img[^>]*>/i, // Contains images
    /\b(?:regards|sincerely|cheers|best|thank you)\b/i, // Common signature closings
    /\b(?:phone|tel|mobile|email|web|website|address)\b/i, // Common signature fields
    /\b(?:facebook|twitter|linkedin|instagram)\b/i // Social media references
  ];

  // Check if at least 2 patterns match
  const matchCount = signaturePatterns.filter(pattern => pattern.test(html)).length;
  return matchCount >= 2;
};

/**
 * Wraps HTML content in an email signature container
 * @param {string} html - The HTML content to wrap
 * @returns {string} - Wrapped HTML content
 */
const wrapAsSignature = (html) => {
  return `<div class="email-signature" style="font-family: Arial, sans-serif; max-width: 500px; color: #333333; line-height: 1.4; width: 100%; background-color: transparent;">${html}</div>`;
};

/**
 * Sanitizes HTML to prevent XSS attacks while preserving structure
 * @param {string} html - The HTML content to sanitize
 * @returns {string} - The sanitized HTML content
 */
export const sanitizeHtml = (html) => {
  if (!html) return '';

  // Create a temporary div to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Remove potentially dangerous elements and attributes
  const scripts = tempDiv.querySelectorAll('script');
  scripts.forEach(script => script.remove());

  const iframes = tempDiv.querySelectorAll('iframe');
  iframes.forEach(iframe => iframe.remove());

  const objects = tempDiv.querySelectorAll('object');
  objects.forEach(object => object.remove());

  const embeds = tempDiv.querySelectorAll('embed');
  embeds.forEach(embed => embed.remove());

  // Remove on* attributes
  const allElements = tempDiv.querySelectorAll('*');
  allElements.forEach(el => {
    Array.from(el.attributes).forEach(attr => {
      if (attr.name.startsWith('on')) {
        el.removeAttribute(attr.name);
      }
    });
  });

  return tempDiv.innerHTML;
};
