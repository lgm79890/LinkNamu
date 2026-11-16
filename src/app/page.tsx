import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-[680px] flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-5xl" aria-hidden>
        🌳
      </p>
      <h1 className="mt-4 text-3xl font-bold">링크나무</h1>
      <p className="mt-3 text-muted">
        내 모든 링크를 한 페이지에 모아두고, 하나의 URL로 공유하세요.
      </p>
      <Link
        href="/kyungmin"
        className="mt-8 inline-flex min-h-12 items-center rounded-full bg-accent px-6 font-semibold text-accent-foreground transition-opacity hover:opacity-90"
      >
        예시 페이지 보기
      </Link>
    </main>
  );
}
