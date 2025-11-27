import { Shield, Truck, RefreshCw, Award } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Shield,
      title: '100% Authentic',
      description: 'Official licensed products with quality guarantee',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Truck,
      title: 'Free Delivery',
      description: 'Fast shipping on all orders across Morocco',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: RefreshCw,
      title: 'Easy Returns',
      description: '30-day hassle-free return policy',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'High-quality materials and craftsmanship',
      color: 'from-green-500 to-green-600'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group text-center p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>

                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
