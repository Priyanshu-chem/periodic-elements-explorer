'use client';

import { useEffect, useRef } from 'react';

interface ElectronShellProps {
  shellModel: number[];
}

const SHELL_COLORS = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#9b59b6', '#e67e22', '#1abc9c'];

export default function ElectronShell({ shellModel }: ElectronShellProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const totalElectrons = shellModel.reduce((a, b) => a + b, 0);
  const numShells = shellModel.length;
  const size = Math.max(320, numShells * 48);
  const center = size / 2;
  const shellSpacing = size / (numShells + 1.5);
  const nucleusRadius = Math.max(8, Math.min(16, size / 20));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const electronAngles: number[] = [];
    const electronSpeeds: number[] = [];
    shellModel.forEach((count, shellIdx) => {
      for (let i = 0; i < count; i++) {
        electronAngles.push((i / count) * Math.PI * 2 + (shellIdx * 0.5));
        electronSpeeds.push(0.008 + shellIdx * 0.003 + Math.random() * 0.005);
      }
    });

    let running = true;

    function draw() {
      if (!running) return;
      ctx!.clearRect(0, 0, size, size);

      const gradient = ctx!.createRadialGradient(center, center, 0, center, center, size * 0.7);
      gradient.addColorStop(0, 'rgba(20, 20, 40, 0.06)');
      gradient.addColorStop(1, 'rgba(20, 20, 40, 0.02)');
      ctx!.fillStyle = gradient;
      ctx!.fillRect(0, 0, size, size);

      ctx!.save();
      ctx!.beginPath();
      let electronIdx = 0;

      shellModel.forEach((count, shellIdx) => {
        const radius = nucleusRadius + (shellIdx + 1) * shellSpacing;

        ctx!.beginPath();
        ctx!.arc(center, center, radius, 0, Math.PI * 2);
        ctx!.strokeStyle = 'rgba(100, 100, 140, 0.25)';
        ctx!.lineWidth = 1.5;
        ctx!.setLineDash([4, 4]);
        ctx!.stroke();
        ctx!.setLineDash([]);

        ctx!.beginPath();
        ctx!.arc(center, center, radius, 0, Math.PI * 2);
        ctx!.strokeStyle = SHELL_COLORS[shellIdx % SHELL_COLORS.length] + '40';
        ctx!.lineWidth = 1;
        ctx!.stroke();

        for (let i = 0; i < count; i++) {
          const angle = electronAngles[electronIdx] + electronSpeeds[electronIdx] * (Date.now() / 16);
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);

          const grad = ctx!.createRadialGradient(x, y, 0, x, y, 5);
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.3, SHELL_COLORS[shellIdx % SHELL_COLORS.length]);
          grad.addColorStop(1, SHELL_COLORS[shellIdx % SHELL_COLORS.length]);
          ctx!.beginPath();
          ctx!.arc(x, y, 4.5, 0, Math.PI * 2);
          ctx!.fillStyle = grad;
          ctx!.fill();

          ctx!.beginPath();
          ctx!.arc(x, y, 6, 0, Math.PI * 2);
          ctx!.fillStyle = SHELL_COLORS[shellIdx % SHELL_COLORS.length] + '30';
          ctx!.fill();

          electronIdx++;
        }

        const labelAngle = -Math.PI / 4;
        const lx = center + radius * Math.cos(labelAngle);
        const ly = center + radius * Math.sin(labelAngle);
        ctx!.fillStyle = 'rgba(100, 100, 140, 0.5)';
        ctx!.font = '10px sans-serif';
        ctx!.textAlign = 'center';
        ctx!.fillText(`${count}e`, lx, ly);
      });

      const nucleusGrad = ctx!.createRadialGradient(
        center - nucleusRadius * 0.3, center - nucleusRadius * 0.3, 0,
        center, center, nucleusRadius,
      );
      nucleusGrad.addColorStop(0, '#ff8a8a');
      nucleusGrad.addColorStop(0.6, '#ff6b6b');
      nucleusGrad.addColorStop(1, '#cc4444');
      ctx!.beginPath();
      ctx!.arc(center, center, nucleusRadius, 0, Math.PI * 2);
      ctx!.fillStyle = nucleusGrad;
      ctx!.fill();

      ctx!.beginPath();
      ctx!.arc(center, center, nucleusRadius * 0.8, 0, Math.PI * 2);
      ctx!.fillStyle = 'rgba(255,255,255,0.15)';
      ctx!.fill();

      ctx!.fillStyle = '#ffffff';
      ctx!.font = `bold ${Math.max(8, nucleusRadius * 0.9)}px sans-serif`;
      ctx!.textAlign = 'center';
      ctx!.textBaseline = 'middle';
      ctx!.fillText(`+${totalElectrons}`, center, center);

      ctx!.restore();

      animRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      running = false;
      cancelAnimationFrame(animRef.current);
    };
  }, [shellModel, size, center, shellSpacing, nucleusRadius, totalElectrons]);

  return (
    <div className="flex w-full justify-center">
      <canvas
        ref={canvasRef}
        style={{
          width: size,
          height: size,
          maxWidth: '100%',
          borderRadius: '12px',
          background: 'transparent',
        }}
        role="img"
        aria-label={`Electron shell diagram: ${shellModel.join(', ')}`}
      />
    </div>
  );
}
