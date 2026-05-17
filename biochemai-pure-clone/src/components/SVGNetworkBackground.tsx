import React from 'react';

interface SVGNetworkBackgroundProps {
  accentColor?: string;
  opacity?: number;
  scale?: number;
  className?: string;
}

/**
 * SVGNetworkBackground Component
 *
 * Renders a parameterized SVG network visualization with theme-aware colors.
 * Positioned absolutely to sit behind content as a background layer.
 *
 * @param accentColor - CSS variable name for the accent color (e.g., '--color-accent-primary')
 * @param opacity - Opacity of the entire SVG (0-1, default: 0.07)
 * @param scale - Scale factor for the SVG (default: 1)
 * @param className - Additional CSS classes to apply
 */
export const SVGNetworkBackground: React.FC<SVGNetworkBackgroundProps> = ({
  accentColor = '--color-accent-primary',
  opacity = 0.07,
  scale = 1,
  className = '',
}) => {
  const accentColorValue = `var(${accentColor})`;

  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: 'center',
      }}
      viewBox="0 0 680 580"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <g stroke={accentColorValue} strokeWidth="1.5" fill="none">
        {/* Top-left cluster */}
        <circle cx="80" cy="80" r="18" />
        <circle cx="80" cy="80" r="6" fill={accentColorValue} />
        <circle cx="160" cy="60" r="12" />
        <circle cx="160" cy="60" r="4" fill={accentColorValue} />
        <circle cx="220" cy="110" r="15" />
        <circle cx="220" cy="110" r="5" fill={accentColorValue} />
        <circle cx="140" cy="150" r="10" />
        <circle cx="140" cy="150" r="3.5" fill={accentColorValue} />
        <circle cx="60" cy="160" r="13" />
        <circle cx="60" cy="160" r="4.5" fill={accentColorValue} />
        <line x1="98" y1="80" x2="148" y2="64" />
        <line x1="172" y1="68" x2="208" y2="100" />
        <line x1="210" y1="122" x2="150" y2="144" />
        <line x1="130" y1="152" x2="73" y2="156" />
        <line x1="65" y1="148" x2="76" y2="94" />

        {/* Top-right cluster */}
        <circle cx="520" cy="100" r="20" />
        <circle cx="520" cy="100" r="7" fill={accentColorValue} />
        <circle cx="590" cy="70" r="14" />
        <circle cx="590" cy="70" r="5" fill={accentColorValue} />
        <circle cx="640" cy="130" r="16" />
        <circle cx="640" cy="130" r="5.5" fill={accentColorValue} />
        <circle cx="600" cy="190" r="11" />
        <circle cx="600" cy="190" r="4" fill={accentColorValue} />
        <circle cx="530" cy="170" r="13" />
        <circle cx="530" cy="170" r="4.5" fill={accentColorValue} />
        <circle cx="470" cy="140" r="10" />
        <circle cx="470" cy="140" r="3.5" fill={accentColorValue} />
        <line x1="540" y1="100" x2="576" y2="76" />
        <line x1="604" y1="76" x2="628" y2="116" />
        <line x1="637" y1="146" x2="608" y2="180" />
        <line x1="590" y1="194" x2="543" y2="174" />
        <line x1="517" y1="183" x2="473" y2="152" />
        <line x1="471" y1="130" x2="504" y2="108" />

        {/* Bottom-left cluster */}
        <circle cx="100" cy="420" r="16" />
        <circle cx="100" cy="420" r="5.5" fill={accentColorValue} />
        <circle cx="170" cy="390" r="12" />
        <circle cx="170" cy="390" r="4" fill={accentColorValue} />
        <circle cx="230" cy="440" r="18" />
        <circle cx="230" cy="440" r="6" fill={accentColorValue} />
        <circle cx="200" cy="510" r="13" />
        <circle cx="200" cy="510" r="4.5" fill={accentColorValue} />
        <circle cx="120" cy="500" r="10" />
        <circle cx="120" cy="500" r="3.5" fill={accentColorValue} />
        <circle cx="60" cy="470" r="14" />
        <circle cx="60" cy="470" r="5" fill={accentColorValue} />
        <line x1="116" y1="420" x2="158" y2="396" />
        <line x1="182" y1="393" x2="215" y2="428" />
        <line x1="236" y1="458" x2="210" y2="497" />
        <line x1="188" y1="512" x2="133" y2="504" />
        <line x1="110" y1="494" x2="68" y2="476" />
        <line x1="62" y1="457" x2="88" y2="433" />

        {/* Bottom-right cluster */}
        <circle cx="580" cy="440" r="14" />
        <circle cx="580" cy="440" r="5" fill={accentColorValue} />
        <circle cx="640" cy="400" r="10" />
        <circle cx="640" cy="400" r="3.5" fill={accentColorValue} />
        <circle cx="660" cy="470" r="16" />
        <circle cx="660" cy="470" r="5.5" fill={accentColorValue} />
        <circle cx="630" cy="530" r="12" />
        <circle cx="630" cy="530" r="4" fill={accentColorValue} />
        <circle cx="555" cy="520" r="14" />
        <circle cx="555" cy="520" r="5" fill={accentColorValue} />
        <line x1="594" y1="440" x2="630" y2="408" />
        <line x1="650" y1="406" x2="657" y2="454" />
        <line x1="657" y1="487" x2="638" y2="518" />
        <line x1="618" y1="532" x2="569" y2="524" />
        <line x1="541" y1="516" x2="568" y2="448" />

        {/* Center hexagon cluster */}
        <g transform="translate(290, 220)">
          <polygon
            points="0,-60 52,-30 52,30 0,60 -52,30 -52,-30"
            stroke={accentColorValue}
            strokeWidth="1.5"
            fill="none"
          />
          <circle cx="0" cy="-60" r="8" />
          <circle cx="0" cy="-60" r="3" fill={accentColorValue} />
          <circle cx="52" cy="-30" r="8" />
          <circle cx="52" cy="-30" r="3" fill={accentColorValue} />
          <circle cx="52" cy="30" r="8" />
          <circle cx="52" cy="30" r="3" fill={accentColorValue} />
          <circle cx="0" cy="60" r="8" />
          <circle cx="0" cy="60" r="3" fill={accentColorValue} />
          <circle cx="-52" cy="30" r="8" />
          <circle cx="-52" cy="30" r="3" fill={accentColorValue} />
          <circle cx="-52" cy="-30" r="8" />
          <circle cx="-52" cy="-30" r="3" fill={accentColorValue} />
          <circle cx="0" cy="0" r="20" strokeDasharray="4 3" />
          <circle cx="0" cy="0" r="5" fill={accentColorValue} />
          <line x1="0" y1="-52" x2="0" y2="-20" />
          <line x1="45" y1="-26" x2="17" y2="-10" />
          <line x1="45" y1="26" x2="17" y2="10" />
          <line x1="0" y1="52" x2="0" y2="20" />
          <line x1="-45" y1="26" x2="-17" y2="10" />
          <line x1="-45" y1="-26" x2="-17" y2="-10" />
          <line x1="26" y1="-45" x2="26" y2="-45" />
          <line x1="52" y1="-30" x2="52" y2="30" />
          <line x1="-52" y1="-30" x2="-52" y2="30" />
          <line x1="26" y1="-45" x2="52" y2="-30" />
          <line x1="26" y1="45" x2="52" y2="30" />
          <line x1="-26" y1="-45" x2="-52" y2="-30" />
          <line x1="-26" y1="45" x2="-52" y2="30" />
        </g>

        {/* Center ellipse cluster */}
        <g transform="translate(400, 300)">
          <ellipse cx="0" cy="0" rx="55" ry="20" transform="rotate(-30)" />
          <ellipse cx="0" cy="0" rx="55" ry="20" transform="rotate(30)" />
          <ellipse cx="0" cy="0" rx="55" ry="20" transform="rotate(90)" />
          <circle cx="0" cy="0" r="10" />
          <circle cx="0" cy="0" r="4" fill={accentColorValue} />
        </g>
      </g>
    </svg>
  );
};
