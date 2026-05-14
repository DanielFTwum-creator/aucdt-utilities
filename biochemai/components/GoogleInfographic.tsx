import React from 'react';

interface InfographicStep {
  icon: string;
  label: string;
  emphasis?: boolean;
}

interface GoogleInfographicProps {
  title: string;
  steps: InfographicStep[];
}

export const GoogleInfographic: React.FC<GoogleInfographicProps> = ({ title, steps }) => {
  const stepCount = steps.length;

  // Calculate cx positions based on step count
  const getCxPositions = (count: number): number[] => {
    const positions: Record<number, number[]> = {
      2: [210, 430],
      3: [190, 340, 490],
      4: [160, 280, 400, 520],
    };
    return positions[count] || [340]; // Default to center if not predefined
  };

  const cxPositions = getCxPositions(stepCount);
  const viewBoxHeight = 260;

  return (
    <svg
      width="100%"
      viewBox={`0 0 680 ${viewBoxHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      className="my-6"
    >
      <defs>
        <filter id="pill-shadow" x="-10%" y="-30%" width="120%" height="160%">
          <feDropShadow
            dx="0"
            dy="1"
            stdDeviation="2"
            floodColor="#000"
            floodOpacity="0.10"
          />
        </filter>
      </defs>

      {/* Container */}
      <rect
        x="40"
        y="52"
        width="600"
        height="185"
        rx="20"
        fill="#C9D9F0"
        fillOpacity="0.55"
      />

      {/* Title pill */}
      <rect
        x={340 - 130}
        y="32"
        width="260"
        height="38"
        rx="19"
        fill="white"
        filter="url(#pill-shadow)"
      />
      <text
        x="340"
        y="56"
        textAnchor="middle"
        fontFamily="'Google Sans', sans-serif"
        fontSize="15"
        fontWeight="500"
        fill="#1A1A1A"
      >
        {title}
      </text>

      {/* Steps */}
      {steps.map((step, index) => {
        const cx = cxPositions[index] || 340;
        const r = 36;
        const isEmphasis = step.emphasis || (stepCount === 1 && index === 0);
        const circleColor = isEmphasis ? '#4285F4' : '#FFFFFF';
        const iconColor = isEmphasis ? '#FFFFFF' : '#4285F4';

        const labelLines = step.label.split('\n');
        const labelY1 = 192;
        const labelY2 = 208;

        return (
          <g key={index}>
            {/* Circle */}
            <circle cx={cx} cy="132" r={r} fill={circleColor} />

            {/* Icon emoji/text */}
            <text
              x={cx}
              y="145"
              textAnchor="middle"
              fontSize="28"
              fill={iconColor}
              fontWeight="bold"
            >
              {step.icon}
            </text>

            {/* Label line 1 */}
            <text
              x={cx}
              y={labelY1}
              textAnchor="middle"
              fontFamily="'Google Sans', sans-serif"
              fontSize="13"
              fontWeight="400"
              fill="#3C3C3C"
            >
              {labelLines[0]}
            </text>

            {/* Label line 2 (if exists) */}
            {labelLines[1] && (
              <text
                x={cx}
                y={labelY2}
                textAnchor="middle"
                fontFamily="'Google Sans', sans-serif"
                fontSize="13"
                fontWeight="400"
                fill="#3C3C3C"
              >
                {labelLines[1]}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};
