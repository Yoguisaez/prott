import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { processPayment } from '../api/checkout';
import { CreditCard, Lock, ShieldCheck } from 'lucide-react';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const reservation = location.state?.reservation;
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  if (!reservation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">No hay reserva activa</h2>
          <button onClick={() => navigate('/')} className="text-blue-600 underline">Volver al inicio</button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await processPayment(reservation.id, {
        method: 'credit_card',
        ...formData
      });

      if (response.success) {
        navigate('/mis-entradas', { state: { purchaseId: response.data.purchaseId, newPurchase: true } });
      }
    } catch (error: any) {
      alert(error.message || 'Error en el pago');
    } finally {
      setLoading(false);
    }
  };

  const total = reservation.seats_details?.reduce((sum: number, s: any) => sum + parseFloat(s.precio), 0) * 1.1 || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Pago Seguro</h1>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
            <div>
              <p className="opacity-80">Total a pagar</p>
              <p className="text-3xl font-bold">$ {total.toLocaleString()}</p>
            </div>
            <ShieldCheck className="w-8 h-8 opacity-80" />
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre en la tarjeta</label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Juan Pérez"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Número de tarjeta</label>
              <div className="relative">
                <input
                  type="text"
                  name="cardNumber"
                  required
                  maxLength={19}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="0000 0000 0000 0000"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                />
                <CreditCard className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiración</label>
                <input
                  type="text"
                  name="expiry"
                  required
                  maxLength={5}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="MM/YY"
                  value={formData.expiry}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                <div className="relative">
                  <input
                    type="text"
                    name="cvc"
                    required
                    maxLength={3}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="123"
                    value={formData.cvc}
                    onChange={handleInputChange}
                  />
                  <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg shadow-md transition-all transform hover:-translate-y-1 mt-6 flex justify-center items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Procesando pago...' : `Pagar $ ${total.toLocaleString()}`}
            </button>

            <p className="text-center text-xs text-gray-500 mt-4 flex justify-center items-center">
              <Lock className="w-3 h-3 mr-1" />
              Tus datos están encriptados y seguros
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
