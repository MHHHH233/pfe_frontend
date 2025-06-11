/**
 * Scrolls to the top of the page
 * @param {Object} options - Scroll options
 * @param {boolean} options.smooth - Whether to use smooth scrolling (default: true)
 */
export const scrollToTop = (options = { smooth: true }) => {
  window.scrollTo({
    top: 0,
    behavior: options.smooth ? 'smooth' : 'auto'
  });
};

/**
 * Scrolls to a specific element on the page
 * @param {string} elementId - The ID of the element to scroll to
 * @param {Object} options - Scroll options
 * @param {boolean} options.smooth - Whether to use smooth scrolling (default: true)
 * @param {number} options.offset - Offset in pixels (default: 0)
 */
export const scrollToElement = (elementId, options = { smooth: true, offset: 0 }) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - (options.offset || 0);
    
    window.scrollTo({
      top: offsetPosition,
      behavior: options.smooth ? 'smooth' : 'auto'
    });
  }
};

/**
 * Creates a function that can be used with React Router to scroll to top on route change
 * @returns {Function} Function to be used with useEffect
 */
export const createScrollToTopOnMount = () => {
  return () => {
    window.scrollTo(0, 0);
  };
};

export default {
  scrollToTop,
  scrollToElement,
  createScrollToTopOnMount
}; 