'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    Upload,
    Mic,
    Radio,
    User,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const navigation = [
    { name: 'Beranda', href: '/beranda', icon: Home },
    { name: 'Upload File', href: '/setoran/file', icon: Upload },
    { name: 'Voice Note', href: '/setoran/voice-note', icon: Mic },
    { name: 'Realtime', href: '/setoran/realtime', icon: Radio },
    { name: 'Profile', href: '/profile', icon: User },
];

export function Navigation() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
                    {/* Logo */}
                    <div className="flex items-center flex-shrink-0 px-6">
                        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">Q</span>
                        </div>
                        <h1 className="ml-3 text-xl font-bold gradient-text">
                            Setoran Mengaji
                        </h1>
                    </div>

                    {/* Navigation */}
                    <nav className="mt-8 flex-1 px-4 space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        'group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200',
                                        isActive
                                            ? 'bg-gradient-primary text-white shadow-lg shadow-primary-500/30'
                                            : 'text-gray-700 hover:bg-primary-50 hover:text-primary-700'
                                    )}
                                >
                                    <Icon
                                        className={cn(
                                            'mr-3 h-5 w-5 flex-shrink-0 transition-transform duration-200',
                                            isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary-600',
                                            'group-hover:scale-110'
                                        )}
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout Button */}
                    <div className="px-4 pb-4">
                        <button
                            onClick={() => {
                                // TODO: Implement logout
                                console.log('Logout clicked');
                            }}
                            className="group flex w-full items-center px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        >
                            <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
                            Keluar
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">Q</span>
                        </div>
                        <h1 className="ml-2 text-lg font-bold gradient-text">
                            Setoran Mengaji
                        </h1>
                    </div>

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6 text-gray-600" />
                        ) : (
                            <Menu className="h-6 w-6 text-gray-600" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="border-t border-gray-200 pb-3">
                        <nav className="px-2 pt-2 space-y-1">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={cn(
                                            'group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200',
                                            isActive
                                                ? 'bg-gradient-primary text-white'
                                                : 'text-gray-700 hover:bg-primary-50 hover:text-primary-700'
                                        )}
                                    >
                                        <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                                        {item.name}
                                    </Link>
                                );
                            })}

                            <button
                                onClick={() => {
                                    // TODO: Implement logout
                                    console.log('Logout clicked');
                                    setIsMobileMenuOpen(false);
                                }}
                                className="group flex w-full items-center px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                            >
                                <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
                                Keluar
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </>
    );
}
