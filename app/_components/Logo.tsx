import type { SVGProps } from "react";

type MarkProps = SVGProps<SVGSVGElement> & { size?: number };

/**
 * M2Prop mark — outlined square with a solid cornerstone (evokes m² and floor plans).
 * Uses currentColor for both stroke and fill so it inherits from parent.
 */
export function LogoMark({ size = 32, ...rest }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...rest}
    >
      <rect x="4.75" y="4.75" width="22.5" height="22.5" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="16.5" y="16.5" width="10.75" height="10.75" rx="1" fill="currentColor" />
      <path d="M9 22 L14 22" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.55" />
      <path d="M9 22 L9 17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

type LockupProps = {
  size?: number;
  tagline?: string;
  className?: string;
  markClassName?: string;
};

/**
 * Full logo lockup: mark + wordmark (+ optional tagline).
 * Colors inherit from parent — wrap in a colored container.
 */
export function Logo({ size = 36, tagline, className = "", markClassName = "" }: LockupProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span className={`inline-flex ${markClassName}`}>
        <LogoMark size={size} />
      </span>
      <span className="leading-tight">
        <span className="font-serif font-bold text-[1.05em] tracking-tight block">
          M2<span className="text-current/70">Prop</span>
        </span>
        {tagline && (
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.22em] opacity-60 block">
            {tagline}
          </span>
        )}
      </span>
    </span>
  );
}
