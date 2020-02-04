import React from 'react';

const ControlButton = ({ title, handler }) => {
  return (
    <div className="control-button" onClick={handler}>
      <p>{title}</p>
    </div>
  );
};

export { ControlButton };
