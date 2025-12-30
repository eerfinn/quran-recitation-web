'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/buttons/Button';
import { Input } from '@/components/ui/inputs/Input';
import { Mic, Square, Play, Pause, Trash2, Send } from 'lucide-react';

export default function SetoranVoiceNotePage() {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [audioURL, setAudioURL] = useState<string>('');
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

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
            if (audioURL) {
                URL.revokeObjectURL(audioURL);
            }
        };
    }, [audioURL]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
                const url = URL.createObjectURL(audioBlob);
                setAudioURL(url);
                setAudioBlob(audioBlob);

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setIsPaused(false);

            // Start timer
            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Tidak dapat mengakses mikrofon. Pastikan izin mikrofon diaktifkan.');
        }
    };

    const pauseRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.pause();
            setIsPaused(true);
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    };

    const resumeRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
            mediaRecorderRef.current.resume();
            setIsPaused(false);
            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsPaused(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    };

    const deleteRecording = () => {
        if (audioURL) {
            URL.revokeObjectURL(audioURL);
        }
        setAudioURL('');
        setAudioBlob(null);
        setRecordingTime(0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!audioBlob || !formData.surah || !formData.ayahStart) {
            alert('Mohon lengkapi semua field dan rekam audio terlebih dahulu');
            return;
        }

        setIsSubmitting(true);

        // TODO: Upload to Supabase storage and process with Whisper
        setTimeout(() => {
            console.log('Submit voice note:', { audioBlob, ...formData });
            alert('Setoran berhasil dikirim! (Demo)');
            setIsSubmitting(false);
            deleteRecording();
            setFormData({ surah: '', ayahStart: '', ayahEnd: '' });
        }, 2000);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Voice Note Recording
                </h1>
                <p className="text-gray-600">
                    Rekam bacaan Al-Qur'an langsung dari browser
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Rekam Suara</CardTitle>
                    <CardDescription>
                        Klik tombol mikrofon untuk mulai merekam
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Recording Control */}
                        <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-8 text-center border border-primary-100">
                            {!isRecording && !audioURL && (
                                <div className="space-y-4">
                                    <div className="w-24 h-24 mx-auto bg-gradient-primary rounded-full flex items-center justify-center shadow-lg shadow-primary-500/30 hover:scale-105 transition-transform cursor-pointer"
                                        onClick={startRecording}
                                    >
                                        <Mic className="w-12 h-12 text-white" />
                                    </div>
                                    <p className="text-gray-700 font-medium">
                                        Klik untuk mulai merekam
                                    </p>
                                </div>
                            )}

                            {isRecording && (
                                <div className="space-y-4">
                                    <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow-lg ${isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'
                                        }`}>
                                        <Mic className="w-12 h-12 text-white" />
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900">
                                        {formatTime(recordingTime)}
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

                            {audioURL && !isRecording && (
                                <div className="space-y-4">
                                    <div className="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                        <Play className="w-12 h-12 text-white" />
                                    </div>
                                    <div className="text-xl font-semibold text-gray-900">
                                        Rekaman Selesai ({formatTime(recordingTime)})
                                    </div>
                                    <audio ref={audioRef} src={audioURL} controls className="w-full mt-4" />
                                    <div className="flex justify-center space-x-3">
                                        <Button type="button" onClick={startRecording} variant="secondary">
                                            <Mic className="w-4 h-4 mr-2" />
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
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            size="lg"
                            isLoading={isSubmitting}
                            disabled={!audioURL}
                        >
                            <Send className="w-4 h-4 mr-2" />
                            {isSubmitting ? 'Mengirim...' : 'Kirim Setoran'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="mt-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100">
                <CardContent className="pt-6">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <Mic className="w-5 h-5 mr-2 text-blue-600" />
                        Tips Rekaman Voice Note
                    </h3>
                    <ul className="text-sm text-gray-700 space-y-1 ml-7">
                        <li>• Pastikan mikrofon diizinkan di browser</li>
                        <li>• Rekam di tempat yang tenang</li>
                        <li>• Jarak mikrofon tidak terlalu jauh</li>
                        <li>• Anda bisa jeda dan lanjutkan rekaman kapan saja</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
