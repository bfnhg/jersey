// src/data/products.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  is_new: boolean;
  description: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Maillot Domicile Maroc 2024/25",
    price: 899,
    image_url: "/img/home-2024.jpg",
    category: "Domicile",
    is_new: true,
    description: "Maillot officiel domicile Maroc 2024/25 – Tissu respirant Dri-FIT, design premium avec étoile brodée."
  },
  {
    id: "2",
    name: "Maillot Extérieur Maroc 2024",
    price: 849,
    image_url: "/img/away-2024.jpg",
    category: "Extérieur",
    is_new: true,
    description: "Maillot extérieur blanc élégant – Coupe slim, logo Puma et fédération brodés."
  },
  {
    id: "3",
    name: "Maillot Third Maroc – Édition Noir & Or",
    price: 999,
    image_url: "/img/third-black.jpg",
    category: "Third",
    is_new: true,
    description: "Édition limitée noir mat avec détails dorés – Ultra premium."
  },
  {
    id: "4",
    name: "Maillot Rétro Maroc 1998",
    price: 749,
    image_url: "/img/retro-1998.jpg",
    category: "Rétro",
    is_new: false,
    description: "Réplique fidèle du mythique maillot de France 98."
  },
  {
    id: "5",
    name: "Survêtement Officiel Maroc 2024",
    price: 1399,
    image_url: "/img/training.jpg",
    category: "Training",
    is_new: true,
    description: "Ensemble veste + pantalon – Idéal entraînement ou streetwear."
  },
  {
    id: "6",
    name: "Écharpe Supporter Maroc",
    price: 199,
    image_url: "/img/echarpe.jpg",
    category: "Accessoires",
    is_new: false,
    description: "Écharpe officielle 100% acrylique – Allez les Lions !"
  }
];