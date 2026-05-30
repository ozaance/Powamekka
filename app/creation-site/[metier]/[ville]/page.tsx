import { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import Contact from "@/app/components/Contact";
import Footer from "@/app/components/Footer";

// Metier and Ville lists
const METIER_LABELS: Record<string, string> = {
  plombier: "Plombier",
  electricien: "Électricien",
  chauffagiste: "Chauffagiste",
  menuisier: "Menuisier",
  couvreur: "Couvreur",
  macon: "Maçon",
  peintre: "Peintre",
};

const VILLE_LABELS: Record<string, string> = {
  paris: "Paris",
  lyon: "Lyon",
  marseille: "Marseille",
  toulouse: "Toulouse",
  nice: "Nice",
  nantes: "Nantes",
  montpellier: "Montpellier",
  strasbourg: "Strasbourg",
  bordeaux: "Bordeaux",
  lille: "Lille",
};

const PREPOSITION_METIER: Record<string, string> = {
  plombier: "de plombier",
  electricien: "d'électricien",
  chauffagiste: "de chauffagiste",
  menuisier: "de menuisier",
  couvreur: "de couvreur",
  macon: "de maçon",
  peintre: "de peintre",
};

const METIER_IMAGES: Record<string, string> = {
  plombier: "/plumbing_hero.jpg",
  electricien: "/electrician_hero.jpg",
  chauffagiste: "/hvac_hero.jpg",
  menuisier: "/menuiserie_hero.jpg",
  couvreur: "/roofing_hero.jpg",
  macon: "/masonry_hero.jpg",
  peintre: "/brand_identity_mockup.jpg",
};

type Props = {
  params: Promise<{ metier: string; ville: string }>;
};

// Generate static routes
export async function generateStaticParams() {
  const metiers = Object.keys(METIER_LABELS);
  const villes = Object.keys(VILLE_LABELS);

  const paramsList = [];
  for (const metier of metiers) {
    for (const ville of villes) {
      paramsList.push({ metier, ville });
    }
  }
  return paramsList;
}

// Metadata generator
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { metier, ville } = await params;
  const metierLabel = METIER_LABELS[metier] || metier;
  const villeLabel = VILLE_LABELS[ville] || ville;

  const title = `Création de Site Internet pour ${metierLabel} à ${villeLabel} | Powamekka`;
  const description = `Besoin d'un site web professionnel pour votre activité de ${metierLabel.toLowerCase()} à ${villeLabel} ? Powamekka conçoit des sites vitrines premium et optimisés pour le référencement local.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/creation-site/${metier}/${ville}`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { metier, ville } = await params;
  const metierLabel = METIER_LABELS[metier] || metier;
  const villeLabel = VILLE_LABELS[ville] || ville;
  const prepMetier = PREPOSITION_METIER[metier] || `de ${metier}`;
  const metierImage = METIER_IMAGES[metier] || "/brand_identity_mockup.jpg";

  return (
    <main className="relative min-h-screen bg-[#050508] text-[#f0f0ee]">
      <div className="noise-overlay" />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-44 pb-28 px-6 overflow-hidden flex flex-col items-center justify-center text-center">
        {/* Background glow effects */}
        <div 
          className="absolute rounded-full pointer-events-none opacity-40" 
          style={{
            width: 500, height: 500,
            background: "radial-gradient(circle, rgba(201,169,110,0.12) 0%, transparent 70%)",
            top: "10%", left: "15%", filter: "blur(60px)",
          }} 
        />
        <div 
          className="absolute rounded-full pointer-events-none opacity-40" 
          style={{
            width: 400, height: 400,
            background: "radial-gradient(circle, rgba(160,120,80,0.08) 0%, transparent 70%)",
            bottom: "10%", right: "15%", filter: "blur(70px)",
          }} 
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 0%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 0%, transparent 70%)",
        }} />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
            style={{ background: "rgba(201,169,110,0.07)", border: "1px solid rgba(201,169,110,0.2)" }}
          >
            <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-[#c9a96e]" />
            <span className="text-[10px] uppercase tracking-widest font-mono text-[#8c6621]">
              Référencement local & Web Design · {villeLabel}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight text-neutral-900 font-display">
            Création de site internet <br className="hidden md:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fcf2d6] via-[#c9a96e] to-[#8c6621]">
              pour {metierLabel} à {villeLabel}
            </span>
          </h1>

          <p className="text-base md:text-lg text-white/42 max-w-2xl mx-auto leading-relaxed">
            Vous êtes {metierLabel.toLowerCase()} à {villeLabel} ou ses environs ? Démarquez-vous de la concurrence avec un site web premium, ultra-rapide et conçu spécifiquement pour attirer de nouveaux chantiers qualifiés dans votre zone.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#contact"
              className="px-8 py-3.5 rounded-full text-sm font-medium transition-all duration-300 bg-white text-black hover:bg-neutral-200 shadow-lg shadow-white/5"
              data-cursor
            >
              Lancer mon projet
            </a>
            <a
              href="#indispensable"
              className="px-8 py-3.5 rounded-full text-sm font-medium transition-all duration-300 text-white/40 hover:text-white/80"
              data-cursor
            >
              En savoir plus ↓
            </a>
          </div>
        </div>
      </section>

      {/* Presentation section */}
      <section id="indispensable" className="py-32 px-6 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text block */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-4xl font-light text-white/88 font-display">
              Pourquoi un site internet est indispensable pour votre activité de {metierLabel.toLowerCase()} à {villeLabel} ?
            </h2>
            <div className="w-16 h-1 bg-[#c9a96e]" />
            <p className="text-sm md:text-base text-white/42 leading-relaxed">
              À {villeLabel}, la majorité de vos clients cherchent un artisan en ligne. Si vous n'avez pas de site web, ou si votre site ne donne pas une image professionnelle immédiate, vos clients se tourneront vers vos concurrents.
            </p>
            <p className="text-sm md:text-base text-white/42 leading-relaxed">
              Chez Powamekka, nous développons des sites web clés en main, pensés spécifiquement pour le métier {prepMetier}.
            </p>

            <ul className="space-y-4 pt-4">
              <li className="flex items-start gap-3">
                <span className="text-[#c9a96e] text-lg font-mono">01.</span>
                <div>
                  <h4 className="text-sm font-light text-white/80">SEO Local Avancé</h4>
                  <p className="text-xs text-white/35">Votre site est optimisé pour ressortir premier quand les clients de {villeLabel} recherchent un {metierLabel.toLowerCase()}.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#c9a96e] text-lg font-mono">02.</span>
                <div>
                  <h4 className="text-sm font-light text-white/80">Confiance & Professionnalisme</h4>
                  <p className="text-xs text-white/35">Présentation soignée de vos réalisations, de vos certifications (RGE, Décennale) et des avis de vos clients satisfaits.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#c9a96e] text-lg font-mono">03.</span>
                <div>
                  <h4 className="text-sm font-light text-white/80">Demandes de Devis Directes</h4>
                  <p className="text-xs text-white/35">Un parcours utilisateur fluide avec formulaires d'estimation de travaux et boutons d'appel rapides sur mobile.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Visual block */}
          <div className="relative group">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#c9a96e]/10 to-transparent blur-xl opacity-30 transition-opacity duration-500 group-hover:opacity-50" />
            <div 
              className="relative overflow-hidden rounded-2xl border" 
              style={{ borderColor: "rgba(255,255,255,0.05)", background: "#080810" }}
            >
              <img 
                src={metierImage} 
                alt={`Création de site pour ${metierLabel} à ${villeLabel}`} 
                className="w-full h-[320px] md:h-[420px] object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-xs text-[#c9a96e] font-mono tracking-widest uppercase mb-1">Concept Design</p>
                <h3 className="text-lg font-light text-white/88 font-display">Maquette de site vitrine {metierLabel.toLowerCase()}</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-28 px-6 text-center border-t border-b" style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(255,200,100,0.02)" }}>
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-light text-white/88 font-display">
            Prêt à booster votre visibilité à {villeLabel} ?
          </h2>
          <p className="text-xs md:text-sm text-white/42 max-w-xl mx-auto">
            Discutons de votre projet. Nous réalisons une étude de mots-clés gratuite pour évaluer le volume de clients potentiels dans votre région.
          </p>
          <a
            href="#contact"
            className="inline-block px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-300"
            style={{ background: "rgba(255,200,100,0.08)", border: "1px solid rgba(255,200,100,0.28)", color: "rgba(255,255,255,0.8)" }}
            data-cursor
          >
            Obtenir une consultation gratuite
          </a>
        </div>
      </section>

      {/* Contact Section */}
      <Contact />

      {/* Footer Section */}
      <Footer />
    </main>
  );
}
