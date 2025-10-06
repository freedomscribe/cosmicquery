import { Rocket, Github, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/50 backdrop-blur-md bg-background/30 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Rocket className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold text-foreground">
                Cosmic<span className="text-primary">Query</span>
              </h3>
            </div>
            <p className="text-card-foreground text-sm">
              Your AI-powered gateway to exploring the wonders of the universe.
            </p>
          </div>
          
          <div>
            <h4 className="text-foreground font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#queries" className="text-card-foreground hover:text-primary transition-colors">
                  AI Queries
                </a>
              </li>
              <li>
                <a href="#simulations" className="text-card-foreground hover:text-primary transition-colors">
                  3D Simulations
                </a>
              </li>
              <li>
                <a href="#alerts" className="text-card-foreground hover:text-primary transition-colors">
                  Celestial Alerts
                </a>
              </li>
              <li>
                <a href="#community" className="text-card-foreground hover:text-primary transition-colors">
                  Community
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-foreground font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#docs" className="text-card-foreground hover:text-primary transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#api" className="text-card-foreground hover:text-primary transition-colors">
                  API Access
                </a>
              </li>
              <li>
                <a href="#blog" className="text-card-foreground hover:text-primary transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#support" className="text-card-foreground hover:text-primary transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-foreground font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Github className="w-5 h-5 text-foreground" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Twitter className="w-5 h-5 text-foreground" />
              </a>
              <a 
                href="mailto:hello@cosmicquery.com"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Mail className="w-5 h-5 text-foreground" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border/50 mt-8 pt-8 text-center text-sm text-card-foreground">
          <p>© 2025 CosmicQuery. Built with ❤️ for space enthusiasts.</p>
          <p className="mt-2">
            Data provided by NASA APIs • Open source on{' '}
            <a href="https://github.com" className="text-primary hover:underline">
              GitHub
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
