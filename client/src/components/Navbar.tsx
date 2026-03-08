import { useState, useEffect } from "react";
import { Radio, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const navLinks = [
    { label: "About", href: "#about" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Map", href: "#live-map" },
    { label: "Features", href: "#features" },
    { label: "Stats", href: "#statistics" },
    { label: "Contact", href: "#contact" },
];

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const isMobile = useIsMobile();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleClick = (href: string) => {
        setMobileOpen(false);
        const el = document.querySelector(href);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-[2000] transition-all duration-300 ${scrolled
                    ? "bg-card/80 backdrop-blur-xl border-b border-border shadow-lg"
                    : "bg-transparent"
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Brand */}
                    <a
                        href="#"
                        className="flex items-center gap-2 group"
                        onClick={(e) => {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                    >
                        <Radio className="w-6 h-6 text-primary animate-pulse-glow" />
                        <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                            SONIQUE
                        </span>
                    </a>

                    {/* Desktop links */}
                    {!isMobile && (
                        <div className="flex items-center gap-1">
                            {navLinks.map((link) => (
                                <button
                                    key={link.href}
                                    onClick={() => handleClick(link.href)}
                                    className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                                >
                                    {link.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Mobile hamburger */}
                    {isMobile && (
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                        >
                            {mobileOpen ? (
                                <X className="w-5 h-5 text-foreground" />
                            ) : (
                                <Menu className="w-5 h-5 text-foreground" />
                            )}
                        </button>
                    )}
                </div>

                {/* Mobile menu */}
                {isMobile && mobileOpen && (
                    <div className="pb-4 border-t border-border/50 animate-fade-in-up">
                        <div className="flex flex-col gap-1 pt-3">
                            {navLinks.map((link) => (
                                <button
                                    key={link.href}
                                    onClick={() => handleClick(link.href)}
                                    className="px-4 py-3 rounded-lg text-left text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                                >
                                    {link.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
