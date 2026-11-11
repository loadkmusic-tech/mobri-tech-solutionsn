import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  creditText?: string;
  onOpenBranding?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  creditText = 'ALL RIGHT REVOLVED BY MPENDO DIGITAL AGENCY',
  onOpenBranding,
}) => {
  return (
    <footer className="pt-6 pb-8 px-6 text-center select-none space-y-2">
      <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium">
        <span>Field Receipt System</span>
        <span>•</span>
        <span>Uganda Operations</span>
      </div>

      <div className="inline-block">
        <p className="text-[11px] sm:text-xs font-black tracking-wider uppercase text-slate-900 bg-amber-100/60 hover:bg-amber-100 transition px-3.5 py-1.5 rounded-full border border-amber-300/80 shadow-2xs">
          {creditText}
        </p>
      </div>

      <p className="text-[10px] text-slate-400">
        Empowering mobile field operations with verified sales & warranty documentation
      </p>
    </footer>
  );
};
