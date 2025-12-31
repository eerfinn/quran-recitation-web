'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Home,
    Upload,
    Mic,
    Radio,
    User,
    LogOut,
    Menu,
    X,
    BookOpen,
    ChevronRight,
    Settings
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const navigation = [
    { name: 'Beranda', href: '/beranda', icon: Home },
    { name: 'Upload File', href: '/setoran/file', icon: Upload },
    { name: 'Voice Note', href: '/setoran/voice-note', icon: Mic },
    { name: 'Realtime', href: '/setoran/realtime', icon: Radio },
];

const secondaryNavigation = [
    { name: 'Profile', href: '/profile', icon: User },
];

export function Navigation() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const handleLogout = () => {
        // TODO: Implement logout with backend
        console.log('Logout clicked');
        router.push('/login');
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col z-50">
                <div className="flex flex-col flex-grow bg-white border-r border-gray-100 shadow-sm">
                    {/* Logo */}
                    <div className="flex items-center px-6 py-6 border-b border-gray-100">
                        <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-3">
                            <h1 className="text-xl font-bold text-gray-900">Qurani</h1>
                            <p className="text-xs text-gray-500">Setoran Mengaji</p>
                        </div>
                    </div>

                    {/* Main Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                            Menu Utama
                        </p>
                        {navigation.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        'group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                                        isActive
                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    )}
                                >
                                    <Icon
                                        className={cn(
                                            'mr-3 h-5 w-5 flex-shrink-0 transition-transform duration-200',
                                            isActive ? 'text-white' : 'text-gray-400 group-hover:text-emerald-600',
                                            'group-hover:scale-110'
                                        )}
                                    />
                                    {item.name}
                                    {isActive && (
                                        <ChevronRight className="ml-auto w-4 h-4 text-white/70" />
                                    )}
                                </Link>
                            );
                        })}

                        {/* Secondary Navigation */}
                        <div className="pt-6">
                            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                Akun
                            </p>
                            {secondaryNavigation.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            'group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                                            isActive
                                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        )}
                                    >
                                        <Icon
                                            className={cn(
                                                'mr-3 h-5 w-5 flex-shrink-0',
                                                isActive ? 'text-white' : 'text-gray-400 group-hover:text-emerald-600'
                                            )}
                                        />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>

                    {/* User Card & Logout */}
                    <div className="p-4 border-t border-gray-100">
                        {/* User Info */}
                        <div className="flex items-center p-3 bg-gray-50 rounded-xl mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                                A
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">Ahmad Ridwan</p>
                                <p className="text-xs text-gray-500 truncate">ahmad@email.com</p>
                            </div>
                            <Link href="/profile" className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                                <Settings className="w-4 h-4 text-gray-400" />
                            </Link>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200"
                        >
                            <LogOut className="mr-2 h-5 w-5" />
                            Keluar
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div className="ml-3">
                            <h1 className="text-lg font-bold text-gray-900">Qurani</h1>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6 text-gray-600" />
                        ) : (
                            <Menu className="h-6 w-6 text-gray-600" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}

                {/* Mobile Menu */}
                <div className={cn(
                    "fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300",
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                )}>
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <BookOpen className="w-5 h-5 text-white" />
                                </div>
                                <div className="ml-3">
                                    <h1 className="text-lg font-bold text-gray-900">Qurani</h1>
                                    <p className="text-xs text-gray-500">Setoran Mengaji</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-xl"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                Menu Utama
                            </p>
                            {navigation.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={cn(
                                            'group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                                            isActive
                                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                                                : 'text-gray-600 hover:bg-gray-50'
                                        )}
                                    >
                                        <Icon className={cn(
                                            'mr-3 h-5 w-5',
                                            isActive ? 'text-white' : 'text-gray-400'
                                        )} />
                                        {item.name}
                                    </Link>
                                );
                            })}

                            <div className="pt-6">
                                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                    Akun
                                </p>
                                {secondaryNavigation.map((item) => {
                                    const isActive = pathname === item.href;
                                    const Icon = item.icon;

                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={cn(
                                                'group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                                                isActive
                                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                            )}
                                        >
                                            <Icon className={cn(
                                                'mr-3 h-5 w-5',
                                                isActive ? 'text-white' : 'text-gray-400'
                                            )} />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </nav>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-100">
                            <div className="flex items-center p-3 bg-gray-50 rounded-xl mb-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold">
                                    A
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-semibold text-gray-900">Ahmad Ridwan</p>
                                    <p className="text-xs text-gray-500">ahmad@email.com</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                            >
                                <LogOut className="mr-2 h-5 w-5" />
                                Keluar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
