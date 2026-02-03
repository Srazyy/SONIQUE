import { Brain, Users, Globe } from "lucide-react";

const About = () => {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Listening to <span className="text-primary">Cities</span>, 
              Powered by <span className="text-accent">AI</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              CrowdNoise harnesses the power of community and artificial intelligence 
              to create real-time noise maps. Using crowdsourced audio recordings and 
              YAMNet machine learning, we detect and classify environmental sounds to 
              help build smarter, quieter cities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-card p-8 rounded-2xl border border-primary/20 hover:border-primary/40 transition-colors group">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:glow-teal transition-all">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart City Planning</h3>
              <p className="text-muted-foreground">
                Data-driven insights help urban planners identify noise pollution 
                hotspots and make informed decisions about city infrastructure.
              </p>
            </div>

            <div className="bg-gradient-card p-8 rounded-2xl border border-accent/20 hover:border-accent/40 transition-colors group">
              <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:glow-lime transition-all">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Citizen Science</h3>
              <p className="text-muted-foreground">
                Everyone can contribute. Join thousands of community members mapping 
                the acoustic environment of their neighborhoods.
              </p>
            </div>

            <div className="bg-gradient-card p-8 rounded-2xl border border-primary/20 hover:border-primary/40 transition-colors group">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:glow-teal transition-all">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Environmental Research</h3>
              <p className="text-muted-foreground">
                Our open dataset enables researchers worldwide to study urban sound 
                patterns and their impact on health and well-being.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
