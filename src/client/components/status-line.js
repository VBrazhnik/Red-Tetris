import React from 'react';

const StatusLine = ({ status }) => {
  return (
    <footer id="status-line">
      <p>{status}</p>
    </footer>
  );
};

export { StatusLine };
