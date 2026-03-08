import { Code2, Layers } from "lucide-react";

const frontendStack = [
    { name: "React 18", description: "UI Components", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    { name: "TypeScript", description: "Type Safety", color: "bg-blue-600/10 text-blue-300 border-blue-600/20" },
    { name: "Vite", description: "Build Tool", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
    { name: "Tailwind CSS", description: "Styling", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
    { name: "shadcn/ui", description: "Component Library", color: "bg-neutral-500/10 text-neutral-300 border-neutral-500/20" },
    { name: "Leaflet.js", description: "Maps", color: "bg-green-500/10 text-green-400 border-green-500/20" },
];

const backendStack = [
    { name: "Python 3.11", description: "Runtime", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
    { name: "Flask", description: "API Framework", color: "bg-gray-500/10 text-gray-300 border-gray-500/20" },
    { name: "TensorFlow", description: "ML Engine", color: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
    { name: "YAMNet", description: "Audio Classification", color: "bg-red-500/10 text-red-400 border-red-500/20" },
    { name: "SQLite", description: "Database", color: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
    { name: "librosa", description: "Audio Processing", color: "bg-pink-500/10 text-pink-400 border-pink-500/20" },
];

const infraStack = [
    { name: "Docker", description: "Containers", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    { name: "Docker Compose", description: "Orchestration", color: "bg-blue-600/10 text-blue-300 border-blue-600/20" },
    { name: "Nginx", description: "Reverse Proxy", color: "bg-green-600/10 text-green-400 border-green-600/20" },
    { name: "ffmpeg", description: "Audio Conversion", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
];

const TechStack = () => {
    return (
        <section id="tech-stack" className="py-24 bg-background relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-accent rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
                        <Code2 className="w-4 h-4 text-accent animate-pulse-glow" />
                        <span className="text-sm font-medium text-accent">Technology</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Built With <span className="text-accent">Modern Tech</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        A powerful, production-ready stack for real-time sound classification
                    </p>
                </div>

                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
                    {/* Frontend */}
                    <div className="bg-card rounded-2xl p-6 border border-border hover:border-primary/30 transition-all">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Layers className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Frontend</h3>
                                <p className="text-xs text-muted-foreground">Client-side</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {frontendStack.map((tech) => (
                                <div
                                    key={tech.name}
                                    className={`rounded-xl px-3 py-2.5 border ${tech.color} transition-all hover:scale-105`}
                                >
                                    <div className="text-sm font-semibold">{tech.name}</div>
                                    <div className="text-xs opacity-70">{tech.description}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Backend */}
                    <div className="bg-card rounded-2xl p-6 border border-border hover:border-accent/30 transition-all">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                <Code2 className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Backend</h3>
                                <p className="text-xs text-muted-foreground">Server-side + ML</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {backendStack.map((tech) => (
                                <div
                                    key={tech.name}
                                    className={`rounded-xl px-3 py-2.5 border ${tech.color} transition-all hover:scale-105`}
                                >
                                    <div className="text-sm font-semibold">{tech.name}</div>
                                    <div className="text-xs opacity-70">{tech.description}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Infrastructure */}
                    <div className="bg-card rounded-2xl p-6 border border-border hover:border-primary/30 transition-all">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Layers className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Infrastructure</h3>
                                <p className="text-xs text-muted-foreground">DevOps & Tooling</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {infraStack.map((tech) => (
                                <div
                                    key={tech.name}
                                    className={`rounded-xl px-3 py-2.5 border ${tech.color} transition-all hover:scale-105`}
                                >
                                    <div className="text-sm font-semibold">{tech.name}</div>
                                    <div className="text-xs opacity-70">{tech.description}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TechStack;
