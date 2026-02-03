import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Github, Twitter, Mail, Radio } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto mb-12">
          {/* Contact Form */}
          <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Mail className="w-6 h-6 text-primary" />
              Get in Touch
            </h3>
            <form className="space-y-4">
              <Input 
                placeholder="Your name" 
                className="bg-background border-border"
              />
              <Input 
                type="email" 
                placeholder="Your email" 
                className="bg-background border-border"
              />
              <Textarea 
                placeholder="Your message" 
                className="bg-background border-border min-h-[120px]"
              />
              <Button variant="hero" className="w-full">
                Send Message
              </Button>
            </form>
          </div>

          {/* Links and Social */}
          <div>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Radio className="w-8 h-8 text-primary animate-pulse-glow" />
                <span className="text-2xl font-bold">CrowdNoise</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Mapping the sound of our cities through community-driven 
                data collection and artificial intelligence.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Quick Links</h4>
                <div className="grid grid-cols-2 gap-2">
                  <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
                    About
                  </a>
                  <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
                    How It Works
                  </a>
                  <a href="#map" className="text-muted-foreground hover:text-primary transition-colors">
                    Live Map
                  </a>
                  <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                    Features
                  </a>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Connect With Us</h4>
                <div className="flex gap-4">
                  <a 
                    href="https://github.com/crowdnoise" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-secondary hover:bg-primary/20 flex items-center justify-center transition-colors group"
                  >
                    <Github className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>
                  <a 
                    href="https://twitter.com/crowdnoise" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-secondary hover:bg-primary/20 flex items-center justify-center transition-colors group"
                  >
                    <Twitter className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>
                  <a 
                    href="mailto:hello@crowdnoise.org"
                    className="w-10 h-10 rounded-lg bg-secondary hover:bg-primary/20 flex items-center justify-center transition-colors group"
                  >
                    <Mail className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>
            © 2025 CrowdNoise. Open source project for sustainable urban innovation. 
          </p>
          <p className="mt-2">
            Built with ❤️ by innovators passionate about better cities.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
