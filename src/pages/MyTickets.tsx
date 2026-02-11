import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { getMyTickets } from '../api/tickets';
import { ArrowLeft, Download, Share2, Calendar, MapPin, Ticket as TicketIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MyTickets() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const userId = localStorage.getItem('ticket_user_id');

  useEffect(() => {
    if (!userId) {
      navigate('/');
      return;
    }

    if (location.state?.newPurchase) {
      triggerConfetti();
    }

    loadTickets();
  }, [userId]);

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const loadTickets = async () => {
    try {
      const response = await getMyTickets(userId!);
      setTickets(response.data);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Cargando entradas...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver a eventos
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Mis Entradas</h1>
        </div>

        {tickets.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <TicketIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-600 mb-2">No tienes entradas aún</h2>
            <p className="text-gray-500 mb-6">¿Buscas algo divertido para hacer?</p>
            <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Ver eventos
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {tickets.map((ticket) => {
              const event = ticket.purchases.events;
              const seat = ticket.seats;
              
              return (
                <div key={ticket.id} className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col md:flex-row">
                  <div className="md:w-1/3 bg-gray-200 relative min-h-[200px]">
                    <img 
                      src={event.imagen_url || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'} 
                      alt={event.titulo}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 md:hidden">
                      <h3 className="text-white font-bold text-xl">{event.titulo}</h3>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3 p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 hidden md:block mb-2">{event.titulo}</h3>
                        <div className="flex flex-col gap-1 text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(event.fecha).toLocaleDateString()} • {new Date(event.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {event.lugar}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${ticket.codigo_qr}`} 
                          alt="QR Code" 
                          className="w-24 h-24 rounded-lg border-2 border-gray-100"
                        />
                      </div>
                    </div>

                    <div className="border-t border-dashed my-4"></div>

                    <div className="flex justify-between items-end">
                      <div className="grid grid-cols-3 gap-8">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider">Sección</p>
                          <p className="font-bold text-lg">{seat.seccion}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider">Fila</p>
                          <p className="font-bold text-lg">{seat.fila}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider">Asiento</p>
                          <p className="font-bold text-lg">{seat.numero}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Descargar">
                          <Download className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Compartir">
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
