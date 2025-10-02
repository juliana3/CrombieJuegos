import './GradientText.css';

export default function GradientText({
  children,
  className = '',
  colors = ['#ffff','#C1FF1E', '#FFD200', '#F55B88', '#33D9FF', '#0B9FF9'],
  animationSpeed = 8,
  showBorder = false
}) {
const gradientStyle = {
  backgroundImage: `linear-gradient(to right, ${colors.join(', ')})`,
  '--speed': `${animationSpeed}s`
};


  return (
    <div className={`animated-gradient-text ${className}`}>
      {showBorder && <div className="gradient-overlay" style={gradientStyle}></div>}
      <div className="text-content" style={gradientStyle}>
        {children}
      </div>
    </div>
  );
}
