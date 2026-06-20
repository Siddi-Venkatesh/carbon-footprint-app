import React from 'react';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export const Card: React.FC<CardProps> = ({ children, className = '', style }) => {
  return (
    <div className={`glass-panel ${className}`} style={style}>
      {children}
    </div>
  );
};
