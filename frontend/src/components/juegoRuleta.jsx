import React, { useRef, useState } from "react";
import "./Ruleta.css";

const ruletaColores = [
  "#FF3366", "#33C466", "#FF3366", "#33C466", "#25B1E1", "#25B1E1", "#FFC433", "#FFC433"
];

function JuegoRuleta({ items = [], onSpinEnd }) {
  const ruletaRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const degrees = Math.floor(Math.random() * 3600) + 720;
    ruletaRef.current.style.transform = `rotate(${degrees}deg)`;

    setTimeout(() => {
      setIsSpinning(false);
      const finalAngle = degrees % 360;
      const segmentAngle = 360 / items.length;
      const selectedItem = items.find(item => {
        return finalAngle >= item.angulo && finalAngle < item.angulo + segmentAngle;
      });
      if (selectedItem) {
        onSpinEnd(selectedItem.nombre);
      }
    }, 5000);
  };

  return (
    <div className="ruleta-container">
      <svg
        width="700"
        height="700"
        viewBox="0 0 700 700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 1. Grupo del fondo estático */}
        <g id="ruleta-fondo-estatico">
          <path d="M699.989 349.983C699.989 543.285 543.298 700 350.011 700C156.724 700 0 543.285 0 349.983C0 156.682 147.698 9.13809 333.238 0.381221C338.788 0.145761 344.405 0 350.011 0C355.617 0 361.201 0.112124 366.762 0.381221C552.268 9.13809 700 162.299 700 349.983H699.989Z" fill="url(#paint0_linear_95_701)"/>
          <path d="M350 694.584C540.309 694.584 694.584 540.306 694.584 349.994C694.584 159.682 540.309 5.4043 350 5.4043C159.691 5.4043 5.41559 159.682 5.41559 349.994C5.41559 540.306 159.691 694.584 350 694.584Z" fill="url(#paint1_linear_95_701)"/>
          <path d="M350 647.111C514.09 647.111 647.112 514.087 647.112 349.994C647.112 185.901 514.09 52.8774 350 52.8774C185.91 52.8774 52.888 185.901 52.888 349.994C52.888 514.087 185.91 647.111 350 647.111Z" fill="url(#paint2_linear_95_701)"/>
        </g>
        
        {/* 2. Grupo de la ruleta que gira */}
        <g ref={ruletaRef} id="ruleta-dinamica" className="ruleta-dinamica">          <path d="M556.114 556.112C583.303 528.922 603.979 497.706 618.173 464.372L350 349.994L464.376 618.172C497.698 603.966 528.924 583.29 556.114 556.112Z" fill="#FF3366"/>
          <path d="M143.886 556.112C171.076 583.302 202.29 603.977 235.624 618.172L350 349.994L81.8266 464.372C96.0325 497.695 116.708 528.922 143.886 556.112Z" fill="#33C466"/>
          <path d="M143.886 143.877C116.697 171.067 96.0213 202.283 81.8266 235.617L350 349.995L235.624 81.8169C202.302 96.023 171.076 116.699 143.886 143.877Z" fill="#FF3366"/>
          <path d="M556.114 143.877C528.924 116.687 497.71 96.0118 464.376 81.8169L350 349.995L618.173 235.617C603.968 202.294 583.292 171.067 556.114 143.877Z" fill="#33C466"/>
          <path d="M612.556 476.75C631.09 438.426 641.484 395.427 641.484 349.994C641.484 304.562 631.09 261.562 612.556 223.239C614.529 227.331 616.402 231.457 618.173 235.606L350 349.983L618.173 464.361C616.402 468.521 614.529 472.647 612.556 476.739V476.75Z" fill="#25B1E1"/>
          <path d="M87.4328 223.239C68.8991 261.562 58.5053 304.562 58.5053 349.994C58.5053 395.427 68.8991 438.415 87.4328 476.75C85.4595 472.658 83.587 468.532 81.8155 464.383L349.989 350.006L81.8155 235.628C83.587 231.468 85.4595 227.342 87.4328 223.261V223.239Z" fill="#25B1E1"/>
          <path d="M476.743 87.4228C438.419 68.8888 395.421 58.4949 349.989 58.4949C304.557 58.4949 261.558 68.8888 223.235 87.4228C227.327 85.4494 231.453 83.577 235.602 81.8054L349.978 349.983L464.353 81.8054C468.513 83.577 472.639 85.4494 476.72 87.4228H476.743Z" fill="#FFC433"/>
          <path d="M464.376 618.172L350 349.994L235.624 618.172C231.465 616.401 227.339 614.528 223.246 612.555C261.569 631.089 304.568 641.494 350 641.494C395.432 641.494 438.431 631.1 476.754 612.566C472.661 614.539 468.535 616.412 464.387 618.183L464.376 618.172Z" fill="#FFC433"/>
          {items.map((item, index) => {
            const segmentAngle = 360 / items.length;
            const textMidRotation = item.angulo + segmentAngle / 2;

            const color = ruletaColores[index]; 
            const textContent = item.nombre.toUpperCase();

            const Y_POSITION = 180;

            return (
              <text
                key={item.nombre + index}
                x="350"
                y={Y_POSITION} 
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`
                  rotate(${textMidRotation} 350 350)
                  translate(0, ${-textRadius})
                  rotate(-${textMidRotation})
                `}
                className="ruleta-texto-categoria"
                fill={color}
              >
                {textContent.split('\n').map((line, lineIndex) => (
                  <tspan 
                    key={lineIndex} 
                    x="350"
                    dy={lineIndex === 0 ? "0" : "1.2em"}
                  >
                    {line}
                  </tspan>
                ))}
              </text>
            );
          })}
        </g>
        
        {/* 3. Grupo del centro y marcador estático */}
        <g id="ruleta-centro-estatico">
          <path style={{ mixBlendMode: 'multiply' }} d="M350 641.494C510.988 641.494 641.495 510.985 641.495 349.994C641.495 189.004 510.988 58.4949 350 58.4949C189.012 58.4949 58.5053 189.004 58.5053 349.994C58.5053 510.985 189.012 641.494 350 641.494Z" fill="url(#paint3_radial_95_701)"/>
          <path style={{ mixBlendMode: 'multiply' }} opacity="0.6" d="M341.95 412.391C371.351 412.391 395.185 388.556 395.185 359.155C395.185 329.753 371.351 305.918 341.95 305.918C312.548 305.918 288.714 329.753 288.714 359.155C288.714 388.556 312.548 412.391 341.95 412.391Z" fill="url(#paint4_radial_95_701)"/>
          <path d="M378.418 378.401C394.111 362.708 394.111 337.265 378.418 321.571C362.725 305.878 337.282 305.878 321.589 321.571C305.896 337.265 305.896 362.708 321.589 378.401C337.282 394.094 362.725 394.094 378.418 378.401Z" fill="url(#paint5_linear_95_701)"/>
          <path d="M377.508 373.299C390.357 358.109 388.461 335.379 373.271 322.528C358.081 309.678 335.351 311.575 322.501 326.765C309.651 341.955 311.548 364.686 326.738 377.536C341.927 390.386 364.658 388.489 377.508 373.299Z" fill="url(#paint6_linear_95_701)"/>
          <path d="M370.118 331.81C370.118 330.59 369.122 329.604 367.913 329.604H359.067C357.847 329.604 356.862 330.601 356.862 331.81C356.862 333.019 357.858 334.016 359.067 334.016H367.913C369.133 334.016 370.118 333.019 370.118 331.81Z" fill="white"/>
          <path d="M328.501 334.016H350.222C351.443 334.016 352.428 333.019 352.428 331.81C352.428 330.601 351.431 329.604 350.222 329.604H340.381C335.745 329.795 331.782 331.262 328.501 334.027V334.016Z" fill="white"/>
          <path d="M356.851 349.489C356.851 350.709 357.836 351.694 359.056 351.694C360.277 351.694 361.262 350.709 361.262 349.489C361.262 348.268 360.277 347.283 359.056 347.283C357.836 347.283 356.851 348.268 356.851 349.489Z" fill="white"/>
          <path d="M363.557 338.438H354.589C353.402 338.438 352.439 339.401 352.439 340.588V340.711C352.439 341.898 353.402 342.861 354.589 342.861H363.557C364.744 342.861 365.707 341.898 365.707 340.711V340.588C365.707 339.401 364.744 338.438 363.557 338.438Z" fill="white"/>
          <path d="M348.017 367.167C348.017 365.947 347.02 364.962 345.811 364.962H328.535C331.815 367.727 335.768 369.194 340.392 369.384H345.811C347.031 369.384 348.017 368.388 348.017 367.179V367.167Z" fill="white"/>
          <path d="M367.913 369.373C369.131 369.373 370.118 368.385 370.118 367.167C370.118 365.949 369.131 364.962 367.913 364.962C366.694 364.962 365.707 365.949 365.707 367.167C365.707 368.385 366.694 369.373 367.913 369.373Z" fill="white"/>
          <path d="M354.645 364.951C353.424 364.951 352.439 365.947 352.439 367.156C352.439 368.366 353.436 369.362 354.645 369.362H359.067C360.288 369.362 361.273 368.366 361.273 367.156C361.273 365.947 360.277 364.951 359.067 364.951H354.645Z" fill="white"/>
          <path d="M363.49 360.539C364.71 360.539 365.696 359.543 365.696 358.334C365.696 357.125 364.699 356.128 363.49 356.128H322.489C323.004 357.696 323.698 359.174 324.605 360.551H363.49V360.539Z" fill="white"/>
          <path d="M352.439 349.489C352.439 348.268 351.443 347.283 350.233 347.283H321.593C321.526 348 321.492 348.738 321.492 349.489C321.492 350.239 321.526 350.978 321.593 351.694H350.233C351.454 351.694 352.439 350.698 352.439 349.489Z" fill="white"/>
          <path d="M345.8 342.861C347.02 342.861 348.005 341.864 348.005 340.655C348.005 339.446 347.009 338.449 345.8 338.449H324.583C323.687 339.826 322.993 341.304 322.478 342.872H345.8V342.861Z" fill="white"/>
          <path d="M349.494 5.39648C159.447 5.39648 5.39655 159.456 5.39655 349.489C5.39655 539.521 159.447 693.581 349.494 693.581C539.541 693.581 693.592 539.521 693.592 349.489C693.592 159.456 539.53 5.39648 349.494 5.39648ZM349.494 646.176C185.636 646.176 52.8019 513.345 52.8019 349.489C52.8019 199.628 163.903 75.7309 308.236 55.6449L349.673 97.0932L391.078 55.6897C535.253 75.91 646.187 199.74 646.187 349.489C646.187 513.345 513.353 646.176 349.494 646.176Z" fill="url(#paint7_linear_95_701)"/>
        </g>
        
        <defs>
          <linearGradient id="paint0_linear_95_701" x1="0" y1="349.994" x2="699.989" y2="349.994" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E84564"/>
            <stop offset="0.39" stopColor="#FBC136"/>
            <stop offset="0.7" stopColor="#4EB066"/>
            <stop offset="1" stopColor="#25AFDF"/>
          </linearGradient>
          <linearGradient id="paint1_linear_95_701" x1="584.335" y1="115.644" x2="89.2861" y2="610.697" gradientUnits="userSpaceOnUse">
            <stop stopColor="#000604"/>
            <stop offset="0.4" stopColor="#303030"/>
            <stop offset="1" stopColor="#000604"/>
          </linearGradient>
          <linearGradient id="paint2_linear_95_701" x1="152.811" y1="152.802" x2="541.623" y2="541.608" gradientUnits="userSpaceOnUse">
            <stop stopColor="#25AFDF"/>
            <stop offset="0.33" stopColor="#4EB066"/>
            <stop offset="0.65" stopColor="#FBC136"/>
            <stop offset="1" stopColor="#E84564"/>
          </linearGradient>
          <radialGradient id="paint3_radial_95_701" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(350 349.994) scale(291.495 291.499)">
            <stop offset="0.81" stopColor="white"/>
            <stop offset="0.87" stopColor="#FCFCFD"/>
            <stop offset="0.91" stopColor="#F3F4F6"/>
            <stop offset="0.94" stopColor="#E9ECF0"/>
            <stop offset="0.97" stopColor="#B9C3CE"/>
            <stop offset="1" stopColor="#899BAD"/>
          </radialGradient>
          <radialGradient id="paint4_radial_95_701" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(341.95 359.155) scale(53.2355 53.2364)">
            <stop offset="0.63" stopColor="#662E29"/>
            <stop offset="0.66" stopColor="#75423E"/>
            <stop offset="0.78" stopColor="#AF9290"/>
            <stop offset="0.88" stopColor="#DACDCB"/>
            <stop offset="0.96" stopColor="#F4F1F0"/>
            <stop offset="1" stopColor="white"/>
          </radialGradient>
          <linearGradient id="paint5_linear_95_701" x1="323.981" y1="323.957" x2="384.875" y2="384.861" gradientUnits="userSpaceOnUse">
            <stop stopColor="#25AFDF"/>
            <stop offset="0.33" stopColor="#4EB066"/>
            <stop offset="0.65" stopColor="#FBC136"/>
            <stop offset="1" stopColor="#E84564"/>
          </linearGradient>
          <linearGradient id="paint6_linear_95_701" x1="379.894" y1="320.134" x2="307.227" y2="392.8" gradientUnits="userSpaceOnUse">
            <stop offset="0.28" stopColor="#303030"/>
            <stop offset="1" stopColor="#000604"/>
          </linearGradient>
          <linearGradient id="paint7_linear_95_701" x1="106.186" y1="106.173" x2="592.806" y2="592.801" gradientUnits="userSpaceOnUse">
            <stop stopColor="#000604"/>
            <stop offset="0.4" stopColor="#303030"/>
            <stop offset="1" stopColor="#000604"/>
          </linearGradient>
        </defs>
      </svg>
      <button 
        onClick={spin} 
        disabled={isSpinning} 
        className="ruleta-boton-centro"
      >
      </button>
    </div>
  );
}

export default JuegoRuleta;
