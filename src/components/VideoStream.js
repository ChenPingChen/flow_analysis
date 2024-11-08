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
    <div className="space-y-4">
      <div className="relative">
        {videoUrl ? (
          <video
            ref={videoRef}
            className="w-full h-auto rounded-lg shadow-lg"
            controls
            autoPlay
            src={videoUrl}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="w-full h-[400px] bg-gray-200 rounded-lg shadow-lg flex items-center justify-center">
            <p className="text-gray-500">等待影像輸入...</p>
          </div>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <button
          onClick={captureFrame}
          className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Edit Regions
        </button>
      </div>
    </div>
  );
}

export default VideoStream;