import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getEventById } from '../api/events';
import { Event } from '../types';
import { Calendar, MapPin, Clock, ArrowLeft, Ticket, Info, CheckCircle2, ArrowRight, Tag, Timer } from 'lucide-react';

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadEvent(id);
    }
  }, [id]);

  const loadEvent = async (eventId: string) => {
    try {
      const response = await getEventById(eventId);
      setEvent(response.data);
    } catch (err) {
      setError('Error al cargar el evento');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyTickets = () => {
    if (!id) return;
    navigate(`/seleccion-asientos/${id}`);
  };

  const now = new Date();
  const salesStart = event?.inicio_venta ? new Date(event.inicio_venta) : null;
  const salesEnd = event?.fin_venta ? new Date(event.fin_venta) : null;
  
  const isSaleOpen = (!salesStart || now >= salesStart) && (!salesEnd || now <= salesEnd);
  const isPreSale = salesStart && now < salesStart;
  const isSaleEnded = salesEnd && now > salesEnd;

  if (loading) return (
    <div className="flex justify-center items-center h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (error || !event) return <div className="text-red-500 text-center p-10">{error || 'Evento no encontrado'}</div>;

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      {/* Hero Header with Blurred Background */}
      <div className="relative h-[400px] overflow-hidden bg-slate-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 blur-xl scale-110"
          style={{ backgroundImage: `url(${event.imagen_url})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
        
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-end pb-12">
          <Link to="/" className="inline-flex items-center text-slate-300 hover:text-white mb-6 transition-colors absolute top-8 left-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a eventos
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-end">
            <div className="hidden md:block w-64 h-64 rounded-xl overflow-hidden shadow-2xl border-4 border-white/10 shrink-0">
              <img 
                src={event.imagen_url} 
                alt={event.titulo}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 mb-2">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full uppercase text-xs font-bold tracking-wider mb-4 inline-block shadow-lg">
                {event.categorias?.[0] || 'Evento'}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                {event.titulo}
              </h1>
              
              <div className="flex flex-wrap gap-6 text-slate-200">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <span className="font-medium">{new Date(event.fecha).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span className="font-medium">{new Date(event.fecha).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })} hrs</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span className="font-medium">{event.lugar}, {event.ciudad}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Info className="text-blue-600" size={24} />
              Información del Evento
            </h2>
            <div 
              className="text-slate-600 leading-relaxed text-lg event-description"
              dangerouslySetInnerHTML={{ __html: event.descripcion || 'No hay descripción disponible para este evento.' }}
            />
          </div>

          {/* Mapa Visual del Recinto */}
          {event.sections && event.sections.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <MapPin className="text-blue-600" size={24} />
                Mapa del Recinto
              </h2>
              <div className="w-full aspect-video bg-gray-50 rounded-lg border border-gray-200 relative select-none">
                {/* Escenario */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-1 rounded shadow-md text-xs font-bold z-10 tracking-widest">
                  ESCENARIO
                </div>
                
                {/* Sectores */}
                {event.sections.map(section => (
                  <div
                    key={section.id}
                    className="absolute rounded-md shadow-sm border border-white/30 flex items-center justify-center text-center transition-all hover:scale-[1.02] hover:shadow-lg group cursor-help hover:z-50"
                    style={{
                      left: `${section.visualX}%`,
                      top: `${section.visualY}%`,
                      width: `${section.width}%`,
                      height: `${section.height}%`,
                      backgroundColor: section.color || '#cbd5e1'
                    }}
                  >
                    <span className="text-white font-bold text-xs md:text-sm drop-shadow-md px-1 truncate w-full pointer-events-none">
                      {section.name}
                    </span>
                    
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900/90 text-white text-xs p-2 rounded shadow-xl whitespace-nowrap z-[100] pointer-events-none min-w-max">
                      <div className="font-bold mb-1">{section.name}</div>
                      <div className="text-green-400 font-mono text-sm">${section.price.toLocaleString()}</div>
                      <div className="text-gray-400 text-[10px] mt-1">
                        {section.type === 'assigned' ? 'Asientos Numerados' : 'General / De Pie'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-xs text-slate-400 mt-4 italic">* Mapa referencial. La distribución puede variar.</p>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Ticket className="text-blue-600" size={24} />
              Localidades y Precios
            </h2>
            
            <div className="space-y-4">
              {event.ticketTypes?.map((type) => (
                <div key={type.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors">
                  <div>
                    <h3 className="font-bold text-slate-800">{type.name}</h3>
                    <p className="text-sm text-slate-500">{type.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">
                      ${type.price.toLocaleString('es-CL')}
                    </p>
                    <p className="text-xs text-slate-400">
                      + Cargo por servicio
                    </p>
                  </div>
                </div>
              ))}
              
              {!event.ticketTypes && (
                <div className="text-center py-8 text-slate-500">
                  Precios disponibles en la selección de asientos.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar / Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 sticky top-24">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Resumen de Compra</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="text-slate-600">Fecha</span>
                <span className="font-medium text-slate-900">{new Date(event.fecha).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="text-slate-600">Hora</span>
                <span className="font-medium text-slate-900">{new Date(event.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="text-slate-600">Recinto</span>
                <span className="font-medium text-slate-900 text-right">{event.lugar}</span>
              </div>
              
              {/* Plazos de Venta */}
              {(salesStart || salesEnd) && (
                <div className="bg-blue-50 p-3 rounded-lg text-sm space-y-2">
                  {salesStart && (
                    <div className="flex items-center text-blue-800">
                      <Clock size={14} className="mr-2" />
                      <span>Inicio: {salesStart.toLocaleDateString()} {salesStart.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  )}
                  {salesEnd && (
                    <div className="flex items-center text-red-800">
                      <Timer size={14} className="mr-2" />
                      <span>Cierre: {salesEnd.toLocaleDateString()} {salesEnd.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button 
              onClick={handleBuyTickets}
              disabled={!isSaleOpen}
              className={`w-full font-bold py-4 px-6 rounded-xl shadow-md transition-all transform flex items-center justify-center gap-2 text-lg
                ${isSaleOpen 
                  ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              {isPreSale ? 'Venta no iniciada' : isSaleEnded ? 'Venta finalizada' : 'Seleccionar Entradas'}
              {isSaleOpen && <ArrowRight size={20} />}
            </button>
            
            {/* Descuentos Disponibles */}
            {event.discounts && event.discounts.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <Tag size={16} className="text-green-600" />
                  Descuentos Disponibles
                </h4>
                <div className="space-y-2">
                  {event.discounts.map(discount => (
                    <div key={discount.id} className="bg-green-50 text-green-800 px-3 py-2 rounded text-sm flex justify-between items-center">
                      <span>{discount.name}</span>
                      <span className="font-bold">
                        {discount.type === 'percentage' ? `${discount.value}% OFF` : `$${discount.value} OFF`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
              <CheckCircle2 size={14} className="text-green-500" />
              <span>Compra 100% segura y garantizada</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
