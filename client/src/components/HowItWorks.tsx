import { Mic, Cpu, Map, Share2 } from "lucide-react";

const steps = [
  {
    icon: Mic,
    title: "Record Noise",
    description: "Use our app to capture environmental sounds from your location",
    color: "primary"
  },
  {
    icon: Cpu,
    title: "AI Classifies",
    description: "YAMNet machine learning identifies and categorizes the sound types",
    color: "accent"
  },
  {
    icon: Map,
    title: "Data is Mapped",
    description: "Your recording is geotagged and added to our real-time heatmap",
    color: "primary"
  },
  {
    icon: Share2,
    title: "Insights Shared",
    description: "Community and researchers access aggregated noise patterns",
    color: "accent"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            How <span className="text-primary">It Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Four simple steps from recording to real-time insights
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isAccent = step.color === "accent";
            
            return (
              <div 
                key={index}
                className="relative group"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-20 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary to-accent opacity-30" />
                )}
                
                <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/40 transition-all duration-300 hover:-translate-y-2 relative z-10">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${
                    isAccent 
                      ? 'bg-accent/10 group-hover:glow-lime' 
                      : 'bg-primary/10 group-hover:glow-teal'
                  } transition-all`}>
                    <Icon className={`w-10 h-10 ${isAccent ? 'text-accent' : 'text-primary'}`} />
                  </div>
                  
                  <div className="absolute top-6 right-6 text-5xl font-bold text-primary/10">
                    {index + 1}
                  </div>
                  
                  <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
