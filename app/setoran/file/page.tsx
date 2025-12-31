'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import {
    Upload,
    FileAudio,
    X,
    Check,
    ArrowLeft,
    Info,
    Send,
    Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/buttons/Button';
import { Input } from '@/components/ui/inputs/Input';
import type { CreateSubmissionRequest, Surah } from '@/types';

// Daftar surah untuk dropdown - akan diambil dari API/constant
const surahList: Surah[] = [
    { number: 1, name_arabic: 'الفاتحة', name_latin: 'Al-Fatihah', name_translation: 'Pembukaan', total_ayah: 7, revelation_type: 'meccan' },
    { number: 2, name_arabic: 'البقرة', name_latin: 'Al-Baqarah', name_translation: 'Sapi', total_ayah: 286, revelation_type: 'medinan' },
    { number: 3, name_arabic: 'آل عمران', name_latin: 'Ali Imran', name_translation: 'Keluarga Imran', total_ayah: 200, revelation_type: 'medinan' },
    { number: 4, name_arabic: 'النساء', name_latin: 'An-Nisa', name_translation: 'Wanita', total_ayah: 176, revelation_type: 'medinan' },
    { number: 5, name_arabic: 'المائدة', name_latin: 'Al-Maidah', name_translation: 'Hidangan', total_ayah: 120, revelation_type: 'medinan' },
    // ... tambahkan surah lainnya
    { number: 114, name_arabic: 'الناس', name_latin: 'An-Nas', name_translation: 'Manusia', total_ayah: 6, revelation_type: 'meccan' },
];

