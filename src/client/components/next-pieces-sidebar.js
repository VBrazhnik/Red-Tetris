import React from 'react';
import { Board } from './board';

const NextPiecesSidebar = ({ pieces }) => {
  return (
    <aside id="next-pieces-sidebar">
      {pieces.map((blocks, index) => (
        <div className="next-piece" key={index}>
          <Board blocks={blocks} />
        </div>
      ))}
    </aside>
  );
};

export { NextPiecesSidebar };
