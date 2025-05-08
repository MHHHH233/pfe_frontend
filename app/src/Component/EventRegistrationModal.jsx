import React, { useState } from 'react';
import styled from 'styled-components';
import activitiesMembersService from '../lib/services/user/activitiesMembersService';
import { useNavigate } from 'react-router-dom';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #222;
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(7, 244, 104, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3`
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s ease;
  
  &:hover {
    color: #07F468;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #07F468;
    box-shadow: 0 0 0 2px rgba(7, 244, 104, 0.2);
  }
`;

const SubmitButton = styled.button`
  background-color: #07F468;
  color: #1a1a1a;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 1rem;
  
  &:hover {
    background-color: #06d35a;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(7, 244, 104, 0.3);
  }
  
  &:disabled {
    background-color: #555;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Message = styled.div`
  padding: 0.75rem;
  border-radius: 8px;
  margin-top: 1rem;
  text-align: center;
  
  &.success {
    background-color: rgba(7, 244, 104, 0.1);
    color: #07F468;
  }
  
  &.error {
    background-color: rgba(255, 77, 77, 0.1);
    color: #ff4d4d;
  }
  
  &.info {
    background-color: rgba(77, 148, 255, 0.1);
    color: #4d94ff;
  }
`;

const EventRegistrationModal = ({ show, onClose, eventId, eventTitle }) => {
  const [formData, setFormData] = useState({
    date_joined: new Date().toISOString().split('T')[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Get user ID directly from sessionStorage where it's stored during login
      // Check both storage methods (direct and from userdetails)
      let userId = sessionStorage.getItem("userId");
      
      // If not found directly, try from userdetails
      if (!userId) {
        const userDetails = sessionStorage.getItem("userdetails");
        if (userDetails) {
          const userData = JSON.parse(userDetails);
          userId = userData.id_compte;
        }
      }
      
      console.log("User ID for registration:", userId);
      
      if (!userId) {
        setMessage({ 
          type: 'error', 
          text: 'Information utilisateur introuvable. Veuillez vous reconnecter.' 
        });
        setIsSubmitting(false);
        return;
      }

      // Check academy membership status flag first (from login response)
      const hasMembership = sessionStorage.getItem("has_academie_membership") === "true";
      console.log("Has academy membership:", hasMembership);
      
      // If they don't have a membership, show message and redirect
      if (!hasMembership) {
        setMessage({ 
          type: 'info', 
          text: 'Vous devez souscrire à un abonnement pour rejoindre cet événement.' 
        });
        
        setTimeout(() => {
          onClose();
          navigate('/academie#tarifs'); // Redirect to Academy page plans section
        }, 2000);
        
        setIsSubmitting(false);
        return;
      }
      
      // Prepare the registration data
      const registrationData = {
        id_activites: eventId,
        id_compte: userId,
        date_joined: formData.date_joined
      };

      // Try to get membership ID from the memberships array first
      let memberId = null;
      const membershipsStr = sessionStorage.getItem("academie_memberships");
      
      if (membershipsStr) {
        try {
          const memberships = JSON.parse(membershipsStr);
          if (memberships && memberships.length > 0) {
            // For now, we'll use the first membership's ID
            // In a more complex app, you might need to match the academy ID with the event's academy
            memberId = memberships[0].id_member;
            console.log("Using membership ID from array:", memberId);
          }
        } catch (error) {
          console.error("Error parsing memberships:", error);
        }
      }
      
      // If we couldn't get it from the array, fall back to the direct academy_member_id
      if (!memberId) {
        memberId = sessionStorage.getItem("academy_member_id");
        console.log("Using direct membership ID:", memberId);
      }

      // Add the id_member_ref if we found any member ID
      if (memberId) {
        registrationData.id_member_ref = memberId;
      } else {
        console.warn("No membership ID found, but has_academie_membership is true.");
      }
      
      console.log("Sending registration data:", registrationData);
      const response = await activitiesMembersService.createMember(registrationData);
      console.log("Registration response:", response);
      
      setMessage({ 
        type: 'success', 
        text: 'Inscription réussie!' 
      });
      
      // Close modal after successful registration
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = 'Erreur lors de l\'inscription. Veuillez réessayer.';
      
      // Check for error response data
      if (error.response && error.response.data) {
        // Check for the specific error about id_member_ref
        if (error.response.data.error && error.response.data.error.id_member_ref) {
          setMessage({ 
            type: 'info', 
            text: 'Vous devez souscrire à un abonnement pour rejoindre cet événement.' 
          });
          
          // Close the modal and redirect to the Academy page plan section after a delay
          setTimeout(() => {
            onClose();
            navigate('/academie#tarifs'); // Redirect to Academy page plans section
          }, 2000);
          
          setIsSubmitting(false);
          return;
        }
        
        // If there's a message field, use that directly
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } 
        // Otherwise check for error field (validation errors)
        else if (error.response.data.error) {
          errorMessage = Object.values(error.response.data.error).join(', ');
        }
      }
      
      // If it's the specific "already registered" error, use a more friendly type
      if (errorMessage.includes('already in this activity')) {
        setMessage({ 
          type: 'info', // Use info instead of error for this case
          text: 'Vous êtes déjà inscrit à cet événement.' 
        });
      } else {
        setMessage({ type: 'error', text: errorMessage });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>S'inscrire à l'événement</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Événement</Label>
            <Input 
              type="text" 
              value={eventTitle} 
              disabled 
            />
          </FormGroup>
          
          {message.text && (
            <Message className={message.type}>
              {message.text}
            </Message>
          )}
          
          <SubmitButton 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Inscription en cours...' : 'Confirmer l\'inscription'}
          </SubmitButton>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default EventRegistrationModal; 