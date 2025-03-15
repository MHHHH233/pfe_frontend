import React from 'react';
import styled from 'styled-components';
import img1 from '../img/img1.PNG'
import img3 from '../img/img3.PNG'
import img2 from '../img/img2.PNG'

const SectionContainer = styled.section`
  background-color: #1a1a1a;
  padding: 4rem 2rem;
  min-height: 100vh;
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

const EventsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const EventCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column; /* Makes the content stack vertically */
  justify-content: space-between; /* Aligns items to the top and bottom */
  height: 100%; /* Ensures consistent height for all cards */

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 8px 32px rgba(7, 244, 104, 0.1);
  }
`;


const EventImage = styled.div`
  width: 100%;
  height: 200px;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to top, rgba(26, 26, 26, 1), transparent);
  }
`;

const EventContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column; /* Stack content vertically */
  flex-grow: 1; /* Ensures it fills available space */
`;

const EventHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const EventTitle = styled.h3`
  color: white;
  font-size: 1.25rem;
  font-weight: 500;
  margin: 0;
`;

const EventDate = styled.span`
  color: #07F468;
  font-size: 0.875rem;
  padding: 0.25rem 0.75rem;
  border: 1px solid #07F468;
  border-radius: 12px;
`;

const EventDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
`;

const JoinButton = styled.button`
  background-color: transparent;
  color: #07F468;
  border: 2px solid #07F468;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: 100%;
  margin-top: auto; /* Pushes the button to the bottom of the card */

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

// EventsSection Component
const EventsSection = () => {
  const events = [
    {
      title: 'EURO 2024',
      dateRange: 'du 2024/10/25 au 2024/12/12',
      description: 'IS IN THE CLUB',
      imageUrl: img3, // Updated to direct variable
    },
    {
      title: "Stage d'Été pour Jeunes",
      dateRange: "Du 1er au 15 juillet 2024",
      description: 'Un programme dentraînement intensif pour les jeunes de 8 à 16 ans, encadré par des coachs professionnels.',
      imageUrl: img2, // Updated to direct variable
    },
    {
      title: 'Match Amical 6v6',
      dateRange: 'Date : 20 mars 2024',
      description: 'Participez à une soirée conviviale avec des matchs 6v6 et rencontrez dautres passionnés.',
      imageUrl: img1, // Updated to direct variable
    },
  ];

  return (
    <SectionContainer>
      <Title>Événements à venir</Title>
      <EventsContainer>
        {events.map((event, index) => (
          <EventCard key={index}>
            <EventImage imageUrl={event.imageUrl} />
            <EventContent>
              <EventHeader>
                <EventTitle>{event.title}</EventTitle>
                <EventDate>{event.dateRange}</EventDate>
              </EventHeader>
              <EventDescription>{event.description}</EventDescription>
              <JoinButton>Rejoindre</JoinButton>
            </EventContent>
          </EventCard>
        ))}
      </EventsContainer>
    </SectionContainer>
  );
};

export default EventsSection;
