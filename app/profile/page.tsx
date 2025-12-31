'use client';

import React, { useState } from 'react';
import {
    User,
    Mail,
    Calendar,
    Award,
    TrendingUp,
    Clock,
    CheckCircle,
    Edit3,
    Camera,
    Lock,
    Save,
    X,
    Flame,
    Target,
    BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/buttons/Button';
import { Input } from '@/components/ui/inputs/Input';
import type { User as UserType, UserStats, Achievement, UpdateProfileRequest, ChangePasswordRequest } from '@/types';

// Mock data - akan diganti dengan data dari API
const mockUser: UserType = {
    id: 'usr_123456',
    name: 'Ahmad Ridwan',
    email: 'ahmad.ridwan@email.com',
    avatar_url: undefined,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-12-30T10:00:00Z',
};

const mockStats: UserStats = {
    total_submissions: 24,
    completed_submissions: 22,
    average_score: 92,
    current_streak: 7,
    longest_streak: 14,
    total_duration: 9000, // 2.5 jam dalam detik
    this_week_submissions: 5,
    this_month_submissions: 18,
};

const mockAchievements: Achievement[] = [
    { id: '1', code: 'first_submission', name: 'Pemula', description: 'Setoran pertama', unlocked_at: '2024-01-01T00:00:00Z' },
    { id: '2', code: 'streak_7', name: 'Konsisten 7 Hari', description: 'Streak 7 hari berturut', unlocked_at: '2024-01-07T00:00:00Z' },
    { id: '3', code: 'perfect_score', name: 'Skor Sempurna', description: 'Mendapat skor 100%', unlocked_at: '2024-01-15T00:00:00Z' },
    { id: '4', code: 'streak_30', name: 'Master 30 Hari', description: 'Streak 30 hari berturut', unlocked_at: undefined },
];

const statsCards = [
    { label: 'Total Setoran', key: 'total_submissions', icon: CheckCircle, color: 'from-emerald-500 to-teal-600' },
    { label: 'Streak Terpanjang', key: 'longest_streak', icon: Flame, color: 'from-orange-500 to-red-500', suffix: ' Hari' },
    { label: 'Total Durasi', key: 'total_duration', icon: Clock, color: 'from-blue-500 to-indigo-600', format: 'duration' },
    { label: 'Rata-rata Skor', key: 'average_score', icon: Target, color: 'from-purple-500 to-pink-600', suffix: '%' },
];

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form state untuk edit profile (sesuai UpdateProfileRequest)
    const [profileForm, setProfileForm] = useState<UpdateProfileRequest>({
        name: mockUser.name,
    });

    // Form state untuk ganti password (sesuai ChangePasswordRequest)
    const [passwordForm, setPasswordForm] = useState<ChangePasswordRequest>({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Handler untuk save profile
    const handleSaveProfile = async () => {
        setErrors({});

        // Validasi
        if (!profileForm.name || profileForm.name.trim() === '') {
            setErrors({ name: 'Nama tidak boleh kosong' });
            return;
        }

        setIsLoading(true);

        // TODO: Panggil API PUT /api/users/profile
        // const response = await updateProfile(profileForm);

        setTimeout(() => {
            console.log('Update Profile Request:', profileForm);
            setIsLoading(false);
            setIsEditing(false);
            alert('Profile berhasil diupdate! (Demo)');
        }, 1000);
    };

    // Handler untuk ganti password
    const handleChangePassword = async () => {
        setErrors({});
        const newErrors: Record<string, string> = {};

        if (!passwordForm.current_password) {
            newErrors.current_password = 'Password saat ini wajib diisi';
        }
        if (!passwordForm.new_password) {
            newErrors.new_password = 'Password baru wajib diisi';
        } else if (passwordForm.new_password.length < 8) {
            newErrors.new_password = 'Password minimal 8 karakter';
        }
        if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
            newErrors.new_password_confirmation = 'Konfirmasi password tidak cocok';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        // TODO: Panggil API PUT /api/users/password
        // const response = await changePassword(passwordForm);

        setTimeout(() => {
            console.log('Change Password Request:', passwordForm);
            setIsLoading(false);
            setIsChangingPassword(false);
            setPasswordForm({ current_password: '', new_password: '', new_password_confirmation: '' });
            alert('Password berhasil diubah! (Demo)');
        }, 1000);
    };

    // Format durasi dari detik ke jam/menit
    const formatDuration = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) {
            return `${hours}.${Math.round(minutes / 6)} Jam`;
        }
        return `${minutes} Menit`;
    };

    // Format tanggal
    const formatDate = (isoString: string): string => {
        return new Date(isoString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div className="mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Profile Saya</h1>
                <p className="text-gray-600 mt-1">Kelola informasi akun dan lihat statistik Anda</p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Cover */}
                <div className="h-32 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>

                {/* Profile Info */}
                <div className="px-6 pb-6">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-12">
                        {/* Avatar */}
                        <div className="flex items-end space-x-4">
                            <div className="relative">
                                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl border-4 border-white">
                                    {mockUser.avatar_url ? (
                                        <img src={mockUser.avatar_url} alt={mockUser.name} className="w-full h-full object-cover rounded-2xl" />
                                    ) : (
                                        mockUser.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-xl border-2 border-gray-100 flex items-center justify-center hover:bg-gray-50 shadow-sm transition-colors">
                                    <Camera className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>
                            <div className="pb-2">
                                <h2 className="text-xl font-bold text-gray-900">{mockUser.name}</h2>
                                <p className="text-gray-500 text-sm">{mockUser.email}</p>
                            </div>
                        </div>

                        {/* Edit Button */}
                        {!isEditing && (
                            <Button
                                variant="outline"
                                onClick={() => setIsEditing(true)}
                                className="mt-4 sm:mt-0"
                            >
                                <Edit3 className="w-4 h-4 mr-2" />
                                Edit Profile
                            </Button>
                        )}
                    </div>

                    {/* Member Since */}
                    <div className="flex items-center mt-4 text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        Bergabung sejak {formatDate(mockUser.created_at)}
                    </div>
                </div>
            </div>

            {/* Edit Profile Form */}
            {isEditing && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <Edit3 className="w-5 h-5 mr-2 text-emerald-600" />
                        Edit Informasi Profile
                    </h3>
                    <div className="space-y-4 max-w-md">
                        <Input
                            label="Nama Lengkap"
                            value={profileForm.name || ''}
                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                            error={errors.name}
                            icon={<User className="w-5 h-5 text-gray-400" />}
                        />
                        <Input
                            label="Email"
                            type="email"
                            value={mockUser.email}
                            disabled
                            icon={<Mail className="w-5 h-5 text-gray-400" />}
                        />
                        <p className="text-xs text-gray-500">* Email tidak dapat diubah</p>

                        <div className="flex space-x-3 pt-2">
                            <Button
                                onClick={handleSaveProfile}
                                isLoading={isLoading}
                                className="!bg-emerald-600 hover:!bg-emerald-700 !text-white"
                                style={{ backgroundColor: '#059669', color: '#ffffff' }}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Simpan
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsEditing(false);
                                    setProfileForm({ name: mockUser.name });
                                    setErrors({});
                                }}
                            >
                                <X className="w-4 h-4 mr-2" />
                                Batal
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Change Password Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <Lock className="w-5 h-5 mr-2 text-blue-600" />
                        Keamanan Akun
                    </h3>
                    {!isChangingPassword && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsChangingPassword(true)}
                        >
                            Ubah Password
                        </Button>
                    )}
                </div>

                {isChangingPassword ? (
                    <div className="space-y-4 max-w-md">
                        <Input
                            type="password"
                            label="Password Saat Ini"
                            value={passwordForm.current_password}
                            onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                            error={errors.current_password}
                            icon={<Lock className="w-5 h-5 text-gray-400" />}
                        />
                        <Input
                            type="password"
                            label="Password Baru"
                            value={passwordForm.new_password}
                            onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                            error={errors.new_password}
                            icon={<Lock className="w-5 h-5 text-gray-400" />}
                        />
                        <Input
                            type="password"
                            label="Konfirmasi Password Baru"
                            value={passwordForm.new_password_confirmation}
                            onChange={(e) => setPasswordForm({ ...passwordForm, new_password_confirmation: e.target.value })}
                            error={errors.new_password_confirmation}
                            icon={<Lock className="w-5 h-5 text-gray-400" />}
                        />
                        <div className="flex space-x-3 pt-2">
                            <Button
                                onClick={handleChangePassword}
                                isLoading={isLoading}
                                className="!bg-blue-600 hover:!bg-blue-700 !text-white"
                                style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Ubah Password
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsChangingPassword(false);
                                    setPasswordForm({ current_password: '', new_password: '', new_password_confirmation: '' });
                                    setErrors({});
                                }}
                            >
                                Batal
                            </Button>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm">
                        Terakhir diubah: {formatDate(mockUser.updated_at)}
                    </p>
                )}
            </div>

            {/* Statistics */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-emerald-600" />
                    Statistik Anda
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {statsCards.map((stat, index) => {
                        const Icon = stat.icon;
                        const value = mockStats[stat.key as keyof UserStats];
                        const displayValue = stat.format === 'duration'
                            ? formatDuration(value as number)
                            : `${value}${stat.suffix || ''}`;

                        return (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                            >
                                <div className={`w-11 h-11 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900">{displayValue}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-yellow-600" />
                    Pencapaian
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {mockAchievements.map((achievement) => {
                        const isUnlocked = !!achievement.unlocked_at;
                        return (
                            <div
                                key={achievement.id}
                                className={`text-center p-4 rounded-xl border-2 transition-all ${isUnlocked
                                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 hover:scale-105'
                                        : 'bg-gray-50 border-gray-200 opacity-50'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg ${isUnlocked
                                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                                        : 'bg-gray-300'
                                    }`}>
                                    <Award className={`w-6 h-6 ${isUnlocked ? 'text-white' : 'text-gray-500'}`} />
                                </div>
                                <p className={`text-sm font-semibold ${isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                                    {achievement.name}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{achievement.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
