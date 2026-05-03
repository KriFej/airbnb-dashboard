export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center text-[17px] font-semibold tracking-tight ${className}`}>
      <span className="text-fg">loc</span><span className="text-brand-500">pilote</span>
    </span>
  );
}
