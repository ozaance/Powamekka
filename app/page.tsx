import dynamic from "next/dynamic";
import Hero from "./components/Hero";

const Manifeste = dynamic(() => import("./components/Manifeste"));
const Stats = dynamic(() => import("./components/Stats"));
const Immersive = dynamic(() => import("./components/Immersive"), { ssr: false });
const Services = dynamic(() => import("./components/Services"));
const Transition = dynamic(() => import("./components/Transition"), { ssr: false });
const Footer = dynamic(() => import("./components/Footer"));

export default function Home() {
  return (
    <main className="bg-[#050508] overflow-x-hidden">
      <Hero />
      <Manifeste />
      <Stats />
      <Immersive />
      <Services />
      <Transition />
      <Footer />
    </main>
  );
}
