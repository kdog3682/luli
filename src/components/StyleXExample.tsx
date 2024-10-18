import React, { useState } from 'react';
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: 'lightgray',
  },
  heading: {
    fontSize: '24px',
    color: 'navy',
    marginBottom: '10px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: 'blue',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: 'darkblue',
    },
  },
  active: {
    backgroundColor: 'green',
    ':hover': {
      backgroundColor: 'darkgreen',
    },
  },
  text: {
    marginTop: '10px',
    fontSize: '18px',
  },
  highlighted: {
    backgroundColor: 'yellow',
    padding: '5px',
  },
});

const StyleXExample = () => {
  const [isActive, setIsActive] = useState(false);
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setIsActive(!isActive);
    setCount(count + 1);
  };

  return (
    <div {...stylex.props(styles.container)}>
      <h1 {...stylex.props(styles.heading)}>Welcome to Vite + React + StyleX</h1>
      <button 
        {...stylex.props(styles.button, isActive && styles.active)}
        onClick={handleClick}
      >
        {isActive ? 'Deactivate' : 'Activate'}
      </button>
      <p {...stylex.props(styles.text)}>
        Button clicked: 
        <span {...stylex.props(count > 5 && styles.highlighted)}>
          {count} times
        </span>
      </p>
    </div>
  );
};

export { StyleXExample }
