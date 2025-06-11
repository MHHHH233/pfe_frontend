import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import AnimatedCheck from './Status/Confirmed';
import AnimatedReserved from './Status/Failed';
import AnimatedPending from './Status/Pending';
import { CreditCard, Wallet, Calendar, Clock, MapPin, User, Lock, Star, ThumbsUp, Mail } from 'lucide-react';
import userReservationService from '../../lib/services/user/reservationServices';
import adminReservationService from '../../lib/services/admin/reservationServices';
import reviewsService from '../../lib/services/user/reviewsService';
import StripeWrapper from '../Payments/StripeWrapper';
import StripePaymentModal from '../Payments/StripePaymentModal';
import { useNavigate } from 'react-router-dom';

const Button = styled.button`
  /* Styling for the button */
  background-color: #07f468;
  color: #1a1a1a;
  border: none;
  border-radius: 50px;
  padding: 10px 25px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  height: 50px;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 6px rgba(7, 244, 104, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #06d35a;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(7, 244, 104, 0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(7, 244, 104, 0.1);
  }

  &:disabled {
    background-color: #3e3e3e;
    color: #8a8a8a;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  @media (max-width: 500px) {
    padding: 8px 20px;
    font-size: 0.8rem;
  }
`;

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

export default function PopupCard({ isVisible, onClose, data, resetStatus, onPayOnline, loadingStripeIntent }) {
  const [status, setStatus] = useState(null); 
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isLoggedIn = !!sessionStorage.getItem("userId");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  const isAdmin = sessionStorage.getItem("type") === "admin";
  const navigate = useNavigate();
  
  // New states for reservation expiration
  const [expirationTime, setExpirationTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  
  // New states for review
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewId, setReviewId] = useState(null);
  const [shouldShowReviewAfterStatus, setShouldShowReviewAfterStatus] = useState(false);

  // Debug state
  const [debugInfo, setDebugInfo] = useState({
    showReviewForm: false,
    status: null,
    isAdmin: false,
    isLoggedIn: false
  });

  // New state for handling new user notifications
  const [isNewUser, setIsNewUser] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  // New state for handling email confirmation notifications
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [emailConfirmationDetails, setEmailConfirmationDetails] = useState({
    email: '',
    isReservation: false,
    reservationNumber: ''
  });

  // Improved terrain price extraction with better fallbacks
  const getTerrain = () => {
    if (!data) return { price: "100", id: null };

    // Handle the direct API response format from buttons.jsx
    if (data.prix !== undefined) {
      return {
        price: data.prix,
        id: data.id_terrain,
        name: data.nom_terrain || `Terrain ${data.id_terrain}`
      };
    }
    
    // Try different possible data structures
    if (data.terrain && typeof data.terrain === 'object') {
      return {
        price: data.terrain.prix || "100",
        id: data.terrain.id_terrain,
        name: data.terrain.nom_terrain
      };
    } else if (data.id_terrain && typeof data.id_terrain === 'object') {
      return {
        price: data.id_terrain.prix || "100",
        id: data.id_terrain.id_terrain,
        name: data.id_terrain.nom_terrain
      };
    } else {
      // If none of the above, try to get from sessionStorage
      const terrainId = data.id_terrain || sessionStorage.getItem("selectedTerrainId");
      const terrainPrice = sessionStorage.getItem("selectedTerrainPrice") || "100";
      const terrainName = sessionStorage.getItem("selectedTerrainName") || `Terrain ${terrainId}`;
      
      return {
        price: terrainPrice,
        id: terrainId,
        name: terrainName
      };
    }
  };

  // Get terrain data once
  const terrain = getTerrain();
  const terrainPrice = terrain.price;

  useEffect(() => {
    // Keep debug info updated
    setDebugInfo({
      showReviewForm,
      status,
      isAdmin,
      isLoggedIn
    });
  }, [showReviewForm, status, isAdmin, isLoggedIn]);

  useEffect(() => {
    if (isVisible) {
      setStatus(null);
      setMsg('');
      setShowPaymentForm(false);
      setError(null);
      
      // Only reset review form for admins or non-logged in users
      // For regular users, we want to keep the review form state
      if (isAdmin || !isLoggedIn) {
        setShowReviewForm(false);
      }
    }
  }, [isVisible, isAdmin, isLoggedIn, data]);
  
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Add a function to validate payment form data
  const validatePaymentForm = () => {
    // Reset any existing error
    setError(null);
    
    // Check that all required fields are filled
    if (!paymentData.cardNumber || paymentData.cardNumber.trim() === '') {
      setError("Please enter a valid card number");
      return false;
    }
    
    if (!paymentData.cardHolder || paymentData.cardHolder.trim() === '') {
      setError("Please enter the cardholder name");
      return false;
    }
    
    if (!paymentData.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
      setError("Please enter a valid expiry date (MM/YY)");
      return false;
    }
    
    if (!paymentData.cvv || !/^\d{3}$/.test(paymentData.cvv)) {
      setError("Please enter a valid CVV (3 digits)");
      return false;
    }
    
    return true;
  };
  
  // Format the price with better handling of invalid values
  const formatPrice = (price) => {
    // Ensure price is a number
    let numPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    // If it's not a valid number, return a fallback
    if (isNaN(numPrice)) return '100.00';
    
    // If the price is in cents (e.g., 20000), convert it to the actual price (200.00)
    if (numPrice >= 1000) {
      numPrice = numPrice / 100;
    }
    
    // Format with 2 decimal places and thousand separators
    return numPrice.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  // Add navigation event listener
  useEffect(() => {
    const handleNavigateToProfile = (event) => {
      const { redirectAfterDelay, delay = 2000 } = event.detail;
      
      if (redirectAfterDelay) {
        // Set a timeout to navigate after the specified delay
        setTimeout(() => {
          navigate('/profile');
        }, delay);
      } else {
        // Navigate immediately
        navigate('/profile');
      }
    };
    
    // Add event listener
    document.addEventListener('navigateToProfile', handleNavigateToProfile);
    
    // Clean up
    return () => {
      document.removeEventListener('navigateToProfile', handleNavigateToProfile);
    };
  }, [navigate]);
  
  // Add an effect to handle transition between popups
  useEffect(() => {
    // If new user popup is closed and email confirmation is pending, show it
    if (!isNewUser && emailConfirmationDetails.email && !showEmailConfirmation) {
      setShowEmailConfirmation(true);
    }
    
    // If both new user and email confirmation popups have been dismissed, show success status
    if (!isNewUser && !showEmailConfirmation && emailConfirmationDetails.email) {
      // Short delay to ensure smooth transition
      setTimeout(() => {
        setStatus('success');
        setMsg('Reservation confirmed successfully!');
        
        // Ensure reservation count is incremented if not already done
        if (!isAdmin && isLoggedIn) {
          try {
            const currentCount = parseInt(sessionStorage.getItem("today_reservations_count") || "0");
            const newCount = currentCount + 1;
            sessionStorage.setItem("today_reservations_count", newCount.toString());
            
            // Dispatch count update event
            const event = new CustomEvent('reservationCountUpdated', { 
              detail: { count: newCount }
            });
            document.dispatchEvent(event);
          } catch (error) {
            console.error("Error updating reservation count:", error);
          }
        }
      }, 300);
    }
  }, [isNewUser, emailConfirmationDetails, showEmailConfirmation, isAdmin, isLoggedIn]);
  
  // Add a reset effect when isVisible changes
  useEffect(() => {
    if (isVisible) {
      // Reset states when popup becomes visible again
      setStatus(null);
      setMsg('');
      setError(null);
      setShowPaymentForm(false);
      // Don't reset the popups here, we need to check response first
    } else {
      // Only reset these states when closing to ensure they're ready for next time
      setIsNewUser(false);
      setNewUserEmail('');
      setShowEmailConfirmation(false);
      setEmailConfirmationDetails({
        email: '',
        isReservation: false,
        reservationNumber: ''
      });
    }
  }, [isVisible]);
  
  // Update the handleSubmit function to handle email_sent flag
  const handleSubmit = async (paymentMethod, e) => {
    if (e) {
      e.preventDefault(); // Prevent any default behavior to avoid page reload
    }
    
    // If using Stripe for online payment
    if (paymentMethod === 'stripe') {
      // Clear any previous states that might interfere with notifications
      setIsNewUser(false);
      setNewUserEmail('');
      setShowEmailConfirmation(false);
      setEmailConfirmationDetails({
        email: '',
        isReservation: false,
        reservationNumber: ''
      });

      // Call the onPayOnline function to initialize Stripe payment
      if (onPayOnline) {
        onPayOnline();
      }
      return;
    }
    
    if (paymentMethod === 'online') {
      setShowPaymentForm(true);
      return;
    }
    
    // Make sure we have the heure field
    if (!data.heure && !data.heuredebut) {
      setMsg('Time is required');
      setStatus('failed');
      setLoading(false);
      return;
    }
    
    // Properly handle user ID - null for guest users
    const userId = isLoggedIn ? parseInt(sessionStorage.getItem("userId")) : null;
    
    // Get terrain ID from our improved terrain object
    const terrainId = terrain.id;
    
    // Process terrain price with safer parsing
    const price = parseFloat(terrainPrice) || 100;
    
    const formData = {
      id_terrain: terrainId,
      date: data.date,
      heure: data.heure || data.heuredebut,
      type: data.type || "client",
      payment_method: paymentMethod,
      payment_status: isAdmin ? 'paid' : 'pending', // Admin reservations are always paid
      id_client: userId, // Use null for guest users
      price: price, // Include the terrain price in the form data
      // Add these fields for online payments
      ...(paymentMethod === 'online' || paymentMethod === 'stripe' ? {
        // Use price directly without multiplying by 100
        amount: Math.round(price), // Use original price value
        currency: 'mad'
      } : {}),
      // For admin reservations, use the provided Name
      ...(isAdmin ? {
        Name: data.Name,
      } : {
        // For user/guest reservations
        Name: data.Name || sessionStorage.getItem("name") || 'Guest',
        email: data.email || sessionStorage.getItem("email") || '',
        telephone: data.telephone || ''
      })
    };

    try {
      setLoading(true);
      const reservationService = isAdmin 
        ? adminReservationService 
        : userReservationService;
      
      const response = await reservationService.createReservation(formData);
      
      // Check for success in various response formats
      const isSuccess = response.success || response.status === 'success' || !!response.data;
      
      if (isSuccess) {
        console.log("Reservation response:", response); // Debug log
        
        // IMPORTANT: Reset previous popup states to ensure they show again
        setIsNewUser(false);
        setNewUserEmail('');
        setShowEmailConfirmation(false);
        setEmailConfirmationDetails({
          email: '',
          isReservation: false,
          reservationNumber: ''
        });
        
        // Check if a new user account was created
        if (response.is_new_user) {
          setIsNewUser(true);
          setNewUserEmail(response.user_email || data.email || '');
          
          // Store email_sent flag and reservation details for later use
          if (response.email_sent) {
            setEmailConfirmationDetails({
              email: response.user_email || data.email || '',
              isReservation: true,
              reservationNumber: response.data?.num_res || ''
            });
          }
        }
        // Check if email was sent but no new user created
        else if (response.email_sent) {
          setEmailConfirmationDetails({
            email: data.email || sessionStorage.getItem("email") || '',
            isReservation: true,
            reservationNumber: response.data?.num_res || ''
          });
          
          // Show email confirmation immediately if no new user popup is needed
          if (!response.is_new_user) {
            setShowEmailConfirmation(true);
          }
        }
        
        // Set the reservation ID for later use with reviews
        if (response.data && response.data.id) {
          setReviewId(response.data.id);
        }
        
        // ONLY increment the reservation count for CONFIRMED reservations
        // Admin reservations or admin-made reservations are confirmed immediately
        const isConfirmed = isAdmin || paymentMethod === 'online';
        
        if (!isAdmin && isLoggedIn && isConfirmed && !response.is_new_user) {
          try {
            // First, increment the local count
            const currentCount = parseInt(sessionStorage.getItem("today_reservations_count") || "0");
            const newCount = currentCount + 1;
            // Immediately update session storage
            sessionStorage.setItem("today_reservations_count", newCount.toString());
            
            // Dispatch count update event
            const event = new CustomEvent('reservationCountUpdated', { 
              detail: { count: newCount }
            });
            document.dispatchEvent(event);
          } catch (error) {
            console.error("Error updating reservation count:", error);
          }
        }
        
        // If a new user was created, show the new user popup instead of proceeding
        if (response.is_new_user) {
          // Hide all other popups
          setShowPaymentForm(false);
          setShowReviewForm(false);
          setStatus(null);
          // Status will be shown after user dismisses popups (via useEffect)
        }
        // For non-admin logged-in users, show review form immediately instead of status
        else if (!isAdmin && isLoggedIn) {
          setStatus(null); // Clear any previous status
          setShowReviewForm(true); // Show review form immediately
        } else {
          // For admins or non-logged-in users, show status animations
          if (isAdmin || paymentMethod === 'online') {
            // Admin reservations and online payments are immediately confirmed
            setStatus('success');
            setMsg('Reservation confirmed successfully!');
          } else {
            // Regular user reservations with cash payment are pending
            setStatus('pending');
            setMsg('Reservation pending! Please proceed to the store for payment.');
            
            // Set expiration time for pending reservations (1 hour from now)
            const expiry = new Date();
            expiry.setHours(expiry.getHours() + 1);
            setExpirationTime(expiry);
          }
        }
        
        // Dispatch an event to notify about successful reservation
        // For online payments or admin reservations, include reservationConfirmed: true
        // For cash payments that are pending, don't include this flag
        const isReservationConfirmed = isAdmin || paymentMethod === 'online';
        const event = new CustomEvent('reservationSuccess', { 
          detail: { 
            response: response.data || response,
            refreshNeeded: true,
            reservationConfirmed: isReservationConfirmed,
            incrementCount: isReservationConfirmed && isLoggedIn && !isAdmin,
            refreshAPI: isReservationConfirmed && isLoggedIn && !isAdmin
          }
        });
        document.dispatchEvent(event);
      } else {
        // Handle conflict or other errors
        if (response.message && response.message.includes("conflict")) {
          setStatus('failed');
          setMsg('This time slot is already reserved. Please choose another time.');
        } else {
          setStatus('failed');
          setMsg(response.message || 'Failed to submit reservation. Please try again.');
        }
      }
    } catch (error) {
      console.error('Reservation error:', error);
      setStatus('failed');
      setMsg('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Update the handlePaymentSubmit function to handle email_sent flag
  const handlePaymentSubmit = async (e) => {
    if (e) {
      e.preventDefault(); // Always prevent default to avoid page reload
    }
    
    // Validate payment form
    if (!validatePaymentForm()) {
      return; // Stop if validation fails
    }
    
    setLoading(true);
    setError(null); // Clear any previous errors
    
    try {
      // Get user ID - null for guest users
      const userId = isLoggedIn ? parseInt(sessionStorage.getItem("userId")) : null;
      
      // Get terrain ID from our improved terrain object
      const terrainId = terrain.id;
      
      // Process terrain price with safer parsing
      const price = parseFloat(terrainPrice) || 100;
      
      // Get the correct service based on user type
      const reservationService = isAdmin 
        ? adminReservationService 
        : userReservationService;
      
      // Create the reservation with payment data
      const formData = {
        id_terrain: terrainId,
        date: data.date,
        heure: data.heure || data.heuredebut,
        type: data.type || "client",
        payment_method: 'online',
        payment_status: 'paid',
        price: price,
        amount: price >= 1000 ? Math.round(price) : Math.round(price * 100), // Add amount field for online payments (in cents)
        currency: 'mad', // Add currency field for online payments
        id_client: userId,
        // For admin reservations, ensure Name is included
        ...(isAdmin ? {
          Name: data.Name,
        } : {
          // For user/guest reservations
          Name: data.Name || sessionStorage.getItem("name") || 'Guest',
          email: data.email || sessionStorage.getItem("email") || '',
          telephone: data.telephone || ''
        })
      };
      
      const response = await reservationService.createReservation(formData);
      
      // Check for success in various response formats
      const isSuccess = response.success || response.status === 'success' || !!response.data;
      
      if (isSuccess) {
        console.log("Payment response:", response); // Debug log
        
        // IMPORTANT: Reset previous popup states to ensure they show again
        setIsNewUser(false);
        setNewUserEmail('');
        setShowEmailConfirmation(false);
        setEmailConfirmationDetails({
          email: '',
          isReservation: false,
          reservationNumber: ''
        });
        
        // Check if a new user account was created
        if (response.is_new_user) {
          // Hide payment form immediately
          setShowPaymentForm(false);
          
          // Set new user state
          setIsNewUser(true);
          setNewUserEmail(response.user_email || data.email || '');
          
          // Store email_sent flag and reservation details for later use
          if (response.email_sent) {
            setEmailConfirmationDetails({
              email: response.user_email || data.email || '',
              isReservation: true,
              reservationNumber: response.data?.num_res || ''
            });
          }
          
          // Don't proceed to other popups yet
          setShowReviewForm(false);
          setStatus(null);
          // Status will be shown after user dismisses popups (via useEffect)
        } 
        // Check if email was sent but no new user created
        else if (response.email_sent) {
          setEmailConfirmationDetails({
            email: data.email || sessionStorage.getItem("email") || '',
            isReservation: true,
            reservationNumber: response.data?.num_res || ''
          });
          
          // Show email confirmation popup if no new user popup needed
          if (!response.is_new_user) {
            setShowPaymentForm(false);
            setShowEmailConfirmation(true);
          }
        }
        else {
          // Set the reservation ID for later use with reviews
          if (response.data && response.data.id) {
            setReviewId(response.data.id);
          }
          
          // IMPORTANT: Hide payment form first and ensure it's fully gone
          setShowPaymentForm(false);
          
          // ALWAYS increment the reservation count for CONFIRMED online payments
          if (!isAdmin && isLoggedIn) {
            try {
              // First increment the local count
              const currentCount = parseInt(sessionStorage.getItem("today_reservations_count") || "0");
              const newCount = currentCount + 1;
              // Immediately update session storage
              sessionStorage.setItem("today_reservations_count", newCount.toString());
              
              // Dispatch count update event
              const event = new CustomEvent('reservationCountUpdated', { 
                detail: { count: newCount }
              });
              document.dispatchEvent(event);
            } catch (error) {
              console.error("Error updating reservation count:", error);
            }
          }
          
          // Only show review form for non-admin logged-in users
          if (!isAdmin && isLoggedIn) {
            setTimeout(() => {
              setShowReviewForm(true); // Show review form after payment form is gone
            }, 50); 
          } else {
            // Show success status for admins or non-logged in users
            setMsg('Payment successful and reservation confirmed!');
            setStatus('success');
          }
        }
        
        // Dispatch an event to notify about successful reservation with confirmed flag
        const event = new CustomEvent('reservationSuccess', { 
          detail: { 
            response: response.data || response,
            refreshNeeded: true,
            reservationConfirmed: true, // Online payment is always confirmed
            incrementCount: isLoggedIn && !isAdmin, // Flag to increment count
            refreshAPI: isLoggedIn && !isAdmin // Flag to refresh from API
          }
        });
        document.dispatchEvent(event);
      } else {
        setMsg(response.message || 'Payment failed. Please try again.');
        setStatus('failed');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      setMsg('Payment processing failed. Please try again.');
      setStatus('failed');
    } finally {
      setLoading(false);
    }
  };
  
  // Update closePopup to also reset email confirmation state
  const closePopup = (e) => {
    if (e) {
      e.preventDefault(); // Prevent default behavior if event is provided
    }
    
    setShowPaymentForm(false);
    setShowReviewForm(false);
    setStatus(null);
    setMsg('');
    setError(null);
    setIsNewUser(false);
    setNewUserEmail('');
    setShowEmailConfirmation(false);
    setEmailConfirmationDetails({
      email: '',
      isReservation: false,
      reservationNumber: ''
    });
    
    // Reset payment data
    setPaymentData({
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: ''
    });
    
    // Reset review data
    setRating(0);
    setReviewComment('');
    
    // Call parent callbacks after a short delay to ensure UI is reset
    setTimeout(() => {
      if (resetStatus) resetStatus();
      if (onClose) onClose();
    }, 50);
    
    // Dispatch an event to notify that the popup was closed
    const event = new CustomEvent('confirmationPopupClosed', {
      detail: { timestamp: Date.now() }
    });
    document.dispatchEvent(event);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const service = sessionStorage.getItem("type") === "admin" 
        ? adminReservationService 
        : userReservationService;

      const response = await service.createReservation(data);
      
      if (response.status === "success") {
        resetStatus();
      } else {
        setError("Failed to create reservation");
        setMsg("Failed to create reservation");
      }
    } catch (error) {
      setError(error.message || "Failed to create reservation");
      setMsg(error.message || "Failed to create reservation");
    } finally {
      setLoading(false);
    }
  };
  
  // Completely rewrite the ReviewForm component to be more stable
  const ReviewForm = () => {
    // Local state for handling form inputs without affecting parent component
    const [localRating, setLocalRating] = useState(rating);
    const [localComment, setLocalComment] = useState(reviewComment);
    const [localError, setLocalError] = useState(error);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Local submit handler to prevent re-renders of parent component
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (localRating === 0) {
        setLocalError("Please select a rating");
        return;
      }
      
      if (!localComment.trim()) {
        setLocalError("Please provide a review description");
        return;
      }
      
      setIsSubmitting(true);
      
      try {
        // Ensure payment form is hidden if it was somehow still showing
        setShowPaymentForm(false);
        
        // Get the user's information from session storage
        const userId = parseInt(sessionStorage.getItem("userId"));
        const userName = sessionStorage.getItem("name") || "Anonymous";
        
        // Create review data with the correct field names
        const reviewData = {
          id_compte: userId,
          name: userName,
          description: localComment,
          rating: localRating,
        };
        
        const response = await reviewsService.createReview(reviewData);
        
        if (response.success || response.data) {
          // Update parent component state on success
          setRating(localRating);
          setReviewComment(localComment);
          
          // Clear any remaining UI elements
          setShowPaymentForm(false);
          setShowReviewForm(false);
          
          setMsg("Thank you for your review!");
          
          // Show success message briefly before closing
          setTimeout(() => {
            if (resetStatus) resetStatus();
          }, 1500);
        } else {
          // Check for validation errors in the response
          if (response.error) {
            // Create a formatted error message from the validation errors
            const errorMessages = Object.entries(response.error)
              .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
              .join("\n");
            setLocalError(`Validation errors: ${errorMessages}`);
          } else {
            setLocalError(response.message || "Failed to submit review");
          }
        }
      } catch (error) {
        console.error("Error submitting review:", error);
        
        // Check if the error has a response with validation errors
        if (error.response && error.response.data && error.response.data.error) {
          const errorData = error.response.data.error;
          const errorMessages = Object.entries(errorData)
            .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
            .join("\n");
          setLocalError(`Validation errors: ${errorMessages}`);
        } else {
          setLocalError("An error occurred while submitting your review");
        }
      } finally {
        setIsSubmitting(false);
      }
    };

    // Handle skip action
    const handleSkip = () => {
      setShowReviewForm(false);
      setTimeout(() => {
        if (resetStatus) resetStatus();
      }, 100);
    };

    return (
      <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
        <div className="text-center mb-6">
          <Star size={40} className="mx-auto text-yellow-500 mb-2" />
          <h3 className="text-xl font-semibold text-white">Rate Your Experience</h3>
          <p className="text-gray-400 text-sm">Your feedback helps us improve our services</p>
        </div>
        
        {localError && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {localError}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2 text-sm">Rating <span className="text-red-400">*</span></label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setLocalRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    size={32}
                    className={`${
                      star <= localRating ? "text-yellow-500 fill-yellow-500" : "text-gray-500"
                    } transition-colors hover:text-yellow-400`}
                  />
                </button>
              ))}
            </div>
            {localRating === 0 && (
              <p className="text-red-400 text-xs mt-2">Please select a rating</p>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="comment" className="block text-gray-300 mb-2 text-sm">
              Review Description <span className="text-red-400">*</span>
            </label>
            <textarea
              id="comment"
              rows="3"
              value={localComment}
              onChange={(e) => setLocalComment(e.target.value)}
              placeholder="Tell us about your experience..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              required
            ></textarea>
            <p className="text-gray-400 text-xs mt-1">Required - please share your thoughts about our service</p>
          </div>
          
          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={handleSkip}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={isSubmitting || localRating === 0 || !localComment.trim()}
              className={`px-4 py-2 bg-green-600 text-white rounded-lg flex items-center ${
                isSubmitting || localRating === 0 || !localComment.trim() 
                  ? "opacity-70 cursor-not-allowed" 
                  : "hover:bg-green-700"
              } transition-colors`}
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2">Submitting...</span>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                </>
              ) : (
                <>
                  <ThumbsUp size={18} className="mr-2" />
                  Submit Review
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  };
  
  // Update the card number input to format as the user types
  const handleCardNumberChange = (e) => {
    const { value } = e.target;
    // Remove non-digit characters
    const cleaned = value.replace(/\D/g, '');
    // Format with spaces
    let formatted = '';
    for (let i = 0; i < cleaned.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += cleaned[i];
    }
    // Update the state
    setPaymentData(prev => ({
      ...prev,
      cardNumber: formatted
    }));
  };
  
  // Update the expiry date input to format as MM/YY
  const handleExpiryChange = (e) => {
    const { value } = e.target;
    // Remove non-digit characters
    const cleaned = value.replace(/\D/g, '');
    // Format as MM/YY
    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    // Update the state
    setPaymentData(prev => ({
      ...prev,
      expiryDate: formatted
    }));
  };
  
  // Add a component to render the countdown timer
  const ExpirationCountdown = () => {
    if (!timeRemaining) return null;
    
    const { minutes, seconds } = timeRemaining;
    const isExpiringSoon = minutes === 0 && seconds <= 300; // 5 minutes or less
    
    return (
      <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/40 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-yellow-400" />
            <div>
              <p className="text-sm font-medium text-yellow-400">
                Payment deadline
              </p>
              <p className="text-xs text-gray-400">
                Please complete payment before time expires
              </p>
            </div>
          </div>
          <div className="font-mono font-bold text-lg text-yellow-400">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>
      </div>
    );
  };
  
  // Add a component to display the new user notification
  const NewUserPopup = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
        <motion.div
          className="bg-[#1a1a1a] rounded-2xl p-6 max-w-[90%] w-[380px] text-center shadow-lg border border-gray-800"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="p-3 bg-blue-500/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Mail size={30} className="text-blue-400" />
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">Account Created Successfully!</h3>
          
          <p className="text-gray-300 mb-4">
            Your account has been automatically created. Please check your email at <span className="text-blue-400 font-medium">{newUserEmail}</span> for your password and login details.
          </p>
          
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-5">
            <p className="text-blue-400 text-sm mb-2">
              For a better experience, please log in with your credentials to manage your reservations and access more features.
            </p>
            <p className="text-yellow-400 text-sm flex items-center justify-center mt-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>If you don't see the email, please check your spam/junk folder and mark it as "not spam"</span>
            </p>
          </div>
          
          <button
            onClick={() => {
              setIsNewUser(false);
              // This will trigger the next popup (email confirmation) via useEffect
              // which will then show the success status when it's dismissed
            }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all w-full font-medium"
          >
            Got It
          </button>
        </motion.div>
      </div>
    );
  };
  
  // Add a component to display the email confirmation notification
  const EmailConfirmationPopup = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
        <motion.div
          className="bg-[#1a1a1a] rounded-2xl p-6 max-w-[90%] w-[380px] text-center shadow-lg border border-gray-800"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="p-3 bg-green-500/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Mail size={30} className="text-green-400" />
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">Confirmation Email Sent!</h3>
          
          <p className="text-gray-300 mb-4">
            {emailConfirmationDetails.isReservation 
              ? `Your reservation (${emailConfirmationDetails.reservationNumber}) has been confirmed. Check your email at ${emailConfirmationDetails.email} for reservation details.` 
              : `A confirmation has been sent to ${emailConfirmationDetails.email}. Please check your inbox.`}
          </p>
          
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-5">
            <p className="text-green-400 text-sm mb-2">
              {emailConfirmationDetails.isReservation 
                ? "Keep this email as proof of your reservation. You'll need it when you arrive." 
                : "The email contains important information about your account and reservation."}
            </p>
            <p className="text-yellow-400 text-sm flex items-center justify-center mt-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>If you don't see the email, please check your spam/junk folder and mark it as "not spam"</span>
            </p>
          </div>
          
          <button
            onClick={() => {
              // Close the popup completely instead of just hiding it
              closePopup();
            }}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all w-full font-medium"
          >
            Got It
          </button>
        </motion.div>
      </div>
    );
  };
  
  // Listen for reservationSuccess events with is_new_user and email_sent flags
  useEffect(() => {
    const handleReservationSuccess = (event) => {
      // Extract all relevant flags from the event
      const { 
        is_new_user, 
        user_email, 
        email_sent, 
        num_res, 
        reservationConfirmed 
      } = event.detail || {};
      
      console.log('Reservation success event received with flags:', {
        is_new_user, user_email, email_sent, num_res, reservationConfirmed
      });
      
      // Check for new user creation
      if (is_new_user) {
        // Clear any previous state
        setShowPaymentForm(false);
        setShowReviewForm(false);
        setStatus(null);
        
        // Set up the new user notification
        setIsNewUser(true);
        setNewUserEmail(user_email || '');
        
        // If email was sent, prepare email confirmation data
        if (email_sent) {
          setEmailConfirmationDetails({
            email: user_email || '',
            isReservation: true,
            reservationNumber: num_res || ''
          });
        }
      } 
      // If just email was sent (no new user)
      else if (email_sent) {
        setShowPaymentForm(false);
        setShowReviewForm(false);
        
        // Show email confirmation
        setEmailConfirmationDetails({
          email: user_email || sessionStorage.getItem("email") || '',
          isReservation: true,
          reservationNumber: num_res || ''
        });
        setShowEmailConfirmation(true);
      }
      // If reservation was confirmed but no special flags
      else if (reservationConfirmed) {
        setShowPaymentForm(false);
        
        // For logged in users who aren't admins, show review form
        if (!isAdmin && isLoggedIn) {
          setShowReviewForm(true);
        } else {
          // For others, show success status
          setStatus('success');
          setMsg('Reservation confirmed successfully!');
        }
        
        // Increment count for logged-in non-admin users
        if (!isAdmin && isLoggedIn) {
          try {
            const currentCount = parseInt(sessionStorage.getItem("today_reservations_count") || "0");
            const newCount = currentCount + 1;
            sessionStorage.setItem("today_reservations_count", newCount.toString());
            
            // Dispatch count update event
            const countEvent = new CustomEvent('reservationCountUpdated', { 
              detail: { count: newCount }
            });
            document.dispatchEvent(countEvent);
          } catch (error) {
            console.error("Error updating reservation count:", error);
          }
        }
      }
    };
    
    document.addEventListener('reservationSuccess', handleReservationSuccess);
    
    return () => {
      document.removeEventListener('reservationSuccess', handleReservationSuccess);
    };
  }, [isAdmin, isLoggedIn]);
  
  return (
    <AnimatePresence>
      {/* Initial reservation confirmation form */}
      {isVisible && status === null && !showReviewForm && !isNewUser && !showEmailConfirmation && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
          onClick={(e) => {
            e.preventDefault();
            closePopup();
          }}
        >
          <motion.div
            className="bg-[#1a1a1a] rounded-2xl p-6 max-w-[90%] w-[380px] text-center shadow-lg border border-gray-800"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <h2 className="text-white mb-5 text-xl font-bold">Confirm Reservation</h2>
            
            <div className="bg-gray-800 rounded-lg p-4 mb-5">
              <div className="space-y-3">
                {/* Only show client info if not in admin mode */}
                {!isAdmin && data.Name && (
                  <div className="flex items-center space-x-3">
                    <User size={18} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">Client Name</p>
                      <p className="text-white">{data.Name}</p>
                    </div>
                  </div>
                )}

                {/* Time */}
                <div className="flex items-center space-x-3">
                  <Clock size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Time</p>
                    <p className="text-white">{data.heure || data.heuredebut}</p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center space-x-3">
                  <Calendar size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Date</p>
                    <p className="text-white">{formatDate(data.date)}</p>
                  </div>
                </div>

                {/* Terrain */}
                <div className="flex items-center space-x-3">
                  <MapPin size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Terrain</p>
                    <p className="text-white">
                      {terrain.name || `Terrain ${data.id_terrain}`}
                      {terrainPrice && (
                        <span className="ml-1 text-green-400">({formatPrice(terrainPrice)} MAD)</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <h3 className="text-white mb-4 text-base">Choose Payment Option</h3>
            
            {showPaymentForm ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <div className="flex items-center mb-4">
                  <button 
                    onClick={() => setShowPaymentForm(false)}
                    className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h3 className="text-white text-lg font-semibold ml-2">Payment Details</h3>
                </div>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault(); // Prevent form from reloading the page
                    handlePaymentSubmit(e);
                  }} 
                  className="space-y-4"
                >
                  {/* Card Number */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-300">Card Number</label>
                    <div className="relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CreditCard className="text-gray-400" size={16} />
                      </div>
                      <input
                        type="text"
                        name="cardNumber"
                        value={paymentData.cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 9012 3456"
                        className="block w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        required
                        maxLength="19"
                      />
                    </div>
                  </div>

                  {/* Card Holder */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-300">Card Holder Name</label>
                    <div className="relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="text-gray-400" size={16} />
                      </div>
                      <input
                        type="text"
                        name="cardHolder"
                        value={paymentData.cardHolder}
                        onChange={handlePaymentChange}
                        placeholder="JOHN DOE"
                        className="block w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Expiry Date and CVV in one row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-300">Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={paymentData.expiryDate}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        className="block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        required
                        maxLength="5"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-300">CVV</label>
                      <div className="relative rounded-lg shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="text-gray-400" size={16} />
                        </div>
                        <input
                          type="password"
                          name="cvv"
                          value={paymentData.cvv}
                          onChange={handlePaymentChange}
                          placeholder="123"
                          className="block w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          required
                          maxLength="3"
                          pattern="\d*"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Total Amount */}
                  <div className="bg-gray-800 rounded-lg p-3 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Total Amount:</span>
                      <span className="text-white font-semibold text-lg">
                        {formatPrice(terrainPrice)} MAD
                      </span>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-3 rounded-lg bg-red-900/30 border border-red-500/40 text-red-400 text-sm mt-2">
                      {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    onClick={(e) => {
                      // Only process if the form submit hasn't already handled it
                      if (!e.defaultPrevented) {
                        e.preventDefault();
                        handlePaymentSubmit(e);
                      }
                    }}
                    className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
                      loading 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span className="ml-2">Processing...</span>
                      </div>
                    ) : (
                      'Pay Now'
                    )}
                  </button>
                </form>

                {msg && (
                  <div className="mt-4 p-3 rounded-lg bg-red-900/50 border border-red-500 text-red-400">
                    {msg}
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="flex flex-col gap-3">
                <Button onClick={(e) => {
                  e.preventDefault();
                  handleSubmit('stripe', e);
                }}
                disabled={loadingStripeIntent}
                >
                  {loadingStripeIntent ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <>
                      <CreditCard className="mr-2" size={18} />
                      Pay with Card
                    </>
                  )}
                </Button>
                
                <Button onClick={(e) => {
                  e.preventDefault();
                  handleSubmit('cash', e);
                }}>
                  <Wallet className="mr-2" size={18} />
                  Pay In-Store (Cash)
                </Button>
                
                {/* Add expiration notice */}
                <div className="mt-2 p-3 bg-yellow-500/20 border border-yellow-500/40 rounded-lg">
                  <p className="text-yellow-400 text-sm flex items-center">
                    <Clock size={16} className="mr-2 flex-shrink-0" />
                    <span>In-store payments must be completed within 1 hour or your reservation will be automatically cancelled.</span>
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
      
      {/* Review form popup - completely separate component */}
      {isVisible && showReviewForm && !isAdmin && isLoggedIn && !isNewUser && !showEmailConfirmation && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            // Only close if clicking the overlay background, not the form itself
            if (e.target === e.currentTarget) {
              e.stopPropagation();
              setShowReviewForm(false);
              setTimeout(() => {
                if (resetStatus) resetStatus();
              }, 100);
            }
          }}
        >
          <motion.div
            className="max-w-[90%] w-[380px]"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => {
              // Prevent clicks inside the form from closing it
              e.stopPropagation();
            }}
          >
            <ReviewForm />
          </motion.div>
        </motion.div>
      )}
      
      {/* Status animations */}
      {status === 'success' && !isNewUser && !showEmailConfirmation && <AnimatedCheck onClose={resetStatus} />}
      {status === 'pending' && !isNewUser && !showEmailConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <motion.div
            className="bg-[#1a1a1a] rounded-2xl p-6 max-w-[90%] w-[380px] text-center shadow-lg border border-gray-800"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <AnimatedPending />
            <h3 className="text-xl font-semibold text-white mt-4">Reservation Pending</h3>
            <p className="text-gray-400 mt-2">Please proceed to the store for payment to confirm your reservation.</p>
            
            {/* Countdown timer */}
            <ExpirationCountdown />
            
            {/* Add prominent expiration warning */}
            <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/40 rounded-lg">
              <p className="text-yellow-400 text-sm font-medium">
                Important: Your reservation will be automatically cancelled if payment is not completed within the time shown above.
              </p>
            </div>
            
            <button
              onClick={resetStatus}
              className="mt-6 px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
      {status === 'failed' && !isNewUser && !showEmailConfirmation && <AnimatedReserved onClose={resetStatus} />}
      
      {/* New user notification popup */}
      {isVisible && isNewUser && !showEmailConfirmation && <NewUserPopup />}
      
      {/* Email confirmation popup */}
      {isVisible && showEmailConfirmation && <EmailConfirmationPopup />}
    </AnimatePresence>
  );
}
  
