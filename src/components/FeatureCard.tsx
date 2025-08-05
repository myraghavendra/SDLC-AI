import React from 'react';
import './FeatureCard.css';

import { Link } from 'react-router-dom';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  className?: string;
  to?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, className, to }) => {
  const content = (
    <div className={`feature-card${className ? ' ' + className : ''}`}>
      <div className="icon">{icon}</div>
      <h3 className="title">{title}</h3>
      <div className="description">{description}</div>
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  return content;
};

export default FeatureCard;
