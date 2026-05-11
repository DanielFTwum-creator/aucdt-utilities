import React from 'react';

const HeaderIcon: React.FC = () => {
  const bars = [
    { color: '#009B48', dur: '1.2s', begin: '0.1s', values: '5; 60; 20; 45; 5' },
    { color: '#009B48', dur: '1.5s', begin: '0.2s', values: '10; 50; 30; 70; 10' },
    { color: '#FCD116', dur: '1.3s', begin: '0.0s', values: '15; 40; 25; 60; 15' },
    { color: '#FCD116', dur: '1.6s', begin: '0.3s', values: '20; 65; 10; 55; 20' },
    { color: '#CE1126', dur: '1.4s', begin: '0.1s', values: '25; 55; 35; 75; 25' },
    { color: '#CE1126', dur: '1.7s', begin: '0.4s', values: '30; 70; 15; 60; 30' },
  ];

  const barWidth = 10;
  const gap = 4;
  const totalBars = 22;
  const totalWidth = totalBars * (barWidth + gap) - gap;
  const svgHeight = 80;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${totalWidth} ${svgHeight}`}
      className="h-16 w-64"
      aria-labelledby="logoTitle"
      role="img"
    >
      <title id="logoTitle">Animated Equalizer Icon</title>
      <g>
        {Array.from({ length: totalBars }).map((_, i) => {
          const bar = bars[i % bars.length];
          const heightValues = bar.values;
          const yValues = heightValues.split(';').map(h => svgHeight - Number(h)).join(';');
          
          return (
            <rect
              key={i}
              x={i * (barWidth + gap)}
              width={barWidth}
              fill={bar.color}
              rx="2"
            >
              <animate 
                attributeName="height"
                values={heightValues}
                dur={bar.dur}
                begin={`${parseFloat(bar.begin) + (i * 0.05)}s`}
                repeatCount="indefinite" 
              />
              <animate 
                attributeName="y"
                values={yValues}
                dur={bar.dur}
                begin={`${parseFloat(bar.begin) + (i * 0.05)}s`}
                repeatCount="indefinite" 
              />
            </rect>
          );
        })}
      </g>
    </svg>
  );
};

export default HeaderIcon;