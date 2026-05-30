import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

export const dynamic = "force-static";

const METIER_KEYS = ["plombier", "electricien", "chauffagiste", "menuisier", "couvreur", "macon", "peintre"];
const VILLE_KEYS = ["paris", "lyon", "marseille", "toulouse", "nice", "nantes", "montpellier", "strasbourg", "bordeaux", "lille"];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://powamekka.com";

  // 1. Home page
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    // 2. Blog home page
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  // 3. Blog post detail pages (dynamic reading from JSON posts)
  const postsDirectory = path.join(process.cwd(), "content/posts");
  if (fs.existsSync(postsDirectory)) {
    const fileNames = fs.readdirSync(postsDirectory);
    const postSlugs = fileNames
      .filter((fileName) => fileName.endsWith(".json"))
      .map((fileName) => fileName.replace(/\.json$/, ""));

    for (const slug of postSlugs) {
      routes.push({
        url: `${baseUrl}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  // 4. Programmatic SEO landing pages
  for (const metier of METIER_KEYS) {
    for (const ville of VILLE_KEYS) {
      routes.push({
        url: `${baseUrl}/creation-site/${metier}/${ville}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return routes;
}
