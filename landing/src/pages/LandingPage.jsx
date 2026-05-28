import Header from "../components/landing/Header";
import Hero from "../components/landing/Hero";
import HowItWorks from "../components/landing/HowItWorks";
import Capabilities from "../components/landing/Capabilities";
import BatteriesIncluded from "../components/landing/BatteriesIncluded";
import Comparison from "../components/landing/Comparison";
import Pricing from "../components/landing/Pricing";
import TryItNow from "../components/landing/TryItNow";
import FAQ from "../components/landing/FAQ";
import AboutProject from "../components/landing/AboutProject";
import Footer from "../components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="relative z-10" data-testid="landing-page">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Capabilities />
        <BatteriesIncluded />
        <Comparison />
        <Pricing />
        <TryItNow />
        <FAQ />
        <AboutProject />
      </main>
      <Footer />
    </div>
  );
}
