import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSeats, reserveSeats } from '../api/seats';
import { getEventById } from '../api/events';
import { Seat, Event, Section } from '../types';
import { ArrowRight, ArrowLeft, ShoppingCart, User, MapPin, Grid, Users, ZoomIn, X, ChevronUp, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/auth/AuthModal';

export default function SeatSelection() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [allSeats, setAllSeats] = useState<Seat[]>([]); // Todos los asientos del evento
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]); // IDs de asientos seleccionados
  
  // Manejo de entradas generales (ID ficticios para carrito)
  const [generalSelection, setGeneralSelection] = useState<Record<string, number>>({}); 

  const [activeSection, setActiveSection] = useState<Section | null>(null); // Sector visualizando actualmente
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingReservation, setPendingReservation] = useState(false);
  const [showMobileSummary, setShowMobileSummary] = useState(false); // Mobile summary toggle

  useEffect(() => {
    if (eventId) {
      loadData(eventId);
    }
  }, [eventId]);

  useEffect(() => {
    if (user && pendingReservation) {
      processReservation();
      setPendingReservation(false);
    }
  }, [user]);

  const loadData = async (id: string) => {
    try {
      const [eventData, seatsData] = await Promise.all([
        getEventById(id),
        getSeats(id)
      ]);
      setEvent(eventData.data);
      setAllSeats(seatsData.data);
    } catch (err) {
      console.error('Error loading data', err);
    } finally {
      setLoading(false);
    }
  };

  // --- Lógica de Selección (Numerada) ---
  const toggleSeat = (seatId: string) => {
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    );
  };

  // --- Lógica de Selección (General) ---
  const updateGeneralQuantity = (sectionId: string, delta: number, max: number) => {
    setGeneralSelection(prev => {
      const current = prev[sectionId] || 0;
      const next = Math.max(0, Math.min(max, current + delta));
      if (next === 0) {
        const { [sectionId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [sectionId]: next };
    });
  };

  // --- Cálculo de Totales ---
  const calculateTotal = () => {
    let total = 0;
    
    // Sumar asientos numerados
    selectedSeats.forEach(seatId => {
      const seat = allSeats.find(s => s.id === seatId);
      if (seat) total += seat.precio;
    });

    // Sumar entradas generales
    Object.entries(generalSelection).forEach(([sectionId, qty]) => {
      const section = event?.sections?.find(s => s.id === sectionId);
      if (section) total += section.price * qty;
    });

    return total;
  };

  const processReservation = async () => {
    if (!user) return;
    
    // Combinar selecciones para el backend
    const generalSeatIds: string[] = [];
    Object.entries(generalSelection).forEach(([sectionId, qty]) => {
      for(let i=0; i<qty; i++) generalSeatIds.push(`gen-${sectionId}-${Date.now()}-${i}`);
    });

    const finalSeatList = [...selectedSeats, ...generalSeatIds];

    if (finalSeatList.length === 0) return;

    setProcessing(true);
    try {
      const response = await reserveSeats(eventId!, user.id, finalSeatList);
      if (response.success) {
        navigate('/carrito', { state: { reservation: response.data } });
      }
    } catch (err: any) {
      alert(err.message || 'Error al reservar asientos');
    } finally {
      setProcessing(false);
    }
  };

  const handleReservation = () => {
    const hasSelection = selectedSeats.length > 0 || Object.keys(generalSelection).length > 0;
    if (!hasSelection) return;
    
    if (!user) {
      setPendingReservation(true);
      setIsAuthModalOpen(true);
      return;
    }

    processReservation();
  };

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
    if (!user) {
      setPendingReservation(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  // Filtrar asientos para el sector activo (si es numerado)
  const activeSeats = activeSection?.type === 'assigned' 
    ? allSeats.filter(s => s.seccion === activeSection.name) 
    : [];

  const total = calculateTotal();
  const hasSelection = selectedSeats.length > 0 || Object.keys(generalSelection).length > 0;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50 relative">
      {/* Header Bar */}
      <div className="bg-white shadow-sm border-b border-slate-200 px-4 py-3 md:px-6 md:py-4 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
          <button onClick={() => activeSection ? setActiveSection(null) : navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors flex items-center gap-1 md:gap-2 text-slate-600 font-medium shrink-0">
            <ArrowLeft size={20} />
            <span className="hidden md:inline">{activeSection ? 'Volver al mapa' : 'Volver'}</span>
          </button>
          <div className="overflow-hidden">
            <h1 className="font-bold text-slate-900 truncate">{event?.titulo}</h1>
            <p className="text-xs text-slate-500 truncate hidden md:block">{event?.lugar}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-6 shrink-0">
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold hidden md:block">Total</p>
            <p className="text-lg md:text-xl font-bold text-blue-600">${total.toLocaleString('es-CL')}</p>
          </div>
          
          <button 
            onClick={handleReservation}
            disabled={!hasSelection || processing}
            className={`
              flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-xl font-bold text-white shadow-lg transition-all transform
              ${hasSelection && !processing
                ? 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5' 
                : 'bg-slate-300 cursor-not-allowed'}
            `}
          >
            {processing ? <span className="text-sm">Procesando...</span> : <><span className="hidden md:inline">Continuar</span><ArrowRight size={18} /></>}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          
          {/* VIEW 1: GLOBAL MAP (Selector de Sectores) */}
          {!activeSection && (
            <div className="flex-1 overflow-auto bg-slate-100 p-4 md:p-8 flex items-center justify-center">
              <div className="w-full max-w-5xl">
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 text-center">Selecciona un sector</h2>
                
                {event?.sections && event.sections.length > 0 ? (
                  <div className="w-full aspect-video bg-white rounded-xl shadow-2xl border border-slate-200 relative overflow-hidden transform transition-all hover:shadow-3xl">
                     {/* Escenario */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 md:px-8 py-2 rounded-lg shadow-lg text-xs md:text-sm font-bold z-10 tracking-[0.2em]">
                      ESCENARIO
                    </div>

                    {event.sections.map(section => (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section)}
                        className="absolute rounded-lg shadow-md border-2 border-white/50 flex flex-col items-center justify-center text-center transition-all hover:scale-[1.05] hover:shadow-xl hover:z-20 hover:border-white group"
                        style={{
                          left: `${section.visualX}%`,
                          top: `${section.visualY}%`,
                          width: `${section.width}%`,
                          height: `${section.height}%`,
                          backgroundColor: section.color || '#cbd5e1'
                        }}
                      >
                        <span className="text-white font-bold text-[10px] md:text-lg drop-shadow-md px-1 truncate w-full group-hover:scale-110 transition-transform">
                          {section.name}
                        </span>
                        <div className="bg-black/20 text-white text-[8px] md:text-xs px-2 py-0.5 rounded-full mt-1 backdrop-blur-sm hidden sm:block">
                           ${section.price.toLocaleString()}
                        </div>
                        {section.type === 'assigned' && <Grid className="text-white/50 w-3 h-3 md:w-4 md:h-4 absolute top-1 right-1" />}
                        {section.type === 'general' && <Users className="text-white/50 w-3 h-3 md:w-4 md:h-4 absolute top-1 right-1" />}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-12 bg-white rounded-xl shadow">
                    <p className="text-slate-500 mb-4">Este evento no tiene un mapa configurado.</p>
                    <div className="grid gap-4 max-w-md mx-auto">
                       <p>Por favor contacta al administrador.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW 2: SECTOR DETAIL (Selección de Asientos/Entradas) */}
          {activeSection && (
            <div className="flex-1 overflow-auto bg-slate-200 p-4 md:p-8 relative flex flex-col items-center pb-32 md:pb-8">
              
              <div className="bg-white p-4 md:p-6 rounded-2xl shadow-xl max-w-4xl w-full mb-8 z-10">
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800">{activeSection.name}</h2>
                    <p className="text-sm text-slate-500 flex items-center gap-2">
                      {activeSection.type === 'assigned' ? <Grid size={16}/> : <Users size={16}/>}
                      {activeSection.type === 'assigned' ? 'Asientos Numerados' : 'Entrada General'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase font-semibold hidden md:block">Precio Entrada</p>
                    <p className="text-xl md:text-3xl font-bold text-blue-600">${activeSection.price.toLocaleString()}</p>
                  </div>
                </div>

                {/* CASO 1: ASIENTOS NUMERADOS */}
                {activeSection.type === 'assigned' && (
                  <div className="w-full overflow-x-auto pb-12 pt-4">
                    <div className="flex flex-col gap-3 min-w-max px-8 mx-auto items-center">
                      {/* Agrupar por filas */}
                      {(() => {
                        // Obtener filas únicas y ordenarlas
                        const rows = Array.from(new Set(activeSeats.map(s => s.fila))).sort();
                        
                        return rows.map(row => (
                          <div key={row} className="flex items-center gap-4">
                            {/* Etiqueta de Fila (Izquierda) */}
                            <div className="w-8 text-right font-bold text-slate-400 text-sm sticky left-0">{row}</div>
                            
                            {/* Asientos de la Fila */}
                            <div className="flex gap-2">
                              {activeSeats
                                .filter(s => s.fila === row)
                                .sort((a, b) => parseInt(a.numero) - parseInt(b.numero))
                                .map(seat => {
                                  const isSelected = selectedSeats.includes(seat.id);
                                  const isAvailable = seat.estado === 'available';
                                  
                                  return (
                                    <button
                                      key={seat.id}
                                      onClick={() => isAvailable && toggleSeat(seat.id)}
                                      disabled={!isAvailable}
                                      title={`Fila ${seat.fila} - Asiento ${seat.numero}`}
                                      className={`
                                        w-8 h-8 md:w-9 md:h-9 rounded-t-lg text-[10px] md:text-xs font-bold transition-all transform duration-150
                                        flex items-center justify-center border-b-[3px] shadow-sm
                                        ${isSelected 
                                          ? 'bg-blue-600 border-blue-800 text-white shadow-lg scale-110 -translate-y-1 z-10' 
                                          : isAvailable 
                                            ? 'bg-white border-slate-300 text-slate-500 hover:border-blue-500 hover:bg-blue-50 hover:-translate-y-0.5' 
                                            : 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed opacity-60'}
                                      `}
                                    >
                                      {seat.numero}
                                    </button>
                                  );
                                })}
                            </div>
                            
                            {/* Etiqueta de Fila (Derecha) */}
                            <div className="w-8 text-left font-bold text-slate-400 text-sm sticky right-0">{row}</div>
                          </div>
                        ));
                      })()}
                    </div>

                    {activeSeats.length === 0 && (
                      <div className="py-12 text-center text-slate-400">
                        No se encontraron asientos para este sector.
                      </div>
                    )}
                  </div>
                )}

                {/* CASO 2: ENTRADA GENERAL */}
                {activeSection.type === 'general' && (
                  <div className="py-8 md:py-12 flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-slate-600 mb-6 text-lg">Selecciona la cantidad de entradas</p>
                    
                    <div className="flex items-center gap-6 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
                      <button 
                        onClick={() => updateGeneralQuantity(activeSection.id, -1, 10)}
                        className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                        disabled={!generalSelection[activeSection.id]}
                      >
                        <span className="text-2xl font-bold">-</span>
                      </button>
                      
                      <span className="text-4xl font-bold text-slate-900 w-16 text-center">
                        {generalSelection[activeSection.id] || 0}
                      </span>
                      
                      <button 
                        onClick={() => updateGeneralQuantity(activeSection.id, 1, 10)}
                        className="w-12 h-12 rounded-xl bg-blue-100 hover:bg-blue-200 flex items-center justify-center text-blue-700 transition-colors"
                      >
                        <span className="text-2xl font-bold">+</span>
                      </button>
                    </div>
                    
                    <p className="mt-4 text-sm text-slate-400">Máximo 10 entradas por persona</p>
                  </div>
                )}
              </div>

              {/* Stage Reference for Detail View */}
              {activeSection.type === 'assigned' && (
                 <div className="w-1/2 mx-auto h-4 bg-slate-300 rounded-full mb-8 relative opacity-50">
                    <span className="absolute top-full left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest text-slate-500 mt-1">Escenario</span>
                 </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Summary (Desktop) */}
        <div className="hidden lg:flex w-80 bg-white border-l border-slate-200 flex-col shadow-xl z-30">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <ShoppingCart size={20} className="text-blue-600"/> Tu Selección
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <SummaryList 
              selectedSeats={selectedSeats} 
              allSeats={allSeats} 
              generalSelection={generalSelection} 
              event={event} 
              toggleSeat={toggleSeat} 
              updateGeneralQuantity={updateGeneralQuantity} 
            />
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-600 font-medium">Total a Pagar</span>
              <span className="text-2xl font-bold text-slate-900">${total.toLocaleString()}</span>
            </div>
            <button 
              onClick={handleReservation}
              disabled={!hasSelection || processing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors shadow-lg"
            >
              Ir a Pagar
            </button>
          </div>
        </div>

        {/* Mobile Summary Sheet */}
        {hasSelection && (
          <div className={`lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)] rounded-t-2xl z-40 transition-transform duration-300 ${showMobileSummary ? 'translate-y-0' : 'translate-y-[calc(100%-80px)]'}`}>
            <button 
              onClick={() => setShowMobileSummary(!showMobileSummary)}
              className="w-full p-4 flex items-center justify-between border-b border-slate-100 bg-white rounded-t-2xl active:bg-slate-50"
            >
              <div className="flex items-center gap-2">
                <ShoppingCart size={20} className="text-blue-600"/>
                <span className="font-bold text-slate-800">Tu Selección ({selectedSeats.length + Object.values(generalSelection).reduce((a,b)=>a+b, 0)})</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-blue-600 text-lg">${total.toLocaleString()}</span>
                {showMobileSummary ? <ChevronDown size={20} className="text-slate-400" /> : <ChevronUp size={20} className="text-slate-400" />}
              </div>
            </button>
            
            <div className="p-4 max-h-[50vh] overflow-y-auto bg-slate-50">
              <SummaryList 
                selectedSeats={selectedSeats} 
                allSeats={allSeats} 
                generalSelection={generalSelection} 
                event={event} 
                toggleSeat={toggleSeat} 
                updateGeneralQuantity={updateGeneralQuantity} 
              />
              <button 
                onClick={handleReservation}
                disabled={!hasSelection || processing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors shadow-lg mt-4"
              >
                Ir a Pagar
              </button>
            </div>
          </div>
        )}
      </div>
      
      <AuthModal isOpen={isAuthModalOpen} onClose={handleAuthModalClose} />
    </div>
  );
}

// Componente auxiliar para listar entradas (reutilizable)
function SummaryList({ selectedSeats, allSeats, generalSelection, event, toggleSeat, updateGeneralQuantity }: any) {
  const hasItems = selectedSeats.length > 0 || Object.keys(generalSelection).length > 0;

  if (!hasItems) {
    return (
      <div className="text-center py-8 text-slate-400 italic text-sm">
        No has seleccionado entradas aún.
      </div>
    );
  }

  return (
    <>
      {selectedSeats.map((seatId: string) => {
        const seat = allSeats.find((s: Seat) => s.id === seatId);
        if (!seat) return null;
        return (
          <div key={seatId} className="flex justify-between items-start p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
            <div>
              <p className="font-bold text-slate-800 text-sm">{seat.seccion}</p>
              <p className="text-xs text-slate-500">Fila {seat.fila} • Asiento {seat.numero}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-blue-600 text-sm">${seat.precio.toLocaleString()}</p>
              <button onClick={() => toggleSeat(seatId)} className="text-xs text-red-400 hover:text-red-600 underline mt-1">Eliminar</button>
            </div>
          </div>
        );
      })}

      {Object.entries(generalSelection).map(([sectionId, qty]: [string, any]) => {
        const section = event?.sections?.find((s: Section) => s.id === sectionId);
        if (!section) return null;
        return (
          <div key={sectionId} className="flex justify-between items-start p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
            <div>
              <p className="font-bold text-slate-800 text-sm">{section.name}</p>
              <p className="text-xs text-slate-500">{qty} x Entrada General</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-blue-600 text-sm">${(section.price * qty).toLocaleString()}</p>
              <div className="flex items-center justify-end gap-2 mt-1">
                  <button onClick={() => updateGeneralQuantity(sectionId, -1, 10)} className="w-5 h-5 bg-slate-200 rounded text-xs font-bold flex items-center justify-center">-</button>
                  <span className="text-xs font-medium w-3 text-center">{qty}</span>
                  <button onClick={() => updateGeneralQuantity(sectionId, 1, 10)} className="w-5 h-5 bg-blue-100 text-blue-600 rounded text-xs font-bold flex items-center justify-center">+</button>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
