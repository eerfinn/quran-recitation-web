'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
    Mic,
    Square,
    Radio,
    AlertCircle,
    ArrowLeft,
    Info,
    Wifi,
    WifiOff
} from 'lucide-react';
import { Button } from '@/components/ui/buttons/Button';
import { Input } from '@/components/ui/inputs/Input';
import type { RealtimeSession, RealtimeTranscriptionChunk, Surah } from '@/types';

// Daftar surah
const surahList: Surah[] = [
    { number: 1, name_arabic: 'الفاتحة', name_latin: 'Al-Fatihah', name_translation: 'Pembukaan', total_ayah: 7, revelation_type: 'meccan' },
    { number: 2, name_arabic: 'البقرة', name_latin: 'Al-Baqarah', name_translation: 'Sapi', total_ayah: 286, revelation_type: 'medinan' },
    { number: 3, name_arabic: 'آل عمران', name_latin: 'Ali Imran', name_translation: 'Keluarga Imran', total_ayah: 200, revelation_type: 'medinan' },
    { number: 4, name_arabic: 'النساء', name_latin: 'An-Nisa', name_translation: 'Wanita', total_ayah: 176, revelation_type: 'medinan' },
    { number: 5, name_arabic: 'المائدة', name_latin: 'Al-Maidah', name_translation: 'Hidangan', total_ayah: 120, revelation_type: 'medinan' },
    { number: 114, name_arabic: 'الناس', name_latin: 'An-Nas', name_translation: 'Manusia', total_ayah: 6, revelation_type: 'meccan' },
];

// Mock Arabic texts for simulation
const mockArabicTexts = [
    'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    'الرَّحْمَٰنِ الرَّحِيمِ',
    'مَالِكِ يَوْمِ الدِّينِ',
    'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
    'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
    'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
];

