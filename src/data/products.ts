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
      name: "Morocco Home Jersey 2024",
      price: 399,
      image_url: "/img1.jpeg",
      category: "Home",
      is_new: true,
      description: "Official Morocco Home Jersey 2024 – breathable, premium fabric."
    },
    {
      id: "2",
      name: "Morocco Away Jersey 2024",
      price: 379,
      image_url: "/img1.jpeg",
      category: "Away",
      is_new: false,
      description: "Stylish Morocco Away Jersey 2024 – lightweight performance fit."
    },
    {
        id: "3",
        name: "Morocco Away Jersey 2024",
        price: 379,
        image_url: "/img1.jpeg",
        category: "Away",
        is_new: false,
        description: "Stylish Morocco Away Jersey 2024 – lightweight performance fit."
      },
      {
        id: "4",
        name: "Morocco Away Jersey 2024",
        price: 379,
        image_url: "/img1.jpeg",
        category: "Away",
        is_new: false,
        description: "Stylish Morocco Away Jersey 2024 – lightweight performance fit."
      },
      
  ];
  