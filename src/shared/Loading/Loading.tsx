import React from 'react';
import styles from './Loading.module.scss';

export const Loading: React.FC = () => {
  return (
    <div className={styles.loader}>
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className={styles.dot}
          style={{ '--rotation': `${index * 45}deg` } as React.CSSProperties}
        />
      ))}
    </div>
  );
};