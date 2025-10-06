import { Sparkles, Rocket, Telescope } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';

export default function Hero() {
  return (
    <section className="w-full py-20 px-4">
      <div className="container mx-auto text-center max-w-4xl">
        <div className="fade-in">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Sparkles className="w-16 h-16 text-primary animate-pulse" />
              <div className="absolute inset-0 blur-xl bg-primary/30 animate-pulse"></div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
            Explore the <span className="text-primary">Cosmos</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-card-foreground mb-8 leading-relaxed">
            Your AI-powered gateway to the universe. Ask questions, explore 3D simulations, 
            and discover the wonders of space with real-time astronomical data.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button className="cosmic-button text-lg px-8 py-6">
              <Rocket className="w-5 h-5 mr-2" />
              Start Exploring
            </Button>
            <Button variant="outline" className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Telescope className="w-5 h-5 mr-2" />
              View Simulations
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="glass-card p-6 glow-on-hover">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">AI-Powered Queries</h3>
              <p className="text-card-foreground">
                Ask anything about space and get accurate, engaging answers powered by advanced AI
              </p>
            </div>
            
            <div className="glass-card p-6 glow-on-hover">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">3D Simulations</h3>
              <p className="text-card-foreground">
                Explore interactive 3D models of solar systems, black holes, and exoplanets
              </p>
            </div>
            
            <div className="glass-card p-6 glow-on-hover">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Telescope className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Real-Time Alerts</h3>
              <p className="text-card-foreground">
                Get notified about meteor showers, ISS passes, and other celestial events
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
