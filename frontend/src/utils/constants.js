export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const PAYMENT_METHODS = {
  CARD: 'card',
  PAYPAL: 'paypal',
  COD: 'cod'
};

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  OUT_OF_STOCK: 'out_of_stock'
};

export const SORT_OPTIONS = {
  NAME_ASC: 'name',
  NAME_DESC: '-name',
  PRICE_ASC: 'price',
  PRICE_DESC: '-price',
  RATING_DESC: '-averageRating',
  NEWEST: '-createdAt',
  OLDEST: 'createdAt'
};

export const ITEMS_PER_PAGE = 12;

export const CURRENCY = '$';

export const SHIPPING_THRESHOLD = 50; // Free shipping over this amount

export const TAX_RATE = 0.08; // 8% tax rate

export const IMAGE_UPLOAD_LIMITS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILES: 5,
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
};

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  NAME_MAX_LENGTH: 50,
  PHONE_MAX_LENGTH: 15,
  DESCRIPTION_MAX_LENGTH: 1000
};

export const API_ENDPOINTS = {
  AUTH: '/auth',
  PRODUCTS: '/products',
  CART: '/cart',
  ORDERS: '/orders',
  USERS: '/users',
  ADMIN: '/admin',
  UPLOAD: '/upload'
};