import React from 'react';
import styles from '../../styles/components/inventory/StockChart.module.scss';

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
          title={`Actual: ${actual}`}
        />
        <span className={styles.label}>ACTUAL</span>
      </div>
      <div className={styles.barGroup}>
        <div 
          className={styles.barMin} 
          style={{ height: `${getPercent(min)}%` }} 
          title={`Umbral: ${min}`}
        />
        <span className={styles.label}>UMBRAL</span>
      </div>
      <div className={styles.barGroup}>
        <div 
          className={styles.barMax} 
          style={{ height: '100%' }} 
          title={`Capacidad: ${max}`}
        />
        <span className={styles.label}>CAPACIDAD</span>
      </div>
    </div>
  );
};
