import React, { createContext, useState, useContext, useEffect } from 'react';
import { socialMediaService } from '../lib/services/user/socialMediaService';

// Create the context
const SocialMediaContext = createContext(null);

// Custom hook to use the context
export const useSocialMedia = () => useContext(SocialMediaContext);

// Context provider component
export const SocialMediaProvider = ({ children }) => {
  const [socialMedia, setSocialMedia] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        setIsLoading(true);
        const response = await socialMediaService.getSocialMedia();
        
        if (response.status === 'success') {
          setSocialMedia(response.data);
        } else {
          setError('Failed to fetch social media data');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching social media data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSocialMedia();
  }, []);

  return (
    <SocialMediaContext.Provider value={{ socialMedia, isLoading, error }}>
      {children}
    </SocialMediaContext.Provider>
  );
};

export default SocialMediaContext; 