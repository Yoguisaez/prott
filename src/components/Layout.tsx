import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, ShoppingCart, User, LogOut, Ticket, Menu, X, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import AuthModal from './auth/AuthModal';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('busqueda') || '');

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?busqueda=${encodeURIComponent(searchTerm)}`);
      setIsMobileSearchOpen(false);
    } else {
      navigate('/');
    }
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/?categoria=${encodeURIComponent(category)}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <nav className="bg-slate-900 text-white sticky top-0 z-[200] shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter" onClick={() => setSearchTerm('')}>
              <Ticket className="text-blue-500" />
              <span>Zona<span className="text-blue-500">Ticket</span></span>
            </Link>

            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar eventos, artistas, lugares..."
                className="w-full bg-slate-800 text-white placeholder-slate-400 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-700"
              />
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            </form>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4 md:gap-6">
              {/* Mobile Search Toggle */}
              <button 
                className="md:hidden text-slate-300 hover:text-white"
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              >
                <Search size={24} />
              </button>

              <Link to="/carrito" className="relative hover:text-blue-400 transition-colors">
                <ShoppingCart size={24} />
              </Link>

              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold shadow-md border-2 border-slate-800">
                      {user.nombre.charAt(0)}
                    </div>
                    <span className="text-sm font-medium hidden md:block max-w-[100px] truncate">{user.nombre}</span>
                    <ChevronDown size={16} className={`text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white text-slate-900 rounded-xl shadow-2xl py-2 border border-slate-100 animate-in fade-in slide-in-from-top-2 z-50">
                      <div className="px-4 py-3 border-b border-slate-100 md:hidden">
                        <p className="font-bold text-slate-800">{user.nombre}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                      
                      <Link 
                        to="/mis-entradas" 
                        className="block px-4 py-2 hover:bg-slate-50 text-sm font-medium text-slate-700"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Mis Entradas
                      </Link>
                      
                      {user.rol === 'admin' && (
                        <Link 
                          to="/admin"
                          className="block px-4 py-2 hover:bg-slate-50 text-sm font-medium text-indigo-600"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Panel Admin
                        </Link>
                      )}
                      
                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button 
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm font-medium text-red-600 flex items-center gap-2"
                        >
                          <LogOut size={14} /> Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => setIsAuthOpen(true)}
                  className="flex items-center gap-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <User size={18} />
                  <span className="hidden sm:inline">Ingresar</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isMobileSearchOpen && (
            <div className="mt-3 md:hidden pb-2 animate-in slide-in-from-top-2">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar..."
                  className="w-full bg-slate-800 text-white placeholder-slate-400 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-700"
                  autoFocus
                />
                <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              </form>
            </div>
          )}
        </div>
        
        {/* Categories Bar */}
        <div className="border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex gap-6 overflow-x-auto py-3 text-sm font-medium text-slate-300 scrollbar-hide">
              <button 
                onClick={() => navigate('/')}
                className={`whitespace-nowrap hover:text-white transition-colors ${!searchParams.get('categoria') ? 'text-white font-bold' : ''}`}
              >
                Todos
              </button>
              {['Conciertos', 'Deportes', 'Teatro', 'Familia', 'Festivales', 'Comedia'].map((cat) => (
                <button 
                  key={cat} 
                  onClick={() => handleCategoryClick(cat)}
                  className={`whitespace-nowrap hover:text-white transition-colors ${searchParams.get('categoria') === cat ? 'text-white font-bold' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">ZonaTicket</h3>
            <p className="text-sm">La mejor plataforma para comprar entradas a tus eventos favoritos.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Ayuda</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400">Preguntas Frecuentes</a></li>
              <li><a href="#" className="hover:text-blue-400">Contacto</a></li>
              <li><a href="#" className="hover:text-blue-400">Términos y Condiciones</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Síguenos</h4>
            <div className="flex gap-4">
              {/* Social Icons would go here */}
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Newsletter</h4>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Tu email" 
                className="bg-slate-800 rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">Suscribir</button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-xs">
          © 2024 ZonaTicket. Todos los derechos reservados.
        </div>
      </footer>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
