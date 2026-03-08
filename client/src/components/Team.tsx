import { Heart, Github } from "lucide-react";

const Team = () => {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Heart className="w-4 h-4 text-primary animate-pulse-glow" />
            <span className="text-sm font-medium text-primary">Built with passion</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Built by <span className="text-primary">Innovators</span>
          </h2>

          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            SONIQUE was created by a team of urban sustainability enthusiasts,
            data scientists, and community advocates passionate about making cities
            more livable through technology and collaboration.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-card rounded-xl p-6 border border-border">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Contributors</div>
            </div>
            <div className="bg-gradient-card rounded-xl p-6 border border-border">
              <div className="text-3xl font-bold text-accent mb-2">100%</div>
              <div className="text-muted-foreground">Open Source</div>
            </div>
            <div className="bg-gradient-card rounded-xl p-6 border border-border">
              <div className="text-3xl font-bold text-primary mb-2">15+</div>
              <div className="text-muted-foreground">Countries</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <a
              href="https://github.com/Srazyy/SONIQUE"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors border border-border"
            >
              <Github className="w-5 h-5" />
              <span className="font-medium">View on GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
