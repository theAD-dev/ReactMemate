import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import Subtract from "../../../assets/images/icon/Subtract.png"
import OnBoardingMain from "../../../assets/images/img/onboardingmain.png"
const VideoPlayer = ({ videoUrl, coverImageUrl }) => {
  const [showVideo, setShowVideo] = useState(false);

  const handlePlayClick = () => {
    setShowVideo(true);  
  };

  return (

<div className="video-player-container SubtractIconPlayflex" style={{ position: 'relative' }}>
{!showVideo && (
  <div onClick={handlePlayClick} className="cover-image-container" style={{ cursor: 'pointer' }}>
      <img src={OnBoardingMain} alt="Cover" className="cover-image" style={{width:"100%", height:"100vh" , objectFit: 'cover'}}/>
    <div className="play-button-overlay" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
    <img src={Subtract} alt="Subtract" />
    </div>
  </div>
)}

{showVideo && (
  <ReactPlayer
    url={videoUrl}
    playing={true}
    loop={true}
    controls={true}
    width="100%"
    height="100%"
  />
)}
</div>




  );
};

export default VideoPlayer;
