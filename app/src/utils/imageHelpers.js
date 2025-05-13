/**
 * Helper functions for handling images
 */

// Using a base64-encoded SVG directly to completely eliminate network requests
const DEFAULT_TERRAIN_SVG = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8IS0tIEJhY2tncm91bmQgLS0+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzFmMjkzNyIvPgogIAogIDwhLS0gRm9vdGJhbGwgZmllbGQgb3V0bGluZSAtLT4KICA8cmVjdCB4PSIxMDAiIHk9IjEwMCIgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiMxNTgwM2QiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI0IiByeD0iOCIvPgogIAogIDwhLS0gQ2VudGVyIGNpcmNsZSAtLT4KICA8Y2lyY2xlIGN4PSI0MDAiIGN5PSIzMDAiIHI9IjgwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iNCIvPgogIDxjaXJjbGUgY3g9IjQwMCIgY3k9IjMwMCIgcj0iNSIgZmlsbD0iI2ZmZmZmZiIvPgogIAogIDwhLS0gR29hbCBhcmVhcyAtLT4KICA8cmVjdCB4PSIxMDAiIHk9IjIwMCIgd2lkdGg9IjUwIiBoZWlnaHQ9IjIwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjMiLz4KICA8cmVjdCB4PSI2NTAiIHk9IjIwMCIgd2lkdGg9IjUwIiBoZWlnaHQ9IjIwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjMiLz4KICA8IS0tIENlbnRlciBsaW5lIC0tPgogIDxsaW5lIHgxPSI0MDAiIHkxPSIxMDAiIHgyPSI0MDAiIHkyPSI1MDAiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI0Ii8+CiAgPCEtLSBUZXh0IC0tPgogIDx0ZXh0IHg9IjQwMCIgeT0iNTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD4KPC9zdmc+`;

// Cache for already loaded images to prevent duplicate requests
const imageCache = new Map();

/**
 * Get the proper image URL for a terrain
 * @param {string} imagePath - The raw image path from the API
 * @returns {string} - The formatted image URL
 */
export const getTerrainImageUrl = (imagePath) => {
  if (!imagePath) {
    return DEFAULT_TERRAIN_SVG; // Use base64 SVG directly
  }
  
  // If already has http prefix, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Create the full URL
  const fullUrl = `http://127.0.0.1:8000/storage/${imagePath}`;
  
  // Check if we've already tried to load this image
  if (imageCache.has(fullUrl)) {
    // If we previously had an error with this image, return default
    if (imageCache.get(fullUrl) === false) {
      return DEFAULT_TERRAIN_SVG;
    }
  }
  
  return fullUrl;
};

/**
 * Pre-load the default terrain image to avoid flickering and repeated calls
 * No longer needed since we use a base64 SVG directly
 */
export const preloadDefaultTerrainImage = () => {
  // No-op - we're using base64 now
};

/**
 * Handle image errors by setting a default fallback
 * @param {Event} event - The error event
 */
export const handleTerrainImageError = (event) => {
  // Mark this image URL as failed in our cache
  if (event.target.src && !event.target.src.startsWith('data:')) {
    imageCache.set(event.target.src, false);
  }
  
  // Set to our base64 SVG
  event.target.src = DEFAULT_TERRAIN_SVG;
}; 