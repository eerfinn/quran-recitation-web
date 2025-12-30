'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/buttons/Button';
import { Input } from '@/components/ui/inputs/Input';
import { BookOpen, ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Email wajib diisi');
            return;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Email tidak valid');
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            console.log('Forgot Password:', email);
            setIsSubmitted(true);
            setIsLoading(false);
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
                                Kembalikan Akses<br />Akun Anda
                            </h2>
                            <div className="pl-6 border-l-4 border-emerald-500 bg-gray-900/30 backdrop-blur-sm p-4 rounded-r-2xl border-t border-r border-b border-white/10">
                                <p className="text-gray-100 text-lg leading-relaxed italic drop-shadow-md">
                                    "Maka sesungguhnya bersama kesulitan ada kemudahan."
                                </p>
                                <span className="text-sm mt-3 block text-emerald-400 font-semibold drop-shadow-sm">- QS. Al-Insyirah: 5</span>
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
                        <Link href="/login" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-emerald-600 mb-6 transition-colors group">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Kembali ke Login
                        </Link>

                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Lupa Password?
                        </h1>
                        <p className="mt-3 text-base text-gray-600">
                            Masukkan email Anda untuk menerima instruksi reset password via email.
                        </p>
                    </div>

                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                type="email"
                                label="Email Address"
                                placeholder="nama@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={error}
                                icon={<Mail className="w-5 h-5 text-gray-400" />}
                            />

                            <Button
                                type="submit"
                                className="w-full h-14 !bg-emerald-600 hover:!bg-emerald-700 !text-white !text-lg !font-bold rounded-2xl shadow-xl shadow-emerald-600/20 hover:shadow-emerald-600/40 transition-all duration-300 transform hover:-translate-y-1"
                                isLoading={isLoading}
                                style={{ backgroundColor: '#059669', color: '#ffffff' }}
                            >
                                Kirim Instruksi Reset
                            </Button>
                        </form>
                    ) : (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 text-center animate-fade-in shadow-xl shadow-emerald-100/50">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-short">
                                <BookOpen className="w-10 h-10 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Cek Email Anda</h3>
                            <p className="text-gray-600 mb-8 text-base">
                                Kami telah mengirimkan tautan untuk mereset password ke <br /><strong className="text-emerald-700 text-lg">{email}</strong>
                            </p>
                            <Button
                                variant="outline"
                                className="w-full border-2 border-emerald-100 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 transition-colors h-12 font-bold rounded-xl"
                                onClick={() => setIsSubmitted(false)}
                            >
                                Kirim Ulang Email
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
