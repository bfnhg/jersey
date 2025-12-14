export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  image_urls: string[]; // <-- Changé de 'image_url' à 'image_urls: string[]'
  category: string;
  is_new: boolean;
  description: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Maillot Domicile Maroc 2024/25",
    price: 899,
    image_url:"",
    image_urls: ["/img1_detail.webp","/img1.webp", "/img1_dos.webp"], // <-- Ajout de plusieurs URLs (simulées)
    category: "Domicile",
    is_new: true,
    description: "Maillot officiel domicile Maroc 2024/25 – Tissu respirant Dri-FIT, design premium avec étoile brodée."
  },
  {
    id: "2",
    name: "Maillot Extérieur Maroc 2024",
    price: 849,
     image_url:"",
    image_urls: [ "/mailloexterier_detail.webp","/mailloexterier.webp","/mailloexterier_dos.webp"], // <-- Ajout de plusieurs URLs (simulées)
    category: "Extérieur",
    is_new: true,
    description: "Maillot extérieur blanc élégant – Coupe slim, logo Puma et fédération brodés."
  },
  // ... autres produits mis à jour avec `image_urls`
  {
    id: "5",
    name: "Survêtement Officiel Maroc 2024",
    price: 1399,
     image_url:"",
    image_urls: ["/survetement.webp"],
    category: "Training",
    is_new: true,
    description: "Ensemble veste + pantalon – Idéal entraînement ou streetwear."
  },
  {
    id: "6",
    name: "Écharpe Supporter Maroc",
    price: 199,
     image_url:"",
    image_urls: ["/echarpe.webp"],
    category: "Accessoires",
    is_new: false,
    description: "Écharpe officielle 100% acrylique – Allez les Lions !"
  }
];