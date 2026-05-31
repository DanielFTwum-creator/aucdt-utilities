import React from 'react';

export const AnimatedMolecularBackground: React.FC = () => {
  // Generate 14 nodes with floating animation
  const nodes = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    cx: 50 + Math.cos((i / 14) * Math.PI * 2) * 35,
    cy: 50 + Math.sin((i / 14) * Math.PI * 2) * 35,
    r: 3 + Math.random() * 2,
    delay: i * 0.4,
    duration: 6 + Math.random() * 4,
    offsetX: -20 + Math.random() * 40,
    offsetY: -20 + Math.random() * 40,
  }));

  // Create connections between nearby nodes
  const connections: Array<[number, number]> = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].cx - nodes[j].cx;
      const dy = nodes[i].cy - nodes[j].cy;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 40) {
        connections.push([i, j]);
      }
    }
  }

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(var(--offset-x), var(--offset-y));
          }
        }

        .molecular-node {
          animation: float linear infinite;
        }
      `}</style>
      <svg
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 1,
          pointerEvents: 'none',
          zIndex: 0,
        }}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <style>{`
            @keyframes float1 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(20px, -15px); } }
            @keyframes float2 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-25px, 18px); } }
            @keyframes float3 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(15px, 22px); } }
            @keyframes float4 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-18px, -20px); } }
            @keyframes float5 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(22px, 16px); } }
            @keyframes float6 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-20px, 22px); } }
            @keyframes float7 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(18px, -18px); } }
            @keyframes float8 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-22px, -15px); } }
            @keyframes float9 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(20px, 20px); } }
            @keyframes float10 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-18px, 18px); } }
            @keyframes float11 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(24px, -12px); } }
            @keyframes float12 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-16px, -22px); } }
            @keyframes float13 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(16px, 20px); } }
            @keyframes float14 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-24px, 14px); } }
          `}</style>
        </defs>

        {/* Connection lines */}
        <g stroke="rgba(124, 58, 237, 0.08)" strokeWidth="0.5" opacity="0.6">
          {connections.map(([i, j]) => (
            <line
              key={`line-${i}-${j}`}
              x1={`${nodes[i].cx}%`}
              y1={`${nodes[i].cy}%`}
              x2={`${nodes[j].cx}%`}
              y2={`${nodes[j].cy}%`}
            />
          ))}
        </g>

        {/* Animated nodes */}
        {nodes.map((node, idx) => (
          <g key={`node-${node.id}`}>
            <circle
              cx={`${node.cx}%`}
              cy={`${node.cy}%`}
              r={node.r}
              fill="rgba(124, 58, 237, 0.15)"
              style={{
                animation: `float${idx + 1} ${node.duration}s ease-in-out ${node.delay}s infinite`,
                transformOrigin: `${node.cx}% ${node.cy}%`,
              }}
            />
            <circle
              cx={`${node.cx}%`}
              cy={`${node.cy}%`}
              r={node.r * 0.6}
              fill="rgba(124, 58, 237, 0.3)"
              style={{
                animation: `float${idx + 1} ${node.duration}s ease-in-out ${node.delay}s infinite`,
                transformOrigin: `${node.cx}% ${node.cy}%`,
              }}
            />
          </g>
        ))}
      </svg>
    </>
  );
};
