'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/buttons/Button';
import {
    TrendingUp,
    Calendar,
    Clock,
    CheckCircle,
    Upload,
    Mic,
    Radio,
    Award,
    BarChart3
} from 'lucide-react';
import Link from 'next/link';

// Mock data
const stats = [
    {
        title: 'Total Setoran',
        value: '24',
        change: '+12%',
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
    },
    {
        title: 'Streak Saat Ini',
        value: '7 Hari',
        change: '+2 hari',
        icon: Calendar,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
    },
    {
        title: 'Total Durasi',
        value: '2.5 Jam',
        change: '+30 menit',
        icon: Clock,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
    },
    {
        title: 'Rata-rata Skor',
        value: '92%',
        change: '+5%',
        icon: TrendingUp,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
    },
];

const recentSubmissions = [
    {
        id: 1,
        type: 'file',
        surah: 'Al-Fatihah',
        ayah: '1-7',
        score: 95,
        date: '2024-01-02',
        status: 'success',
    },
    {
        id: 2,
        type: 'voice-note',
        surah: 'Al-Baqarah',
        ayah: '1-5',
        score: 88,
        date: '2024-01-01',
        status: 'success',
    },
    {
        id: 3,
        type: 'realtime',
        surah: 'Ali-Imran',
        ayah: '1-3',
        score: 92,
        date: '2023-12-31',
        status: 'success',
    },
];

const quickActions = [
    {
        title: 'Upload File Audio',
        description: 'Upload rekaman dari file',
        icon: Upload,
        href: '/dashboard/setoran/file',
        color: 'from-green-500 to-emerald-600',
    },
    {
        title: 'Voice Note',
        description: 'Rekam langsung dari browser',
        icon: Mic,
        href: '/dashboard/setoran/voice-note',
        color: 'from-blue-500 to-cyan-600',
    },
    {
        title: 'Realtime',
        description: 'Rekam dengan feedback langsung',
        icon: Radio,
        href: '/dashboard/setoran/realtime',
        color: 'from-purple-500 to-pink-600',
    },
];

export default function BerandaPage() {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Assalamu'alaikum 👋
                </h1>
                <p className="text-gray-600">
                    Selamat datang kembali! Semangat untuk setoran hari ini
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-1">
                                            {stat.title}
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stat.value}
                                        </p>
                                        <p className="text-xs text-green-600 mt-1 flex items-center">
                                            <TrendingUp className="w-3 h-3 mr-1" />
                                            {stat.change}
                                        </p>
                                    </div>
                                    <div className={`${stat.bgColor} ${stat.color} p-3 rounded-xl`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Buat Setoran Baru
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {quickActions.map((action, index) => {
                        const Icon = action.icon;
                        return (
                            <Link key={index} href={action.href}>
                                <Card className="group cursor-pointer hover:scale-105 transition-transform duration-200">
                                    <CardContent className="pt-6">
                                        <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-1">
                                            {action.title}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {action.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Recent Submissions */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Setoran Terbaru</CardTitle>
                            <CardDescription>Riwayat setoran mengaji Anda</CardDescription>
                        </div>
                        <Button variant="outline" size="sm">
                            Lihat Semua
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentSubmissions.map((submission) => (
                            <div
                                key={submission.id}
                                className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                                        {submission.type === 'file' && <Upload className="w-5 h-5 text-white" />}
                                        {submission.type === 'voice-note' && <Mic className="w-5 h-5 text-white" />}
                                        {submission.type === 'realtime' && <Radio className="w-5 h-5 text-white" />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {submission.surah}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Ayat {submission.ayah} • {submission.date}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="text-right">
                                        <div className="flex items-center space-x-1">
                                            <Award className="w-4 h-4 text-yellow-500" />
                                            <span className="font-semibold text-gray-900">
                                                {submission.score}%
                                            </span>
                                        </div>
                                        <span className="badge badge-success text-xs">
                                            Berhasil
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
