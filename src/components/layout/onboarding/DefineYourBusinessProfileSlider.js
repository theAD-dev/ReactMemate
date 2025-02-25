import React from 'react';
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import { Fade } from 'react-slideshow-image';

import 'react-slideshow-image/dist/styles.css';
import login_slider1 from "../../../assets/images/img/emailSlider01.png";
import login_slider2 from "../../../assets/images/img/emailSlider02.png";
import login_slider3 from "../../../assets/images/img/emailSlider03.jpg";


const DefineYourBusinessProfileSlider = () => {
  const fadeImages = [
    {
      url: login_slider2,
      caption: "Elevating Australian Enterprises with Innovative Solutions for Unmatched Growth.",
    },
    {
      url: login_slider1,
      caption: "Empowering Australian Businesses with Cutting-Edge Systems for a Competitive Edge.",
    },
    {
      url: login_slider3,
      caption: "Driving Australian Success: Pioneering Technologies for a Thriving Business Landscape.",
    },

  ];

  const properties = {
    prevArrow: <div>{<ChevronLeft size={20} color="#fff" />}</div>,
    nextArrow: <div>{<ChevronRight size={20} color="#fff" />}</div>,
    autoplay: true,
    infinite: true,
    indicators: true
  };

  return (
    <div className="slide-container">
      <Fade {...properties}>
        {fadeImages.map((fadeImage, index) => (
          <div key={index} style={{ backgroundImage: `url(${fadeImage.url})` }} className='loginSliderImages'>
            <p>{fadeImage.caption}</p>
          </div>
        ))}
      </Fade>
    </div>
  );
};

export default DefineYourBusinessProfileSlider;
