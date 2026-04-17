import { Button } from "../ui/Button";
import { Logo } from "../ui/Logo";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
          <a href="#features" className="hover:text-white transition-colors">
            Fonctionnalités
          </a>
          <a href="#pricing" className="hover:text-white transition-colors">
            Tarifs
          </a>
          <a href="#testimonials" className="hover:text-white transition-colors">
            Témoignages
          </a>
          <a href="#faq" className="hover:text-white transition-colors">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Button href="/login" variant="secondary" size="md">
            Connexion
          </Button>
          <Button href="/signup" size="md">
            Commencer
          </Button>
        </div>
      </div>
    </header>
  );
}
