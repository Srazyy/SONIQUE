import { Zap, MapPinned, BarChart3, Leaf } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Real-time Sound Classification",
    description: "Advanced AI instantly identifies traffic, construction, nature sounds, and more using YAMNet neural networks"
  },
  {
    icon: MapPinned,
    title: "Geolocation Tagging",
    description: "Every recording is precisely mapped with GPS coordinates for accurate spatial analysis"
  },
  {
    icon: BarChart3,
    title: "Data Visualization",
    description: "Interactive heatmaps and charts reveal noise patterns across time and location"
  },
  {
    icon: Leaf,
    title: "Eco-friendly & Citizen-driven",
    description: "Sustainable urban development powered by community collaboration and open data"
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Powerful <span className="text-primary">Features</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built for researchers, urban planners, and community advocates
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                className="group bg-gradient-card rounded-2xl p-8 border border-border hover:border-primary/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${isEven ? 'bg-primary/10 group-hover:glow-teal' : 'bg-accent/10 group-hover:glow-lime'
                  } transition-all`}>
                  <Icon className={`w-8 h-8 ${isEven ? 'text-primary' : 'text-accent'}`} />
                </div>

                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
