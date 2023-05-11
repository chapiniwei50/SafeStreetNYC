import React from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/styles';
import Button from '@mui/material/Button';
import Image from '../img/my-image.jpg';
import './Intro.css';

const MyButton = styled(Button)({
  background: 'linear-gradient(45deg, #02b5b5 30%, #87CEEB 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
});

const IntroPage = () => {
  return (
    <div className="intro-page">
      <div className="intro-container">
        <img src={Image} width='100' />
        <h1>SafeStreetNYC</h1>
        <p>Welcome to SafeStreetNYC! Click below to learn more about your area!</p>
        <div className="buttons">
          <Link to="/airbnb">
            <MyButton>Explore Airbnb</MyButton>
          </Link>
          <Link to="/housing">
            <MyButton>Explore Housing</MyButton>
          </Link>
          <Link to="/hospitals">
            <MyButton>Explore Hospitals</MyButton>
          </Link>
          <Link to="/nearby">
            <MyButton>Check Out Nearby Hospitals and Crimes</MyButton>
          </Link>
        </div>
        <h4>© 2023 Nathan Chen, Abhinav Gopinath, Jiwoong Matt Park, Cindy Wei</h4>
      </div>
    </div>
  );
};

export default IntroPage;