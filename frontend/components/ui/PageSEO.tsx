import React, { useEffect } from 'react';

interface PageSEOProps {
  title: string;
  description: string;
}

const PageSEO: React.FC<PageSEOProps> = ({ title, description }) => {
  useEffect(() => {
    document.title = title;

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

  }, [title, description]);

  return null;
};

export default PageSEO;
