import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createEvent, getEventById } from '../../api/events';
import { TicketType, Section, Discount } from '../../types';
import { Calendar, MapPin, Image as ImageIcon, DollarSign, Users, Tag, Type, Plus, Trash2, Layout, Grid, Armchair, Move, Maximize2, Percent } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const CreateEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Si hay ID, estamos editando
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  
  // Paso 1: Definición de Categorías de Precios
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [newTicketType, setNewTicketType] = useState<Partial<TicketType>>({
    name: '',
    price: 0,
    description: ''
  });

  // Paso 2: Diseño del Recinto (Sectores)
  const [sections, setSections] = useState<Section[]>([]);
  const [newSection, setNewSection] = useState<Partial<Section>>({
    name: '',
    type: 'assigned',
    rows: 10,
    seatsPerRow: 20,
    capacity: 0,
    ticketTypeId: '',
    color: '#4F46E5', // Indigo-600 default
    width: 15,
    height: 15,
    visualX: 10,
    visualY: 10
  });

  // Paso 4: Descuentos
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [newDiscount, setNewDiscount] = useState<Partial<Discount>>({
    name: '',
    type: 'percentage',
    value: 0,
    code: '',
    startDate: '',
    endDate: ''
  });

  // Estado para Drag & Drop
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fecha: '',
    lugar: '',
    ciudad: '',
    imagen_url: '',
    categorias: '',
    capacidad_total: 0,
    precio_min: 0,
    precio_max: 0,
    inicio_venta: '',
    fin_venta: ''
  });

  // Cargar datos si estamos editando
  useEffect(() => {
    if (id) {
      setFetching(true);
      getEventById(id).then(response => {
        const event = response.data;
        if (event) {
          setFormData({
            titulo: event.titulo,
            descripcion: event.descripcion,
            fecha: event.fecha ? new Date(event.fecha).toISOString().slice(0, 16) : '',
            lugar: event.lugar,
            ciudad: event.ciudad,
            imagen_url: event.imagen_url,
            categorias: event.categorias.join(', '),
            capacidad_total: event.capacidad_total,
            precio_min: event.precio_min || 0,
            precio_max: event.precio_max || 0,
            inicio_venta: event.inicio_venta ? new Date(event.inicio_venta).toISOString().slice(0, 16) : '',
            fin_venta: event.fin_venta ? new Date(event.fin_venta).toISOString().slice(0, 16) : ''
          });
          setTicketTypes(event.ticketTypes || []);
          setSections(event.sections || []);
          setDiscounts(event.discounts || []);
        }
      }).finally(() => {
        setFetching(false);
      });
    }
  }, [id]);

  // Calcular totales automáticamente basado en SECTORES
  useEffect(() => {
    if (sections.length > 0) {
      // Calcular capacidad total sumando sectores
      const totalCapacity = sections.reduce((acc, curr) => acc + curr.capacity, 0);
      
      // Calcular precios min/max basados en los ticketTypes usados en las secciones
      const usedTicketTypeIds = new Set(sections.map(s => s.ticketTypeId));
      const activeTicketTypes = ticketTypes.filter(t => usedTicketTypeIds.has(t.id));
      const prices = activeTicketTypes.map(t => t.price);
      
      setFormData(prev => ({
        ...prev,
        precio_min: prices.length > 0 ? Math.min(...prices) : 0,
        precio_max: prices.length > 0 ? Math.max(...prices) : 0,
        capacidad_total: totalCapacity
      }));
    }
  }, [sections, ticketTypes]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacidad_total' || name.includes('precio') ? Number(value) : value
    }));
  };

  // --- Lógica de Ticket Types ---
  const addTicketType = () => {
    if (newTicketType.name && newTicketType.price !== undefined) {
      setTicketTypes(prev => [...prev, {
        id: uuidv4(),
        name: newTicketType.name!,
        price: newTicketType.price!,
        description: newTicketType.description || '',
        capacity: 0,
        sold: 0
      }]);
      setNewTicketType({ name: '', price: 0, description: '' });
    }
  };

  const removeTicketType = (id: string) => {
    setTicketTypes(prev => prev.filter(t => t.id !== id));
    setSections(prev => prev.map(s => s.ticketTypeId === id ? { ...s, ticketTypeId: '' } : s));
  };

  // --- Lógica de Sectores ---
  const handleSectionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewSection(prev => {
      const updated = {
        ...prev,
        [name]: name === 'rows' || name === 'seatsPerRow' || name === 'capacity' || name === 'width' || name === 'height' ? Number(value) : value
      };
      
      if (updated.type === 'assigned' && updated.rows && updated.seatsPerRow) {
        updated.capacity = updated.rows * updated.seatsPerRow;
      }
      return updated;
    });
  };

  const addSection = () => {
    if (newSection.name && newSection.ticketTypeId && newSection.capacity! > 0) {
      const selectedTicket = ticketTypes.find(t => t.id === newSection.ticketTypeId);
      setSections(prev => [...prev, {
        id: uuidv4(),
        name: newSection.name!,
        type: newSection.type as 'assigned' | 'general',
        capacity: newSection.capacity!,
        price: selectedTicket?.price || 0,
        ticketTypeId: newSection.ticketTypeId,
        rows: newSection.type === 'assigned' ? newSection.rows : undefined,
        seatsPerRow: newSection.type === 'assigned' ? newSection.seatsPerRow : undefined,
        visualX: 50 - (newSection.width || 15) / 2, // Centrado por defecto
        visualY: 50 - (newSection.height || 15) / 2,
        width: newSection.width || 15,
        height: newSection.height || 15,
        color: newSection.color || '#4F46E5'
      }]);
      setNewSection(prev => ({ ...prev, name: '', capacity: 0 })); 
    }
  };

  const removeSection = (id: string) => {
    setSections(prev => prev.filter(s => s.id !== id));
  };

  // --- Lógica de Descuentos ---
  const addDiscount = () => {
    if (newDiscount.name && newDiscount.value) {
      setDiscounts(prev => [...prev, {
        id: uuidv4(),
        name: newDiscount.name!,
        type: newDiscount.type as 'percentage' | 'fixed',
        value: newDiscount.value!,
        code: newDiscount.code,
        startDate: newDiscount.startDate,
        endDate: newDiscount.endDate
      }]);
      setNewDiscount({ name: '', type: 'percentage', value: 0, code: '', startDate: '', endDate: '' });
    }
  };

  const removeDiscount = (id: string) => {
    setDiscounts(prev => prev.filter(d => d.id !== id));
  };

  // --- Drag & Drop Logic ---
  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setDraggingId(id);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId || !mapRef.current) return;

    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Clamp values between 0 and 100
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    setSections(prev => prev.map(s => 
      s.id === draggingId 
        ? { ...s, visualX: clampedX - (s.width || 10) / 2, visualY: clampedY - (s.height || 10) / 2 }
        : s
    ));
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Aquí se usaría updateEvent si existe ID, o createEvent si no
      // Como updateEvent no está explícitamente en el mock api, simulamos que create hace un "upsert" o simplemente lo guardamos
      await createEvent({
        id: id, // Pass ID if editing
        ...formData,
        categorias: formData.categorias.split(',').map(c => c.trim()),
        fecha: new Date(formData.fecha).toISOString(),
        inicio_venta: formData.inicio_venta ? new Date(formData.inicio_venta).toISOString() : undefined,
        fin_venta: formData.fin_venta ? new Date(formData.fin_venta).toISOString() : undefined,
        ticketTypes,
        sections,
        discounts
      });
      navigate('/admin');
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error al guardar el evento');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="flex justify-center items-center h-screen">Cargando evento...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <Type className="w-8 h-8 text-indigo-600" />
          {id ? 'Editar Evento' : 'Crear Nuevo Evento'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Información Básica */}
          <div className="bg-gray-50 p-6 rounded-lg space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">1. Información General</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Título del Evento</label>
                <input
                  type="text"
                  name="titulo"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ej: Concierto de Rock 2024"
                  value={formData.titulo}
                  onChange={handleChange}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción (HTML Permitido)
                </label>
                <div className="mb-2 text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-200">
                  Ejemplo de estructura personalizada:
                  <code className="block mt-1 p-1 bg-white border border-gray-200 rounded text-indigo-600">
                    &lt;div class="bg-blue-50 p-4 rounded-lg border border-blue-100"&gt;
                      &lt;h3 class="font-bold text-blue-800"&gt;Detalles Importantes&lt;/h3&gt;
                      &lt;p&gt;Contenido del evento...&lt;/p&gt;
                    &lt;/div&gt;
                  </code>
                </div>
                <textarea
                  name="descripcion"
                  required
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                  placeholder="Escribe la descripción aquí o pega tu código HTML..."
                  value={formData.descripcion}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha y Hora del Evento</label>
                <input
                  type="datetime-local"
                  name="fecha"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={formData.fecha}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categorías (separadas por coma)</label>
                <input
                  type="text"
                  name="categorias"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Música, Concierto"
                  value={formData.categorias}
                  onChange={handleChange}
                />
              </div>

              {/* Plazo de Venta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Inicio de Venta (Opcional)</label>
                <input
                  type="datetime-local"
                  name="inicio_venta"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={formData.inicio_venta}
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-500 mt-1">Si se deja vacío, la venta inicia inmediatamente.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cierre de Venta (Opcional)</label>
                <input
                  type="datetime-local"
                  name="fin_venta"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={formData.fin_venta}
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-500 mt-1">Si se deja vacío, la venta cierra al iniciar el evento.</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lugar / Recinto</label>
                <input
                  type="text"
                  name="lugar"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={formData.lugar}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                <input
                  type="text"
                  name="ciudad"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={formData.ciudad}
                  onChange={handleChange}
                />
              </div>
               <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">URL Imagen</label>
                <input
                  type="url"
                  name="imagen_url"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={formData.imagen_url}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* 2. Definición de Precios (Ticket Types) */}
          <div className="bg-blue-50 p-6 rounded-lg space-y-6">
            <h2 className="text-xl font-semibold text-blue-900 border-b border-blue-200 pb-2 flex items-center gap-2">
              <DollarSign className="w-5 h-5" /> 2. Categorías de Precios
            </h2>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-xs font-medium text-blue-800 mb-1">Nombre (Ej: VIP)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-blue-200 rounded-md"
                  value={newTicketType.name}
                  onChange={e => setNewTicketType({...newTicketType, name: e.target.value})}
                />
              </div>
              <div className="w-32">
                <label className="block text-xs font-medium text-blue-800 mb-1">Precio</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-blue-200 rounded-md"
                  value={newTicketType.price || ''}
                  onChange={e => setNewTicketType({...newTicketType, price: Number(e.target.value)})}
                />
              </div>
              <button
                type="button"
                onClick={addTicketType}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Agregar
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {ticketTypes.map(t => (
                <div key={t.id} className="bg-white px-3 py-1 rounded-full border border-blue-200 shadow-sm flex items-center gap-2">
                  <span className="font-medium text-blue-900">{t.name}</span>
                  <span className="text-green-600 font-bold">${t.price.toLocaleString()}</span>
                  <button type="button" onClick={() => removeTicketType(t.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Diseño Visual del Recinto */}
          <div className="bg-indigo-50 p-6 rounded-lg space-y-6">
            <div className="flex justify-between items-center border-b border-indigo-200 pb-2">
              <h2 className="text-xl font-semibold text-indigo-900 flex items-center gap-2">
                <Layout className="w-5 h-5" /> 3. Diseñador de Mapa Visual
              </h2>
              <div className="text-right">
                <span className="text-sm text-indigo-600 mr-2">Capacidad Total:</span>
                <span className="text-2xl font-bold text-indigo-900">{formData.capacidad_total}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Columna Izquierda: Formulario de Creación */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
                  <h3 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Agregar Nuevo Sector
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Nombre</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Ej: Platea Baja"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={newSection.name}
                        onChange={handleSectionChange}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Categoría</label>
                        <select
                          name="ticketTypeId"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          value={newSection.ticketTypeId}
                          onChange={handleSectionChange}
                        >
                          <option value="">Seleccionar...</option>
                          {ticketTypes.map(t => (
                            <option key={t.id} value={t.id}>{t.name} (${t.price})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Color</label>
                        <input
                          type="color"
                          name="color"
                          className="w-full h-9 p-1 border border-gray-300 rounded-md cursor-pointer"
                          value={newSection.color}
                          onChange={handleSectionChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                       <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Ancho (%)</label>
                        <input
                          type="number"
                          name="width"
                          min="5" max="100"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={newSection.width}
                          onChange={handleSectionChange}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Alto (%)</label>
                        <input
                          type="number"
                          name="height"
                          min="5" max="100"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={newSection.height}
                          onChange={handleSectionChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Tipo de Sector</label>
                      <select
                        name="type"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        value={newSection.type}
                        onChange={handleSectionChange}
                      >
                        <option value="assigned">Numerado (Asientos)</option>
                        <option value="general">General (De pie)</option>
                      </select>
                    </div>

                    {newSection.type === 'assigned' ? (
                      <div className="grid grid-cols-2 gap-3 bg-gray-50 p-2 rounded">
                        <div>
                          <label className="block text-xs font-medium text-gray-600">Filas</label>
                          <input
                            type="number"
                            name="rows"
                            min="1"
                            className="w-full px-2 py-1 border border-gray-300 rounded-md"
                            value={newSection.rows}
                            onChange={handleSectionChange}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600">Asientos/Fila</label>
                          <input
                            type="number"
                            name="seatsPerRow"
                            min="1"
                            className="w-full px-2 py-1 border border-gray-300 rounded-md"
                            value={newSection.seatsPerRow}
                            onChange={handleSectionChange}
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Capacidad</label>
                        <input
                          type="number"
                          name="capacity"
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={newSection.capacity}
                          onChange={handleSectionChange}
                        />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={addSection}
                      disabled={!newSection.name || !newSection.ticketTypeId || !newSection.capacity}
                      className="w-full mt-2 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Agregar al Mapa
                    </button>
                  </div>
                </div>

                {/* Leyenda de Sectores */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100 max-h-60 overflow-y-auto">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Sectores Creados</h4>
                  <div className="space-y-2">
                    {sections.map(section => (
                      <div key={section.id} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded hover:bg-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: section.color }}></div>
                          <span className="font-medium text-gray-700 truncate max-w-[120px]">{section.name}</span>
                        </div>
                        <button onClick={() => removeSection(section.id)} className="text-gray-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {sections.length === 0 && <p className="text-xs text-gray-400 italic">No hay sectores aún.</p>}
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Canvas Visual */}
              <div className="lg:col-span-2">
                <div className="sticky top-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Move className="w-3 h-3" /> Arrastra los sectores para ubicarlos
                    </span>
                    <div className="bg-black text-white px-3 py-1 rounded text-xs font-bold">ESCENARIO</div>
                  </div>
                  
                  {/* LIENZO DE MAPA */}
                  <div 
                    ref={mapRef}
                    className="w-full aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 relative overflow-hidden select-none"
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    {/* Grid de fondo sutil */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" 
                         style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                    </div>

                    {sections.map(section => (
                      <div
                        key={section.id}
                        onMouseDown={(e) => handleMouseDown(e, section.id)}
                        className={`absolute rounded shadow-sm border border-white/50 flex flex-col items-center justify-center cursor-move transition-shadow hover:shadow-lg group
                          ${draggingId === section.id ? 'z-50 ring-2 ring-indigo-500 opacity-90' : 'z-10'}
                        `}
                        style={{
                          left: `${section.visualX}%`,
                          top: `${section.visualY}%`,
                          width: `${section.width}%`,
                          height: `${section.height}%`,
                          backgroundColor: section.color,
                        }}
                      >
                        <span className="text-white font-bold text-xs md:text-sm drop-shadow-md text-center px-1 truncate w-full">
                          {section.name}
                        </span>
                        <span className="text-white/90 text-[10px] drop-shadow-md hidden group-hover:block">
                          Cap: {section.capacity}
                        </span>
                      </div>
                    ))}
                    
                    {sections.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
                        <p>Agrega sectores desde el panel izquierdo</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Descuentos y Promociones */}
          <div className="bg-green-50 p-6 rounded-lg space-y-6">
            <h2 className="text-xl font-semibold text-green-900 border-b border-green-200 pb-2 flex items-center gap-2">
              <Percent className="w-5 h-5" /> 4. Descuentos y Promociones
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div className="md:col-span-1">
                <label className="block text-xs font-medium text-green-800 mb-1">Nombre</label>
                <input
                  type="text"
                  placeholder="Ej: Preventa"
                  className="w-full px-3 py-2 border border-green-200 rounded-md"
                  value={newDiscount.name}
                  onChange={e => setNewDiscount({...newDiscount, name: e.target.value})}
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-xs font-medium text-green-800 mb-1">Tipo</label>
                <select
                  className="w-full px-3 py-2 border border-green-200 rounded-md"
                  value={newDiscount.type}
                  onChange={e => setNewDiscount({...newDiscount, type: e.target.value as 'percentage' | 'fixed'})}
                >
                  <option value="percentage">% Porcentaje</option>
                  <option value="fixed">$ Monto Fijo</option>
                </select>
              </div>
              <div className="md:col-span-1">
                <label className="block text-xs font-medium text-green-800 mb-1">Valor</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-green-200 rounded-md"
                  value={newDiscount.value || ''}
                  onChange={e => setNewDiscount({...newDiscount, value: Number(e.target.value)})}
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-xs font-medium text-green-800 mb-1">Código (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: BANCOX"
                  className="w-full px-3 py-2 border border-green-200 rounded-md"
                  value={newDiscount.code || ''}
                  onChange={e => setNewDiscount({...newDiscount, code: e.target.value})}
                />
              </div>
              <div className="md:col-span-1">
                <button
                  type="button"
                  onClick={addDiscount}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Agregar
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {discounts.map(d => (
                <div key={d.id} className="bg-white px-3 py-2 rounded-lg border border-green-200 shadow-sm flex items-center gap-3">
                  <div>
                    <div className="font-medium text-green-900">{d.name}</div>
                    <div className="text-xs text-gray-500">
                      {d.type === 'percentage' ? `${d.value}% OFF` : `$${d.value} OFF`}
                      {d.code && <span className="ml-2 font-mono bg-gray-100 px-1 rounded">{d.code}</span>}
                    </div>
                  </div>
                  <button type="button" onClick={() => removeDiscount(d.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {discounts.length === 0 && <p className="text-sm text-gray-500 italic">No hay descuentos configurados.</p>}
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="mr-4 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || sections.length === 0}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? 'Guardando...' : id ? 'Guardar Cambios' : 'Crear Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
