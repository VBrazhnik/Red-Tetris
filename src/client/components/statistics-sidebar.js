import React from 'react';

const StatisticsSidebar = ({ statistics }) => {
  return (
    <aside id="statistics-sidebar">
      {statistics.map(({ value, caption }, index) => (
        <div className="statistic-block" key={index}>
          <p>{value}</p>
          <p>{caption}</p>
        </div>
      ))}
    </aside>
  );
};

export { StatisticsSidebar };
