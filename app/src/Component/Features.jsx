import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Calendar, Trophy, Users } from 'lucide-react';

const SectionContainer = styled.section`
  background: linear-gradient(to bottom, #1a1a1a, #0f0f0f);
  padding: 5rem 2rem;
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, #07F468, transparent);
  }
`;

const Title = styled.h2`
  color: white;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  text-align: center;
  font-weight: 600;
  position: relative;
  display: inline-block;

  &:after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(to right, #07F468, #34d399);
    border-radius: 3px;
  }
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column; 
  justify-content: space-between; 
  align-items: center;
  text-align: center;
  transition: all 0.4s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  height: 100%;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(to right, transparent, #07F468, transparent);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 10px 40px rgba(7, 244, 104, 0.15);
    border-color: rgba(7, 244, 104, 0.1);
    
    &::before {
      opacity: 1;
    }
  }
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  background: rgba(7, 244, 104, 0.08);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border-radius: 50%;
    border: 1px solid rgba(7, 244, 104, 0.3);
    opacity: 0;
    transition: all 0.3s ease;
  }

  ${Card}:hover & {
    background: rgba(7, 244, 104, 0.15);
    transform: scale(1.1);
    
    &::after {
      opacity: 1;
      animation: pulse 2s infinite;
    }
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.5;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.3;
    }
    100% {
      transform: scale(1);
      opacity: 0.5;
    }
  }
`;

const CardTitle = styled.h3`
  color: white;
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.4;
`;

const Button = styled(Link)`
  background-color: transparent;
  color: #07F468;
  border: 2px solid #07F468;
  padding: 0.75rem 1.75rem;
  border-radius: 30px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: auto;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-decoration: none;
  display: inline-block;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background-color: rgba(7, 244, 104, 0.2);
    transition: width 0.3s ease;
    z-index: -1;
  }

  &:hover {
    background-color: rgba(7, 244, 104, 0.1);
    color: #07F468;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(7, 244, 104, 0.2);
    
    &::before {
      width: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }
`;

const FeaturesSection = () => {
  const features = [
    {
      icon: <Calendar size={36} className="text-[#07F468]" />,
      title: 'Réservez vos terrains de football 5v5 et 6v6 en quelques clics',
      buttonText: 'Réserver maintenant',
      path: '/reservation'
    },
    {
      icon: <Trophy size={36} className="text-[#07F468]" />,
      title: 'Participez à nos tournois compétitifs et amusants',
      buttonText: 'Voir les tournois',
      path: '/tournoi'
    },
    {
      icon: <Users size={36} className="text-[#07F468]" />,
      title: 'Rejoignez notre académie pour progresser et apprendre avec les meilleurs',
      buttonText: 'Découvrir l\'académie',
      path: '/Academie'
    }
  ];

  return (
    <SectionContainer>
      <Title>Fonctionnalités</Title>
      <CardsContainer>
        {features.map((feature, index) => (
          <Card key={index}>
            <IconWrapper>
              {feature.icon}
            </IconWrapper>
            <CardTitle>{feature.title}</CardTitle>
            <Button to={feature.path}>{feature.buttonText}</Button>
          </Card>
        ))}
      </CardsContainer>
    </SectionContainer>
  );
};

export default FeaturesSection;

