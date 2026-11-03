import Link from "next/link";
import "./globals.css";

export default function RootNotFound() {
  return (
    <html lang="ko" className="dark antialiased">
      <body className="min-h-dvh flex items-center justify-center">
        <main className="text-center px-4">
          <p className="text-5xl font-black text-zinc-700 mb-4">404</p>
          <p className="text-zinc-500 mb-6">페이지를 찾을 수 없습니다. / Page not found.</p>
          <Link href="/" className="text-brand hover:text-brand-hover text-sm transition-colors">
            홈으로 / Home
          </Link>
        </main>
      </body>
    </html>
  );
}
