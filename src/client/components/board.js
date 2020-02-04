import React from 'react';
import { Cell } from './cell';

const Board = ({ blocks }) => {
  return (
    <div className="board">
      {blocks.map((row, y) => (
        <div className="row" key={y}>
          {row.map((cellType, x) => {
            return <Cell type={cellType} key={x} />;
          })}
        </div>
      ))}
    </div>
  );
};

export { Board };
