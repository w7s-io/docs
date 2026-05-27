import "@/App.css";
import { Toaster } from "sonner";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <div className="App relative min-h-screen bg-[#050505] text-zinc-100 overflow-x-hidden">
      <div className="noise-overlay" aria-hidden="true" />
      <LandingPage />
      <Toaster
        theme="dark"
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#0f0f11",
            border: "1px solid rgba(245,158,11,0.4)",
            color: "#fafafa",
            borderRadius: 0,
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "12px",
          },
        }}
      />
    </div>
  );
}

export default App;
