import React from 'react';
import { Link } from 'react-router-dom';

const Restricted = () => {
  return (
    <div style={containerStyle}>
      <p style={messageStyle}>
        Sorry, you do not have permission to access this section.
      </p>
      <div>
        <Link to='/' style={ctaStyle}>
          Back To Dashboard
        </Link>
      </div>
    </div>
  );
};

const containerStyle = {
    height: '100%',
    padding: '2rem',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  messageStyle = {
    fontSize: '4rem',
    marginBottom: '2rem',
  },
  ctaStyle = {
    // color: '#61dafb',
    textDecoration: 'none',
    color: 'white',
    backgroundColor: '#252b35',
    border: '2px solid transparent',
    borderRadius: '7px',
    fontSize: '1rem',
    padding: '10px 2rem',
    transition: 'all 0.5s ease-out',
  };

export default Restricted;
