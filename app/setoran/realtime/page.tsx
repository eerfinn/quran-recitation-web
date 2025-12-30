'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/buttons/Button';
import { Input } from '@/components/ui/inputs/Input';
import { Mic, Square, Radio, AlertCircle } from 'lucide-react';

export default function SetoranRealtimePage() {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [transcription, setTranscription] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const [formData, setFormData] = useState({
        surah: '',
        ayahStart: '',
        ayahEnd: '',
    });

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = async (event) => {
                if (event.data.size > 0) {
                    // TODO: Send chunks to Whisper API for real-time transcription
                    // Simulate transcription update
                    setIsProcessing(true);
                    setTimeout(() => {
                        const mockTexts = [
                            'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
                            'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
                            'الرَّحْمَٰنِ الرَّحِيمِ',
                            'مَالِكِ يَوْمِ الدِّينِ',
                        ];
                        const randomText = mockTexts[Math.floor(Math.random() * mockTexts.length)];
                        setTranscription(prev => prev + ' ' + randomText);
                        setIsProcessing(false);
                    }, 1000);
                }
            };

            mediaRecorder.onstop = () => {
                stream.getTracks().forEach(track => track.stop());
            };

            // Start recording with timeslice for regular data availability
            mediaRecorder.start(3000); // Get data every 3 seconds
            setIsRecording(true);
            setTranscription('');

            // Start timer
            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Tidak dapat mengakses mikrofon. Pastikan izin mikrofon diaktifkan.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }

            // TODO: Finalize and submit to backend
            console.log('Final transcription:', transcription);
            alert('Rekaman selesai! Transcription: ' + transcription + ' (Demo)');
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Realtime Recording
                </h1>
                <p className="text-gray-600">
                    Rekam dengan feedback transkripsi langsung menggunakan AI
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recording Control */}
                <Card>
                    <CardHeader>
                        <CardTitle>Kontrol Rekaman</CardTitle>
                        <CardDescription>
                            Mulai rekam untuk mendapatkan feedback real-time
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Recording Button */}
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 text-center border border-purple-100">
                                {!isRecording ? (
                                    <div className="space-y-4">
                                        <div
                                            className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer"
                                            onClick={startRecording}
                                        >
                                            <Radio className="w-12 h-12 text-white" />
                                        </div>
                                        <p className="text-gray-700 font-medium">
                                            Klik untuk mulai rekam realtime
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="w-24 h-24 mx-auto bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                            <Mic className="w-12 h-12 text-white" />
                                        </div>
                                        <div className="text-3xl font-bold text-gray-900">
                                            {formatTime(recordingTime)}
                                        </div>
                                        <div className="flex items-center justify-center space-x-2 text-sm text-red-600">
                                            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                                            <span className="font-medium">MEREKAM</span>
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={stopRecording}
                                            variant="outline"
                                            className="mt-4"
                                        >
                                            <Square className="w-4 h-4 mr-2" />
                                            Hentikan
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Form Inputs */}
                            <div className="space-y-3">
                                <Input
                                    label="Nama Surah"
                                    placeholder="Al-Fatihah"
                                    value={formData.surah}
                                    onChange={(e) => setFormData({ ...formData, surah: e.target.value })}
                                    disabled={isRecording}
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <Input
                                        label="Ayat Mulai"
                                        type="number"
                                        placeholder="1"
                                        value={formData.ayahStart}
                                        onChange={(e) => setFormData({ ...formData, ayahStart: e.target.value })}
                                        disabled={isRecording}
                                    />
                                    <Input
                                        label="Ayat Akhir"
                                        type="number"
                                        placeholder="7"
                                        value={formData.ayahEnd}
                                        onChange={(e) => setFormData({ ...formData, ayahEnd: e.target.value })}
                                        disabled={isRecording}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Live Transcription */}
                <Card className="lg:row-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Radio className="w-5 h-5 mr-2 text-purple-600" />
                            Live Transcription
                        </CardTitle>
                        <CardDescription>
                            Transkripsi bacaan Anda akan muncul di sini secara realtime
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="min-h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border-2 border-gray-200">
                            {!isRecording && !transcription && (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <AlertCircle className="w-12 h-12 text-gray-400 mb-3" />
                                    <p className="text-gray-500">
                                        Mulai rekaman untuk melihat transkripsi real-time
                                    </p>
                                </div>
                            )}

                            {(isRecording || transcription) && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-medium text-gray-700">
                                            Transkripsi AI:
                                        </span>
                                        {isProcessing && (
                                            <span className="text-xs text-purple-600 flex items-center">
                                                <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse mr-1.5" />
                                                Processing...
                                            </span>
                                        )}
                                    </div>

                                    <div className="prose prose-lg font-arabic text-right leading-relaxed">
                                        <p className="text-gray-900 text-2xl">
                                            {transcription || 'Mendengarkan...'}
                                        </p>
                                    </div>

                                    {transcription && !isRecording && (
                                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0">
                                                    <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="ml-3">
                                                    <h3 className="text-sm font-medium text-green-800">
                                                        Rekaman Selesai!
                                                    </h3>
                                                    <p className="text-xs text-green-700 mt-1">
                                                        Transkripsi telah diproses. Review sebelum submit.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Info Card */}
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
                    <CardContent className="pt-6">
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <Radio className="w-5 h-5 mr-2 text-purple-600" />
                            Tentang Realtime Mode
                        </h3>
                        <ul className="text-sm text-gray-700 space-y-1 ml-7">
                            <li>• Transkripsi muncul saat Anda membaca</li>
                            <li>• Feedback langsung dari AI Whisper</li>
                            <li>• Cocok untuk latihan dan perbaikan bacaan</li>
                            <li>• Membutuhkan koneksi internet stabil</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
