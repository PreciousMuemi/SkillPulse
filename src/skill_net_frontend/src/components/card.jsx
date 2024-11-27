// Card.jsx
import React from 'react';

const Card = ({ title, content, image, footer, className }) => {
  return (
    <div className={`card ${className}`}>
      {image && <img src={image} alt="card-img" className="card-image" />}
      {title && <h3 className="card-title">{title}</h3>}
      <div className="card-content">
        {content}
      </div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};

export default Card;

