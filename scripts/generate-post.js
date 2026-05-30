const fs = require("fs");
const path = require("path");

const METIERS = [
  { key: "plombier", label: "Plombier" },
  { key: "electricien", label: "Électricien" },
  { key: "chauffagiste", label: "Chauffagiste" },
  { key: "menuisier", label: "Menuisier" },
  { key: "couvreur", label: "Couvreur" },
  { key: "macon", label: "Maçon" },
  { key: "peintre", label: "Peintre" }
];

const VILLES = [
  "Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Nantes", "Montpellier", "Strasbourg", "Bordeaux", "lille"
];

const TOPICS = [
  "Comment le SEO local et Google Maps peuvent doubler le nombre de chantiers d'un artisan",
  "Pourquoi un site internet au design premium et haut de gamme inspire plus confiance qu'un site amateur",
  "Les 5 éléments indispensables sur le site internet d'une entreprise du bâtiment pour capter des devis",
  "Comment présenter ses réalisations et travaux de manière professionnelle sur son site internet",
  "Pourquoi la vitesse de chargement sur mobile est cruciale pour le site web d'un artisan en urgence",
  "Comment obtenir et utiliser les avis clients 5 étoiles pour dominer la recherche locale sur Google",
  "Pourquoi les artisans du bâtiment doivent avoir un site web sécurisé (HTTPS) et conforme aux normes modernes",
  "Comment valoriser ses certifications (RGE, décennale, Qualibat) sur internet pour rassurer ses clients"
];

async function generatePost() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Erreur : La variable d'environnement GEMINI_API_KEY est manquante.");
    process.exit(1);
  }

  // 1. Select a random metier, ville, and topic
  const metier = METIERS[Math.floor(Math.random() * METIERS.length)];
  const ville = VILLES[Math.floor(Math.random() * VILLES.length)];
  const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];

  console.log(`Sélection de la thématique : ${topic} pour un ${metier.label} à ${ville}`);

  // 2. Build the prompt
  const prompt = `Tu es un expert en SEO, en marketing digital et en création de sites internet premium pour les artisans du bâtiment et les PME chez Powamekka.
Écris un article de blog expert, captivant et très informatif en français.
Sujet : ${topic}
Cible spécifique : ${metier.label} à ${ville}.
L'article doit expliquer comment les professionnels de ce secteur peuvent développer leur activité, rassurer leurs prospects et attirer plus de clients grâce à un site internet haut de gamme et un bon référencement local.

Tu dois répondre UNIQUEMENT avec un objet JSON au format exact suivant, sans blocs de code markdown (pas de "json" ou de triple backticks), simplement le texte JSON :
{
  "title": "Un titre d'article de blog percutant, captivant et optimisé SEO en français (environ 60-70 caractères)",
  "excerpt": "Une méta-description/résumé accrocheur pour donner envie de lire (environ 150 caractères)",
  "content": "Le corps de l'article au format HTML (environ 600-800 mots). Utilise des balises <h2>, <h3>, <p>, <ul>, <li>, <strong>, et <blockquote> pour structurer ton texte. N'ajoute pas de balises <html>, <head> ou <body>. Mets en valeur le professionnalisme, le design premium et le fait que l'agence web Powamekka résout ces problématiques.",
  "slug": "le-slug-de-l-url-sans-accent-ni-caractere-special-uniquement-lettres-chiffres-et-tirets",
  "readTime": "X min de lecture",
  "category": "Catégorie de l'article (choisis une parmi : Référencement, Stratégie, Design, Web)"
}`;

  // 3. Request Gemini API
  console.log("Appel de l'API Gemini...");
  // Using Gemini 2.5 Flash model
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;

    // 4. Parse the result
    let jsonText = responseText.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.substring(7);
    }
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.substring(3);
    }
    if (jsonText.endsWith("```")) {
      jsonText = jsonText.substring(0, jsonText.length - 3);
    }
    jsonText = jsonText.trim();

    const postData = JSON.parse(jsonText);

    // Validate fields
    if (!postData.title || !postData.content || !postData.slug) {
      throw new Error("L'API n'a pas renvoyé tous les champs obligatoires (title, content, slug).");
    }

    // Add today's date
    postData.date = new Date().toISOString();

    // 5. Save the file
    const postsDir = path.join(__dirname, "../content/posts");
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
    }

    // Clean slug for safety
    const safeSlug = postData.slug
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    postData.slug = safeSlug;

    const filePath = path.join(postsDir, `${safeSlug}.json`);
    fs.writeFileSync(filePath, JSON.stringify(postData, null, 2), "utf8");
    console.log(`Succès ! Article enregistré sous : ${filePath}`);
    console.log(`Titre : "${postData.title}"`);

  } catch (error) {
    console.error("Une erreur est survenue lors de la génération de l'article :", error);
    process.exit(1);
  }
}

generatePost();
