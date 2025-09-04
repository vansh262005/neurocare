import React, { useContext, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../App';
import { useAuth } from '../store/useAuth';
import { MenuIcon, XIcon, MoonIcon, SunIcon } from '@heroicons/react/outline';

function Dashboard() {
  const { dark, toggle } = useContext(ThemeContext);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links = [
    { to: 'chat', label: 'Chat' },
    { to: 'task', label: 'Task' },
    { to: 'progress', label: 'Progress' }
  ];

  const linkClasses = ({ isActive }) =>
    `block px-4 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-primary text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'}`;

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 transform bg-white dark:bg-gray-800 transition-transform duration-200 ease-in-out z-30 ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:inset-0`}>        
        <div className="flex items-center justify-between md:hidden p-4 border-b border-gray-200 dark:border-gray-700">
          <span className="font-bold text-lg">Menu</span>
          <button onClick={() => setOpen(false)}><XIcon className="h-6 w-6 text-gray-700 dark:text-gray-200" /></button>
        </div>
        <div className="p-4 space-y-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Hello, {user?.name}</h2>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClasses} end>
              {l.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center space-x-2">
            <button onClick={() => setOpen(true)} className="md:hidden">              
              <MenuIcon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
            </button>
            <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100 hidden md:block">Neurocare Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={toggle} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              {dark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>
            <button onClick={handleLogout} className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600">Logout</button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;