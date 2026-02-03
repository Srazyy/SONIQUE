import { Sparkles, Smartphone, Cloud, LineChart } from "lucide-react";

const visionItems = [
  {
    icon: LineChart,
    title: "Predictive Noise Analytics",
    description: "Machine learning models that forecast noise patterns based on historical data and urban events"
  },
  {
    icon: Cloud,
    title: "Air Quality Integration",
    description: "Combining acoustic data with air quality sensors for comprehensive environmental monitoring"
  },
  {
    icon: Smartphone,
    title: "Mobile App Expansion",
    description: "Native iOS and Android apps with offline recording and automated background monitoring"
  }
];

const FutureVision = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Sparkles className="w-4 h-4 text-accent animate-pulse-glow" />
            <span className="text-sm font-medium text-accent">Coming Soon</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            The <span className="text-accent">Future</span> of Urban Sound
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're building tomorrow's smart city monitoring platform today
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {visionItems.map((item, index) => {
            const Icon = item.icon;
            
            return (
              <div
                key={index}
                className="group bg-card rounded-2xl p-8 border border-border hover:border-accent/40 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:glow-lime transition-all">
                  <Icon className="w-8 h-8 text-accent" />
                </div>
                
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            );
          })}
        </div>

        <div className="max-w-3xl mx-auto text-center bg-gradient-card rounded-3xl p-12 border border-primary/20">
          <h3 className="text-3xl font-bold mb-4">
            Imagine a World Where...
          </h3>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            Every city uses real-time acoustic data to reduce noise pollution, 
            improve public health, and create more peaceful urban environments. 
            Where communities are empowered with data to advocate for change, 
            and where technology serves the greater good of sustainable living.
          </p>
          <div className="inline-flex items-center gap-2 text-primary font-semibold">
            <Sparkles className="w-5 h-5 animate-pulse-glow" />
            <span>That's the CrowdNoise vision</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FutureVision;
