INSERT INTO events (titulo, descripcion, fecha, lugar, ciudad, imagen_url, categorias, capacidad_total, activo)
VALUES
(
  'Concierto de Rock Estelar',
  'Disfruta de una noche inolvidable con las mejores bandas de rock del momento. Un espectáculo de luces y sonido que no te puedes perder.',
  NOW() + INTERVAL '1 month',
  'Estadio Nacional',
  'Santiago',
  'https://images.unsplash.com/photo-1459749411177-0473ef7161cf?auto=format&fit=crop&q=80',
  '["Música", "Rock"]',
  50000,
  true
),
(
  'Festival de Jazz al Parque',
  'Relájate con las suaves melodías del jazz en un entorno natural. Food trucks, arte y música en vivo.',
  NOW() + INTERVAL '2 weeks',
  'Parque Bicentenario',
  'Concepción',
  'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80',
  '["Música", "Jazz", "Aire Libre"]',
  5000,
  true
),
(
  'Teatro: La Vida es Sueño',
  'Una adaptación moderna del clásico de Calderón de la Barca. Una obra que te hará cuestionar la realidad.',
  NOW() + INTERVAL '3 weeks',
  'Teatro Municipal',
  'Viña del Mar',
  'https://images.unsplash.com/photo-1507924538820-ede94a04019d?auto=format&fit=crop&q=80',
  '["Teatro", "Cultura"]',
  800,
  true
);
