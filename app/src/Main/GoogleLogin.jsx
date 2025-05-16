import { useState } from "react";
import { Icon } from '@iconify/react';
import { authService } from "../lib/services/authoServices";

const GoogleLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.googleRedirect();
      
      if (response && response.url) {
        // Redirect to Google OAuth
        window.location.href = response.url;
      } else {
        throw new Error('Failed to get Google authentication URL');
      }
    } catch (error) {
      console.error("Google redirect error:", error);
      setError(error.message || "Failed to connect to Google");
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full flex items-center justify-center p-3 mb-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 active:bg-gray-200 active:scale-95 transition border border-gray-300"
      >
        {loading ? (
          <span className="animate-spin mr-2">
            <Icon icon="mdi:loading" width="1.5em" height="1.5em" />
          </span>
        ) : (
          <span className="mr-2 text-[#4285F4]">
            <Icon icon="flat-color-icons:google" width="1.5em" height="1.5em" />
          </span>
        )}
        {loading ? "Connecting..." : "Sign in with Google"}
      </button>
      
      {error && (
        <div className="mt-1 mb-4 text-red-500 text-sm bg-red-100 border border-red-400 p-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default GoogleLogin; 