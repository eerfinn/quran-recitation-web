'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/buttons/Button';
import { Input } from '@/components/ui/inputs/Input';
import { BookOpen, User, Mail, Lock, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({ name: '', email: '', password: '', confirmPassword: '' });

        let isValid = true;
        const newErrors = { name: '', email: '', password: '', confirmPassword: '' };

        if (!formData.name) {
            newErrors.name = 'Nama lengkap wajib diisi';
            isValid = false;
        }

        if (!formData.email) {
            newErrors.email = 'Email wajib diisi';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Format email tidak valid';
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = 'Password wajib diisi';
            isValid = false;
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password minimal 8 karakter';
            isValid = false;
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Password tidak cocok';
            isValid = false;
        }

        if (!isValid) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            console.log('Register Data:', formData);
            setIsLoading(false);
            router.push('/beranda');
        }, 1500);
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/auth-bg.png"
                        alt="Quran Recitation"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-gray-900/90 via-gray-900/50 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent"></div>
                </div>

                <div className="relative z-10 flex flex-col justify-between h-full p-12">
                    <div className="flex flex-col items-start space-y-8">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-emerald-500/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-emerald-500/30 shadow-lg shadow-emerald-900/20">
                                <BookOpen className="w-6 h-6 text-emerald-400" />
                            </div>
                            <span className="text-xl font-bold tracking-wide text-white drop-shadow-md">Qurani</span>
                        </div>

                        <div className="max-w-md">
                            <h2 className="text-4xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
                                Mulai Perjalanan<br />Hafalan Anda
                            </h2>
                            <div className="pl-6 border-l-4 border-emerald-500 bg-gray-900/30 backdrop-blur-sm p-4 rounded-r-2xl border-t border-r border-b border-white/10">
                                <p className="text-gray-100 text-lg leading-relaxed italic drop-shadow-md">
                                    "Sebaik-baik kalian adalah orang yang belajar Al-Qur'an dan mengajarkannya."
                                </p>
                                <span className="text-sm mt-3 block text-emerald-400 font-semibold drop-shadow-sm">- HR. Bukhari</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6 text-xs font-medium text-gray-300">
                        <span>© 2025 Qurani App</span>
                        <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                        <a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a>
                        <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                        <a href="#" className="hover:text-emerald-400 transition-colors">Terms</a>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 xl:p-24 bg-white">
                <div className="w-full max-w-md space-y-10 animate-slide-up">
                    <div className="text-center lg:text-left">
                        <div className="lg:hidden flex justify-center mb-6">
                            <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                                <BookOpen className="w-7 h-7 text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Buat Akun Baru
                        </h1>
                        <p className="mt-3 text-base text-gray-600">
                            Bergabunglah dengan ribuan penghafal lainnya di <span className="font-bold text-emerald-600">Qurani</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-5">
                            <Input
                                type="text"
                                label="Nama Lengkap"
                                placeholder="Ahmad Ridwan"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                error={errors.name}
                                icon={<User className="w-5 h-5 text-gray-400" />}
                            />

                            <Input
                                type="email"
                                label="Email Address"
                                placeholder="nama@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                error={errors.email}
                                icon={<Mail className="w-5 h-5 text-gray-400" />}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    type="password"
                                    label="Password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    error={errors.password}
                                    icon={<Lock className="w-5 h-5 text-gray-400" />}
                                />
                                <Input
                                    type="password"
                                    label="Konfirmasi"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    error={errors.confirmPassword}
                                    icon={<Lock className="w-5 h-5 text-gray-400" />}
                                />
                            </div>
                        </div>

                        <div className="flex items-start">
                            <input
                                type="checkbox"
                                id="terms"
                                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 mt-1"
                                required
                            />
                            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                                Saya menyetujui <a href="#" className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline">Syarat & Ketentuan</a>
                            </label>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 !bg-emerald-600 hover:!bg-emerald-700 !text-white !text-lg !font-bold rounded-2xl shadow-xl shadow-emerald-600/20 hover:shadow-emerald-600/40 transition-all duration-300 transform hover:-translate-y-1"
                            isLoading={isLoading}
                            style={{ backgroundColor: '#059669', color: '#ffffff' }}
                        >
                            Daftar Sekarang
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
