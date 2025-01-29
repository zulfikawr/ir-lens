import React from 'react';

const Loading = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="square"></div>
      <div className="square"></div>
      <div className="square"></div>

      <style jsx>{`
        .square {
          width: 32px;
          height: 32px;
          background-color: black;
          animation: bounce 1s infinite ease-in-out;
          margin: 0 8px;
        }

        .square:nth-child(1) {
          animation-delay: 0s;
        }

        .square:nth-child(2) {
          animation-delay: 0.3s;
        }

        .square:nth-child(3) {
          animation-delay: 0.6s;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;
