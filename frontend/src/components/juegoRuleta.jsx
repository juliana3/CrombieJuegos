import React, { useRef, useState } from "react";
import "../pages/css/Ruleta.css";

const ruletaColores = [
  "#FF3366", "#33C466", "#FF3366", "#33C466", "#25B1E1", "#25B1E1", "#FFC433", "#FFC433"
];

function JuegoRuleta({ items = [], onSpinEnd }) {
  const ruletaRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const audioRef = useRef(null);
  const clickTimer = useRef(null);

  // 🔊 Precargamos sonido
  if (!audioRef.current) {
    audioRef.current = new Audio("/clack.mp3");
  }

  const playClick = () => {
    const sound = audioRef.current.cloneNode();
    sound.play().catch(() => {});
  };

  const reproducirClicsProgresivos = (duracionTotal = 4500) => {
    let tiempo = 0;
    let intervalo = 60; // más rápido al inicio

    const reproducir = () => {
      playClick();
      tiempo += intervalo;
      intervalo += 15; // se va desacelerando
      if (tiempo < duracionTotal) {
        clickTimer.current = setTimeout(reproducir, intervalo);
      }
    };
    reproducir();
  };

  const spin = () => {
    if (isSpinning || items.length === 0) return;
    setIsSpinning(true);

    const r = Math.random();
    let candidatos;

    // 45% Perdiste, 45% Sorteo, 10% API
    if (r < 0.20) {
      candidatos = items.filter(it => it.nombre === "Perdiste");
    } else if (r < 0.40) {
      candidatos = items.filter(it => it.nombre === "Sorteo");
    } else {
      candidatos = items.filter(it => it.nombre !== "Perdiste" && it.nombre !== "Sorteo");
    }
    
    if (!candidatos.length) candidatos = items;

    const elegido = candidatos[Math.floor(Math.random() * candidatos.length)];
    const min = elegido.min ?? 0;
    const max = elegido.max ?? 360;
    const target = Math.random() * (max - min) + min;

    const vueltas = Math.floor(Math.random() * 3) + 4; // 4..6 vueltas
    const finalRotation = vueltas * 360 + (360 - target);

    // 🎵 Inicia sonido durante todo el giro
    reproducirClicsProgresivos(4000);

    if (ruletaRef.current) {
      ruletaRef.current.style.transition = "transform 4.5s cubic-bezier(0.33, 1, 0.68, 1)";
      ruletaRef.current.style.transform = `rotate(${finalRotation}deg)`;
    }

    // ⏳ Al finalizar el giro:
    setTimeout(() => {
      clearTimeout(clickTimer.current);
      setIsSpinning(false);
      if (onSpinEnd) onSpinEnd(elegido.nombre);
    }, 4700);
  };

  return (
    <div className="ruleta-container" style={{ position: "relative" }}>
      <svg
        viewBox="0 0 700 700"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%' }}
      >
        {/* 1. Grupo del fondo estático */}
        <g id="ruleta-fondo-estatico">
          <path d="M350.625 698.866C157.876 699.269 1.2816 543.354 0.878129 350.619C0.474656 157.885 156.415 1.2819 349.164 0.878393C541.912 0.47489 689.342 147.443 698.461 332.434C698.708 337.967 698.865 343.568 698.877 349.158C698.888 354.748 698.788 360.316 698.531 365.862C690.187 550.856 537.772 698.485 350.625 698.877L350.625 698.866Z" fill="url(#paint0_linear_182_59)"/>
          <path d="M6.27837 350.597C6.67562 540.362 160.835 693.874 350.602 693.477C540.37 693.08 693.885 538.923 693.488 349.159C693.091 159.394 538.931 5.88137 349.164 6.27863C159.396 6.6759 5.88111 160.833 6.27837 350.597Z" fill="url(#paint1_linear_182_59)"/>
          <path d="M53.6155 350.498C53.958 514.119 186.879 646.483 350.503 646.14C514.127 645.797 646.493 512.879 646.15 349.257C645.807 185.636 512.886 53.2724 349.263 53.615C185.639 53.9575 53.2729 186.876 53.6155 350.498Z" fill="url(#paint2_linear_182_59)"/>
        </g>

        {/* 2. Grupo de la ruleta que gira */}
        <g ref={ruletaRef} id="ruleta-dinamica" className="ruleta-dinamica">
          <path d="M144.785 555.832C171.954 582.888 203.123 603.439 236.392 617.523L349.883 349.878L82.7107 464.486C96.9457 497.684 117.627 528.777 144.785 555.832Z" fill="#FF3366"/>
          <path d="M143.925 144.783C116.869 171.952 96.3181 203.121 82.2334 236.389L349.883 349.878L235.273 82.7098C202.075 96.9446 170.981 117.626 143.925 144.783Z" fill="#33C466"/>
          <path d="M554.98 143.923C527.811 116.868 496.642 96.3168 463.373 82.2323L349.883 349.878L617.055 235.269C602.82 202.072 582.138 170.978 554.98 143.923Z" fill="#FF3366"/>
          <path d="M555.841 554.972C582.897 527.803 603.448 496.635 617.533 463.366L349.883 349.878L464.493 617.046C497.692 602.811 528.786 582.129 555.841 554.972Z" fill="#33C466"/>
          <path d="M224.037 611.948C262.29 630.348 305.189 640.623 350.491 640.528C395.794 640.433 438.649 629.979 476.824 611.418C472.748 613.395 468.637 615.27 464.504 617.045L349.894 349.878L236.403 617.523C232.252 615.765 228.134 613.907 224.049 611.948L224.037 611.948Z" fill="#25B1E1"/>
          <path d="M475.728 87.7965C437.475 69.3958 394.577 59.1215 349.274 59.2164C303.972 59.3112 261.128 69.7649 222.941 88.3257C227.018 86.3495 231.128 84.4738 235.261 82.6987L349.872 349.866L463.362 82.2212C467.514 83.9789 471.632 85.8374 475.706 87.7966L475.728 87.7965Z" fill="#25B1E1"/>
          <path d="M611.968 475.71C630.369 437.458 640.644 394.56 640.549 349.258C640.454 303.956 630 261.102 611.439 222.927C613.415 227.004 615.291 231.114 617.066 235.247L349.894 349.855L617.544 463.344C615.786 467.496 613.927 471.614 611.968 475.688L611.968 475.71Z" fill="#FFC433"/>
          <path d="M82.7108 464.486L349.883 349.878L82.2333 236.389C83.9911 232.237 85.8496 228.119 87.8088 224.034C69.4078 262.287 59.1222 305.184 59.217 350.486C59.3119 395.788 69.7658 438.642 88.3268 476.817C86.3505 472.741 84.4748 468.63 82.6997 464.497L82.7108 464.486Z" fill="#FFC433"/>
          {items.map((item, index) => {
            const mid = ((Number(item.min) + Number(item.max)) / 2) % 360;
            const color = ruletaColores[index % ruletaColores.length];
            const textContent = String(item.nombre).toUpperCase();
            const Y_POSITION = 180;

            return (
              <text
                key={String(item.nombre) + index}
                x="350"
                y={Y_POSITION}
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`
                  rotate(${mid} 350 350)
                  translate(170, 170)
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
          <path style={{ mixBlendMode: 'multiply' }} d="M59.2169 350.486C59.553 511.014 189.961 640.875 350.491 640.539C511.022 640.203 640.885 509.797 640.549 349.269C640.213 188.741 509.805 58.8803 349.275 59.2164C188.744 59.5525 58.8809 189.958 59.2169 350.486Z" fill="url(#paint3_radial_182_59)"/>
          <path style={{ mixBlendMode: 'multiply' }} opacity="0.6" d="M287.648 341.981C287.709 371.298 311.526 395.014 340.843 394.953C370.161 394.891 393.878 371.075 393.816 341.758C393.755 312.441 369.938 288.725 340.621 288.786C311.303 288.848 287.587 312.664 287.648 341.981Z" fill="url(#paint4_radial_182_59)"/>
          <path d="M321.617 378.274C337.298 393.89 362.669 393.836 378.284 378.156C393.9 362.475 393.847 337.104 378.166 321.489C362.485 305.874 337.114 305.927 321.498 321.608C305.883 337.289 305.936 362.659 321.617 378.274Z" fill="url(#paint5_linear_182_59)"/>
          <path d="M326.703 377.356C341.876 390.137 364.538 388.198 377.319 373.025C390.101 357.852 388.162 335.191 372.989 322.409C357.816 309.628 335.154 311.567 322.372 326.74C309.591 341.913 311.529 364.574 326.703 377.356Z" fill="url(#paint6_linear_182_59)"/>
          <path d="M371.386 331.951C371.386 330.734 370.392 329.751 369.187 329.751L360.367 329.751C359.15 329.751 358.167 330.745 358.167 331.951C358.167 333.156 359.161 334.15 360.367 334.15L369.187 334.15C370.404 334.15 371.386 333.156 371.386 331.951Z" fill="white"/>
          <path d="M329.888 334.15L351.547 334.15C352.764 334.15 353.746 333.156 353.746 331.951C353.746 330.745 352.753 329.751 351.547 329.751L341.734 329.751C337.112 329.941 333.159 331.404 329.888 334.161L329.888 334.15Z" fill="white"/>
          <path d="M358.156 349.579C358.156 350.796 359.139 351.778 360.356 351.778C361.573 351.778 362.555 350.796 362.555 349.579C362.555 348.362 361.573 347.379 360.356 347.379C359.139 347.379 358.156 348.362 358.156 349.579Z" fill="white"/>
          <path d="M364.844 338.56L355.901 338.56C354.718 338.56 353.758 339.52 353.758 340.704L353.758 340.826C353.758 342.01 354.718 342.97 355.901 342.97L364.844 342.97C366.028 342.97 366.988 342.01 366.988 340.826L366.988 340.704C366.988 339.52 366.028 338.56 364.844 338.56Z" fill="white"/>
          <path d="M349.348 367.207C349.348 365.99 348.354 365.008 347.149 365.008L329.922 365.008C333.193 367.765 337.134 369.228 341.745 369.417L347.149 369.417C348.366 369.417 349.348 368.424 349.348 367.218L349.348 367.207Z" fill="white"/>
          <path d="M369.187 369.406C370.402 369.406 371.387 368.422 371.387 367.207C371.387 365.992 370.402 365.008 369.187 365.008C367.973 365.008 366.988 365.992 366.988 367.207C366.988 368.422 367.973 369.406 369.187 369.406Z" fill="white"/>
          <path d="M355.957 364.997C354.74 364.997 353.758 365.99 353.758 367.196C353.758 368.402 354.751 369.396 355.957 369.396L360.367 369.396C361.584 369.396 362.567 368.402 362.567 367.196C362.567 365.99 361.573 364.997 360.367 364.997L355.957 364.997Z" fill="white"/>
          <path d="M364.777 360.598C365.994 360.598 366.976 359.604 366.976 358.399C366.976 357.193 365.983 356.199 364.777 356.199L323.893 356.199C324.407 357.762 325.099 359.236 326.003 360.609L364.777 360.609L364.777 360.598Z" fill="white"/>
          <path d="M353.758 349.579C353.758 348.362 352.764 347.38 351.558 347.38L323 347.38C322.933 348.094 322.899 348.831 322.899 349.579C322.899 350.327 322.933 351.064 323 351.778L351.558 351.778C352.775 351.778 353.758 350.785 353.758 349.579Z" fill="white"/>
          <path d="M347.137 342.97C348.354 342.97 349.337 341.976 349.337 340.771C349.337 339.565 348.343 338.571 347.137 338.571L325.981 338.571C325.088 339.944 324.396 341.418 323.882 342.981L347.137 342.981L347.137 342.97Z" fill="white"/>
          <path d="M693.495 348.654C693.098 159.15 539.157 5.86187 349.668 6.25855C160.179 6.65523 6.88126 160.587 7.27797 350.091C7.67468 539.594 161.615 692.883 351.105 692.486C540.594 692.089 693.891 538.147 693.495 348.654ZM54.547 349.992C54.205 186.601 186.379 53.8704 349.767 53.5284C499.199 53.2156 622.974 163.741 643.304 307.618L602.06 349.024L643.432 390.223C623.57 534.029 500.326 644.904 351.006 645.216C187.618 645.558 54.8891 513.382 54.547 349.992Z" fill="url(#paint7_linear_182_59)"/>
        </g>
        
        <defs>
          <linearGradient id="paint0_linear_182_59" x1="349.152" y1="0.878416" x2="350.614" y2="698.866" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E84564"/>
            <stop offset="0.39" stopColor="#FBC136"/>
            <stop offset="0.7" stopColor="#4EB066"/>
            <stop offset="1" stopColor="#25AFDF"/>
          </linearGradient>
          <linearGradient id="paint1_linear_182_59" x1="584.052" y1="583.054" x2="89.3821" y2="90.4535" gradientUnits="userSpaceOnUse">
            <stop stopColor="#000604"/>
            <stop offset="0.4" stopColor="#303030"/>
            <stop offset="1" stopColor="#000604"/>
          </linearGradient>
          <linearGradient id="paint2_linear_182_59" x1="546.099" y1="152.841" x2="159.217" y2="541.352" gradientUnits="userSpaceOnUse">
            <stop stopColor="#25AFDF"/>
            <stop offset="0.33" stopColor="#4EB066"/>
            <stop offset="0.65" stopColor="#FBC136"/>
            <stop offset="1" stopColor="#E84564"/>
          </linearGradient>
          <radialGradient id="paint3_radial_182_59" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(349.883 349.878) rotate(89.8801) scale(290.662 290.667)">
            <stop offset="0.81" stopColor="white"/>
            <stop offset="0.87" stopColor="#FCFCFD"/>
            <stop offset="0.91" stopColor="#F3F4F6"/>
            <stop offset="0.94" stopColor="#E9ECF0"/>
            <stop offset="0.97" stopColor="#B9C3CE"/>
            <stop offset="1" stopColor="#899BAD"/>
          </radialGradient>
          <radialGradient id="paint4_radial_182_59" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(340.732 341.869) rotate(89.8801) scale(53.0834 53.0843)">
            <stop offset="0.63" stopColor="#662E29"/>
            <stop offset="0.66" stopColor="#75423E"/>
            <stop offset="0.78" stopColor="#AF9290"/>
            <stop offset="0.88" stopColor="#DACDCB"/>
            <stop offset="0.96" stopColor="#F4F1F0"/>
            <stop offset="1" stopColor="white"/>
          </radialGradient>
          <linearGradient id="paint5_linear_182_59" x1="375.792" y1="323.879" x2="315.189" y2="384.726" gradientUnits="userSpaceOnUse">
            <stop stopColor="#25AFDF"/>
            <stop offset="0.33" stopColor="#4EB066"/>
            <stop offset="0.65" stopColor="#FBC136"/>
            <stop offset="1" stopColor="#E84564"/>
          </linearGradient>
          <linearGradient id="paint6_linear_182_59" x1="379.72" y1="379.624" x2="307.111" y2="307.317" gradientUnits="userSpaceOnUse">
            <stop offset="0.28" stopColor="#303030"/>
            <stop offset="1" stopColor="#000604"/>
          </linearGradient>
          <linearGradient id="paint7_linear_182_59" x1="592.498" y1="106.252" x2="108.278" y2="592.496" gradientUnits="userSpaceOnUse">
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