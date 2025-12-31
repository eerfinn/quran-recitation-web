'use client';

import React from 'react';
import Link from 'next/link';
import {
    TrendingUp,
    Calendar,
    Clock,
    CheckCircle,
    Upload,
    Mic,
    Radio,
    Award,
    ChevronRight,
    BookOpen,
    Flame,
    Target,
    Play
} from 'lucide-react';

// Mock data - akan diganti dengan data dari backend
const stats = [
    {
        title: 'Total Setoran',
        value: '24',
        change: '+3 minggu ini',
        icon: CheckCircle,
        color: 'from-emerald-500 to-teal-600',
        bgLight: 'bg-emerald-50',
        textColor: 'text-emerald-600',
    },
    {
        title: 'Streak Saat Ini',
        value: '7',
        unit: 'Hari',
        change: 'Pertahankan!',
        icon: Flame,
        color: 'from-orange-500 to-red-500',
        bgLight: 'bg-orange-50',
        textColor: 'text-orange-600',
    },
    {
        title: 'Total Durasi',
        value: '2.5',
        unit: 'Jam',
        change: '+30 menit',
        icon: Clock,
        color: 'from-blue-500 to-indigo-600',
        bgLight: 'bg-blue-50',
        textColor: 'text-blue-600',
    },
    {
        title: 'Rata-rata Skor',
        value: '92',
        unit: '%',
        change: '+5% dari bulan lalu',
        icon: Target,
        color: 'from-purple-500 to-pink-600',
        bgLight: 'bg-purple-50',
        textColor: 'text-purple-600',
    },
];

const recentSubmissions = [
    {
        id: 1,
        type: 'file',
        surah: 'Al-Fatihah',
        ayah: '1-7',
        score: 95,
        date: '2 jam lalu',
        status: 'success',
    },
    {
        id: 2,
        type: 'voice-note',
        surah: 'Al-Baqarah',
        ayah: '1-5',
        score: 88,
        date: 'Kemarin',
        status: 'success',
    },
    {
        id: 3,
        type: 'realtime',
        surah: 'Ali Imran',
        ayah: '1-3',
        score: 92,
        date: '2 hari lalu',
        status: 'success',
    },
];

const quickActions = [
    {
        title: 'Upload File',
        description: 'Upload rekaman audio',
        icon: Upload,
        href: '/setoran/file',
        color: 'from-emerald-500 to-teal-600',
        bgHover: 'hover:bg-emerald-50',
    },
    {
        title: 'Voice Note',
        description: 'Rekam langsung',
        icon: Mic,
        href: '/setoran/voice-note',
        color: 'from-blue-500 to-cyan-600',
        bgHover: 'hover:bg-blue-50',
    },
    {
        title: 'Realtime',
        description: 'Feedback langsung',
        icon: Radio,
        href: '/setoran/realtime',
        color: 'from-purple-500 to-pink-600',
        bgHover: 'hover:bg-purple-50',
    },
];

export default function BerandaPage() {
    const currentHour = new Date().getHours();
    const greeting = currentHour < 12 ? 'Selamat Pagi' : currentHour < 18 ? 'Selamat Siang' : 'Selamat Malam';

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 rounded-3xl p-8 text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-emerald-100 text-sm font-medium">{greeting} 👋</p>
                            <h1 className="text-2xl sm:text-3xl font-bold">Ahmad Ridwan</h1>
                        </div>
                    </div>
                    <p className="text-emerald-100 mt-4 max-w-xl">
                        Semangat untuk setoran hari ini! Anda sudah konsisten selama 7 hari berturut-turut.
                    </p>

                    {/* Quick Progress */}
                    <div className="mt-6 flex flex-wrap gap-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center space-x-3">
                            <Flame className="w-5 h-5 text-orange-300" />
                            <div>
                                <p className="text-xs text-emerald-200">Streak</p>
                                <p className="font-bold">7 Hari</p>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center space-x-3">
                            <Target className="w-5 h-5 text-blue-300" />
                            <div>
                                <p className="text-xs text-emerald-200">Target Bulan Ini</p>
                                <p className="font-bold">80% Tercapai</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className={`w-11 h-11 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <div className={`${stat.bgLight} ${stat.textColor} text-xs font-medium px-2 py-1 rounded-full`}>
                                    <TrendingUp className="w-3 h-3 inline mr-1" />
                                    {stat.change}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                                    {stat.value}
                                    {stat.unit && <span className="text-lg text-gray-500 ml-1">{stat.unit}</span>}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions & Recent */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <Play className="w-5 h-5 mr-2 text-emerald-600" />
                            Buat Setoran
                        </h2>
                        <div className="space-y-3">
                            {quickActions.map((action, index) => {
                                const Icon = action.icon;
                                return (
                                    <Link
                                        key={index}
                                        href={action.href}
                                        className={`flex items-center p-4 rounded-xl border border-gray-100 ${action.bgHover} transition-all duration-200 group`}
                                    >
                                        <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{action.title}</h3>
                                            <p className="text-sm text-gray-500">{action.description}</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Recent Submissions */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center">
                                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                                Setoran Terbaru
                            </h2>
                            <Link
                                href="/riwayat"
                                className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center"
                            >
                                Lihat Semua
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {recentSubmissions.map((submission) => (
                                <div
                                    key={submission.id}
                                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-md ${submission.type === 'file' ? 'bg-gradient-to-br from-emerald-500 to-teal-600' :
                                                submission.type === 'voice-note' ? 'bg-gradient-to-br from-blue-500 to-cyan-600' :
                                                    'bg-gradient-to-br from-purple-500 to-pink-600'
                                            }`}>
                                            {submission.type === 'file' && <Upload className="w-5 h-5 text-white" />}
                                            {submission.type === 'voice-note' && <Mic className="w-5 h-5 text-white" />}
                                            {submission.type === 'realtime' && <Radio className="w-5 h-5 text-white" />}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{submission.surah}</p>
                                            <p className="text-sm text-gray-500">Ayat {submission.ayah} • {submission.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="text-right">
                                            <div className="flex items-center space-x-1">
                                                <Award className="w-4 h-4 text-yellow-500" />
                                                <span className="font-bold text-gray-900">{submission.score}%</span>
                                            </div>
                                            <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                                                Berhasil
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {recentSubmissions.length === 0 && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <BookOpen className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-500">Belum ada setoran</p>
                                <p className="text-sm text-gray-400 mt-1">Mulai setoran pertama Anda!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Motivational Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
                <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 mb-1">Ayat Hari Ini</h3>
                        <p className="text-gray-700 italic text-lg leading-relaxed">
                            "Dan bacalah Al-Qur'an itu dengan perlahan-lahan (tartil)."
                        </p>
                        <p className="text-sm text-amber-700 font-medium mt-2">- QS. Al-Muzzammil: 4</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
