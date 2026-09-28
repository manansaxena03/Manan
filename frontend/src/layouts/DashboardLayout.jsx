import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, List, PieChart, Target, LogOut, Menu, X } from 'lucide-react';

const DashboardLayout = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/', label: 'Dashboard', icon: Home },
        { path: '/transactions', label: 'Transactions', icon: List },
        { path: '/budgets', label: 'Budgets', icon: PieChart },
        { path: '/goals', label: 'Savings Goals', icon: Target },
    ];

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar for Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-white shadow-md">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-primary">SpendWise</h1>
                    <p className="text-sm text-gray-500 mt-1">Hello, {user?.name}</p>
                </div>
                <nav className="flex-1 px-4 py-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 text-gray-600 hover:text-danger w-full px-4 py-3 rounded-xl transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="md:hidden flex items-center justify-between p-4 bg-white shadow-sm">
                    <h1 className="text-xl font-bold text-primary">SpendWise</h1>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600">
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </header>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg z-50 p-4 space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
                                >
                                    <Icon size={20} />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-danger hover:bg-gray-100 w-full"
                        >
                            <LogOut size={20} />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                )}

                {/* Main Content */}
                <main className="flex-1 overflow-auto p-4 md:p-8 bg-background">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
