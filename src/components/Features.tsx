import { Shield, Truck, RefreshCw, Award } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Shield,
      title: '100% Authentique',
      description: 'Produits officiels sous licence avec garantie de qualité',
      color: 'from-red-500 to-red-600',
      delay: '0'
    },
    {
      icon: Truck,
      title: 'Livraison Gratuite',
      description: 'Expédition rapide sur toutes les commandes au Maroc',
      color: 'from-green-500 to-green-600',
      delay: '100'
    },
    {
      icon: RefreshCw,
      title: 'Retours Faciles',
      description: 'Politique de retour sans tracas de 30 jours',
      color: 'from-red-500 to-red-600',
      delay: '200'
    },
    {
      icon: Award,
      title: 'Qualité Premium',
      description: 'Matériaux de haute qualité et savoir-faire',
      color: 'from-green-500 to-green-600',
      delay: '300'
    }
  ];

  return (
    <section className="relative py-24 overflow-hidden bg-black">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-4">
            Pourquoi nous
            <span className="bg-gradient-to-r from-red-500 via-green-500 to-red-500 bg-clip-text text-transparent"> choisir ?</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            L'excellence et la satisfaction client au cœur de notre service
          </p>
        </div>

        {/* Grid de features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative"
                style={{
                  animationDelay: `${feature.delay}ms`
                }}
              >
                {/* Card */}
                <div className="relative h-full p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105">
                  {/* Glow effect on hover */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-black text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-red-400 group-hover:to-green-400 group-hover:bg-clip-text transition-all duration-300">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                      {feature.description}
                    </p>

                    {/* Decorative bar */}
                    <div className="mt-6 h-1 w-0 group-hover:w-16 bg-gradient-to-r from-red-500 to-green-500 rounded-full transition-all duration-500" />
                  </div>

                  {/* Corner accent */}
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.color} opacity-10 rounded-bl-full rounded-tr-3xl`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom accent line */}
        <div className="mt-16 flex justify-center gap-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-1 w-16 bg-gradient-to-r from-red-500 to-green-500 rounded-full"
              style={{
                opacity: 0.3 + (i * 0.2)
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}