import { Rocket, Telescope, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';

export default function Header() {
  return (
    <header className="w-full border-b border-border/50 backdrop-blur-md bg-background/30 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Rocket className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">
            Cosmic<span className="text-primary">Query</span>
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#home" className="text-foreground hover:text-primary transition-colors flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Home
          </a>
          <a href="#queries" className="text-foreground hover:text-primary transition-colors flex items-center gap-2">
            <Telescope className="w-4 h-4" />
            Explore
          </a>
          <a href="#simulations" className="text-foreground hover:text-primary transition-colors flex items-center gap-2">
            <Rocket className="w-4 h-4" />
            Simulations
          </a>
          <a href="#community" className="text-foreground hover:text-primary transition-colors flex items-center gap-2">
            <Users className="w-4 h-4" />
            Community
          </a>
        </nav>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="text-foreground hover:text-primary">
            Sign In
          </Button>
          <Button className="cosmic-button">
            Get Premium
          </Button>
        </div>
      </div>
    </header>
  );
}
