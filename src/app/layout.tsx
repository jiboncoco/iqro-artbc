import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { AudioPlayerBar } from '@/components/quran/AudioPlayerBar';

export const metadata: Metadata = {
  title: "IQRO - Al-Qur'an AI Assistant & PWA Reader",
  description: "Temukan rujukan dan korelasi Al-Qur'an atas setiap pertanyaan kehidupan dengan Google Gemini AI.",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'IQRO',
  },
};

export const viewport: Viewport = {
  themeColor: '#FF5733',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Amiri:wght@400;700&family=Scheherazade+New:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF4EC] text-[#2C1A14] antialiased selection:bg-[#FF5733] selection:text-white font-sans">
        <Navbar />
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
          {children}
        </main>
        <AudioPlayerBar />
      </body>
    </html>
  );
}
