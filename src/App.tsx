import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EventDetail from './pages/EventDetail';
import WaitingRoom from './pages/WaitingRoom';
import SeatSelection from './pages/SeatSelection';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyTickets from './pages/MyTickets';
import CreateEvent from './pages/admin/CreateEvent';
import AdminDashboard from './pages/admin/Dashboard';
import AdminRoute from './components/admin/AdminRoute';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/eventos/:id" element={<EventDetail />} />
            <Route path="/sala-espera/:eventId" element={<WaitingRoom />} />
            <Route path="/seleccion-asientos/:eventId" element={<SeatSelection />} />
            <Route path="/carrito" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/mis-entradas" element={<MyTickets />} />
            
            {/* Rutas de Admin */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/crear-evento" element={
              <AdminRoute>
                <CreateEvent />
              </AdminRoute>
            } />
            <Route path="/admin/editar-evento/:id" element={
              <AdminRoute>
                <CreateEvent />
              </AdminRoute>
            } />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
