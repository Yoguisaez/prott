import { Event, User, Seat } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'usuario@demo.com',
    nombre: 'Juan Pérez',
    rol: 'user',
    avatar: 'https://ui-avatars.com/api/?name=Juan+Perez&background=random',
  },
  {
    id: '2',
    email: 'admin@demo.com',
    nombre: 'Admin User',
    rol: 'admin',
  }
];

export let MOCK_EVENTS: Event[] = [
  {
    id: '1',
    titulo: 'Bad Bunny - World Hottest Tour',
    descripcion: `<div class="space-y-6">
  <div class="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
    <h3 class="text-xl font-bold text-indigo-900 mb-2">🔥 World's Hottest Tour</h3>
    <p class="text-indigo-800">
      ¡El conejo malo regresa a los escenarios con su gira más ambiciosa hasta la fecha! 
      Prepárate para una noche inolvidable llena de energía, fuegos artificiales y todos los éxitos que han conquistado al mundo.
    </p>
  </div>

  <div class="grid md:grid-cols-2 gap-6">
    <div>
      <h4 class="font-bold text-slate-900 text-lg mb-3">🎵 Setlist Esperado</h4>
      <ul class="space-y-2 text-slate-600">
        <li class="flex items-center gap-2"><span class="w-2 h-2 bg-pink-500 rounded-full"></span>Moscow Mule</li>
        <li class="flex items-center gap-2"><span class="w-2 h-2 bg-pink-500 rounded-full"></span>Me Porto Bonito</li>
        <li class="flex items-center gap-2"><span class="w-2 h-2 bg-pink-500 rounded-full"></span>Tití Me Preguntó</li>
        <li class="flex items-center gap-2"><span class="w-2 h-2 bg-pink-500 rounded-full"></span>Después de la Playa</li>
      </ul>
    </div>
    
    <div>
      <h4 class="font-bold text-slate-900 text-lg mb-3">⚠️ Información Importante</h4>
      <ul class="space-y-3">
        <li class="flex gap-3 bg-slate-50 p-3 rounded-lg">
          <span class="text-2xl">🚪</span>
          <div>
            <span class="font-bold text-slate-800 block">Apertura de Puertas</span>
            <span class="text-sm text-slate-500">17:00 hrs - Llegar con anticipación</span>
          </div>
        </li>
        <li class="flex gap-3 bg-slate-50 p-3 rounded-lg">
          <span class="text-2xl">⛔</span>
          <div>
            <span class="font-bold text-slate-800 block">Objetos Prohibidos</span>
            <span class="text-sm text-slate-500">Cámaras profesionales, botellas, alimentos</span>
          </div>
        </li>
      </ul>
    </div>
  </div>

  <div class="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl shadow-lg mt-6">
    <div class="flex items-center gap-4">
      <div class="text-4xl">🎉</div>
      <div>
        <h3 class="font-bold text-xl">Experiencia VIP</h3>
        <p class="text-blue-100 mt-1">
          Los tickets Pacífico VIP incluyen acceso exclusivo al lounge, cóctel de bienvenida y after-party oficial.
        </p>
      </div>
    </div>
  </div>
</div>`,
    fecha: new Date(Date.now() + 86400000 * 30).toISOString(), // 30 days from now
    lugar: 'Estadio Nacional',
    ciudad: 'Santiago',
    imagen_url: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&w=1000&q=80',
    categorias: ['Concierto', 'Urbano'],
    capacidad_total: 50000,
    activo: true,
    precio_min: 45000,
    precio_max: 250000,
    ticketTypes: [
      { id: 't1', name: 'Cancha General', price: 45000, description: 'Acceso general a cancha de pie', capacity: 20000, sold: 5000 },
      { id: 't2', name: 'Andes', price: 85000, description: 'Asientos numerados en sector Andes', capacity: 10000, sold: 8000 },
      { id: 't3', name: 'Pacífico VIP', price: 250000, description: 'Mejor vista, asientos acolchados y acceso exclusivo', capacity: 2000, sold: 1900 },
    ],
    sections: [
      { id: 's1', name: 'Cancha General', type: 'general', capacity: 20000, price: 45000, ticketTypeId: 't1', visualX: 20, visualY: 40, width: 60, height: 40, color: '#3b82f6' },
      { id: 's2', name: 'Andes', type: 'assigned', capacity: 10000, price: 85000, ticketTypeId: 't2', rows: 50, seatsPerRow: 200, visualX: 82, visualY: 20, width: 15, height: 60, color: '#a855f7' },
      { id: 's3', name: 'Pacífico VIP', type: 'assigned', capacity: 2000, price: 250000, ticketTypeId: 't3', rows: 20, seatsPerRow: 100, visualX: 3, visualY: 20, width: 15, height: 60, color: '#fbbf24' },
      { id: 's4', name: 'Golden Circle', type: 'general', capacity: 5000, price: 150000, ticketTypeId: 't3', visualX: 25, visualY: 10, width: 50, height: 25, color: '#ef4444' }
    ]
  },
  {
    id: '2',
    titulo: 'Final Copa Libertadores',
    descripcion: `<div class="space-y-6">
    <div class="bg-green-50 p-6 rounded-xl border border-green-100">
      <h3 class="text-xl font-bold text-green-900 mb-2">🏆 La Gloria Eterna</h3>
      <p class="text-green-800">
        Vive la pasión del fútbol sudamericano en su máxima expresión. Los dos mejores equipos del continente se enfrentan en una batalla épica por la copa más deseada.
      </p>
    </div>
    
    <div class="grid grid-cols-2 gap-4 text-center">
      <div class="bg-slate-100 p-4 rounded-lg">
        <span class="text-2xl block mb-1">⚽</span>
        <span class="font-bold text-slate-700">Fútbol de Élite</span>
      </div>
      <div class="bg-slate-100 p-4 rounded-lg">
        <span class="text-2xl block mb-1">🏟️</span>
        <span class="font-bold text-slate-700">Estadio Monumental</span>
      </div>
    </div>
    </div>`,
    fecha: new Date(Date.now() + 86400000 * 15).toISOString(),
    lugar: 'Estadio Monumental',
    ciudad: 'Buenos Aires',
    imagen_url: 'https://images.unsplash.com/photo-1522778119026-d647f0565c6a?auto=format&fit=crop&w=1000&q=80',
    categorias: ['Deportes', 'Fútbol'],
    capacidad_total: 80000,
    activo: true,
    precio_min: 20000,
    precio_max: 150000,
    ticketTypes: [
      { id: 't4', name: 'Galería', price: 20000, description: 'Tribuna popular', capacity: 30000, sold: 29000 },
      { id: 't5', name: 'Platea', price: 80000, description: 'Visión lateral', capacity: 20000, sold: 10000 },
    ],
    sections: [
        { id: 's5', name: 'Galería Norte', type: 'general', capacity: 15000, price: 20000, ticketTypeId: 't4', visualX: 20, visualY: 10, width: 60, height: 20, color: '#64748b' },
        { id: 's6', name: 'Galería Sur', type: 'general', capacity: 15000, price: 20000, ticketTypeId: 't4', visualX: 20, visualY: 70, width: 60, height: 20, color: '#64748b' },
        { id: 's7', name: 'Platea Este', type: 'assigned', capacity: 10000, price: 80000, ticketTypeId: 't5', rows: 40, seatsPerRow: 250, visualX: 85, visualY: 20, width: 15, height: 60, color: '#22c55e' },
        { id: 's8', name: 'Platea Oeste', type: 'assigned', capacity: 10000, price: 80000, ticketTypeId: 't5', rows: 40, seatsPerRow: 250, visualX: 0, visualY: 20, width: 15, height: 60, color: '#22c55e' }
    ]
  },
  {
    id: '3',
    titulo: 'Coldplay - Music of the Spheres',
    descripcion: 'Una experiencia visual y auditiva única.',
    fecha: new Date(Date.now() + 86400000 * 60).toISOString(),
    lugar: 'Estadio River Plate',
    ciudad: 'Buenos Aires',
    imagen_url: 'https://images.unsplash.com/photo-1470229722913-7ea05107f5c3?auto=format&fit=crop&w=1000&q=80',
    categorias: ['Concierto', 'Pop'],
    capacidad_total: 65000,
    activo: true,
    precio_min: 55000,
    precio_max: 180000,
    ticketTypes: [
      { id: 't6', name: 'General', price: 55000, description: 'Acceso general', capacity: 40000, sold: 10000 },
    ],
    sections: [
        { id: 's9', name: 'Cancha', type: 'general', capacity: 40000, price: 55000, ticketTypeId: 't6', visualX: 20, visualY: 30, width: 60, height: 50, color: '#f43f5e' }
    ]
  },
  {
    id: '4',
    titulo: 'El Rey León - El Musical',
    descripcion: 'El aclamado musical de Broadway llega a la ciudad.',
    fecha: new Date(Date.now() + 86400000 * 45).toISOString(),
    lugar: 'Teatro Municipal',
    ciudad: 'Santiago',
    imagen_url: 'https://images.unsplash.com/photo-1507676184212-d0370b9bd265?auto=format&fit=crop&w=1000&q=80',
    categorias: ['Teatro', 'Familia', 'Musical'],
    capacidad_total: 1500,
    activo: true,
    precio_min: 35000,
    precio_max: 120000,
    ticketTypes: [
      { id: 't7', name: 'Platea Baja', price: 120000, description: 'Frente al escenario', capacity: 500, sold: 200 },
      { id: 't8', name: 'Platea Alta', price: 35000, description: 'Vista panorámica', capacity: 1000, sold: 100 },
    ],
    sections: [
        { id: 's10', name: 'Platea Baja', type: 'assigned', capacity: 500, price: 120000, ticketTypeId: 't7', rows: 20, seatsPerRow: 25, visualX: 25, visualY: 30, width: 50, height: 30, color: '#eab308' },
        { id: 's11', name: 'Platea Alta', type: 'assigned', capacity: 1000, price: 35000, ticketTypeId: 't8', rows: 25, seatsPerRow: 40, visualX: 20, visualY: 65, width: 60, height: 25, color: '#a16207' }
    ]
  },
  {
    id: '5',
    titulo: 'Lollapalooza 2025',
    descripcion: `<div class="space-y-6">
    <div class="bg-pink-50 p-6 rounded-xl border border-pink-100">
      <h3 class="text-xl font-bold text-pink-900 mb-2">🎪 El Festival Más Grande</h3>
      <p class="text-pink-800">
        Tres días de música, arte y cultura. Más de 100 artistas en 5 escenarios. ¡No te pierdas la experiencia Lolla!
      </p>
    </div>
    </div>`,
    fecha: new Date(Date.now() + 86400000 * 120).toISOString(),
    lugar: 'Parque Bicentenario',
    ciudad: 'Santiago',
    imagen_url: 'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?auto=format&fit=crop&w=1000&q=80',
    categorias: ['Festivales', 'Concierto'],
    capacidad_total: 100000,
    activo: true,
    precio_min: 150000,
    precio_max: 400000,
    ticketTypes: [
      { id: 't9', name: 'Pase General 3 Días', price: 150000, description: 'Acceso a los 3 días', capacity: 80000, sold: 40000 },
      { id: 't10', name: 'Lolla Lounge VIP', price: 400000, description: 'Acceso VIP con barra libre y comida', capacity: 5000, sold: 1000 },
    ],
    sections: [
        { id: 's12', name: 'General', type: 'general', capacity: 80000, price: 150000, ticketTypeId: 't9', visualX: 10, visualY: 30, width: 80, height: 60, color: '#db2777' },
        { id: 's13', name: 'VIP Lounge', type: 'general', capacity: 5000, price: 400000, ticketTypeId: 't10', visualX: 70, visualY: 10, width: 25, height: 20, color: '#fce7f3' }
    ]
  },
  {
    id: '6',
    titulo: 'Stand Up Comedy: La Risa',
    descripcion: 'Una noche de risas con los mejores comediantes locales.',
    fecha: new Date(Date.now() + 86400000 * 5).toISOString(),
    lugar: 'Club de la Comedia',
    ciudad: 'Viña del Mar',
    imagen_url: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=1000&q=80',
    categorias: ['Comedia', 'Teatro'],
    capacidad_total: 300,
    activo: true,
    precio_min: 15000,
    precio_max: 25000,
    ticketTypes: [
      { id: 't11', name: 'Entrada General', price: 15000, description: 'Mesas compartidas', capacity: 200, sold: 50 },
      { id: 't12', name: 'Mesa VIP', price: 25000, description: 'Mesa privada frente al escenario', capacity: 100, sold: 80 },
    ],
    sections: [
        { id: 's14', name: 'Mesas VIP', type: 'assigned', capacity: 100, price: 25000, ticketTypeId: 't12', rows: 10, seatsPerRow: 10, visualX: 30, visualY: 20, width: 40, height: 30, color: '#8b5cf6' },
        { id: 's15', name: 'General', type: 'general', capacity: 200, price: 15000, ticketTypeId: 't11', visualX: 20, visualY: 60, width: 60, height: 30, color: '#94a3b8' }
    ]
  },
  {
    id: '7',
    titulo: 'NBA Mexico City Game 2025',
    descripcion: 'El mejor baloncesto del mundo regresa a CDMX.',
    fecha: new Date(Date.now() + 86400000 * 90).toISOString(),
    lugar: 'Arena CDMX',
    ciudad: 'Ciudad de México',
    imagen_url: 'https://images.unsplash.com/photo-1504454172868-dddf41a63b22?auto=format&fit=crop&w=1000&q=80',
    categorias: ['Deportes', 'Baloncesto'],
    capacidad_total: 22000,
    activo: true,
    precio_min: 60000,
    precio_max: 500000,
    ticketTypes: [
      { id: 't13', name: 'Gradas Superiores', price: 60000, description: 'Vista general', capacity: 10000, sold: 5000 },
      { id: 't14', name: 'Cancha', price: 500000, description: 'A pie de cancha', capacity: 500, sold: 450 },
    ],
    sections: [
        { id: 's16', name: 'Cancha VIP', type: 'assigned', capacity: 500, price: 500000, ticketTypeId: 't14', rows: 5, seatsPerRow: 100, visualX: 20, visualY: 40, width: 60, height: 20, color: '#f97316' },
        { id: 's17', name: 'Gradas', type: 'assigned', capacity: 10000, price: 60000, ticketTypeId: 't13', rows: 50, seatsPerRow: 200, visualX: 10, visualY: 10, width: 80, height: 25, color: '#fdba74' }
    ]
  },
  {
    id: '8',
    titulo: 'Cirque du Soleil: OVO',
    descripcion: 'Un ecosistema colorido repleto de vida.',
    fecha: new Date(Date.now() + 86400000 * 25).toISOString(),
    lugar: 'Movistar Arena',
    ciudad: 'Santiago',
    imagen_url: 'https://images.unsplash.com/photo-1596253270392-7cf5b2c9c7c0?auto=format&fit=crop&w=1000&q=80',
    categorias: ['Teatro', 'Familia', 'Circo'],
    capacidad_total: 12000,
    activo: true,
    precio_min: 40000,
    precio_max: 180000,
    ticketTypes: [
      { id: 't15', name: 'Platea Alta', price: 40000, description: 'Vista panorámica', capacity: 5000, sold: 1000 },
      { id: 't16', name: 'Diamante', price: 180000, description: 'Mejores asientos centrales', capacity: 1000, sold: 200 },
    ],
    sections: [
        { id: 's18', name: 'Diamante', type: 'assigned', capacity: 1000, price: 180000, ticketTypeId: 't16', rows: 20, seatsPerRow: 50, visualX: 30, visualY: 30, width: 40, height: 30, color: '#60a5fa' },
        { id: 's19', name: 'Platea Alta', type: 'assigned', capacity: 5000, price: 40000, ticketTypeId: 't15', rows: 50, seatsPerRow: 100, visualX: 10, visualY: 10, width: 80, height: 15, color: '#93c5fd' }
    ]
  }
];

