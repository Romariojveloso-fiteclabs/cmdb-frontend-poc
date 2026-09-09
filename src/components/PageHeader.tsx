import React from 'react';

interface PageHeaderProps {
  title: string;
  intro?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, intro }) => (
  <>
    <h1 style={{ fontFamily: 'var(--font-accent)', fontSize: '34px', fontWeight: 600, margin: '0 0 8px' }}>
      {title}
    </h1>
    {intro ? <p className="page-intro">{intro}</p> : null}
  </>
);
