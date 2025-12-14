// src/data/testimonials.ts
export type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

export const testimonials: Testimonial[] = [
  {
    quote: "Le meilleur site pour les maillots du Maroc ! Livraison ultra rapide et qualité parfaite.",
    name: "karima",
    designation: "Fan inconditionnel – Casablanca",
    src: "/trendc.webp",          // ← Image 1
  },
  {
    quote: "J’ai pris le maillot vintage 98, il est encore plus beau en vrai. Merci Morocco Store !",
    name: "Amina Zahra",
    designation: "Cliente fidèle – Marrakech",
    src: "/trendcom.webp",       // ← Image 2
  },
  {
    quote: "Service client exceptionnel, ils m’ont trouvé une taille rare en 24h seulement.",
    name: "Slama",
    designation: "Collectionneur – Marrakech",
    src: "/tre.webp",            // ← Image 3
  },
  {
    quote: "Qualité premium, emballage soigné, et prix imbattables. Je recommande à 100% !",
    name: "Sarah ",
    designation: "Cliente depuis 2022 – Agadir",
    src: "/testi.webp",          // ← Image 4
  },
  {
    quote: "J’ai commandé 5 maillots, tous parfaits. Le site numéro 1 au Maroc !",
    name: "Loubna",
    designation: "Supporter des Lions de l’Atlas – Tanger",
    src: "/trend.webp",          // ← Image 5 (j'ai réutilisé la première, change si tu as une 5e image)
  },
];