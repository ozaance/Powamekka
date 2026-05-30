import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

interface Post {
  title: string;
  date: string;
  excerpt: string;
  content: string;
  slug: string;
  readTime: string;
  category: string;
}

type Props = {
  params: Promise<{ slug: string }>;
};

// Read post file by slug
function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(process.cwd(), "content/posts", `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContent) as Post;
  } catch (e) {
    return null;
  }
}

// Generate static params
export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), "content/posts");
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith(".json"))
    .map((fileName) => ({
      slug: fileName.replace(/\.json$/, ""),
    }));
}

// Metadata generator
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Article non trouvé | Powamekka",
    };
  }

  return {
    title: `${post.title} | Blog Powamekka`,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="relative min-h-screen bg-[#050508] text-[#f0f0ee]">
      <div className="noise-overlay" />
      <Navbar />

      {/* Hero section */}
      <section className="relative pt-44 pb-20 px-6 overflow-hidden">
        {/* Background glow */}
        <div 
          className="absolute rounded-full pointer-events-none opacity-20" 
          style={{
            width: 500, height: 500,
            background: "radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)",
            top: "5%", left: "50%", transform: "translateX(-50%)", filter: "blur(60px)",
          }} 
        />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          {/* Breadcrumb & Meta */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-white/35">
            <Link href="/blog" className="hover:text-[#c9a96e] transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-[#c9a96e] uppercase tracking-wider">{post.category || "Conseils"}</span>
            <span>·</span>
            <span>{post.readTime || "3 min"}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-light leading-tight text-white/88 font-display">
            {post.title}
          </h1>

          {/* Date & Author */}
          <div className="pt-2 flex items-center gap-4 border-b pb-8" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#fcf2d6] to-[#c9a96e] flex items-center justify-center text-black font-semibold text-xs font-mono">
              P
            </div>
            <div>
              <p className="text-xs text-white/75 font-medium">L'Équipe Powamekka</p>
              <p className="text-[10px] text-white/28 font-mono">
                Publié le {new Date(post.date).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-40 px-6 relative z-10">
        <article className="max-w-3xl mx-auto">
          {/* Main article content with customized formatting classes */}
          <div 
            className="text-white/58 leading-relaxed space-y-6 text-sm md:text-base font-sans
              [&_h2]:text-xl [&_h2]:md:text-2xl [&_h2]:font-light [&_h2]:text-white/88 [&_h2]:font-display [&_h2]:pt-6 [&_h2]:pb-2
              [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[#c9a96e] [&_h3]:pt-4 [&_h3]:pb-1
              [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ul]:my-4
              [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_ol]:my-4
              [&_a]:text-[#c9a96e] [&_a]:underline [&_a]:hover:text-white [&_a]:transition-colors
              [&_p]:leading-relaxed
              [&_blockquote]:border-l-2 [&_blockquote]:border-[#c9a96e] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-white/42 [&_blockquote]:my-6
              [&_strong]:text-white [&_strong]:font-semibold
            "
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Share/CTA Section */}
          <div className="mt-16 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-6" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <Link 
              href="/blog"
              className="text-xs text-white/40 hover:text-white/80 flex items-center gap-1.5 transition-colors duration-200"
              data-cursor
            >
              ← Retour au blog
            </Link>

            <Link 
              href="/#contact"
              className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300"
              style={{ background: "rgba(255,200,100,0.08)", border: "1px solid rgba(255,200,100,0.28)", color: "rgba(255,255,255,0.8)" }}
              data-cursor
            >
              Discuter d'un projet web
            </Link>
          </div>
        </article>
      </section>

      <Footer />
    </main>
  );
}
