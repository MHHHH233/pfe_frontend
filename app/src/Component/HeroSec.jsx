import React from 'react';
import styled, { keyframes } from 'styled-components';
import background from '../img/fc24-hero-lg-motion-pitch-3x2-lg-md.webm';

// Fade-in animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled components
const HeroContainer = styled.div`
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }

  video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
  }

  
  
`;


const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
  animation: ${fadeIn} 1s ease-out;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  line-height: 1.2;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 500px) {
    font-size: 2rem;
  }
`;

const WhiteText = styled.span`
  color: white;
  display: block;
`;

const GreenText = styled.span`
  color: #07f468;
  display: block;
  font-size: 1.2em;
  font-weight: 700;
  letter-spacing: 2px;
  margin-top: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 500px) {
    font-size: 0.9rem;
  }
`;

const Button = styled.button`
  background-color: #07f468;
  color: #1a1a1a;
  border: none;
  border-radius: 50px;
  padding: 10px 25px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 6px rgba(7, 244, 104, 0.1);

  &:hover {
    background-color: #06d35a;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(7, 244, 104, 0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(7, 244, 104, 0.1);
  }

  @media (max-width: 500px) {
    padding: 8px 20px;
    font-size: 0.8rem;
  }
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  font-size: 0.9rem;
  opacity: 0.7;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;

const ScrollText = styled.span`
  margin-bottom: 8px;
`;

const ScrollIcon = styled.div`
  width: 30px;
  height: 50px;
  border: 2px solid white;
  border-radius: 25px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 50%;
    width: 6px;
    height: 6px;
    background-color: white;
    border-radius: 50%;
    transform: translateX(-50%);
    animation: scrollAnimation 2s infinite;
  }

  @keyframes scrollAnimation {
    0% {
      transform: translate(-50%, 0);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: translate(-50%, 20px);
      opacity: 0;
    }
  }
`;

const HeroSection = () => {
  return (
    <HeroContainer>
      <video autoPlay loop muted>
        <source src={background} type="video/webm" />
        Your browser does not support the video tag.
      </video>
      <ContentWrapper>
        <Title>
          <WhiteText>Bienvenue chez</WhiteText>
          <GreenText>Terrana FA</GreenText>
        </Title>
        <Subtitle>Découvrez tout un univers de football passionnant et compétitif</Subtitle>
        <Button>À propos de nous</Button>
      </ContentWrapper>
      <ScrollIndicator>
        <ScrollText>Scroll Down</ScrollText>
        <ScrollIcon />
      </ScrollIndicator>
    </HeroContainer>
  );
};

export default HeroSection;
