// app/components/Preloader.tsx
'use client'

import { useEffect } from 'react'

export default function Preloader() {
  useEffect(() => {
    // Add your preloader JavaScript logic here
    // This will run when the component mounts
  }, [])

  return (
    <div className="loader-wrap">
      <div className="preloader">
        <div className="preloader-close">x</div>
        <div id="handle-preloader" className="handle-preloader">
          <div className="animation-preloader">
            <div className="spinner"></div>
            <div className="txt-loading">
              {['f', 'i', 'n', 'b', 'a', 'N', 'k'].map((letter, index) => (
                <span 
                  key={index} 
                  data-text-preloader={letter} 
                  className="letters-loading"
                >
                  {letter}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}