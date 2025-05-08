import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import eventsService from '../lib/services/user/eventsService';
import EventRegistrationModal from './EventRegistrationModal';

const SectionContainer = styled(motion.section)`
  background: linear-gradient(to bottom, #1a1a1a, #111111);
  padding: 5rem 2rem;
  min-height: 100vh;
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

const Title = styled(motion.h2)`
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

const EventsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2.5rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const EventCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.4s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(to right, transparent, #07F468, transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
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

const EventContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 1.2rem;
`;

const EventHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
`;

const EventTitle = styled.h3`
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
  line-height: 1.4;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    background-color: #07F468;
    border-radius: 50%;
    margin-right: 0.3rem;
  }
`;

const EventDate = styled.div`
  color: #07F468;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  background: rgba(7, 244, 104, 0.1);
  border-radius: 8px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const EventDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
`;

const JoinButton = styled.button`
  background-color: transparent;
  color: #07F468;
  border: 2px solid #07F468;
  padding: 0.75rem 1.75rem;
  border-radius: 30px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: 100%;
  margin-top: auto;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
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
    
    svg {
      transform: translateX(3px);
    }
  }

  &:active {
    transform: translateY(0);
  }
  
  svg {
    transition: transform 0.3s ease;
  }
`;

const ViewAllButton = styled(Link)`
  background-color: transparent;
  color: #07F468;
  border: 2px solid #07F468;
  padding: 0.75rem 1.75rem;
  border-radius: 30px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  margin-top: 3rem;
  gap: 0.5rem;
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
    
    svg {
      transform: translateX(3px);
    }
  }

  &:active {
    transform: translateY(0);
  }
  
  svg {
    transition: transform 0.3s ease;
  }
`;

const LoadingMessage = styled.div`
  color: white;
  text-align: center;
  font-size: 1.2rem;
  margin: 2rem 0;
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  text-align: center;
  font-size: 1.2rem;
  margin: 2rem 0;
`;

const EventsSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventsService.getPaginatedEvents(1, 6);
        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch events. Please try again later.');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleJoinClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  if (loading) {
    return (
      <SectionContainer>
        <Title>Événements à venir</Title>
        <LoadingMessage>Loading events...</LoadingMessage>
      </SectionContainer>
    );
  }

  if (error) {
    return (
      <SectionContainer>
        <Title>Événements à venir</Title>
        <ErrorMessage>{error}</ErrorMessage>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, amount: 0.1 }}
    >
      <Title
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
      >
        Événements à venir
      </Title>
      <EventsContainer
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        viewport={{ once: true }}
      >
        {events.map((event, index) => (
          <EventCard 
            key={event.id_activites}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
            viewport={{ once: true }}
          >
            <EventContent>
              <EventHeader>
                <EventTitle>{event.title}</EventTitle>
                <EventDate>
                  <Calendar size={14} />
                  {`${formatDate(event.date_debut)} - ${formatDate(event.date_fin)}`}
                </EventDate>
              </EventHeader>
              <EventDescription>{event.description}</EventDescription>
              <JoinButton onClick={() => handleJoinClick(event)}>
                Rejoindre
                <ChevronRight size={16} />
              </JoinButton>
            </EventContent>
          </EventCard>
        ))}
      </EventsContainer>
      <ViewAllButton to="/events">
        Voir tous les événements
        <ChevronRight size={16} />
      </ViewAllButton>
      
      {showModal && selectedEvent && (
        <EventRegistrationModal 
          show={showModal}
          onClose={handleCloseModal}
          eventId={selectedEvent.id_activites}
          eventTitle={selectedEvent.title}
        />
      )}
    </SectionContainer>
  );
};

export default EventsSection;
