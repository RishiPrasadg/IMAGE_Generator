import React, { useState, useRef } from 'react';
import './ImageGenerator.css';
import default_image from '../assets/default_image.png';

function ImageGenerator() {

  const [image_url, setImagae_url] = useState("/");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef("");

  const imageGenerator = async () => {
    const prompt = inputRef.current.value;
    if (!prompt) return;

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (data.error) {
        alert("Error: " + data.error);
        setLoading(false);
        return;
      }

      setImagae_url(`data:image/png;base64,${data.image}`);

    } catch (err) {
      alert("Backend error: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className='ai-image-generator'>
      <div className="header">Ai Image <span>generator</span></div>

      <div className="img-loading">
        <div className="image">
          <img src={image_url === "/" ? default_image : image_url} alt="" />

          {loading && (
            <div className="loading">
              <div className="loading-bar-full"></div>
              <div className="loading-text">Loading...</div>
            </div>
          )}
        </div>
      </div>

      <div className="search-box">
        <input 
          type="text" 
          ref={inputRef} 
          className="search-input" 
          placeholder='Describe what you want to see' 
        />
        
        <div className="generate-btn" onClick={imageGenerator}>
          Generate
        </div>
      </div>
    </div>
  );
}

export default ImageGenerator;
