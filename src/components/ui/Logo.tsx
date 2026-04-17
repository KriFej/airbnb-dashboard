export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        className="text-brand-500"
        aria-hidden="true"
      >
        <path
          d="M4 14c4-2 6-2 8 0s4 4 8 2"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M4 8c4-2 6-2 8 0s4 4 8 2"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
      <span className="text-[17px] font-semibold tracking-tight text-white">
        Profitly
      </span>
    </div>
  );
}
