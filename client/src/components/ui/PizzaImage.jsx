import PropTypes from 'prop-types';
import { useState } from 'react';
import { FaPizzaSlice } from 'react-icons/fa';

// Pizza images are external URLs (seed data points at Unsplash) that can
// 404 at any time — a bare <img> then shows the browser's broken-image
// icon and alt text, which looks broken to a real user. Falls back to a
// simple placeholder instead of failing visibly.
function PizzaImage({ src, alt, className }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-neutral-100 text-neutral-300 ${className || ''}`}
      >
        <FaPizzaSlice className="text-4xl" />
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />;
}

PizzaImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default PizzaImage;
