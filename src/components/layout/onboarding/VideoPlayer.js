import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';

const CustomVideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef();

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16 / 9',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        backgroundColor: '#000',
      }}
      onClick={togglePlayPause}
    >
      <ReactPlayer
        ref={playerRef}
        url="https://memate-website.s3.ap-southeast-2.amazonaws.com/assets/video/memate-intro-full.mp4"
        width="100%"
        height="100%"
        playing={isPlaying}
        controls={false}
        muted={false}
        playsinline
      />
      {!isPlaying && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 2,
            width: '72px',
            height: '72px',
            backgroundColor: 'rgba(255, 255, 255, 0.30)',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="17" viewBox="0 0 14 17" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M3.82505 0.81934C3.83452 0.825655 3.84402 0.831991 3.85356 0.838346L12.2115 6.41028C12.4533 6.57147 12.6775 6.72093 12.8497 6.85981C13.0295 7.00475 13.2413 7.20574 13.3633 7.49977C13.5244 7.88841 13.5244 8.32518 13.3633 8.71382C13.2413 9.00785 13.0295 9.20884 12.8497 9.35378C12.6775 9.49265 12.4533 9.6421 12.2115 9.80328L3.82508 15.3942C3.52948 15.5913 3.26367 15.7686 3.03813 15.8908C2.81243 16.0131 2.50262 16.1529 2.14103 16.1313C1.67852 16.1037 1.25126 15.875 0.971722 15.5055C0.753184 15.2166 0.697634 14.8813 0.674211 14.6257C0.650804 14.3702 0.650826 14.0507 0.65085 13.6955L0.650851 2.55238C0.650851 2.54093 0.650851 2.5295 0.65085 2.51812C0.650826 2.16285 0.650804 1.84339 0.674211 1.58793C0.697634 1.33229 0.753184 0.996983 0.971722 0.708097C1.25126 0.338579 1.67852 0.109917 2.14103 0.0823014C2.50262 0.0607115 2.81243 0.200484 3.03813 0.322801C3.26367 0.445029 3.52946 0.622251 3.82505 0.81934Z" fill="white" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default CustomVideoPlayer;
