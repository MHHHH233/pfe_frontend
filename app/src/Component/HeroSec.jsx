import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import background from '../img/fc24-hero-lg-motion-pitch-3x2-lg-md.webm';

// Fade-in animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Animations
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
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
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5));
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, #07F468, transparent);
    z-index: 2;
    opacity: 0.7;
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
  max-width: 900px;
  padding: 0 2rem;
`;

const Title = styled.h1`
  font-size: 3.8rem;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.6);

  @media (max-width: 768px) {
    font-size: 2.7rem;
  }

  @media (max-width: 500px) {
    font-size: 2.2rem;
  }
`;

const WhiteText = styled.span`
  color: white;
  display: block;
`;

const GreenText = styled.span`
  background: linear-gradient(to right, #07F468, #34d399);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: block;
  font-size: 1.3em;
  font-weight: 700;
  letter-spacing: 2px;
  margin-top: 0.5rem;
  animation: ${pulse} 3s infinite ease-in-out;
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  margin-bottom: 2.5rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }

  @media (max-width: 500px) {
    font-size: 1rem;
  }
`;

const Button = styled(Link)`
  background-color: #07F468;
  color: #1a1a1a;
  border: none;
  border-radius: 50px;
  padding: 12px 35px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(7, 244, 104, 0.3);
  text-decoration: none;
  display: inline-block;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to bottom right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.4) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: rotate(45deg);
    transition: all 0.5s ease;
    opacity: 0;
  }

  &:hover {
    background-color: #06d35a;
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(7, 244, 104, 0.4);
    
    &::after {
      opacity: 1;
      left: 100%;
      top: 100%;
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 8px rgba(7, 244, 104, 0.3);
  }

  @media (max-width: 500px) {
    padding: 10px 25px;
    font-size: 0.9rem;
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
  opacity: 0.8;
  transition: opacity 0.3s ease;
  animation: ${float} 2s infinite ease-in-out;
  z-index: 2;

  &:hover {
    opacity: 1;
  }
`;

const ScrollText = styled.span`
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const ScrollIconWrapper = styled.div`
  position: relative;
  width: 24px;
  height: 40px;
  display: flex;
  justify-content: center;
`;

const HeroSection = () => {
  return (
    <HeroContainer>
      <video autoPlay loop muted playsInline>
        <source src={background} type="video/webm" />
        Your browser does not support the video tag.
      </video>
      <ContentWrapper>
        <Title>
          <WhiteText>Bienvenue chez</WhiteText>
          <GreenText>Terrana FC</GreenText>
        </Title>
        <Subtitle>Découvrez tout un univers de football passionnant et compétitif où le plaisir du jeu rencontre l'excellence sportive</Subtitle>
        <Button to="/about">À propos de nous</Button>
      </ContentWrapper>
      <ScrollIndicator>
        <ScrollText>Scroll Down</ScrollText>
        <ScrollIconWrapper>
          <ChevronDown className="text-[#07F468] animate-bounce" size={24} />
        </ScrollIconWrapper>
      </ScrollIndicator>
    </HeroContainer>
  );
};

export default HeroSection;
