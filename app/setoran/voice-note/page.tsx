'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
    Mic,
    Square,
    Play,
    Pause,
    Trash2,
    Send,
    ArrowLeft,
    Info,
    RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/buttons/Button';
import { Input } from '@/components/ui/inputs/Input';
import type { CreateSubmissionRequest, AudioRecording, Surah } from '@/types';

// Daftar surah untuk dropdown
const surahList: Surah[] = [
    { number: 1, name_arabic: 'الفاتحة', name_latin: 'Al-Fatihah', name_translation: 'Pembukaan', total_ayah: 7, revelation_type: 'meccan' },
    { number: 2, name_arabic: 'البقرة', name_latin: 'Al-Baqarah', name_translation: 'Sapi', total_ayah: 286, revelation_type: 'medinan' },
    { number: 3, name_arabic: 'آل عمران', name_latin: 'Ali Imran', name_translation: 'Keluarga Imran', total_ayah: 200, revelation_type: 'medinan' },
    { number: 4, name_arabic: 'النساء', name_latin: 'An-Nisa', name_translation: 'Wanita', total_ayah: 176, revelation_type: 'medinan' },
    { number: 5, name_arabic: 'المائدة', name_latin: 'Al-Maidah', name_translation: 'Hidangan', total_ayah: 120, revelation_type: 'medinan' },
    { number: 114, name_arabic: 'الناس', name_latin: 'An-Nas', name_translation: 'Manusia', total_ayah: 6, revelation_type: 'meccan' },
];

