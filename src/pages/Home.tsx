import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getEvents } from '../api/events';
import { Event } from '../types';
import { Calendar, MapPin, ArrowRight, SearchX } from 'lucide-react';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const categoria = searchParams.get('categoria');
  const busqueda = searchParams.get('busqueda');

  useEffect(() => {
    loadEvents();
  }, [categoria, busqueda]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const response = await getEvents({
        categoria: categoria || undefined,
        busqueda: busqueda || undefined
      });
      setEvents(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  // Featured event logic: Only show if no filters are active, or pick the first one from results
  const showHero = !categoria && !busqueda;
  const featuredEvent = showHero ? events[0] : null;
  const displayEvents = showHero ? events.slice(1) : events;

  return (
    <div className="pb-12">
      {/* Hero Section - Only on main page without filters */}
      {featuredEvent && (
        <div className="relative h-[500px] w-full overflow-hidden mb-12">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10"></div>
          <img 
            src={featuredEvent.imagen_url} 
            alt={featuredEvent.titulo}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 z-20 container mx-auto px-4 pb-12">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-4 inline-block">
              Destacado
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-8 max-w-3xl leading-tight">
              {featuredEvent.titulo}
            </h1>
            <Link 
              to={`/eventos/${featuredEvent.id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 inline-flex items-center gap-2"
            >
              Comprar Entradas <ArrowRight />
            </Link>
          </div>
        </div>
      )}

      <div className={`container mx-auto px-4 ${!showHero ? 'pt-8' : ''} relative z-30`}>
        {/* Categories Cards - Only on main page */}
        {showHero && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 -mt-20 relative z-30">
            {['Conciertos', 'Deportes', 'Teatro', 'Familia'].map((cat) => (
              <Link to={`/?categoria=${cat}`} key={cat} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-b-4 border-blue-500 block">
                <h3 className="font-bold text-lg text-slate-800">{cat}</h3>
                <p className="text-sm text-slate-500">Ver eventos</p>
              </Link>
            ))}
          </div>
        )}

        {/* Filter Title */}
        {(categoria || busqueda) && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              {categoria ? `Eventos de ${categoria}` : `Resultados para "${busqueda}"`}
            </h2>
            <p className="text-slate-500 mt-2">{events.length} eventos encontrados</p>
          </div>
        )}

        {/* Events Grid */}
        {!showHero && !categoria && !busqueda && (
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Más Eventos</h2>
          </div>
        )}

        {events.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-100 shadow-sm">
            <SearchX className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">No se encontraron eventos</h3>
            <p className="text-slate-500 mb-6">Intenta con otra categoría o término de búsqueda.</p>
            <Link to="/" className="text-blue-600 font-semibold hover:underline">
              Ver todos los eventos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayEvents.map((event) => (
              <Link to={`/eventos/${event.id}`} key={event.id} className="group h-full">
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col overflow-hidden border border-slate-100">
                  <div className="h-48 relative overflow-hidden">
                    <img 
                      src={event.imagen_url} 
                      alt={event.titulo}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-slate-800 shadow-sm">
                      {event.categorias?.[0] || 'Evento'}
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-blue-600 font-bold text-sm mb-1">
                          {new Date(event.fecha).toLocaleDateString('es-CL', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </div>
                        <div className="text-slate-400 text-xs font-semibold">
                          {new Date(event.fecha).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })} hrs
                        </div>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {event.titulo}
                    </h3>

                    <div className="mt-auto pt-4 border-t border-slate-100">
                      <div className="flex items-center text-slate-500 mb-2">
                        <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                        <span className="text-sm truncate">{event.lugar}, {event.ciudad}</span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xs text-slate-400">Desde</span>
                        <span className="text-lg font-bold text-slate-900">
                          ${(event.precio_min || 0).toLocaleString('es-CL')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
