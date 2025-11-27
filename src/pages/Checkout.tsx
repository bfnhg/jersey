import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Check, AlertCircle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productId = searchParams.get('product');
  const quantity = parseInt(searchParams.get('quantity') || '1');

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deliveryAddress: '',
    city: '',
    postalCode: '',
    quantity: quantity,
    notes: '',
  });

  useEffect(() => {
    if (!productId) {
      navigate('/');
      return;
    }

    async function fetchProduct() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, price, image_url')
          .eq('id', productId)
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          navigate('/');
          return;
        }

        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setErrorMsg('Failed to load product');
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setFormData((prev) => ({
      ...prev,
      quantity: Math.max(1, value),
    }));
  };

  const validateForm = () => {
    if (!formData.customerName.trim()) {
      setErrorMsg('Please enter your full name');
      return false;
    }
    if (!formData.customerEmail.trim()) {
      setErrorMsg('Please enter your email');
      return false;
    }
    if (!formData.customerEmail.includes('@')) {
      setErrorMsg('Please enter a valid email');
      return false;
    }
    if (!formData.customerPhone.trim()) {
      setErrorMsg('Please enter your phone number');
      return false;
    }
    if (!formData.deliveryAddress.trim()) {
      setErrorMsg('Please enter your delivery address');
      return false;
    }
    if (!formData.city.trim()) {
      setErrorMsg('Please enter your city');
      return false;
    }
    if (!formData.postalCode.trim()) {
      setErrorMsg('Please enter your postal code');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!validateForm()) {
      return;
    }

    if (!product) return;

    setSubmitting(true);

    try {
      const totalPrice = product.price * formData.quantity;

      const { error } = await supabase.from('orders').insert([
        {
          customer_name: formData.customerName,
          customer_email: formData.customerEmail,
          customer_phone: formData.customerPhone,
          delivery_address: formData.deliveryAddress,
          city: formData.city,
          postal_code: formData.postalCode,
          product_id: productId,
          quantity: formData.quantity,
          total_price: totalPrice,
          payment_method: 'cash_on_delivery',
          order_status: 'pending',
          notes: formData.notes,
        },
      ]);

      if (error) throw error;

      setOrderSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Error submitting order:', error);
      setErrorMsg('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Product not found</p>
        </div>
      </div>
    );
  }

  const totalPrice = product.price * formData.quantity;

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white pt-20 pb-12 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="inline-flex p-4 bg-green-100 rounded-full mb-6">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your order. We will contact you soon to confirm delivery details.
          </p>
          <p className="text-gray-600 mb-8">
            Redirecting to home page in a few seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
              {errorMsg && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-700 font-medium">{errorMsg}</p>
                </div>
              )}

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                      placeholder="+212 612 345 678"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Information</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Delivery Address *
                    </label>
                    <input
                      type="text"
                      name="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                      placeholder="Street address"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                        placeholder="e.g. Casablanca"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                        placeholder="Postal code"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Notes</h2>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Any special instructions or notes..."
                  rows={4}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-red-600 to-green-600 text-white font-bold py-4 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {submitting ? 'Processing...' : 'Confirm Order - Cash on Delivery'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h3>

              <div className="mb-6 pb-6 border-b border-gray-200">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <p className="text-gray-900 font-semibold">{product.name}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Price per item:</span>
                  <span className="font-semibold">{product.price.toFixed(2)} MAD</span>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quantity:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={handleQuantityChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-green-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total:</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
                    {totalPrice.toFixed(2)} MAD
                  </span>
                </div>
              </div>

              <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-semibold text-gray-900">Payment Method</p>
                <p className="text-lg font-bold text-blue-600">Cash on Delivery</p>
                <p className="text-sm text-gray-600">
                  Pay the delivery person when your package arrives
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
