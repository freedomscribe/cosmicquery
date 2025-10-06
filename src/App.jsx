import './App.css'
import StarField from './components/StarField'
import Header from './components/Header'
import Hero from './components/Hero'
import QueryInterface from './components/QueryInterface'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen relative">
      {/* Animated starfield background */}
      <StarField />
      
      {/* Nebula overlay for depth */}
      <div className="nebula-overlay" />
      
      {/* Main content */}
      <div className="relative z-10">
        <Header />
        
        <main>
          <Hero />
          
          <section id="queries" className="py-12">
            <QueryInterface />
          </section>
          
          <section id="simulations" className="py-20 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Interactive <span className="text-primary">Simulations</span>
                </h2>
                <p className="text-xl text-card-foreground">
                  Explore the universe in stunning 3D
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6 glow-on-hover cursor-pointer">
                  <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-foreground">Solar System</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Solar System Explorer</h3>
                  <p className="text-card-foreground">
                    Navigate through our solar system with accurate planetary positions and orbital mechanics
                  </p>
                </div>
                
                <div className="glass-card p-6 glow-on-hover cursor-pointer">
                  <div className="aspect-video bg-gradient-to-br from-orange-900/50 to-red-900/50 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-foreground">Black Hole</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Black Hole Visualization</h3>
                  <p className="text-card-foreground">
                    Witness the power of gravity with an interactive black hole accretion disk simulation
                  </p>
                </div>
                
                <div className="glass-card p-6 glow-on-hover cursor-pointer">
                  <div className="aspect-video bg-gradient-to-br from-green-900/50 to-teal-900/50 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-foreground">Exoplanets</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Exoplanet Builder</h3>
                  <p className="text-card-foreground">
                    Create and customize your own exoplanets with realistic habitability calculations
                  </p>
                </div>
                
                <div className="glass-card p-6 glow-on-hover cursor-pointer">
                  <div className="aspect-video bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-foreground">Galaxy</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Galaxy Formation</h3>
                  <p className="text-card-foreground">
                    Watch spiral galaxies form and evolve over billions of years
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          <section id="community" className="py-20 px-4 bg-gradient-to-b from-transparent to-background/50">
            <div className="container mx-auto max-w-4xl text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Join the <span className="text-primary">Community</span>
              </h2>
              <p className="text-xl text-card-foreground mb-8">
                Connect with fellow space enthusiasts, share your discoveries, and participate in challenges
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="glass-card p-6">
                  <div className="text-4xl font-bold text-primary mb-2">10K+</div>
                  <div className="text-card-foreground">Active Users</div>
                </div>
                <div className="glass-card p-6">
                  <div className="text-4xl font-bold text-primary mb-2">50K+</div>
                  <div className="text-card-foreground">Queries Answered</div>
                </div>
                <div className="glass-card p-6">
                  <div className="text-4xl font-bold text-primary mb-2">1K+</div>
                  <div className="text-card-foreground">Shared Photos</div>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </div>
  )
}

export default App