export default function SetoranFilePage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Form data sesuai CreateSubmissionRequest
    const [formData, setFormData] = useState({
        surah_number: '',
        surah_name: '',
        ayah_start: '',
        ayah_end: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Validasi file
    const validateFile = useCallback((file: File): string | null => {
        const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/x-m4a', 'audio/mp4'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|m4a)$/i)) {
            return 'Format file tidak didukung. Gunakan MP3, WAV, atau M4A';
        }

        if (file.size > maxSize) {
            return 'Ukuran file terlalu besar. Maksimal 10MB';
        }

        return null;
    }, []);

    // Handle drag & drop
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleFileSelect = (file: File) => {
        const error = validateFile(file);
        if (error) {
            setErrors({ ...errors, file: error });
            return;
        }
        setErrors({ ...errors, file: '' });
        setSelectedFile(file);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    // Handle surah selection
    const handleSurahChange = (surahNumber: string) => {
        const surah = surahList.find(s => s.number === parseInt(surahNumber));
        setFormData({
            ...formData,
            surah_number: surahNumber,
            surah_name: surah?.name_latin || '',
        });
    };

    // Validasi form
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!selectedFile) {
            newErrors.file = 'File audio wajib diupload';
        }
        if (!formData.surah_number) {
            newErrors.surah = 'Pilih surah';
        }
        if (!formData.ayah_start) {
            newErrors.ayah_start = 'Ayat mulai wajib diisi';
        } else if (parseInt(formData.ayah_start) < 1) {
            newErrors.ayah_start = 'Ayat mulai minimal 1';
        }
        if (formData.ayah_end && parseInt(formData.ayah_end) < parseInt(formData.ayah_start)) {
            newErrors.ayah_end = 'Ayat akhir harus lebih besar dari ayat mulai';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setUploadProgress(0);

        // Simulate upload progress
        const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return prev;
                }
                return prev + 10;
            });
        }, 200);

        // Prepare request data sesuai CreateSubmissionRequest
        const requestData: CreateSubmissionRequest = {
            type: 'file',
            surah_name: formData.surah_name,
            surah_number: parseInt(formData.surah_number),
            ayah_start: parseInt(formData.ayah_start),
            ayah_end: formData.ayah_end ? parseInt(formData.ayah_end) : undefined,
            audio_file: selectedFile!,
        };

        // TODO: Panggil API POST /api/submissions
        // Gunakan FormData untuk upload file
        // const formDataObj = new FormData();
        // formDataObj.append('type', requestData.type);
        // formDataObj.append('surah_name', requestData.surah_name);
        // formDataObj.append('surah_number', requestData.surah_number.toString());
        // formDataObj.append('ayah_start', requestData.ayah_start.toString());
        // if (requestData.ayah_end) formDataObj.append('ayah_end', requestData.ayah_end.toString());
        // formDataObj.append('audio_file', requestData.audio_file);
        // const response = await fetch('/api/submissions', { method: 'POST', body: formDataObj });

        setTimeout(() => {
            clearInterval(progressInterval);
            setUploadProgress(100);
            console.log('Create Submission Request:', requestData);

            setTimeout(() => {
                setIsSubmitting(false);
                alert('Setoran berhasil dikirim! (Demo)');

                // Reset form
                setSelectedFile(null);
                setFormData({ surah_number: '', surah_name: '', ayah_start: '', ayah_end: '' });
                setUploadProgress(0);
            }, 500);
        }, 2000);
    };

    // Format file size
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const selectedSurah = surahList.find(s => s.number === parseInt(formData.surah_number));

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="mb-6">
                <Link
                    href="/beranda"
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-emerald-600 mb-4 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Kembali ke Beranda
                </Link>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Upload File Audio</h1>
                <p className="text-gray-600 mt-1">Upload rekaman bacaan Al-Qur'an Anda untuk divalidasi</p>
            </div>

            {/* Main Form Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* File Upload Area */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            File Audio <span className="text-red-500">*</span>
                        </label>
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`
                                border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer
                                ${isDragging
                                    ? 'border-emerald-500 bg-emerald-50'
                                    : selectedFile
                                        ? 'border-emerald-500 bg-emerald-50/50'
                                        : errors.file
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-200 hover:border-emerald-400 hover:bg-gray-50'
                                }
                            `}
                        >
                            {!selectedFile ? (
                                <label className="cursor-pointer block">
                                    <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Upload className="w-8 h-8 text-emerald-600" />
                                    </div>
                                    <p className="text-base font-medium text-gray-900 mb-1">
                                        Drag & drop file audio atau <span className="text-emerald-600">pilih file</span>
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        MP3, WAV, atau M4A (maks. 10MB)
                                    </p>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="audio/mp3,audio/mpeg,audio/wav,audio/m4a"
                                        onChange={handleFileInputChange}
                                    />
                                </label>
                            ) : (
                                <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-emerald-200">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                            <FileAudio className="w-6 h-6 text-emerald-600" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-medium text-gray-900 text-sm truncate max-w-[200px]">
                                                {selectedFile.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatFileSize(selectedFile.size)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedFile(null)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <X className="w-5 h-5 text-gray-400 hover:text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        {errors.file && (
                            <p className="mt-2 text-sm text-red-500">{errors.file}</p>
                        )}
                    </div>

                    {/* Surah Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pilih Surah <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.surah_number}
                            onChange={(e) => handleSurahChange(e.target.value)}
                            className={`
                                w-full px-4 py-3 rounded-xl border bg-gray-50/50 text-gray-900
                                focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white
                                transition-all duration-200
                                ${errors.surah ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'}
                            `}
                        >
                            <option value="">-- Pilih Surah --</option>
                            {surahList.map((surah) => (
                                <option key={surah.number} value={surah.number}>
                                    {surah.number}. {surah.name_latin} ({surah.name_arabic}) - {surah.total_ayah} ayat
                                </option>
                            ))}
                        </select>
                        {errors.surah && (
                            <p className="mt-2 text-sm text-red-500">{errors.surah}</p>
                        )}
                    </div>

                    {/* Ayah Range */}
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Ayat Mulai"
                            type="number"
                            min="1"
                            max={selectedSurah?.total_ayah || 999}
                            placeholder="1"
                            value={formData.ayah_start}
                            onChange={(e) => setFormData({ ...formData, ayah_start: e.target.value })}
                            error={errors.ayah_start}
                            required
                        />
                        <Input
                            label="Ayat Akhir (opsional)"
                            type="number"
                            min={parseInt(formData.ayah_start) || 1}
                            max={selectedSurah?.total_ayah || 999}
                            placeholder={selectedSurah?.total_ayah?.toString() || '7'}
                            value={formData.ayah_end}
                            onChange={(e) => setFormData({ ...formData, ayah_end: e.target.value })}
                            error={errors.ayah_end}
                        />
                    </div>

                    {/* Progress Bar */}
                    {isSubmitting && (
                        <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Mengunggah...</span>
                                <span className="text-sm text-emerald-600 font-bold">{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    {/* Submit Buttons */}
                    <div className="flex space-x-3 pt-2">
                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                            disabled={!selectedFile}
                            className="flex-1 h-12 !bg-emerald-600 hover:!bg-emerald-700 !text-white !font-bold rounded-xl"
                            style={{ backgroundColor: '#059669', color: '#ffffff' }}
                        >
                            <Send className="w-5 h-5 mr-2" />
                            {isSubmitting ? 'Mengirim...' : 'Kirim Setoran'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setSelectedFile(null);
                                setFormData({ surah_number: '', surah_name: '', ayah_start: '', ayah_end: '' });
                                setErrors({});
                            }}
                        >
                            <Trash2 className="w-5 h-5" />
                        </Button>
                    </div>
                </form>
            </div>

            {/* Tips Card */}
            <div className="mt-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                    <Info className="w-5 h-5 mr-2 text-blue-600" />
                    Tips Rekaman Berkualitas
                </h3>
                <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        Rekam di tempat yang tenang tanpa noise
                    </li>
                    <li className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        Pastikan suara jelas dan tidak terlalu jauh dari mikrofon
                    </li>
                    <li className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        Bacaan dengan tartil dan tajwid yang baik
                    </li>
                    <li className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        Format MP3 atau M4A direkomendasikan untuk kualitas terbaik
                    </li>
                </ul>
            </div>
        </div>
    );
}
