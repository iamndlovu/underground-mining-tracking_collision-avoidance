import React from 'react';

const SingleTag = ({ tag, rightMargin }) => {
  return (
    <li
      style={{
        margin: `0 ${rightMargin || '0px'} 0.3rem 0`,
        padding: '2px 2.7px',
        fontWeight: '500',
        fontSize: '.74rem',
        fontFamily: 'Arial, Helvetica, sans-serif',
        textTransform: 'uppercase',
        background: '#a6e4f5',
        color: '#232323',
        borderRadius: '4px',
        cursor: 'default',
      }}
    >
      {tag || '...'}
    </li>
  );
};

export default SingleTag;
