import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Setoran Mengaji - Aplikasi Setoran Al-Qur'an dengan AI",
  description: "Aplikasi untuk tracking dan validasi bacaan Al-Qur'an menggunakan AI Whisper",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
