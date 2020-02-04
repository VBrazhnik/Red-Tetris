import React from 'react';
import classNames from 'classnames';
import { EMPTY, FILLED, BLOCKED } from '../constants/cell-types';

const Cell = ({ type }) => {
  const className = classNames(
    'cell',
    { 'empty': type === EMPTY },
    { 'filled': type === FILLED },
    { 'blocked': type === BLOCKED }
  );

  return <div className={className} />;
};

export { Cell };
