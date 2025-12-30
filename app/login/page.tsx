'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/buttons/Button';
import { Input } from '@/components/ui/inputs/Input';
import { BookOpen, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({ email: '', password: '' });

        let isValid = true;
        const newErrors = { email: '', password: '' };

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
        }

        if (!isValid) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        setTimeout(() => {
            console.log('Login Data:', formData);
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
                    <div className="absolute inset-0 bg-gray-900/60"></div>
                </div>

                {/* Content - Centered Vertically */}
                <div className="relative z-10 flex flex-col h-full p-12 w-full">
                    {/* Logo at Top */}
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-emerald-500/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-emerald-500/30 shadow-lg shadow-emerald-900/20">
                            <BookOpen className="w-6 h-6 text-emerald-400" />
                        </div>
                        <span className="text-xl font-bold tracking-wide text-white drop-shadow-md">Qurani Website</span>
                    </div>

                    {/* Text - Centered Vertically */}
                    <div className="flex-1 flex items-center justify-center">
                        <div className="max-w-lg text-center">
                            <h2 className="text-5xl font-bold mb-8 leading-tight text-white drop-shadow-xl">
                                Perbaiki Bacaan,<br />Tenangkan Jiwa
                            </h2>
                            <div className="inline-block bg-gray-900/40 backdrop-blur-sm p-6 rounded-3xl border border-white/10">
                                <p className="text-gray-100 text-xl leading-relaxed italic drop-shadow-md">
                                    "Dan bacalah Al-Qur'an itu dengan perlahan-lahan (tartil)."
                                </p>
                                <span className="text-base mt-4 block text-emerald-400 font-semibold drop-shadow-sm">- QS. Al-Muzzammil: 4</span>
                            </div>
                        </div>
                    </div>

                    {/* Empty footer space */}
                    <div className="h-10"></div>
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
                            Selamat Datang
                        </h1>
                        <p className="mt-3 text-base text-gray-600">
                            Masuk untuk melanjutkan hafalan Anda di <span className="font-bold text-emerald-600">Qurani</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-5">
                            <Input
                                type="email"
                                label="Email Address"
                                placeholder="nama@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                error={errors.email}
                                icon={<Mail className="w-5 h-5 text-gray-400" />}
                            />

                            <div>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        label="Password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        error={errors.password}
                                        icon={<Lock className="w-5 h-5 text-gray-400" />}
                                        className="pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                <div className="flex items-center justify-end mt-2">
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                                    >
                                        Lupa password?
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 !bg-emerald-600 hover:!bg-emerald-700 !text-white !text-lg !font-bold rounded-2xl shadow-xl shadow-emerald-600/20 hover:shadow-emerald-600/40 transition-all duration-300 transform hover:-translate-y-1"
                            isLoading={isLoading}
                            style={{ backgroundColor: '#059669', color: '#ffffff' }}
                        >
                            Masuk Sekarang
                        </Button>
                    </form>

                    <p className="text-center text-sm text-gray-600 font-medium">
                        Belum memiliki akun?{' '}
                        <Link href="/register" className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                            Daftar gratis
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
