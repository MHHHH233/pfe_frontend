import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook that scrolls to the element with ID matching the URL hash
 * after navigation or when the hash changes.
 */
const useScrollToSection = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if there's a hash in the URL
    if (location.hash) {
      // Get the ID from the hash (remove the # character)
      const id = location.hash.substring(1);
      
      // Find the element with that ID
      const element = document.getElementById(id);
      
      // If element exists, scroll to it with smooth behavior
      if (element) {
        // Add a small delay to ensure the page is fully loaded
        setTimeout(() => {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
      }
    }
  }, [location]);
};

export default useScrollToSection; 