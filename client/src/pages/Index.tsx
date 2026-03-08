import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import HowItWorks from "@/components/HowItWorks";
import LiveMap from "@/components/LiveMap";
import Features from "@/components/Features";
import Statistics from "@/components/Statistics";
import Team from "@/components/Team";
import TechStack from "@/components/TechStack";
import FutureVision from "@/components/FutureVision";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <HowItWorks />
      <LiveMap />
      <Features />
      <Statistics />
      <Team />
      <TechStack />
      <FutureVision />
      <Footer />
    </main>
  );
};

export default Index;
