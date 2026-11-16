import Link from "next/link";

// 존재하지 않는 아이디 안내 + 가입 유도 (7장 404 페이지)
export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-[680px] flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-5xl" aria-hidden>
        🌱
      </p>
      <h1 className="mt-4 text-2xl font-bold">페이지를 찾을 수 없어요</h1>
      <p className="mt-2 text-muted">
        아직 아무도 이 주소를 쓰지 않고 있어요.
        <br />
        지금 링크나무에서 내 페이지를 만들어 보세요.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-12 items-center rounded-full bg-accent px-6 font-semibold text-accent-foreground transition-opacity hover:opacity-90"
      >
        링크나무 시작하기
      </Link>
    </main>
  );
}
