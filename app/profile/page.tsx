'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/buttons/Button';
import { Input } from '@/components/ui/inputs/Input';
import {
    User,
    Mail,
    Calendar,
    Award,
    TrendingUp,
    Clock,
    CheckCircle,
    Edit,
    Camera
} from 'lucide-react';

// Mock user data
const mockUser = {
    name: 'Ahmad Ridwan',
    email: 'ahmad.ridwan@email.com',
    joinDate: '2024-01-01',
    avatar: null,
};

const userStats = [
    {
        label: 'Total Setoran',
        value: '24',
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
    },
    {
        label: 'Streak Terpanjang',
        value: '12 Hari',
        icon: TrendingUp,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
    },
    {
        label: 'Total Durasi',
        value: '2.5 Jam',
        icon: Clock,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
    },
    {
        label: 'Rata-rata Skor',
        value: '92%',
        icon: Award,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
    },
];

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: mockUser.name,
        email: mockUser.email,
    });

    const handleSave = () => {
        // TODO: Save to backend
        console.log('Save profile:', formData);
        setIsEditing(false);
        alert('Profile berhasil diupdate! (Demo)');
    };

    const handleCancel = () => {
        setFormData({
            name: mockUser.name,
            email: mockUser.email,
        });
        setIsEditing(false);
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Profile Saya
                </h1>
                <p className="text-gray-600">
                    Kelola informasi dan lihat statistik Anda
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="lg:col-span-1">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            {/* Avatar */}
                            <div className="relative inline-block mb-4">
                                <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                    {mockUser.name.charAt(0)}
                                </div>
                                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                                    <Camera className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>

                            <h2 className="text-xl font-bold text-gray-900 mb-1">
                                {mockUser.name}
                            </h2>
                            <p className="text-sm text-gray-500 mb-4">
                                {mockUser.email}
                            </p>

                            <div className="flex items-center justify-center text-sm text-gray-600">
                                <Calendar className="w-4 h-4 mr-1.5" />
                                Bergabung sejak {new Date(mockUser.joinDate).toLocaleDateString('id-ID', {
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Profile Details */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Informasi Profile</CardTitle>
                                <CardDescription>
                                    Detail akun dan preferensi Anda
                                </CardDescription>
                            </div>
                            {!isEditing && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsEditing(true)}
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {!isEditing ? (
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <User className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Nama Lengkap</p>
                                        <p className="text-base text-gray-900 mt-0.5">{mockUser.name}</p>
                                    </div>
                                </div>

                                <div className="divider"></div>

                                <div className="flex items-start">
                                    <Mail className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Email</p>
                                        <p className="text-base text-gray-900 mt-0.5">{mockUser.email}</p>
                                    </div>
                                </div>

                                <div className="divider"></div>

                                <div className="pt-4">
                                    <Button variant="outline" className="w-full">
                                        Ubah Password
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <Input
                                    label="Nama Lengkap"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />

                                <Input
                                    label="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />

                                <div className="flex space-x-3 pt-2">
                                    <Button
                                        variant="primary"
                                        className="flex-1"
                                        onClick={handleSave}
                                    >
                                        Simpan
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={handleCancel}
                                    >
                                        Batal
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Statistics */}
            <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Statistik Anda
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {userStats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={index}>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-1">
                                                {stat.label}
                                            </p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {stat.value}
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
            </div>

            {/* Achievements (Optional) */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Award className="w-5 h-5 mr-2 text-yellow-600" />
                        Pencapaian
                    </CardTitle>
                    <CardDescription>
                        Badge dan pencapaian yang telah Anda raih
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['Pemula', 'Konsisten 7 Hari', 'Master 30 Hari', 'Perfect Score'].map((achievement, index) => (
                            <div
                                key={index}
                                className="text-center p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 hover:scale-105 transition-transform"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                                    <Award className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-xs font-medium text-gray-800">
                                    {achievement}
                                </p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
