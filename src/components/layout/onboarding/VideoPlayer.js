import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import Subtract from "../../../assets/images/icon/Subtract.png"
const VideoPlayer = ({ videoUrl, coverImageUrl }) => {
  const [showVideo, setShowVideo] = useState(false);

  const handleClick = () => {
    setShowVideo(true);
  };

  return (
    <div className='SubtractIconPlayflex'>
    <div onClick={handleClick}>
<div className='SubtractIconPlay'>
  <img src={Subtract} alt="Subtract" />
</div>
</div>
        <ReactPlayer
          url={videoUrl}
          playing={true} // Autoplay
          loop={true} // Infinite loop
          controls={true}
          width="100%"
          height="100%"
        />
    </div>
  );
};

export default VideoPlayer;
