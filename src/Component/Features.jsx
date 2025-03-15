import React from 'react';
import styled from 'styled-components';

const SectionContainer = styled.section`
  background-color: #1a1a1a;
  padding: 4rem 2rem;
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  color: white;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  text-align: center;
  font-weight: 600;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background-color: #07F468;
  }
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  flex-direction: column; 
  justify-content: space-between; 
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  height: 100%; 

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 8px 32px rgba(7, 244, 104, 0.1);
  }
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  background: rgba(7, 244, 104, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;

  ${Card}:hover & {
    background: rgba(7, 244, 104, 0.2);
    transform: scale(1.1);
  }
`;

const Icon = styled.img`
  width: 40px;
  height: 40px;
  filter: brightness(0) invert(1);
`;

const CardTitle = styled.h3`
  color: white;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  font-weight: 500;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Button = styled.button`
  background-color: transparent;
  color: #07F468;
  border: 2px solid #07F468;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: auto; /* Push button to the bottom */
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    background-color: #07F468;
    color: #1a1a1a;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(7, 244, 104, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const FeaturesSection = () => {
  const features = [
    {
      icon: '⚽',
      title: 'Réservez vos terrains de football 5v5 et 6v6 en quelques clics',
      buttonText: 'Réserver maintenant'
    },
    {
      icon: '🏆',
      title: 'Participez à nos tournois compétitifs et amusants',
      buttonText: 'Voir les tournois'
    },
    {
      icon: '👥',
      title: 'Rejoignez notre académie pour progresser et apprendre avec les meilleurs',
      buttonText: 'Découvrir lacadémie'
    }
  ];

  return (
    <SectionContainer>
      <Title>Fonctinaliter</Title>
      <CardsContainer>
        {features.map((feature, index) => (
          <Card key={index}>
            <IconWrapper>
              <span style={{ fontSize: '2rem' }}>{feature.icon}</span>
            </IconWrapper>
            <CardTitle>{feature.title}</CardTitle>
            <Button>{feature.buttonText}</Button>
          </Card>
        ))}
      </CardsContainer>
    </SectionContainer>
  );
};

export default FeaturesSection;

