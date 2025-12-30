// User types
export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    createdAt: Date;
}

// Submission types
export type SubmissionType = 'file' | 'voice-note' | 'realtime';
export type SubmissionStatus = 'pending' | 'processing' | 'success' | 'failed';

export interface Submission {
    id: string;
    userId: string;
    type: SubmissionType;
    surah: string;
    ayah: string;
    audioUrl: string;
    duration: number;
    transcription?: string;
    score?: number;
    status: SubmissionStatus;
    createdAt: Date;
    validatedAt?: Date;
}

// Statistics
export interface UserStats {
    totalSubmissions: number;
    successfulSubmissions: number;
    averageScore: number;
    currentStreak: number;
    longestStreak: number;
    totalDuration: number;
}

// Audio recording
export interface AudioRecording {
    blob: Blob;
    url: string;
    duration: number;
}
