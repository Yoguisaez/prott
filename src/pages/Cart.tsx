import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getReservation, cancelReservation } from '../api/cart';
import { Reservation, Seat } from '../types';
import { Clock, Trash2, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Cart() {
  const location = useLocation();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState<any>(location.state?.reservation || null);
  const [loading, setLoading] = useState(!location.state?.reservation);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!reservation && location.state?.reservationId) {
      loadReservation(location.state.reservationId);
    } else if (reservation) {
      updateTimer();
    }
  }, [reservation]);

  useEffect(() => {
    if (expired) return;
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [reservation, expired]);

  const loadReservation = async (id: string) => {
    try {
      const response = await getReservation(id);
      setReservation(response.data);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTimer = () => {
    if (!reservation) return;
    const expireTime = new Date(reservation.expira_en).getTime();
    const now = Date.now();
    const diff = Math.max(0, Math.floor((expireTime - now) / 1000));
    
    setTimeLeft(diff);
    
    if (diff === 0 && !expired) {
      setExpired(true);
      handleExpire();
    }
  };

  const handleExpire = async () => {
    if (reservation?.id) {
      await cancelReservation(reservation.id);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCheckout = () => {
    navigate('/checkout', { state: { reservation } });
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Cargando carrito...</div>;
  if (!reservation) return <div className="text-center p-10">Tu carrito está vacío</div>;

  if (expired) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">¡Tiempo agotado!</h2>
          <p className="text-gray-600 mb-6">
            El tiempo para completar tu compra ha expirado. Los asientos han sido liberados.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg w-full"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const seats = reservation.seats_details || [];
  const total = seats.reduce((sum: number, s: any) => sum + parseFloat(s.precio), 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Tu Carrito</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-4 border-l-4 border-blue-500 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Tiempo restante para completar compra</p>
                <p className="text-2xl font-mono font-bold text-blue-600">{formatTime(timeLeft)}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-200" />
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">{reservation.events?.titulo}</h2>
                <p className="text-gray-500">
                  {new Date(reservation.events?.fecha).toLocaleDateString()} • {reservation.events?.lugar}
                </p>
              </div>
              
              <div className="p-6 space-y-4">
                {seats.map((seat: any) => (
                  <div key={seat.id} className="flex justify-between items-center py-2 border-b last:border-0">
                    <div>
                      <p className="font-semibold">Sección {seat.seccion}</p>
                      <p className="text-sm text-gray-500">Fila {seat.fila} • Asiento {seat.numero}</p>
                    </div>
                    <p className="font-bold">$ {parseFloat(seat.precio).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-96">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-bold mb-4">Resumen</h3>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({seats.length} entradas)</span>
                  <span>$ {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Cargo por servicio</span>
                  <span>$ {(total * 0.1).toLocaleString()}</span>
                </div>
                <div className="border-t pt-4 mt-4 flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span>$ {(total * 1.1).toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors flex items-center justify-center"
              >
                Ir a Pagar
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
