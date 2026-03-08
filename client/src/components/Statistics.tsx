import { useEffect, useState, useRef } from "react";
import { BarChart3, Mic, MapPin, Gauge, TrendingUp } from "lucide-react";

interface CounterProps {
    end: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
}

const AnimatedCounter = ({ end, duration = 2000, suffix = "", prefix = "" }: CounterProps) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    const startTime = performance.now();
                    const animate = (currentTime: number) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease-out cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setCount(Math.round(eased * end));
                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        }
                    };
                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end, duration]);

    return (
        <div ref={ref} className="text-4xl md:text-5xl font-bold">
            {prefix}{count.toLocaleString()}{suffix}
        </div>
    );
};

const statCards = [
    {
        icon: Mic,
        label: "Total Recordings",
        value: 15420,
        suffix: "",
        color: "primary",
        description: "Audio samples collected",
    },
    {
        icon: BarChart3,
        label: "Sound Categories",
        value: 521,
        suffix: "",
        color: "accent",
        description: "YAMNet classification classes",
    },
    {
        icon: Gauge,
        label: "Avg Confidence",
        value: 87,
        suffix: "%",
        color: "primary",
        description: "Classification accuracy",
    },
    {
        icon: MapPin,
        label: "Cities Mapped",
        value: 52,
        suffix: "",
        color: "accent",
        description: "Worldwide coverage",
    },
];

const topSounds = [
    { label: "Traffic / Vehicle", count: 4280, percentage: 85 },
    { label: "Speech / Voice", count: 3150, percentage: 63 },
    { label: "Music", count: 2340, percentage: 47 },
    { label: "Bird / Animal", count: 1860, percentage: 37 },
    { label: "Construction", count: 1420, percentage: 28 },
    { label: "Siren / Alarm", count: 980, percentage: 20 },
];

const Statistics = () => {
    return (
        <section id="statistics" className="py-24 bg-card relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                        <TrendingUp className="w-4 h-4 text-primary animate-pulse-glow" />
                        <span className="text-sm font-medium text-primary">Live Statistics</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        SONIQUE by the <span className="text-primary">Numbers</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Real-time platform metrics and classification insights
                    </p>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        const isPrimary = stat.color === "primary";

                        return (
                            <div
                                key={index}
                                className="group bg-gradient-card rounded-2xl p-6 md:p-8 border border-border hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 text-center"
                            >
                                <div
                                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${isPrimary
                                            ? "bg-primary/10 group-hover:glow-teal"
                                            : "bg-accent/10 group-hover:glow-lime"
                                        } transition-all`}
                                >
                                    <Icon
                                        className={`w-7 h-7 ${isPrimary ? "text-primary" : "text-accent"
                                            }`}
                                    />
                                </div>
                                <AnimatedCounter
                                    end={stat.value}
                                    suffix={stat.suffix}
                                />
                                <div className="text-sm font-semibold mt-2 mb-1">{stat.label}</div>
                                <div className="text-xs text-muted-foreground">{stat.description}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Top sounds bar chart */}
                <div className="max-w-3xl mx-auto">
                    <h3 className="text-2xl font-bold mb-8 text-center">
                        Top Detected <span className="text-accent">Sound Categories</span>
                    </h3>
                    <div className="space-y-4">
                        {topSounds.map((sound, index) => (
                            <div key={index} className="group">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-sm font-medium">{sound.label}</span>
                                    <span className="text-sm text-muted-foreground">
                                        {sound.count.toLocaleString()} recordings
                                    </span>
                                </div>
                                <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${index % 2 === 0
                                                ? "bg-gradient-to-r from-primary/80 to-primary"
                                                : "bg-gradient-to-r from-accent/80 to-accent"
                                            }`}
                                        style={{
                                            width: `${sound.percentage}%`,
                                            animationDelay: `${index * 100}ms`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Statistics;
