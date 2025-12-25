/**
 * Cache Utility
 * Simple in-memory cache with TTL (time-to-live) support
 * 
 * @module utils/cache
 * @version 1.4.0
 * @since 1.0.0
 */

class Cache {
  constructor() {
    this.store = new Map();
  }

  /**
   * Set a value in cache with TTL
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} ttl - Time to live in milliseconds
   */
  set(key, value, ttl) {
    const expiresAt = Date.now() + ttl;
    this.store.set(key, {
      value,
      expiresAt
    });
  }

  /**
   * Get a value from cache
   * @param {string} key - Cache key
   * @returns {*} Cached value or null if not found/expired
   */
  get(key) {
    const item = this.store.get(key);
    
    if (!item) {
      return null;
    }

    // Check if expired
    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return item.value;
  }

  /**
   * Check if key exists and is not expired
   * @param {string} key - Cache key
   * @returns {boolean}
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Delete a key from cache
   * @param {string} key - Cache key
   */
  delete(key) {
    this.store.delete(key);
  }

  /**
   * Clear all cache
   */
  clear() {
    this.store.clear();
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache stats
   */
  getStats() {
    const now = Date.now();
    let validCount = 0;
    let expiredCount = 0;

    for (const [, item] of this.store) {
      if (now > item.expiresAt) {
        expiredCount++;
      } else {
        validCount++;
      }
    }

    return {
      total: this.store.size,
      valid: validCount,
      expired: expiredCount
    };
  }

  /**
   * Clean up expired entries
   * @returns {number} Number of entries removed
   */
  cleanup() {
    const now = Date.now();
    let removed = 0;

    for (const [key, item] of this.store) {
      if (now > item.expiresAt) {
        this.store.delete(key);
        removed++;
      }
    }

    return removed;
  }

  /**
   * Get time until expiration for a key
   * @param {string} key - Cache key
   * @returns {number|null} Milliseconds until expiration or null
   */
  getTTL(key) {
    const item = this.store.get(key);
    
    if (!item) {
      return null;
    }

    const ttl = item.expiresAt - Date.now();
    return ttl > 0 ? ttl : null;
  }
}

// Export singleton instance
export default new Cache();
