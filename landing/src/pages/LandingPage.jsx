import Header from "../components/landing/Header";
import Hero from "../components/landing/Hero";
import HowItWorks from "../components/landing/HowItWorks";
import Capabilities from "../components/landing/Capabilities";
import Comparison from "../components/landing/Comparison";
import Pricing from "../components/landing/Pricing";
import TryItNow from "../components/landing/TryItNow";
import FAQ from "../components/landing/FAQ";
import Footer from "../components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="relative z-10" data-testid="landing-page">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Capabilities />
        <Comparison />
        <Pricing />
        <TryItNow />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
