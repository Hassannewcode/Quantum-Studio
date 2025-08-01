import React from 'react';

export const LoaderIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
    <path
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
      fill="currentColor"
      fillOpacity="0.4"
      fillRule="evenodd"
    />
    <path
      d="M2 12C2 6.477 6.477 2 12 2v2c-4.41 0-8 3.59-8 8H2z"
      fill="currentColor"
    />
  </svg>
);
