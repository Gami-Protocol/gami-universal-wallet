/**
 * Validation Utilities
 * Common validation functions for forms
 */

/**
 * Validates email address using a comprehensive regex pattern
 * Supports most valid email formats including international domains
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }

  // More comprehensive email validation regex
  // Supports: local-part@domain.tld, handles most edge cases
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  return emailRegex.test(email.trim());
};

/**
 * Validates password strength
 * Returns error message if invalid, null if valid
 */
export const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'Password is required';
  }
  
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  
  // Optional: Add more strict requirements
  // if (!/[A-Z]/.test(password)) {
  //   return 'Password must contain at least one uppercase letter';
  // }
  // if (!/[a-z]/.test(password)) {
  //   return 'Password must contain at least one lowercase letter';
  // }
  // if (!/[0-9]/.test(password)) {
  //   return 'Password must contain at least one number';
  // }
  
  return null;
};

/**
 * Validates full name
 */
export const validateFullName = (name: string): string | null => {
  if (!name || !name.trim()) {
    return 'Full name is required';
  }
  
  if (name.trim().length < 2) {
    return 'Full name must be at least 2 characters';
  }
  
  return null;
};