export default function SetoranRealtimePage() {
    // Session state (sesuai RealtimeSession type)
    const [session, setSession] = useState<RealtimeSession>({
        session_id: '',
        status: 'idle',
        chunks: [],
        final_transcription: undefined,
    });

    const [recordingTime, setRecordingTime] = useState(0);
    const [isOnline, setIsOnline] = useState(true);

    // Refs
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const chunkIndexRef = useRef(0);

    // Form data
    const [formData, setFormData] = useState({
        surah_number: '',
        surah_name: '',
        ayah_start: '',
        ayah_end: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Check online status
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        setIsOnline(navigator.onLine);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Simulate receiving transcription chunk from backend
    const simulateTranscriptionChunk = useCallback(() => {
        if (chunkIndexRef.current < mockArabicTexts.length) {
            const newChunk: RealtimeTranscriptionChunk = {
                text: mockArabicTexts[chunkIndexRef.current],
                timestamp: recordingTime,
                confidence: 0.85 + Math.random() * 0.15, // 0.85 - 1.0
            };

            setSession(prev => ({
                ...prev,
                status: 'recording',
                chunks: [...prev.chunks, newChunk],
            }));

            chunkIndexRef.current++;
        }
    }, [recordingTime]);

    // Start realtime session
    const startRecording = useCallback(async () => {
        if (!formData.surah_number) {
            setErrors({ surah: 'Pilih surah terlebih dahulu' });
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 16000, // Lower sample rate for realtime
                }
            });

            streamRef.current = stream;
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
            });

            mediaRecorderRef.current = mediaRecorder;
            chunkIndexRef.current = 0;

            // Handle audio chunks - send to backend for transcription
            mediaRecorder.ondataavailable = async (event) => {
                if (event.data.size > 0) {
                    // TODO: Send chunk to WebSocket/API for realtime transcription
                    // const response = await sendChunkToWhisper(event.data);
                    // handleTranscriptionResponse(response);

                    // Simulate receiving transcription
                    simulateTranscriptionChunk();
                }
            };

            mediaRecorder.onstop = () => {
                stream.getTracks().forEach(track => track.stop());

                // Combine all chunks into final transcription
                setSession(prev => ({
                    ...prev,
                    status: 'completed',
                    final_transcription: prev.chunks.map(c => c.text).join(' '),
                }));
            };

            // Generate session ID
            const sessionId = `session_${Date.now()}`;

            // Start recording with timeslice for regular chunks
            mediaRecorder.start(3000); // Get data every 3 seconds

            setSession({
                session_id: sessionId,
                status: 'recording',
                chunks: [],
                final_transcription: undefined,
            });
            setRecordingTime(0);
            setErrors({});

            // Start timer
            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);

        } catch (error) {
            console.error('Error accessing microphone:', error);
            setErrors({ recording: 'Tidak dapat mengakses mikrofon.' });
        }
    }, [formData.surah_number, simulateTranscriptionChunk]);

    // Stop recording
    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            setSession(prev => ({ ...prev, status: 'processing' }));
            mediaRecorderRef.current.stop();
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    // Reset session
    const resetSession = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        setSession({
            session_id: '',
            status: 'idle',
            chunks: [],
            final_transcription: undefined,
        });
        setRecordingTime(0);
        chunkIndexRef.current = 0;
    };

    // Handle surah change
    const handleSurahChange = (surahNumber: string) => {
        const surah = surahList.find(s => s.number === parseInt(surahNumber));
        setFormData({
            ...formData,
            surah_number: surahNumber,
            surah_name: surah?.name_latin || '',
        });
        setErrors({});
    };

    // Format time
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const selectedSurah = surahList.find(s => s.number === parseInt(formData.surah_number));
    const isRecording = session.status === 'recording';
    const isProcessing = session.status === 'processing';
    const isCompleted = session.status === 'completed';

    return (
        <div className="max-w-5xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="mb-6">
                <Link
                    href="/beranda"
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-emerald-600 mb-4 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Kembali ke Beranda
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Realtime Recording</h1>
                        <p className="text-gray-600 mt-1">Rekam dengan feedback transkripsi langsung</p>
                    </div>
                    <div className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${isOnline
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-700'
                        }`}>
                        {isOnline ? (
                            <>
                                <Wifi className="w-4 h-4 mr-1.5" />
                                Online
                            </>
                        ) : (
                            <>
                                <WifiOff className="w-4 h-4 mr-1.5" />
                                Offline
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recording Control */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <Radio className="w-5 h-5 mr-2 text-purple-600" />
                        Kontrol Rekaman
                    </h2>

                    <div className="space-y-6">
                        {/* Recording Button */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 text-center border border-purple-100">
                            {session.status === 'idle' && (
                                <div className="space-y-4">
                                    <button
                                        type="button"
                                        onClick={startRecording}
                                        disabled={!isOnline}
                                        className={`w-28 h-28 mx-auto rounded-full flex items-center justify-center shadow-xl transition-all ${isOnline
                                                ? 'bg-gradient-to-br from-purple-500 to-pink-600 hover:scale-105 active:scale-95 cursor-pointer'
                                                : 'bg-gray-300 cursor-not-allowed'
                                            }`}
                                    >
                                        <Radio className="w-14 h-14 text-white" />
                                    </button>
                                    <p className="text-gray-700 font-medium">
                                        {isOnline ? 'Klik untuk mulai rekam realtime' : 'Membutuhkan koneksi internet'}
                                    </p>
                                    {errors.surah && (
                                        <p className="text-sm text-red-500">{errors.surah}</p>
                                    )}
                                    {errors.recording && (
                                        <p className="text-sm text-red-500">{errors.recording}</p>
                                    )}
                                </div>
                            )}

                            {isRecording && (
                                <div className="space-y-4">
                                    <div className="w-28 h-28 mx-auto bg-red-500 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                                        <Mic className="w-14 h-14 text-white" />
                                    </div>

                                    <div className="text-4xl font-bold text-gray-900 font-mono">
                                        {formatTime(recordingTime)}
                                    </div>

                                    <div className="flex items-center justify-center text-sm text-red-600">
                                        <div className="w-2 h-2 bg-red-600 rounded-full mr-2 animate-pulse" />
                                        MEREKAM LIVE
                                    </div>

                                    <Button type="button" onClick={stopRecording} variant="outline">
                                        <Square className="w-4 h-4 mr-2" />
                                        Hentikan
                                    </Button>
                                </div>
                            )}

                            {isProcessing && (
                                <div className="space-y-4">
                                    <div className="w-28 h-28 mx-auto bg-yellow-500 rounded-full flex items-center justify-center shadow-xl">
                                        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
                                    </div>
                                    <p className="text-gray-700 font-medium">Memproses transkripsi...</p>
                                </div>
                            )}

                            {isCompleted && (
                                <div className="space-y-4">
                                    <div className="w-28 h-28 mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-xl">
                                        <Radio className="w-14 h-14 text-white" />
                                    </div>

                                    <div className="text-xl font-bold text-gray-900">
                                        Rekaman Selesai ({formatTime(recordingTime)})
                                    </div>

                                    <div className="flex justify-center space-x-3">
                                        <Button type="button" onClick={startRecording}>
                                            <Radio className="w-4 h-4 mr-2" />
                                            Rekam Lagi
                                        </Button>
                                        <Button type="button" onClick={resetSession} variant="outline">
                                            Reset
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Form Inputs */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Pilih Surah <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.surah_number}
                                    onChange={(e) => handleSurahChange(e.target.value)}
                                    disabled={isRecording || isProcessing}
                                    className={`
                                        w-full px-4 py-3 rounded-xl border bg-gray-50/50 text-gray-900
                                        focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white
                                        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                                        ${errors.surah ? 'border-red-300' : 'border-gray-200'}
                                    `}
                                >
                                    <option value="">-- Pilih Surah --</option>
                                    {surahList.map((surah) => (
                                        <option key={surah.number} value={surah.number}>
                                            {surah.number}. {surah.name_latin}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    label="Ayat Mulai"
                                    type="number"
                                    min="1"
                                    max={selectedSurah?.total_ayah || 999}
                                    placeholder="1"
                                    value={formData.ayah_start}
                                    onChange={(e) => setFormData({ ...formData, ayah_start: e.target.value })}
                                    disabled={isRecording || isProcessing}
                                />
                                <Input
                                    label="Ayat Akhir"
                                    type="number"
                                    min={parseInt(formData.ayah_start) || 1}
                                    max={selectedSurah?.total_ayah || 999}
                                    placeholder={selectedSurah?.total_ayah?.toString() || '7'}
                                    value={formData.ayah_end}
                                    onChange={(e) => setFormData({ ...formData, ayah_end: e.target.value })}
                                    disabled={isRecording || isProcessing}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Transcription Panel */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <Radio className="w-5 h-5 mr-2 text-purple-600" />
                        Live Transcription
                        {isRecording && (
                            <span className="ml-2 flex items-center text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mr-1.5 animate-pulse" />
                                Live
                            </span>
                        )}
                    </h2>

                    <div className="min-h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200">
                        {session.status === 'idle' && session.chunks.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center py-16">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                    <AlertCircle className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-500 font-medium">Mulai rekaman untuk melihat transkripsi</p>
                                <p className="text-sm text-gray-400 mt-1">Transkripsi akan muncul secara real-time</p>
                            </div>
                        )}

                        {(isRecording || isProcessing || isCompleted) && (
                            <div className="space-y-4">
                                {/* Transcription Chunks */}
                                <div className="prose prose-lg max-w-none">
                                    <div className="text-right space-y-3" dir="rtl">
                                        {session.chunks.map((chunk, index) => (
                                            <p
                                                key={index}
                                                className="text-2xl leading-loose text-gray-900 font-arabic animate-fade-in"
                                                style={{ animationDelay: `${index * 100}ms` }}
                                            >
                                                {chunk.text}
                                                <span className="text-xs text-gray-400 ml-2" dir="ltr">
                                                    ({Math.round(chunk.confidence * 100)}%)
                                                </span>
                                            </p>
                                        ))}
                                    </div>

                                    {isRecording && (
                                        <div className="flex items-center justify-center mt-6">
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                            <span className="ml-3 text-sm text-purple-600">Mendengarkan...</span>
                                        </div>
                                    )}
                                </div>

                                {/* Completion Message */}
                                {isCompleted && session.final_transcription && (
                                    <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-bold text-emerald-800">Rekaman Selesai!</h3>
                                                <p className="text-xs text-emerald-700 mt-1">
                                                    {session.chunks.length} ayat terdeteksi • Rata-rata confidence: {
                                                        Math.round(session.chunks.reduce((acc, c) => acc + c.confidence, 0) / session.chunks.length * 100)
                                                    }%
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Info Card */}
            <div className="mt-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                    <Info className="w-5 h-5 mr-2 text-purple-600" />
                    Tentang Realtime Mode
                </h3>
                <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        Transkripsi muncul secara langsung saat Anda membaca
                    </li>
                    <li className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        Menggunakan AI Whisper untuk akurasi tinggi
                    </li>
                    <li className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        Cocok untuk latihan dan perbaikan bacaan
                    </li>
                    <li className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        Membutuhkan koneksi internet yang stabil
                    </li>
                </ul>
            </div>
        </div>
    );
}
