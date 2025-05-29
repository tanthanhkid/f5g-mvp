'use client';

import React, { useEffect, useRef } from 'react';

const TestCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 400;

    console.log('Drawing test canvas');

    // Clear and draw background
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw test circle
    ctx.beginPath();
    ctx.arc(200, 200, 50, 0, Math.PI * 2);
    ctx.fillStyle = '#8b5cf6';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TEST', 200, 200);

    // Draw more circles
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(100 + i * 120, 100, 30 + i * 10, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${i * 60}, 70%, 50%)`;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = 'white';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(`${(i + 1) * 5}%`, 100 + i * 120, 100);
    }

  }, []);

  return (
    <div className="w-full bg-gray-900 rounded-2xl p-6">
      <h3 className="text-2xl font-bold text-white mb-4">🧪 Test Canvas</h3>
      <div className="w-full h-[400px] bg-gray-800 rounded-xl">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            backgroundColor: '#1f2937'
          }}
        />
      </div>
    </div>
  );
};

export default TestCanvas; 