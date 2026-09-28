// Concepts:
// useState (current index)
// Modulo % for wrap-around (last → first, first → last)
// map() for the dots
// Active class
// Importing local images (Vite turns each import into a URL)

import { useState } from "react";
import mountains from "./images/mountains.svg";
import beach from "./images/beach.svg";
import forest from "./images/forest.svg";
import cityNight from "./images/city-night.svg";
import "./ImageCarousel.css";

const images = [
  { id: 1, src: mountains, alt: "Purple mountains with snow caps at sunrise", caption: "Mountains" },
  { id: 2, src: beach, alt: "Sunny beach with blue sea and sand", caption: "Beach" },
  { id: 3, src: forest, alt: "Green hills with pine trees", caption: "Forest" },
  { id: 4, src: cityNight, alt: "City skyline at night under the moon", caption: "City at night" },
];

function ImageCarousel() {
  // 1. State
  const [currentIndex, setCurrentIndex] = useState(0);

  // 2. Event handlers
  function goToPrevious() {
    // From the first image go to the last one.
    // "+ images.length" keeps the number positive: (0 - 1 + 4) % 4 = 3
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  }

  function goToNext() {
    // From the last image go back to the first one: (3 + 1) % 4 = 0
    setCurrentIndex((currentIndex + 1) % images.length);
  }

  function goToSlide(index) {
    setCurrentIndex(index);
  }

  // 3. Main logic
  const currentImage = images[currentIndex];

  // 4. JSX
  return (
    <div className="carousel">
      <div className="carousel-frame">
        <img className="carousel-image" src={currentImage.src} alt={currentImage.alt} />

        <button className="carousel-arrow left" onClick={goToPrevious} aria-label="Previous image">
          ‹
        </button>
        <button className="carousel-arrow right" onClick={goToNext} aria-label="Next image">
          ›
        </button>
      </div>

      <p className="carousel-caption">
        {currentImage.caption} · {currentIndex + 1} / {images.length}
      </p>

      <div className="carousel-dots">
        {images.map((image, index) => (
          <button
            key={image.id}
            className={index === currentIndex ? "carousel-dot active" : "carousel-dot"}
            onClick={() => goToSlide(index)}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageCarousel;
