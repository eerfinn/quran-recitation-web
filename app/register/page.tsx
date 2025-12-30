'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/buttons/Button';
import { Input } from '@/components/ui/inputs/Input';
import { BookOpen, User, Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
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

        setTimeout(() => {
            console.log('Register Data:', formData);
            setIsLoading(false);
            setIsSuccess(true);
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex bg-white relative">
            {/* Success Popup */}
            {isSuccess && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl p-8 shadow-2xl transform scale-100 animate-slide-up max-w-sm w-full text-center mx-4">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-12 h-12 text-emerald-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Pendaftaran Berhasil!</h3>
                        <p className="text-gray-600 mb-6">Akun Anda telah dibuat. Mengalihkan ke halaman login...</p>
                        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                </div>
            )}

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
                                Mulai Perjalanan<br />Hafalan Anda
                            </h2>
                            <div className="inline-block bg-gray-900/40 backdrop-blur-sm p-6 rounded-3xl border border-white/10">
                                <p className="text-gray-100 text-xl leading-relaxed italic drop-shadow-md">
                                    "Sebaik-baik kalian adalah orang yang belajar Al-Qur'an dan mengajarkannya."
                                </p>
                                <span className="text-base mt-4 block text-emerald-400 font-semibold drop-shadow-sm">- HR. Bukhari</span>
                            </div>
                        </div>
                    </div>

                    {/* Empty footer space */}
                    <div className="h-10"></div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 xl:p-20 bg-white">
                <div className="w-full max-w-md space-y-8 animate-slide-up">
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Buat Akun Baru
                        </h1>
                        <p className="mt-3 text-base text-gray-600">
                            Bergabunglah dengan ribuan penghafal lainnya di <span className="font-bold text-emerald-600">Qurani</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-4">
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
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        label="Password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        error={errors.password}
                                        icon={<Lock className="w-5 h-5 text-gray-400" />}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <div className="relative">
                                    <Input
                                        type={showConfirmPassword ? "text" : "password"}
                                        label="Konfirmasi"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        error={errors.confirmPassword}
                                        icon={<Lock className="w-5 h-5 text-gray-400" />}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
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

                    <p className="text-center text-sm text-gray-600 font-medium">
                        Sudah punya akun?{' '}
                        <Link href="/login" className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                            Masuk disini
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
