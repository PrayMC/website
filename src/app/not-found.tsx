import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="ko" className="dark antialiased">
      <body className="min-h-dvh flex items-center justify-center">
        <main className="text-center px-4">
          <p className="text-5xl font-black text-zinc-500 mb-4">404</p>
          <h1 className="text-muted mb-6">페이지를 찾을 수 없습니다. / Page not found.</h1>
          <Link
            href="/"
            className="inline-block pointer-coarse:py-3 text-brand hover:text-brand-hover text-sm transition-colors"
          >
            홈으로 / Home
          </Link>
        </main>
      </body>
    </html>
  );
}
