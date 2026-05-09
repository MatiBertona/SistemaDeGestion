import React from 'react';
import styles from './StockChart.module.scss';

interface Props {
  actual: number;
  min: number;
  max: number;
}

export const StockChart: React.FC<Props> = ({ actual, min, max }) => {
  const getPercent = (val: number) => Math.min((val / max) * 100, 100);
  
  return (
    <div className={styles.chartContainer}>
      <div className={styles.barGroup}>
        <div 
          className={styles.barActual} 
          style={{ height: `${getPercent(actual)}%` }} 
        />
        <span className={styles.label}>ACTUAL ({actual})</span>
      </div>
      <div className={styles.barGroup}>
        <div 
          className={styles.barMin} 
          style={{ height: `${getPercent(min)}%` }} 
        />
        <span className={styles.label}>BAJO ({min})</span>
      </div>
      <div className={styles.barGroup}>
        <div 
          className={styles.barMax} 
          style={{ height: '100%' }} 
        />
        <span className={styles.label}>MÁX ({max})</span>
      </div>
    </div>
  );
};
