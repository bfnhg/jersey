// src/pages/Home.tsx
import Navbar from './components/Navbar';
import HeroWaves from './components/HeroWaves';
import Features from './components/Features';
import Footer from './components/Footer';
import CardJersey from './components/CardJersey';
import { products } from './data/products';
import { useCart } from './context/CartContext';
import { Link } from 'react-router-dom';

function Home() {
  const { getTotalItems } = useCart();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <Navbar cartItemCount={getTotalItems()} />

      <main>
        <HeroWaves />

        {/* Section produits */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-5xl md:text-6xl font-black text-white text-center mb-16 tracking-tight">
              COLLECTION OFFICIELLE 2024/25
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
              {products.map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="block transform transition-all duration-300 hover:scale-105"
                >
                  <CardJersey product={item} />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <Features />
      </main>

      <Footer />
    </div>
  );
}

export default Home;