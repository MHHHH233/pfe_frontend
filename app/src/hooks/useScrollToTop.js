import { useNavigate } from 'react-router-dom';

/**
 * Custom hook to handle navigation with automatic scroll to top
 * @returns {Function} Function that navigates to a path and scrolls to top
 */
export const useScrollToTop = () => {
  const navigate = useNavigate();
  
  /**
   * Navigate to the specified path and scroll to the top of the page
   * @param {string} path - The path to navigate to
   * @param {Object} options - Navigation options
   * @param {boolean} options.smooth - Whether to use smooth scrolling (default: true)
   */
  const navigateAndScrollToTop = (path, options = { smooth: true }) => {
    navigate(path);
    
    // Scroll to top with smooth behavior by default
    window.scrollTo({ 
      top: 0, 
      behavior: options.smooth ? 'smooth' : 'auto'
    });
  };
  
  return navigateAndScrollToTop;
};

export default useScrollToTop; 