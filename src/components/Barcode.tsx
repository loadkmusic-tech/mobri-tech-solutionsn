import React from 'react';

interface BarcodeProps {
  value: string;
  height?: number;
  className?: string;
}

export const Barcode: React.FC<BarcodeProps> = ({ value, height = 40, className = '' }) => {
  // Deterministic bar widths generated from string characters
  const bars: { width: number; isSpace: boolean }[] = [];
  const cleanVal = (value || '351555817172073').replace(/[^a-zA-Z0-9]/g, '');

  for (let i = 0; i < cleanVal.length; i++) {
    const charCode = cleanVal.charCodeAt(i);
    const w1 = (charCode % 3) + 1.2;
    const s1 = ((charCode >> 1) % 2) + 1;
    const w2 = ((charCode >> 2) % 3) + 1.2;
    const s2 = ((charCode >> 3) % 2) + 1;
    bars.push({ width: w1, isSpace: false });
    bars.push({ width: s1, isSpace: true });
    bars.push({ width: w2, isSpace: false });
    bars.push({ width: s2, isSpace: true });
  }

  let totalWidth = 0;
  bars.forEach((b) => (totalWidth += b.width));

  let currentX = 0;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg
        viewBox={`0 0 ${Math.max(totalWidth, 180)} ${height}`}
        className="w-full max-w-[280px]"
        preserveAspectRatio="none"
      >
        {bars.map((bar, idx) => {
          const x = currentX;
          currentX += bar.width;
          if (bar.isSpace) return null;
          return (
            <rect
              key={idx}
              x={x}
              y={0}
              width={bar.width}
              height={height}
              fill="currentColor"
            />
          );
        })}
      </svg>
      <span className="text-[11px] font-mono tracking-widest text-slate-500 mt-1">
        * {value} *
      </span>
    </div>
  );
};
