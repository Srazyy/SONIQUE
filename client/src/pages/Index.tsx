import Hero from "@/components/Hero";
import About from "@/components/About";
import HowItWorks from "@/components/HowItWorks";
import LiveMap from "@/components/LiveMap";
import Features from "@/components/Features";
import Team from "@/components/Team";
import FutureVision from "@/components/FutureVision";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <HowItWorks />
      <LiveMap />
      <Features />
      <Team />
      <FutureVision />
      <Footer />
    </main>
  );
};

export default Index;
