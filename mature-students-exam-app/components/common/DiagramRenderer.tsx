
import React, { useEffect, useRef } from 'react';
import { DiagramType } from '../../types';
import { COLORS } from '../../constants';
// import Chart from 'chart.js/auto'; // Commented out as libraries are not installed
// import mermaid from 'mermaid'; // Commented out as libraries are not installed

interface DiagramRendererProps {
  type: DiagramType;
  data?: any; // Data for Chart.js or Mermaid
}

export const DiagramRenderer: React.FC<DiagramRendererProps> = ({ type, data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current && (type === 'chartjs_bar' || type === 'chartjs_line')) {
      // Placeholder for Chart.js rendering
      // const chartInstance = new Chart(chartRef.current, data);
      // return () => chartInstance.destroy();
      console.log(`Chart.js rendering for type ${type} with data:`, data);
    }
  }, [type, data]);

  useEffect(() => {
    if (mermaidRef.current && (type === 'mermaid_flowchart' || type === 'mermaid_sequence' || type === 'mermaid_class')) {
      // Placeholder for Mermaid rendering
      // mermaid.render('mermaid-svg', data).then(({ svg }) => {
      //   if (mermaidRef.current) {
      //     mermaidRef.current.innerHTML = svg;
      //   }
      // });
      console.log(`Mermaid rendering for type ${type} with data:`, data);
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = `<pre>${data}</pre>`; // Display raw Mermaid code as fallback
      }
    }
  }, [type, data]);

  if (!type) return null;
  const svgStyle: React.CSSProperties = { stroke: COLORS.aucdtDarkGray, strokeWidth: 1.5, fill: 'none', fontFamily: 'sans-serif', width: '100%', height: 'auto' };
  const textStyle: React.CSSProperties = { fill: COLORS.aucdtDeepBrown, stroke: 'none', textAnchor: 'middle' };

  switch (type) {
    case 'right_triangle_abc':
      return (
        <div className="w-full flex justify-center items-center">
            <svg viewBox="0 0 340 300" style={svgStyle}>
                <polygon points="50,250 290,250 50,50" />
                <text x="295" y="260" style={{...textStyle, fontSize: '24px', textAnchor: 'start'}}>A</text>
                <text x="40" y="265" style={{...textStyle, fontSize: '24px', textAnchor: 'end'}}>B</text>
                <text x="40" y="45" style={{...textStyle, fontSize: '24px', textAnchor: 'end'}}>C</text>
                <text x="170" y="270" style={textStyle}>6</text>
                <text x="25" y="150" style={textStyle}>8</text>
                <text x="170" y="140" style={{...textStyle, fontStyle: 'italic'}}>AC = ?</text>
                <rect x="50" y="225" width="25" height="25" style={{ fill: 'none', stroke: COLORS.aucdtDarkGray, strokeWidth: 1.5 }} />
            </svg>
        </div>
      );
    case 'angles_on_line':
      const vertex_x = 225;
      const vertex_y = 100;
      const diag_end_x = 380;
      const diag_end_y = 30;
      const vec_x = diag_end_x - vertex_x;
      const vec_y = diag_end_y - vertex_y;
      const vec_len = Math.sqrt(vec_x * vec_x + vec_y * vec_y);
      const arc_radius = 70; 
      const p_diag_x = vertex_x + (vec_x / vec_len) * arc_radius;
      const p_diag_y = vertex_y + (vec_y / vec_len) * arc_radius;
      const p_left_x = vertex_x - arc_radius;
      const p_left_y = vertex_y;
      const angle_105_arc_path = `M ${p_diag_x} ${p_diag_y} A ${arc_radius} ${arc_radius} 0 0 0 ${p_left_x} ${p_left_y}`;
      const p_right_x = vertex_x + arc_radius;
      const p_right_y = vertex_y;
      const y_arc_path = `M ${p_right_x} ${p_right_y} A ${arc_radius} ${arc_radius} 0 0 0 ${p_diag_x} ${p_diag_y}`;
      const labelTextStyle = { ...textStyle, fontSize: '20px' };
      return (
          <div className="w-full flex justify-center items-center">
              <svg viewBox="0 0 450 200" style={svgStyle}>
                  <line x1="20" y1={vertex_y} x2="430" y2={vertex_y} />
                  <line x1={vertex_x} y1={vertex_y} x2={diag_end_x} y2={diag_end_y} />
                  <path d={angle_105_arc_path} style={{fill: 'none'}} />
                  <text x="210" y="72" style={labelTextStyle}>105°</text>
                  <path d={y_arc_path} style={{fill: 'none'}} />
                  <text x="285" y="100" style={labelTextStyle}>y</text>
              </svg>
          </div>
      );
    case 'pie_chart_colors':
      const pieData = [
          { label: 'Red', value: 8, color: '#EF4444' },
          { label: 'Blue', value: 12, color: '#3B82F6' },
          { label: 'Green', value: 5, color: '#22C55E' },
          { label: 'Yellow', value: 7, color: '#F59E0B' }
      ];
      const total = pieData.reduce((acc, d) => acc + d.value, 0);
      const pieRadius = 80;
      const pieCx = 150;
      const pieCy = 100;
      let startAngle = -90;
      return (
          <div className="w-full flex justify-center items-center my-4">
              <svg viewBox="0 0 300 240" style={{...svgStyle, strokeWidth: 0}}>
                  <g transform={`translate(${pieCx}, ${pieCy})`}>
                      {pieData.map(d => {
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
                   {pieData.map((d, i) => (
                       <g key={i}>
                          <rect x="10" y={20 * i + 185} width="15" height="15" fill={d.color} />
                          <text x="35" y={20 * i + 198} style={{...textStyle, fontSize: '14px', textAnchor: 'start', fill: COLORS.aucdtDarkGray}}>
                              {`${d.label}: ${d.value}`}
                          </text>
                      </g>
                  ))}
              </svg>
          </div>
      );
    case 'chartjs_bar':
    case 'chartjs_line':
      return (
        <div className="w-full flex justify-center items-center">
          <canvas ref={chartRef} />
        </div>
      );
    case 'mermaid_flowchart':
    case 'mermaid_sequence':
    case 'mermaid_class':
      return (
        <div className="w-full flex justify-center items-center">
          <div ref={mermaidRef} />
        </div>
      );
    default:
      return null;
  }
};
