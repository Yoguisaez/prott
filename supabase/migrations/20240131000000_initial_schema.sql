-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabla de Usuarios (users)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    rol VARCHAR(20) DEFAULT 'user' CHECK (rol IN ('user', 'organizer', 'admin')),
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_rol ON users(rol);

-- Tabla de Eventos (events)
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha TIMESTAMP WITH TIME ZONE NOT NULL,
    lugar VARCHAR(255) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    imagen_url VARCHAR(500),
    categorias JSONB,
    capacidad_total INTEGER NOT NULL,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_fecha ON events(fecha);
CREATE INDEX IF NOT EXISTS idx_events_ciudad ON events(ciudad);
CREATE INDEX IF NOT EXISTS idx_events_activo ON events(activo);

-- Tabla de Asientos (seats)
CREATE TABLE IF NOT EXISTS seats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evento_id UUID REFERENCES events(id) ON DELETE CASCADE,
    seccion VARCHAR(50) NOT NULL,
    fila VARCHAR(10) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'available' CHECK (estado IN ('available', 'reserved', 'sold')),
    coordenadas JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(evento_id, seccion, fila, numero)
);

CREATE INDEX IF NOT EXISTS idx_seats_evento ON seats(evento_id);
CREATE INDEX IF NOT EXISTS idx_seats_estado ON seats(estado);
CREATE INDEX IF NOT EXISTS idx_seats_seccion ON seats(seccion);

-- Tabla de Reservas (reservations)
CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES users(id),
    evento_id UUID REFERENCES events(id),
    asientos_ids UUID[] NOT NULL,
    expira_en TIMESTAMP WITH TIME ZONE NOT NULL,
    estado VARCHAR(20) DEFAULT 'active' CHECK (estado IN ('active', 'expired', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reservations_usuario ON reservations(usuario_id);
CREATE INDEX IF NOT EXISTS idx_reservations_evento ON reservations(evento_id);
CREATE INDEX IF NOT EXISTS idx_reservations_expira ON reservations(expira_en);
CREATE INDEX IF NOT EXISTS idx_reservations_estado ON reservations(estado);

-- Tabla de Compras (purchases)
CREATE TABLE IF NOT EXISTS purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES users(id),
    evento_id UUID REFERENCES events(id),
    total DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    estado_pago VARCHAR(20) DEFAULT 'pending' CHECK (estado_pago IN ('pending', 'completed', 'failed', 'refunded')),
    transaccion_id VARCHAR(255),
    datos_pago JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_purchases_usuario ON purchases(usuario_id);
CREATE INDEX IF NOT EXISTS idx_purchases_evento ON purchases(evento_id);
CREATE INDEX IF NOT EXISTS idx_purchases_estado ON purchases(estado_pago);

-- Tabla de Entradas (tickets)
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    compra_id UUID REFERENCES purchases(id),
    asiento_id UUID REFERENCES seats(id),
    codigo_qr VARCHAR(255) UNIQUE NOT NULL,
    estado VARCHAR(20) DEFAULT 'active' CHECK (estado IN ('active', 'used', 'cancelled')),
    usado_en TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tickets_compra ON tickets(compra_id);
CREATE INDEX IF NOT EXISTS idx_tickets_asiento ON tickets(asiento_id);
CREATE INDEX IF NOT EXISTS idx_tickets_codigo ON tickets(codigo_qr);
CREATE INDEX IF NOT EXISTS idx_tickets_estado ON tickets(estado);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Grant permissions to anon and authenticated roles
GRANT SELECT ON events TO anon;
GRANT SELECT ON seats TO anon;
GRANT SELECT ON events TO authenticated;
GRANT SELECT ON seats TO authenticated;

GRANT ALL PRIVILEGES ON users TO authenticated;
GRANT ALL PRIVILEGES ON reservations TO authenticated;
GRANT ALL PRIVILEGES ON purchases TO authenticated;
GRANT ALL PRIVILEGES ON tickets TO authenticated;

-- Policies (Simplified for initial setup, should be refined for production)

-- Events: Everyone can view active events
CREATE POLICY "Enable read access for all users" ON events FOR SELECT USING (true);

-- Seats: Everyone can view seats
CREATE POLICY "Enable read access for all users" ON seats FOR SELECT USING (true);

-- Users: Users can read/update their own data
CREATE POLICY "Users can see own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

-- Reservations: Users can see/create their own reservations
CREATE POLICY "Users can see own reservations" ON reservations FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "Users can create reservations" ON reservations FOR INSERT WITH CHECK (auth.uid() = usuario_id);

-- Purchases: Users can see/create their own purchases
CREATE POLICY "Users can see own purchases" ON purchases FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "Users can create purchases" ON purchases FOR INSERT WITH CHECK (auth.uid() = usuario_id);

-- Tickets: Users can see their own tickets
CREATE POLICY "Users can see own tickets" ON tickets FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM purchases 
        WHERE purchases.id = tickets.compra_id 
        AND purchases.usuario_id = auth.uid()
    )
);
