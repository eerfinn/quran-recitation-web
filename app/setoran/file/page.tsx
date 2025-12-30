'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/buttons/Button';
import { Input } from '@/components/ui/inputs/Input';
import { Upload, FileAudio, X, Check } from 'lucide-react';

export default function SetoranFilePage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        surah: '',
        ayahStart: '',
        ayahEnd: '',
    });

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
        // Validate file type
        const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/x-m4a'];
        if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|m4a)$/i)) {
            alert('Format file tidak didukung. Gunakan MP3, WAV, atau M4A');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert('Ukuran file terlalu besar. Maksimal 10MB');
            return;
        }

        setSelectedFile(file);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFile || !formData.surah || !formData.ayahStart) {
            alert('Mohon lengkapi semua field');
            return;
        }

        setIsUploading(true);

        // TODO: Upload to Supabase storage and process with Whisper
        setTimeout(() => {
            console.log('Upload file:', { file: selectedFile, ...formData });
            alert('Setoran berhasil dikirim! (Demo)');
            setIsUploading(false);
            setSelectedFile(null);
            setFormData({ surah: '', ayahStart: '', ayahEnd: '' });
        }, 2000);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Upload File Audio
                </h1>
                <p className="text-gray-600">
                    Upload rekaman bacaan Al-Qur'an Anda untuk divalidasi
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Upload Rekaman</CardTitle>
                    <CardDescription>
                        File audio maksimal 10MB dengan format MP3, WAV, atau M4A
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* File Upload Area */}
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`
                border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
                ${isDragging
                                    ? 'border-primary-500 bg-primary-50'
                                    : selectedFile
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                                }
              `}
                        >
                            {!selectedFile ? (
                                <>
                                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <p className="text-sm font-medium text-gray-900 mb-1">
                                        Drag & drop file audio atau
                                    </p>
                                    <label className="cursor-pointer text-primary-600 hover:text-primary-700 font-medium">
                                        pilih file
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="audio/mp3,audio/mpeg,audio/wav,audio/m4a"
                                            onChange={handleFileInputChange}
                                        />
                                    </label>
                                    <p className="text-xs text-gray-500 mt-2">
                                        MP3, WAV, atau M4A (maks. 10MB)
                                    </p>
                                </>
                            ) : (
                                <div className="flex items-center justify-between bg-white rounded-lg p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <FileAudio className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-medium text-gray-900 text-sm">
                                                {selectedFile.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatFileSize(selectedFile.size)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Check className="w-5 h-5 text-green-600" />
                                        <button
                                            type="button"
                                            onClick={() => setSelectedFile(null)}
                                            className="p-1 hover:bg-gray-100 rounded"
                                        >
                                            <X className="w-5 h-5 text-gray-400" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Surah & Ayah Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                label="Nama Surah"
                                placeholder="Al-Fatihah"
                                value={formData.surah}
                                onChange={(e) => setFormData({ ...formData, surah: e.target.value })}
                                required
                            />
                            <Input
                                label="Ayat Mulai"
                                type="number"
                                placeholder="1"
                                value={formData.ayahStart}
                                onChange={(e) => setFormData({ ...formData, ayahStart: e.target.value })}
                                required
                            />
                            <Input
                                label="Ayat Akhir"
                                type="number"
                                placeholder="7"
                                value={formData.ayahEnd}
                                onChange={(e) => setFormData({ ...formData, ayahEnd: e.target.value })}
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex space-x-3">
                            <Button
                                type="submit"
                                variant="primary"
                                className="flex-1"
                                isLoading={isUploading}
                                disabled={!selectedFile}
                            >
                                {isUploading ? 'Mengirim...' : 'Kirim Setoran'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setSelectedFile(null);
                                    setFormData({ surah: '', ayahStart: '', ayahEnd: '' });
                                }}
                            >
                                Reset
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="mt-6 bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-100">
                <CardContent className="pt-6">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <FileAudio className="w-5 h-5 mr-2 text-primary-600" />
                        Tips Rekaman Berkualitas
                    </h3>
                    <ul className="text-sm text-gray-700 space-y-1 ml-7">
                        <li>• Rekam di tempat yang tenang tanpa noise</li>
                        <li>• Pastikan suara jelas dan tidak terlalu jauh dari mikrofon</li>
                        <li>• Bacaan dengan tartil dan tajwid yang baik</li>
                        <li>• Format MP3 atau M4A direkomendasikan untuk kualitas terbaik</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
