import React from "react";
import img from '../assets/btn-app-store.webp';
import Img from '../assets/btn-play-store.webp';

const Button = () => {
  return (
    <div className="mt-16 ">
      <a
        href="https://apps.apple.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block"
      >
        <button
          type="button"
          className="inline-block pt-8   "
        >
          <img
            src={img}
            alt="Download on the App Store"
            className="inline-block  h-20 w-690 pr-20 "
          />
        </button>
      </a>
      <a
        href="https://play.google.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block pt-8"
      >
        <button
          type="button"
          className="inline-block   "
        >
          <img
            src={Img}
            alt="Get it on Google Play"
            className="inline-block  h-20 w-690 pr-20 "
          />
        </button>
      </a>
    </div>
  );
};

export default Button;
