import React from 'react';
import PropTypes from 'prop-types';

const TechIcons = ({ icons }) => {
  return (
    <div className="tech-icons flex flex-wrap gap-6 justify-center mt-10">
      {icons.map((icon, index) => (
        <div key={index} className="tech-icon text-3xl" title={icon.alt} style={{ color: icon.color || '#fff' }}>
          {icon.icon}
        </div>
      ))}
    </div>
  );
};

TechIcons.propTypes = {
  icons: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.node.isRequired,
      alt: PropTypes.string.isRequired,
      color: PropTypes.string,
    })
  ).isRequired,
};

export default TechIcons; 