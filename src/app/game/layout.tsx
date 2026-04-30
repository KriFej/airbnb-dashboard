import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rhythm Dash',
  description: 'Rhythm platformer game — press to jump, survive the beat.',
};

export default function GameLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {children}
    </div>
  );
}
