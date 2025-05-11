import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const Card = ({ 
  icon, // React-элемент
  title, 
  description, 
  isFeatured, 
  onLearnMore 
}) => {
  return (
    <motion.div
      className={`card ${isFeatured ? 'featured' : ''}`}
      whileHover={{ y: -8, boxShadow: isFeatured ? '0 0 24px #00D4FF, 0 0 40px #00D4FF33' : '0 8px 32px #0006' }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: 'spring' }}
    >
      <div className="card-icon" style={{ fontSize: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', filter: 'drop-shadow(0 0 12px #fff3)' }}>
        {icon}
      </div>
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
      <button className="button" onClick={onLearnMore}>
        Learn More
      </button>
    </motion.div>
  );
};

Card.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  isFeatured: PropTypes.bool,
  onLearnMore: PropTypes.func.isRequired,
};

Card.defaultProps = {
  isFeatured: false,
};

export default Card; 