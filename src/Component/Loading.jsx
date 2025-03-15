import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <StyledLoaderContainer>
        <div className="loader3">
          <div className="bars bar1" />
          <div className="bars bar2" />
          <div className="bars bar3" />
          <div className="bars bar4" />
          <div className="bars bar5" />
          <div className="bars bar6" />
          <div className="bars bar7" />
          <div className="bars bar8" />
          <div className="bars bar9" />
          <div className="bars bar10" />
        </div>
      </StyledLoaderContainer>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
`;

const StyledLoaderContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  .loader3 {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .bars {
    width: 15px;
    height: 30px;
    margin: 0 3px;
    border-radius: 4px;
    animation: loader3 3s ease-in-out infinite;
  }

  .bar1 {
    background-color: #07F468;
    animation-delay: -0.8s;
  }

  .bar2 {
    background-color: #07F468;
    animation-delay: -0.7s;
  }

  .bar3 {
    background-color: #07F468;
    animation-delay: -0.6s;
  }

  .bar4 {
    background-color: #07F468;
    animation-delay: -0.5s;
  }

  .bar5 {
    background-color: #07F468;
    animation-delay: -0.4s;
  }

  .bar6 {
    background-color: #07F468;
    animation-delay: -0.3s;
  }

  .bar7 {
    background-color: #07F468;
    animation-delay: -0.2s;
  }

  .bar8 {
    background-color: #07F468;
    animation-delay: -0.1s;
  }

  .bar9 {
    background-color: #07F468;
    animation-delay: 0s;
  }

  .bar10 {
    background-color: #07F468;
    animation-delay: 0.1s;
  }

  @keyframes loader3 {
    0% {
      transform: scale(1);
    }

    20% {
      transform: scale(1, 2.32);
    }

    40% {
      transform: scale(1);
    }
  }
`;

export default Loader;

