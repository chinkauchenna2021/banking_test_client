'use client';

import { useEffect, useState } from 'react';

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#0FB4C3] to-[#0a8b96]'>
      <div className='space-y-8 text-center'>
        {/* Animated Logo/Icon */}
        <div className='relative mx-auto h-24 w-24'>
          <div className='absolute inset-0 animate-pulse rounded-full bg-white/20'></div>
          <div
            className='absolute inset-4 animate-pulse rounded-full bg-white/10'
            style={{ animationDelay: '0.2s' }}
          ></div>
          <div className='absolute inset-8 flex items-center justify-center rounded-full bg-white'>
            <span className='text-2xl font-black text-[#0FB4C3]'>F</span>
          </div>
        </div>

        {/* Bank Name with Typing Effect */}
        <div className='overflow-hidden'>
          <h1 className='text-4xl font-black tracking-tight text-white md:text-5xl'>
            <span className='animate-slideIn inline-block'>FIDELITY</span>
          </h1>
          <div className='mx-auto mt-4 h-1 w-32 overflow-hidden bg-white/50'>
            <div className='animate-loadingBar h-full bg-white'></div>
          </div>
        </div>

        {/* Tagline */}
        <p className='animate-fadeIn text-lg font-light tracking-wide text-white/90'>
          Secure Offshore Banking
        </p>
      </div>

      {/* Styles */}
      <style jsx global>{`
        @keyframes slideIn {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes loadingBar {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          70% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.8s ease-out forwards;
        }

        .animate-loadingBar {
          animation: loadingBar 1.8s ease-in-out forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

// 'use client'

// import { useEffect } from 'react'

// export default function Preloader() {
//   useEffect(() => {
//     // Add your preloader JavaScript logic here
//     // This will run when the component mounts
//   }, [])

//   return (
//     <div className="loader-wrap">
//       <div className="preloader">
//         <div className="preloader-close">x</div>
//         <div id="handle-preloader" className="handle-preloader">
//           <div className="animation-preloader">
//             <div className="spinner"></div>
//             <div className="txt-loading ">
//               {['f', 'i', 'd', 'e', 'l', 'i', 't','y'].map((letter, index) => (
//                 <span
//                   key={index}
//                   data-text-preloader={letter}
//                   className="letters-loading"
//                 >
//                   {letter}
//                 </span>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
