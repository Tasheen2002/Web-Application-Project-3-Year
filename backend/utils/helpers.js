export const generateSKU = (category, name) => {
  const categoryCode = category.substring(0, 3).toUpperCase();
  const nameCode = name.replace(/\s+/g, '').substring(0, 3).toUpperCase();
  const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${categoryCode}-${nameCode}-${randomCode}`;
};

export const calculatePagination = (page, limit, total) => {
  const currentPage = parseInt(page) || 1;
  const itemsPerPage = parseInt(limit) || 10;
  const totalPages = Math.ceil(total / itemsPerPage);
  const skip = (currentPage - 1) * itemsPerPage;

  return {
    page: currentPage,
    limit: itemsPerPage,
    total,
    pages: totalPages,
    skip,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
    prevPage: currentPage > 1 ? currentPage - 1 : null
  };
};

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const calculateTax = (amount, taxRate = 0.08) => {
  return Math.round(amount * taxRate * 100) / 100;
};

export const calculateShipping = (weight, distance = 100) => {
  const baseRate = 5.00;
  const weightRate = weight * 0.5;
  const distanceRate = distance * 0.01;
  return Math.round((baseRate + weightRate + distanceRate) * 100) / 100;
};

export const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp.slice(-6)}-${random}`;
};

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export const generateRandomCode = (length = 6) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export const generateCouponCode = (prefix = 'SAVE', length = 6) => {
  const suffix = generateRandomCode(length);
  return `${prefix}${suffix}`;
};

export const calculateDiscountAmount = (price, discountPercentage) => {
  return Math.round(price * (discountPercentage / 100) * 100) / 100;
};

export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat('en-US', {
    ...defaultOptions,
    ...options
  }).format(new Date(date));
};

export const getTimeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

  const timeIntervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, seconds] of Object.entries(timeIntervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
};

export const validateRequired = (fields, body) => {
  const missing = [];
  fields.forEach(field => {
    if (!body[field] || (typeof body[field] === 'string' && body[field].trim() === '')) {
      missing.push(field);
    }
  });
  return missing;
};

export const sanitizeHtml = (html) => {
  if (!html) return '';

  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '');
};

export const generateMetaDescription = (text, maxLength = 160) => {
  if (!text) return '';

  const cleaned = text.replace(/<[^>]*>/g, '').trim();

  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  return cleaned.substring(0, maxLength).trim() + '...';
};