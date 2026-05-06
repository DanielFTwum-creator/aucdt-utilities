import React from 'react';

// Enhanced DiagramRendererProps to include new diagram types
interface DiagramRendererProps {
  type: 'right_triangle_abc' | 'angles_on_line' | 'pie_chart_colors' | 'circle_radius' | 'cube_side';
}

export const DiagramRenderer: React.FC<DiagramRendererProps> = ({ type }) => {
    if (!type) return null;
    
    // Enhanced base styles for better visibility and theme integration
    const svgStyle: React.CSSProperties = { stroke: 'var(--text-color)', strokeWidth: 2, fill: 'none', fontFamily: 'sans-serif', width: '100%', height: 'auto', maxWidth: '350px' };
    const textStyle: React.CSSProperties = { fill: 'var(--primary-text-color)', stroke: 'none', fontSize: '22px', textAnchor: 'middle', userSelect: 'none' };
    const labelStyle: React.CSSProperties = { ...textStyle, fill: 'var(--text-color)', fontSize: '20px' };

    switch (type) {
        case 'right_triangle_abc':
            return (
                <div className="w-full flex justify-center items-center my-4">
                    <svg viewBox="0 0 340 300" style={svgStyle}>
                        <polygon points="50,250 290,250 50,50" />
                        {/* Vertex labels */}
                        <text x="300" y="270" style={{...textStyle, textAnchor: 'start'}}>A</text>
                        <text x="40" y="270" style={{...textStyle, textAnchor: 'end'}}>B</text>
                        <text x="40" y="40" style={{...textStyle, textAnchor: 'end'}}>C</text>
                        {/* Side length labels */}
                        <text x="170" y="275" style={labelStyle}>6</text>
                        <text x="25" y="150" style={labelStyle}>8</text>
                        <text x="180" y="140" style={{...labelStyle, fontStyle: 'italic'}}>AC = ?</text>
                        {/* Right angle indicator */}
                        <rect x="50" y="225" width="25" height="25" style={{ fill: 'none', stroke: 'var(--text-color)', strokeWidth: 2 }} />
                    </svg>
                </div>
            );

        case 'angles_on_line':
            return (
                <div className="w-full flex justify-center items-center my-4">
                    <svg viewBox="0 0 450 200" style={svgStyle}>
                        <line x1="20" y1="100" x2="430" y2="100" />
                        <line x1="225" y1="100" x2="380" y2="30" />
                        {/* Arc for 105° angle */}
                        <path d="M 155 100 A 70 70 0 0 0 268.5 49.3" />
                        <text x="185" y="68" style={labelStyle}>105°</text>
                        {/* Arc for 'y' angle */}
                        <path d="M 295 100 A 70 70 0 0 0 268.5 49.3" />
                        <text x="290" y="85" style={{...labelStyle, fontStyle: 'italic'}}>y</text>
                    </svg>
                </div>
            );

        case 'pie_chart_colors':
            const data = [
                { label: 'Red', value: 8, color: '#EF4444' },
                { label: 'Blue', value: 12, color: '#3B82F6' },
                { label: 'Green', value: 5, color: '#22C55E' },
                { label: 'Yellow', value: 7, color: '#F59E0B' }
            ];
            const total = data.reduce((acc, d) => acc + d.value, 0);
            const pieRadius = 85;
            const pieCx = 150;
            const pieCy = 105;
            let startAngle = -90;

            return (
                <div className="w-full flex justify-center items-center my-4">
                    <svg viewBox="0 0 300 240" style={{...svgStyle, strokeWidth: 1, stroke: 'var(--background-color)'}}>
                        <g transform={`translate(${pieCx}, ${pieCy})`}>
                            {data.map(d => {
                                const sliceAngle = (d.value / total) * 360;
                                const endAngle = startAngle + sliceAngle;
                                const startX = pieRadius * Math.cos(Math.PI * startAngle / 180);
                                const startY = pieRadius * Math.sin(Math.PI * startAngle / 180);
                                const endX = pieRadius * Math.cos(Math.PI * endAngle / 180);
                                const endY = pieRadius * Math.sin(Math.PI * endAngle / 180);
                                const largeArcFlag = sliceAngle > 180 ? 1 : 0;
                                const pathData = `M 0,0 L ${startX},${startY} A ${pieRadius},${pieRadius} 0 ${largeArcFlag},1 ${endX},${endY} Z`;
                                startAngle = endAngle;
                                return <path key={d.label} d={pathData} fill={d.color} />;
                            })}
                        </g>
                         {/* Enhanced Legend */}
                         <g transform="translate(10, 200)">
                             {data.map((d, i) => (
                                 <g key={i} transform={`translate(${(i % 2) * 150}, ${Math.floor(i/2) * 25})`}>
                                    <rect width="15" height="15" fill={d.color} rx="3" />
                                    <text x="25" y="12.5" style={{...labelStyle, fontSize: '16px', textAnchor: 'start', fill: 'var(--text-color)'}}>
                                        {`${d.label}: ${d.value}`}
                                    </text>
                                </g>
                            ))}
                        </g>
                    </svg>
                </div>
            );
        
        case 'circle_radius':
            return (
                <div className="w-full flex justify-center items-center my-4">
                    <svg viewBox="0 0 220 220" style={svgStyle}>
                        <circle cx="110" cy="110" r="100" />
                        <line x1="110" y1="110" x2="210" y2="110" style={{ strokeDasharray: '4 4' }} />
                        <circle cx="110" cy="110" r="4" style={{ fill: 'var(--text-color)', stroke: 'none' }} />
                        <text x="160" y="100" style={labelStyle}>r = 5 cm</text>
                    </svg>
                </div>
            );
            
        case 'cube_side':
            return (
                <div className="w-full flex justify-center items-center my-4">
                    <svg viewBox="0 0 200 200" style={svgStyle}>
                        {/* Back square */}
                        <rect x="50" y="50" width="100" height="100" style={{fill: 'var(--card-border-color)', stroke: 'var(--input-border)'}}/>
                        {/* Front square */}
                        <rect x="75" y="25" width="100" height="100" style={{fill: 'var(--background-color)'}}/>
                        {/* Connecting lines */}
                        <line x1="50" y1="50" x2="75" y2="25" />
                        <line x1="150" y1="50" x2="175" y2="25" />
                        <line x1="50" y1="150" x2="75" y2="125" />
                        <line x1="150" y1="150" x2="175" y2="125" />
                        {/* Label */}
                        <text x="125" y="140" style={labelStyle}>4 cm</text>
                    </svg>
                </div>
            );

        default:
            return null;
    }
};