export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="text-[17px] font-semibold tracking-tight text-white">
        locpilote
      </span>
    </div>
  );
}
