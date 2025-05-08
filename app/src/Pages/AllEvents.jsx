import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Search, SortAsc, SortDesc, Filter } from 'lucide-react';
import eventsService from '../lib/services/user/eventsService';
import { useSearchParams } from 'react-router-dom';
import EventRegistrationModal from '../Component/EventRegistrationModal';

const PageContainer = styled.div`
  background: linear-gradient(to bottom, #1a1a1a, #0f0f0f);
  min-height: 100vh;
  padding: 6rem 2rem 4rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, #07F468, transparent);
    opacity: 0.7;
  }
`;

const Title = styled(motion.h1)`
  color: white;
  font-size: 2.8rem;
  margin-bottom: 3rem;
  text-align: center;
  font-weight: 600;
  position: relative;
  display: inline-block;
  margin-left: auto;
  margin-right: auto;
  width: 100%;

  &:after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(to right, #07F468, #34d399);
    border-radius: 3px;
  }
`;

const FiltersContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto 2.5rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(to right, transparent, #07F468, transparent);
  }
`;

const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;
  max-width: 500px;
`;

const SearchInput = styled.input`
  padding: 0.85rem 1rem 0.85rem 3rem;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  color: white;
  width: 100%;
  font-size: 0.95rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #07F468;
    box-shadow: 0 0 0 2px rgba(7, 244, 104, 0.2);
    background: rgba(255, 255, 255, 0.06);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
  pointer-events: none;
  transition: color 0.3s ease;
  
  ${SearchInput}:focus + & {
    color: #07F468;
  }
`;

const SelectWrapper = styled.div`
  position: relative;
  min-width: 180px;
`;

const Select = styled.select`
  padding: 0.85rem 1rem 0.85rem 3rem;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  color: white;
  cursor: pointer;
  font-size: 0.95rem;
  appearance: none;
  width: 100%;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #07F468;
    box-shadow: 0 0 0 2px rgba(7, 244, 104, 0.2);
    background: rgba(255, 255, 255, 0.06);
  }

  option {
    background: #1a1a1a;
    color: white;
    padding: 10px;
  }
`;

const SelectIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
  pointer-events: none;
  transition: color 0.3s ease;
  
  ${Select}:focus + & {
    color: #07F468;
  }
`;

const EventsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2.5rem;
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
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
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
  gap: 0.4rem;
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
  padding: 0.85rem 1.75rem;
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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 3.5rem;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const PageButton = styled.button`
  background-color: ${props => props.active ? 'rgba(7, 244, 104, 0.2)' : 'transparent'};
  color: ${props => props.active ? '#07F468' : 'white'};
  border: ${props => props.active ? '2px solid #07F468' : '1px solid rgba(255, 255, 255, 0.2)'};
  padding: 0.6rem ${props => props.isArrow ? '0.8rem' : '1.2rem'};
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: ${props => props.isArrow ? '40px' : '44px'};
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    border-color: #07F468;
    color: #07F468;
    transform: translateY(-2px);
    background-color: rgba(7, 244, 104, 0.1);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const LoadingMessage = styled(motion.div)`
  color: white;
  text-align: center;
  font-size: 1.2rem;
  margin: 3rem 0;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const ErrorMessage = styled(motion.div)`
  color: #ff5555;
  text-align: center;
  font-size: 1.2rem;
  margin: 3rem 0;
  padding: 2rem;
  background: rgba(255, 0, 0, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(255, 100, 100, 0.1);
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const NoResults = styled(motion.div)`
  color: white;
  text-align: center;
  font-size: 1.2rem;
  margin: 3rem 0;
  padding: 3rem 2rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Get current filter values from URL
  const currentPage = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const sortBy = searchParams.get('sort_by') || 'date_debut';
  const sortOrder = searchParams.get('sort_order') || 'desc';

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await eventsService.getPaginatedEvents(
          currentPage,
          9,
          search,
          sortBy,
          sortOrder
        );
        setEvents(response.data);
        setPagination({
          currentPage: response.meta.current_page,
          lastPage: response.meta.last_page,
          total: response.meta.total
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch events. Please try again later.');
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentPage, search, sortBy, sortOrder]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (value) {
        newParams.set('search', value);
      } else {
        newParams.delete('search');
      }
      newParams.set('page', '1');
      return newParams;
    });
  };

  const handleSort = (e) => {
    const [newSortBy, newSortOrder] = e.target.value.split('-');
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('sort_by', newSortBy);
      newParams.set('sort_order', newSortOrder);
      newParams.set('page', '1');
      return newParams;
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('page', newPage);
      return newParams;
    });
  };

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

  const renderPaginationButtons = () => {
    const buttons = [];
    
    // Previous button
    buttons.push(
      <PageButton
        key="prev"
        onClick={() => handlePageChange(pagination.currentPage - 1)}
        disabled={pagination.currentPage === 1}
        isArrow
      >
        <ChevronLeft size={18} />
      </PageButton>
    );

    // Page numbers
    for (let i = 1; i <= pagination.lastPage; i++) {
      buttons.push(
        <PageButton
          key={i}
          active={pagination.currentPage === i}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </PageButton>
      );
    }

    // Next button
    buttons.push(
      <PageButton
        key="next"
        onClick={() => handlePageChange(pagination.currentPage + 1)}
        disabled={pagination.currentPage === pagination.lastPage}
        isArrow
      >
        <ChevronRight size={18} />
      </PageButton>
    );

    return buttons;
  };

  return (
    <PageContainer>
      <Title
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Tous les événements
      </Title>
      
      <FiltersContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <SearchInputWrapper>
          <SearchInput
            type="text"
            placeholder="Rechercher des événements..."
            value={search}
            onChange={handleSearch}
          />
          <SearchIcon>
            <Search size={18} />
          </SearchIcon>
        </SearchInputWrapper>
        
        <SelectWrapper>
          <Select value={`${sortBy}-${sortOrder}`} onChange={handleSort}>
            <option value="date_debut-desc">Plus récents</option>
            <option value="date_debut-asc">Plus anciens</option>
            <option value="title-asc">Titre (A-Z)</option>
            <option value="title-desc">Titre (Z-A)</option>
          </Select>
          <SelectIcon>
            <Filter size={18} />
          </SelectIcon>
        </SelectWrapper>
      </FiltersContainer>

      {loading ? (
        <LoadingMessage
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          Chargement des événements...
        </LoadingMessage>
      ) : error ? (
        <ErrorMessage
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </ErrorMessage>
      ) : events.length === 0 ? (
        <NoResults
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          Aucun événement ne correspond à vos critères de recherche.
        </NoResults>
      ) : (
        <>
          <EventsGrid
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {events.map((event, index) => (
              <EventCard 
                key={event.id_activites}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * (index % 9) }}
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
          </EventsGrid>
          <PaginationContainer>
            {renderPaginationButtons()}
          </PaginationContainer>
        </>
      )}
      
      {showModal && selectedEvent && (
        <EventRegistrationModal 
          show={showModal}
          onClose={handleCloseModal}
          eventId={selectedEvent.id_activites}
          eventTitle={selectedEvent.title}
        />
      )}
    </PageContainer>
  );
};

export default AllEvents; 