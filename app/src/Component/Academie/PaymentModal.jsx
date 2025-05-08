import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, X, Lock } from 'lucide-react';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContainer = styled(motion.div)`
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

const Title = styled.h3`
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

const CardRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1rem;
`;

const Button = styled.button`
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

const PlanSummary = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const PlanName = styled.div`
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
    font-weight: 600;
    color: white;
  }
`;

const SecureNote = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
  margin-top: 1rem;
  justify-content: center;
`;

const SuccessContainer = styled(motion.div)`
  text-align: center;
  padding: 2rem 1rem;
`;

const SuccessIcon = styled.div`
  color: #07F468;
  margin-bottom: 1.5rem;
  
  svg {
    width: 64px;
    height: 64px;
  }
`;

const SuccessTitle = styled.h3`
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
`;

const PaymentModal = ({ show, onClose, planName, price, isAnnual, onSuccess }) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  if (!show) return null;
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
    }
    
    // Format expiry date with slash
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\//g, '');
      if (formattedValue.length > 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
      }
    }
    
    // Limit CVV to 3 digits
    if (name === 'cvv') {
      formattedValue = value.slice(0, 3);
    }
    
    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      
      // After successful "payment", call the onSuccess callback
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }, 1500);
  };
  
  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <ModalOverlay
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={modalVariants}
      onClick={onClose}
    >
      <ModalContainer 
        variants={containerVariants}
        onClick={e => e.stopPropagation()}
      >
        {isComplete ? (
          <SuccessContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <SuccessIcon>
              <CheckCircle />
            </SuccessIcon>
            <SuccessTitle>Paiement Réussi!</SuccessTitle>
            <SuccessMessage>
              Votre abonnement au {planName} a été activé avec succès.
            </SuccessMessage>
          </SuccessContainer>
        ) : (
          <>
            <ModalHeader>
              <Title>Paiement pour {planName}</Title>
              <CloseButton onClick={onClose}><X size={24} /></CloseButton>
            </ModalHeader>
            
            <PlanSummary>
              <PlanName>{planName}</PlanName>
              <PriceRow>
                <span>Prix</span>
                <span>{price} {isAnnual ? '/an' : '/mois'}</span>
              </PriceRow>
              {isAnnual && (
                <PriceRow>
                  <span>Économie</span>
                  <span>-10%</span>
                </PriceRow>
              )}
              <PriceRow>
                <span>Total</span>
                <span>{price} {isAnnual ? '/an' : '/mois'}</span>
              </PriceRow>
            </PlanSummary>
            
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Nom sur la carte</Label>
                <Input
                  type="text"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Numéro de carte</Label>
                <Input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </FormGroup>
              
              <CardRow>
                <FormGroup>
                  <Label>Date d'expiration</Label>
                  <Input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>CVV</Label>
                  <Input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    required
                  />
                </FormGroup>
              </CardRow>
              
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? 'Traitement...' : 'Payer maintenant'}
              </Button>
              
              <SecureNote>
                <Lock size={14} />
                <span>Paiement sécurisé - Ceci est une simulation de paiement pour démonstration</span>
              </SecureNote>
            </Form>
          </>
        )}
      </ModalContainer>
    </ModalOverlay>
  );
};

export default PaymentModal; 