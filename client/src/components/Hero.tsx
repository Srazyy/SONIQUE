import { Button } from "@/components/ui/button";
import { Activity, Radio } from "lucide-react";
import heroImage from "@/assets/hero-soundwave.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary to-background" />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full animate-pulse-glow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-primary/20 mb-4">
              <Radio className="w-4 h-4 text-primary animate-pulse-glow" />
              <span className="text-sm text-muted-foreground">AI-Powered Noise Mapping</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Sonique:
              </span>
              <br />
              <span className="text-foreground">
                Mapping the Sound of Our Cities
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl">
              Join the community that listens, learns, and improves urban soundscapes 
              through collaborative noise mapping and machine learning.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                variant="hero" 
                size="lg" 
                className="gap-2"
                onClick={() => document.getElementById('live-map')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Activity className="w-5 h-5" />
                Start Recording
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => document.getElementById('live-map')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore the Map
              </Button>
            </div>

            <div className="flex items-center gap-8 justify-center lg:justify-start pt-4">
              <div>
                <div className="text-3xl font-bold text-primary">15K+</div>
                <div className="text-sm text-muted-foreground">Recordings</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <div className="text-3xl font-bold text-accent">50+</div>
                <div className="text-sm text-muted-foreground">Cities</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <div className="text-3xl font-bold text-primary">2K+</div>
                <div className="text-sm text-muted-foreground">Contributors</div>
              </div>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative animate-float">
            <div className="absolute inset-0 bg-gradient-hero opacity-20 blur-3xl rounded-full" />
            <img
              src={heroImage}
              alt="Visualization of city sound waves and noise mapping"
              className="relative rounded-2xl shadow-2xl glow-teal"
            />
            {/* Floating sound wave indicators */}
            <div className="absolute top-1/4 -left-4 w-16 h-16 bg-primary/10 rounded-full border border-primary flex items-center justify-center animate-pulse-glow">
              <Activity className="w-8 h-8 text-primary" />
            </div>
            <div className="absolute bottom-1/4 -right-4 w-12 h-12 bg-accent/10 rounded-full border border-accent flex items-center justify-center animate-pulse-glow">
              <Radio className="w-6 h-6 text-accent" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-card to-transparent" />
    </section>
  );
};

export default Hero;
