// ============================================
// USER & AUTHENTICATION TYPES
// ============================================

export interface User {
    id: string;                     // UUID dari database
    email: string;                  // Email user (unique)
    name: string;                   // Nama lengkap
    avatar_url?: string;            // URL foto profil (nullable)
    created_at: string;             // ISO 8601 timestamp
    updated_at: string;             // ISO 8601 timestamp
}

export interface AuthResponse {
    user: User;
    access_token: string;
    refresh_token: string;
    expires_in: number;             // Seconds until token expires
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    password: string;
    password_confirmation: string;
}

// ============================================
// SUBMISSION (SETORAN) TYPES
// ============================================

export type SubmissionType = 'file' | 'voice_note' | 'realtime';
export type SubmissionStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Submission {
    id: string;                     // UUID
    user_id: string;                // Foreign key to User
    type: SubmissionType;           // Jenis setoran
    surah_name: string;             // Nama surah (e.g., "Al-Fatihah")
    surah_number?: number;          // Nomor surah (1-114)
    ayah_start: number;             // Ayat mulai
    ayah_end?: number;              // Ayat akhir (nullable jika hanya 1 ayat)
    audio_url: string;              // URL file audio di storage
    audio_duration: number;         // Durasi dalam detik
    transcription?: string;         // Hasil transkripsi dari Whisper
    score?: number;                 // Skor 0-100 (nullable sebelum diproses)
    feedback?: string;              // Feedback dari sistem/guru
    status: SubmissionStatus;       // Status pemrosesan
    created_at: string;             // ISO 8601 timestamp
    processed_at?: string;          // Waktu selesai diproses (nullable)
}

export interface CreateSubmissionRequest {
    type: SubmissionType;
    surah_name: string;
    surah_number?: number;
    ayah_start: number;
    ayah_end?: number;
    audio_file: File | Blob;        // File audio yang diupload
}

export interface SubmissionListResponse {
    data: Submission[];
    meta: {
        current_page: number;
        per_page: number;
        total: number;
        total_pages: number;
    };
}

// ============================================
// USER STATISTICS TYPES
// ============================================

export interface UserStats {
    total_submissions: number;      // Total setoran
    completed_submissions: number;  // Setoran yang berhasil
    average_score: number;          // Rata-rata skor (0-100)
    current_streak: number;         // Streak saat ini (hari)
    longest_streak: number;         // Streak terpanjang
    total_duration: number;         // Total durasi dalam detik
    this_week_submissions: number;  // Setoran minggu ini
    this_month_submissions: number; // Setoran bulan ini
}

export interface DailyProgress {
    date: string;                   // Format: YYYY-MM-DD
    submissions_count: number;
    total_duration: number;         // Dalam detik
    average_score: number;
}

// ============================================
// SURAH REFERENCE DATA
// ============================================

export interface Surah {
    number: number;                 // 1-114
    name_arabic: string;            // الفاتحة
    name_latin: string;             // Al-Fatihah
    name_translation: string;       // Pembukaan
    total_ayah: number;             // Jumlah ayat
    revelation_type: 'meccan' | 'medinan';
}

// ============================================
// PROFILE UPDATE TYPES
// ============================================

export interface UpdateProfileRequest {
    name?: string;
    avatar_file?: File;             // File gambar untuk avatar
}

export interface ChangePasswordRequest {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
}

// ============================================
// ACHIEVEMENTS / BADGES
// ============================================

export interface Achievement {
    id: string;
    code: string;                   // e.g., 'first_submission', 'streak_7', 'streak_30'
    name: string;                   // Nama badge
    description: string;            // Deskripsi pencapaian
    icon_url?: string;              // URL icon badge
    unlocked_at?: string;           // Waktu unlock (null jika belum)
}

// ============================================
// API RESPONSE WRAPPER
// ============================================

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
    errors?: Record<string, string[]>; // Validation errors
}

export interface ApiError {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
}

// ============================================
// AUDIO RECORDING (CLIENT-SIDE ONLY)
// ============================================

export interface AudioRecording {
    blob: Blob;
    url: string;                    // Object URL untuk preview
    duration: number;               // Durasi dalam detik
    mimeType: string;               // e.g., 'audio/webm', 'audio/mp4'
}

// ============================================
// REALTIME TRANSCRIPTION
// ============================================

export interface RealtimeTranscriptionChunk {
    text: string;                   // Teks transkripsi
    timestamp: number;              // Timestamp dalam detik
    confidence: number;             // 0-1 confidence score
}

export interface RealtimeSession {
    session_id: string;
    status: 'idle' | 'recording' | 'processing' | 'completed';
    chunks: RealtimeTranscriptionChunk[];
    final_transcription?: string;
}
