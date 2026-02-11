import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useWaitingRoom } from '../hooks/useWaitingRoom';
import { Loader2 } from 'lucide-react';

export default function WaitingRoom() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, position, estimatedWait, joinQueue } = useWaitingRoom(eventId || '');
  const eventTitle = location.state?.eventTitle || 'Evento';

  useEffect(() => {
    if (status === 'not_in_queue') {
      joinQueue();
    } else if (status === 'active') {
      navigate(`/seleccion-asientos/${eventId}`);
    }
  }, [status, eventId, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl p-8 shadow-2xl text-center">
        <h1 className="text-3xl font-bold mb-2">Sala de Espera Virtual</h1>
        <p className="text-blue-400 mb-8 font-medium">{eventTitle}</p>

        <div className="mb-8 relative">
          <div className="w-48 h-48 mx-auto border-8 border-gray-700 rounded-full flex items-center justify-center relative">
            <div className="absolute inset-0 border-8 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <div className="flex flex-col items-center z-10">
              <span className="text-5xl font-bold">{position !== null ? position : '-'}</span>
              <span className="text-sm text-gray-400 mt-1">Tu posición</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-700/50 p-4 rounded-xl">
            <div className="flex items-center justify-center text-gray-300 mb-1">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              <span className="text-sm">Tiempo estimado</span>
            </div>
            <p className="text-2xl font-bold">
              {estimatedWait ? `${estimatedWait} min` : 'Calculando...'}
            </p>
          </div>
          
          <p className="text-sm text-gray-400 leading-relaxed">
            Estás en la fila para comprar entradas. Por favor no cierres ni recargues esta página, o podrías perder tu lugar. Te redirigiremos automáticamente cuando sea tu turno.
          </p>
        </div>
      </div>
    </div>
  );
}