export default function SetoranVoiceNotePage() {
    // Recording states
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Audio recording result (sesuai AudioRecording type)
    const [audioRecording, setAudioRecording] = useState<AudioRecording | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Refs
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Form data
    const [formData, setFormData] = useState({
        surah_number: '',
        surah_name: '',
        ayah_start: '',
        ayah_end: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (audioRecording?.url) URL.revokeObjectURL(audioRecording.url);
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [audioRecording?.url]);

    // Start recording
    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100,
                }
            });

            streamRef.current = stream;
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
            });

            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const mimeType = mediaRecorder.mimeType;
                const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
                const url = URL.createObjectURL(audioBlob);

                // Create AudioRecording object
                setAudioRecording({
                    blob: audioBlob,
                    url: url,
                    duration: recordingTime,
                    mimeType: mimeType,
                });

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setIsPaused(false);
            setRecordingTime(0);

            // Start timer
            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);

        } catch (error) {
            console.error('Error accessing microphone:', error);
            setErrors({ ...errors, recording: 'Tidak dapat mengakses mikrofon. Pastikan izin mikrofon diaktifkan.' });
        }
    }, [recordingTime, errors]);

    // Pause recording
    const pauseRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.pause();
            setIsPaused(true);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    // Resume recording
    const resumeRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
            mediaRecorderRef.current.resume();
            setIsPaused(false);
            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        }
    };

    // Stop recording
    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsPaused(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    // Delete recording
    const deleteRecording = () => {
        if (audioRecording?.url) {
            URL.revokeObjectURL(audioRecording.url);
        }
        setAudioRecording(null);
        setRecordingTime(0);
        setIsPlaying(false);
    };

    // Toggle audio playback
    const togglePlayback = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    // Handle surah change
    const handleSurahChange = (surahNumber: string) => {
        const surah = surahList.find(s => s.number === parseInt(surahNumber));
        setFormData({
            ...formData,
            surah_number: surahNumber,
            surah_name: surah?.name_latin || '',
        });
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!audioRecording) {
            newErrors.recording = 'Rekam audio terlebih dahulu';
        }
        if (!formData.surah_number) {
            newErrors.surah = 'Pilih surah';
        }
        if (!formData.ayah_start) {
            newErrors.ayah_start = 'Ayat mulai wajib diisi';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || !audioRecording) return;

        setIsSubmitting(true);

        // Prepare request data sesuai CreateSubmissionRequest
        const requestData: CreateSubmissionRequest = {
            type: 'voice_note',
            surah_name: formData.surah_name,
            surah_number: parseInt(formData.surah_number),
            ayah_start: parseInt(formData.ayah_start),
            ayah_end: formData.ayah_end ? parseInt(formData.ayah_end) : undefined,
            audio_file: audioRecording.blob,
        };

        // TODO: Panggil API POST /api/submissions
        // const formDataObj = new FormData();
        // formDataObj.append('type', 'voice_note');
        // formDataObj.append('surah_name', requestData.surah_name);
        // formDataObj.append('surah_number', requestData.surah_number.toString());
        // formDataObj.append('ayah_start', requestData.ayah_start.toString());
        // if (requestData.ayah_end) formDataObj.append('ayah_end', requestData.ayah_end.toString());
        // formDataObj.append('audio_file', requestData.audio_file, 'recording.webm');
        // formDataObj.append('audio_duration', audioRecording.duration.toString());
        // const response = await fetch('/api/submissions', { method: 'POST', body: formDataObj });

        setTimeout(() => {
            console.log('Create Submission Request:', {
                ...requestData,
                audio_duration: audioRecording.duration,
            });
            setIsSubmitting(false);
            alert('Setoran berhasil dikirim! (Demo)');

            // Reset form
            deleteRecording();
            setFormData({ surah_number: '', surah_name: '', ayah_start: '', ayah_end: '' });
        }, 2000);
    };

    // Format time
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Voice Note Recording</h1>
                <p className="text-gray-600 mt-1">Rekam bacaan Al-Qur'an langsung dari browser</p>
            </div>

            {/* Main Form Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Recording Control */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 text-center border border-blue-100">
                        {/* Not Recording & No Audio */}
                        {!isRecording && !audioRecording && (
                            <div className="space-y-4">
                                <button
                                    type="button"
                                    onClick={startRecording}
                                    className="w-28 h-28 mx-auto bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-transform"
                                >
                                    <Mic className="w-14 h-14 text-white" />
                                </button>
                                <p className="text-gray-700 font-medium">Klik untuk mulai merekam</p>
                                {errors.recording && (
                                    <p className="text-sm text-red-500">{errors.recording}</p>
                                )}
                            </div>
                        )}

                        {/* Recording in Progress */}
                        {isRecording && (
                            <div className="space-y-4">
                                <div className={`w-28 h-28 mx-auto rounded-full flex items-center justify-center shadow-xl ${isPaused
                                        ? 'bg-yellow-500'
                                        : 'bg-red-500 animate-pulse'
                                    }`}>
                                    <Mic className="w-14 h-14 text-white" />
                                </div>

                                <div className="text-4xl font-bold text-gray-900 font-mono">
                                    {formatTime(recordingTime)}
                                </div>

                                <div className="flex items-center justify-center text-sm text-red-600">
                                    <div className={`w-2 h-2 bg-red-600 rounded-full mr-2 ${!isPaused && 'animate-pulse'}`} />
                                    {isPaused ? 'DIJEDA' : 'MEREKAM'}
                                </div>

                                <div className="flex justify-center space-x-3">
                                    {!isPaused ? (
                                        <Button type="button" onClick={pauseRecording} variant="secondary">
                                            <Pause className="w-4 h-4 mr-2" />
                                            Jeda
                                        </Button>
                                    ) : (
                                        <Button type="button" onClick={resumeRecording} variant="secondary">
                                            <Play className="w-4 h-4 mr-2" />
                                            Lanjutkan
                                        </Button>
                                    )}
                                    <Button type="button" onClick={stopRecording} variant="outline">
                                        <Square className="w-4 h-4 mr-2" />
                                        Selesai
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Recording Complete */}
                        {audioRecording && !isRecording && (
                            <div className="space-y-4">
                                <button
                                    type="button"
                                    onClick={togglePlayback}
                                    className={`w-28 h-28 mx-auto rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-105 ${isPlaying
                                            ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                                            : 'bg-gradient-to-br from-blue-500 to-cyan-600'
                                        }`}
                                >
                                    {isPlaying ? (
                                        <Pause className="w-14 h-14 text-white" />
                                    ) : (
                                        <Play className="w-14 h-14 text-white ml-2" />
                                    )}
                                </button>

                                <div className="text-xl font-bold text-gray-900">
                                    Rekaman Selesai ({formatTime(audioRecording.duration)})
                                </div>

                                {/* Hidden audio element */}
                                <audio
                                    ref={audioRef}
                                    src={audioRecording.url}
                                    onEnded={() => setIsPlaying(false)}
                                    className="hidden"
                                />

                                {/* Audio waveform placeholder */}
                                <div className="bg-white rounded-xl p-4 mx-auto max-w-md">
                                    <div className="flex items-center justify-center space-x-1 h-12">
                                        {[...Array(30)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`w-1 bg-blue-400 rounded-full transition-all ${isPlaying ? 'animate-pulse' : ''
                                                    }`}
                                                style={{
                                                    height: `${Math.random() * 100}%`,
                                                    animationDelay: `${i * 50}ms`
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-center space-x-3">
                                    <Button type="button" onClick={startRecording} variant="secondary">
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        Rekam Ulang
                                    </Button>
                                    <Button type="button" onClick={deleteRecording} variant="outline">
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Hapus
                                    </Button>
                                </div>
                            </div>
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
                                    {surah.number}. {surah.name_latin} - {surah.total_ayah} ayat
                                </option>
                            ))}
                        </select>
                        {errors.surah && <p className="mt-2 text-sm text-red-500">{errors.surah}</p>}
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
                        />
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        isLoading={isSubmitting}
                        disabled={!audioRecording}
                        className="w-full h-12 !bg-emerald-600 hover:!bg-emerald-700 !text-white !font-bold rounded-xl"
                        style={{ backgroundColor: '#059669', color: '#ffffff' }}
                    >
                        <Send className="w-5 h-5 mr-2" />
                        {isSubmitting ? 'Mengirim...' : 'Kirim Setoran'}
                    </Button>
                </form>
            </div>

            {/* Tips Card */}
            <div className="mt-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                    <Info className="w-5 h-5 mr-2 text-blue-600" />
                    Tips Rekaman Voice Note
                </h3>
                <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        Pastikan mikrofon browser sudah diizinkan
                    </li>
                    <li className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        Rekam di tempat yang tenang tanpa noise
                    </li>
                    <li className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        Jarak mikrofon tidak terlalu jauh dari mulut
                    </li>
                    <li className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        Anda bisa jeda dan lanjutkan rekaman kapan saja
                    </li>
                </ul>
            </div>
        </div>
    );
}