// Helper to generate seats for a section
export const generateSeats = (eventId: string, section: string, rows: number, seatsPerRow: number, price: number, startRow = 1): Seat[] => {
  const seats: Seat[] = [];
  for (let r = 0; r < rows; r++) {
    for (let s = 1; s <= seatsPerRow; s++) {
      const rowChar = String.fromCharCode(65 + startRow + r - 1); // A, B, C...
      seats.push({
        id: `${eventId}-${section}-${rowChar}-${s}`,
        evento_id: eventId,
        seccion: section,
        fila: rowChar,
        numero: s.toString(),
        precio: price,
        estado: Math.random() > 0.7 ? 'sold' : 'available', // Random availability
        coordenadas: { x: s * 40, y: r * 40 }
      });
    }
  }
  return seats;
};

export let MOCK_SEATS: Record<string, Seat[]> = {
  '1': [
    ...generateSeats('1', 'Pacífico VIP', 5, 20, 250000),
    ...generateSeats('1', 'Andes', 8, 25, 85000, 5),
  ],
  '2': [
    ...generateSeats('2', 'Platea Este', 10, 30, 80000),
    ...generateSeats('2', 'Platea Oeste', 10, 30, 80000),
  ],
  '3': [
    // General event, seats generated dynamically or not needed if only general
  ],
  '4': [
    ...generateSeats('4', 'Platea Baja', 8, 20, 120000),
    ...generateSeats('4', 'Platea Alta', 10, 25, 35000),
  ],
  '5': [
    // Festival
  ],
  '6': [
    ...generateSeats('6', 'Mesas VIP', 4, 10, 25000),
  ],
  '7': [
    ...generateSeats('7', 'Cancha VIP', 3, 20, 500000),
    ...generateSeats('7', 'Gradas', 10, 30, 60000),
  ],
  '8': [
    ...generateSeats('8', 'Diamante', 5, 20, 180000),
    ...generateSeats('8', 'Platea Alta', 10, 30, 40000),
  ]
};
