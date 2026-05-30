import fs from "fs";
import path from "path";
import Link from "next/link";
import Cursor from "@/components/Cursor";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Post {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
  readTime: string;
  category: string;
}

function getPosts(): Post[] {
  const postsDirectory = path.join(process.cwd(), "content/posts");
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .filter((fileName) => fileName.endsWith(".json"))
    .map((fileName) => {
      const filePath = path.join(postsDirectory, fileName);
      const fileContent = fs.readFileSync(filePath, "utf8");
      return JSON.parse(fileContent) as Post;
    });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export const metadata = {
  title: "Le Blog Powamekka — SEO, Web Design & Conseils Artisans",
  description: "Découvrez nos articles, guides et conseils pour développer votre visibilité en ligne, attirer de nouveaux clients et optimiser votre référencement local.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  const posts = getPosts();

  return (
    <main className="relative min-h-screen bg-[#F5F2EB] text-neutral-900">
      <div className="noise-overlay" />
      <Cursor />
      <Navbar />

      {/* Header Section */}
      <section className="relative pt-44 pb-20 px-6 overflow-hidden text-center">
        {/* Background glow */}
        <div 
          className="absolute rounded-full pointer-events-none opacity-30" 
          style={{
            width: 450, height: 450,
            background: "radial-gradient(circle, rgba(201,169,110,0.1) 0%, transparent 70%)",
            top: "5%", left: "50%", transform: "translateX(-50%)", filter: "blur(70px)",
          }} 
        />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
            style={{ background: "rgba(201,169,110,0.07)", border: "1px solid rgba(201,169,110,0.2)" }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#c9a96e]" />
            <span className="text-[10px] uppercase tracking-widest font-mono text-[#d4b896]">
              Ressources & Guides
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-neutral-900 font-display">
            Le Blog Powamekka
          </h1>
          <p className="text-sm md:text-base text-[#110D0B]/70 max-w-xl mx-auto leading-relaxed">
            Conseils d'experts en Web Design, SEO Local et stratégies digitales pour booster l'activité des artisans et des PME.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="pb-40 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {posts.length === 0 ? (
            <div 
              className="text-center py-20 rounded-2xl border"
              style={{ borderColor: "rgba(0,0,0,0.05)", background: "rgba(0,0,0,0.01)" }}
            >
              <p className="text-[#110D0B]/50 text-sm">Aucun article n'a encore été publié. Revenez bientôt !</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post.slug} className="group relative">
                  {/* Subtle golden hover effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#c9a96e]/10 to-transparent blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="glass-card block h-full p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 group-hover:translate-y-[-4px]"
                    data-cursor
                  >
                    <div className="space-y-4">
                      {/* Meta info */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[#c9a96e]">
                          {post.category || "Conseils"}
                        </span>
                        <span className="text-[10px] text-[#110D0B]/50 font-mono">
                          {post.readTime || "3 min de lecture"}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-neutral-900 font-display group-hover:text-[#c9a96e] transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-xs text-[#110D0B]/70 leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Bottom bar */}
                    <div className="pt-6 flex items-center justify-between">
                      <span className="text-[10px] text-[#110D0B]/50 font-mono">
                        {new Date(post.date).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span className="text-xs text-neutral-800 group-hover:text-[#c9a96e] transition-colors duration-300 flex items-center gap-1.5 font-medium">
                        Lire l'article
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-transform duration-300 group-hover:translate-x-0.5">
                          <path d="M2 6H10M10 6L6 2M10 6L6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
