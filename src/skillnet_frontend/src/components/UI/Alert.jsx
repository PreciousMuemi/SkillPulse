// src/components/ui/alert.jsx
import React from 'react';

export const Alert = ({ children }) => (
  <div className="alert">{children}</div>
);

export const AlertDescription = ({ children }) => (
  <p className="alert-description">{children}</p>
);

export const AlertTitle = ({ children }) => (
  <h3 className="alert-title">{children}</h3>
);
