import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Ticket, 
  Activity, 
  Search, 
  MoreHorizontal,
  Plus,
  Edit
} from 'lucide-react';
import { MOCK_EVENTS, MOCK_USERS } from '../../data/mock';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'events'>('overview');
  
  // Calculate stats
  const totalRevenue = MOCK_EVENTS.reduce((acc, event) => {
    return acc + (event.ticketTypes?.reduce((sum, type) => sum + (type.sold * type.price), 0) || 0);
  }, 0);

  const totalTicketsSold = MOCK_EVENTS.reduce((acc, event) => {
    return acc + (event.ticketTypes?.reduce((sum, type) => sum + type.sold, 0) || 0);
  }, 0);

  const activeEventsCount = MOCK_EVENTS.filter(e => e.activo).length;
  const totalUsers = MOCK_USERS.length; // In a real app this would be from DB

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <div className="flex space-x-4">
            <Link 
              to="/admin/crear-evento" 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Evento
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`${
                  activeTab === 'overview'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm flex items-center justify-center`}
              >
                <Activity className="h-5 w-5 mr-2" />
                Resumen
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`${
                  activeTab === 'users'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm flex items-center justify-center`}
              >
                <Users className="h-5 w-5 mr-2" />
                Usuarios
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`${
                  activeTab === 'events'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm flex items-center justify-center`}
              >
                <Calendar className="h-5 w-5 mr-2" />
                Eventos
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Stats Cards */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Ingresos Totales</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{formatCurrency(totalRevenue)}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Ticket className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Tickets Vendidos</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{totalTicketsSold}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Eventos Activos</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{activeEventsCount}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Usuarios Registrados</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{totalUsers}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Activity or additional charts could go here */}
            <div className="col-span-full mt-8">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Eventos Recientes</h3>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {MOCK_EVENTS.slice(0, 5).map((event) => (
                    <li key={event.id}>
                      <div className="px-4 py-4 flex items-center sm:px-6">
                        <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                          <div className="truncate">
                            <div className="flex text-sm">
                              <p className="font-medium text-indigo-600 truncate">{event.titulo}</p>
                              <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                                en {event.ciudad}
                              </p>
                            </div>
                            <div className="mt-2 flex">
                              <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                <p>
                                  {new Date(event.fecha).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="ml-5 flex-shrink-0">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${event.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {event.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Gestión de Usuarios</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Lista de usuarios registrados y sus roles.</p>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                  placeholder="Buscar usuario..."
                />
              </div>
            </div>
            <div className="border-t border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {MOCK_USERS.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full" src={user.avatar || `https://ui-avatars.com/api/?name=${user.nombre}`} alt="" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.nombre}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.rol === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : user.rol === 'organizer'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.rol}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Activo
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900">Editar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
             <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Gestión de Eventos</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Administra todos los eventos de la plataforma.</p>
              </div>
              <Link 
                to="/admin/crear-evento"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 mr-1" />
                Crear
              </Link>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {MOCK_EVENTS.map((event) => (
                  <li key={event.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-24">
                          <img className="h-16 w-24 object-cover rounded-md" src={event.imagen_url} alt={event.titulo} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{event.titulo}</div>
                          <div className="text-sm text-gray-500">{event.lugar}, {event.ciudad}</div>
                          <div className="text-sm text-gray-500">{new Date(event.fecha).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${event.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {event.activo ? 'Publicado' : 'Borrador'}
                          </span>
                        <Link 
                          to={`/admin/editar-evento/${event.id}`}
                          className="text-indigo-600 hover:text-indigo-900 p-2"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
