export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
        <rect width="32" height="32" rx="5" fill="#000"/>
        <polygon points="16,2 30,11 30,30 2,30 2,11" fill="#22C55E"/>
        <rect x="5" y="22" width="6" height="6" fill="#000"/>
        <rect x="13" y="17" width="6" height="11" fill="#000"/>
        <rect x="21" y="11" width="6" height="17" fill="#000"/>
        <polyline points="8,25 16,19 24,13" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="2,11 16,2 30,11" fill="none" stroke="#000" strokeWidth="2"/>
      </svg>
      <span className="text-[17px] font-semibold tracking-tight">
        <span className="text-white">loc</span>
        <span className="text-brand-500">pilote</span>
      </span>
    </div>
  );
}
