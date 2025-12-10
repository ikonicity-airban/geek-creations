// lib/helpers.ts - Utility functions

/**
 * Format currency in Nigerian Naira
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  
  /**
   * Format date to readable string
   */
  export function formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  }
  
  /**
   * Generate unique session ID
   */
  export function generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
  
  /**
   * Get or create session ID from localStorage
   */
  export function getSessionId(): string {
    if (typeof window === 'undefined') return generateSessionId();
    
    let sessionId = localStorage.getItem('geeks_session_id');
    if (!sessionId) {
      sessionId = generateSessionId();
      localStorage.setItem('geeks_session_id', sessionId);
    }
    return sessionId;
  }
  
  /**
   * Calculate discount percentage
   */
  export function calculateDiscount(price: number, compareAtPrice: number): number {
    if (!compareAtPrice || compareAtPrice <= price) return 0;
    return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
  }
  
  /**
   * Generate SKU for custom designs
   */
  export function generateCustomSKU(productType: string): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `CUSTOM-${productType.toUpperCase()}-${timestamp}-${random}`;
  }
  
  /**
   * Validate Nigerian phone number
   */
  export function validateNigerianPhone(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '');
    return /^(0|234)?[7-9][0-1]\d{8}$/.test(cleaned);
  }
  
  /**
   * Format Nigerian phone number
   */
  export function formatNigerianPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('234')) {
      return `+234 ${cleaned.substring(3, 6)} ${cleaned.substring(6, 10)} ${cleaned.substring(10)}`;
    }
    if (cleaned.startsWith('0')) {
      return `+234 ${cleaned.substring(1, 4)} ${cleaned.substring(4, 8)} ${cleaned.substring(8)}`;
    }
    return phone;
  }
  
  /**
   * Truncate text with ellipsis
   */
  export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }
  
  /**
   * Generate slug from text
   */
  export function slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  
  /**
   * Calculate estimated delivery date
   */
  export function calculateDeliveryDate(daysToAdd: number = 7): Date {
    const today = new Date();
    today.setDate(today.getDate() + daysToAdd);
    return today;
  }
  
  /**
   * Check if order qualifies for free shipping
   */
  export function qualifiesForFreeShipping(subtotal: number): boolean {
    return subtotal >= 50000; // ₦50,000
  }
  
  /**
   * Get shipping cost based on subtotal
   */
  export function getShippingCost(subtotal: number): number {
    return qualifiesForFreeShipping(subtotal) ? 0 : 2500; // ₦2,500
  }
  
  /**
   * Calculate tax (VAT) - 7.5% in Nigeria
   */
  export function calculateTax(subtotal: number): number {
    return subtotal * 0.075;
  }
  
  /**
   * Parse Shopify GraphQL ID to get numeric ID
   */
  export function parseShopifyId(gid: string): number {
    const parts = gid.split('/');
    return parseInt(parts[parts.length - 1] || '0');
  }
  
  /**
   * Convert numeric ID to Shopify GraphQL ID
   */
  export function toShopifyId(id: number, resource: string): string {
    return `gid://shopify/${resource}/${id}`;
  }
  
  /**
   * Validate email address
   */
  export function validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  /**
   * Get product availability status
   */
  export function getAvailabilityStatus(inventoryQuantity: number): {
    available: boolean;
    status: 'in_stock' | 'low_stock' | 'out_of_stock';
    message: string;
  } {
    if (inventoryQuantity === 0) {
      return {
        available: false,
        status: 'out_of_stock',
        message: 'Out of Stock',
      };
    }
    if (inventoryQuantity <= 5) {
      return {
        available: true,
        status: 'low_stock',
        message: `Only ${inventoryQuantity} left!`,
      };
    }
    return {
      available: true,
      status: 'in_stock',
      message: 'In Stock',
    };
  }
  
  /**
   * Generate order number
   */
  export function generateOrderNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `GC${timestamp}${random}`;
  }
  
  /**
   * Format file size
   */
  export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
  
  /**
   * Debounce function
   */
  export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: Parameters<T>) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  /**
   * Deep clone object
   */
  export function deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }
  
  /**
   * Check if user is on mobile device
   */
  export function isMobile(): boolean {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }