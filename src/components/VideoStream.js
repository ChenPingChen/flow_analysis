import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function VideoStream() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedFrame, setCapturedFrame] = useState(null);
  
  const [videoUrl, setVideoUrl] = useState('');
  
  useEffect(() => {
    // 這裡可以從後端 API 獲取視頻源
    // 暫時留空，等待實際視頻源接入
  }, []);

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth || 800;
      canvas.height = video.videoHeight || 600;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const frameDataURL = canvas.toDataURL('image/jpeg');
      setCapturedFrame(frameDataURL);
      
      navigate('/edit', { state: { frameDataURL } });
    } else {
      navigate('/edit');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
        {videoUrl ? (
          <video
            ref={videoRef}
            className="w-full h-auto rounded-lg"
            controls
            autoPlay
            src={videoUrl}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 text-lg">Waiting for video input...</p>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
        <button
          onClick={captureFrame}
          className="absolute top-4 right-4 bg-indigo-600 text-white px-6 py-2 rounded-lg 
                   hover:bg-indigo-700 transition-colors duration-200 shadow-md
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Edit Regions
        </button>
      </div>
    </div>
  );
}

export default VideoStream;