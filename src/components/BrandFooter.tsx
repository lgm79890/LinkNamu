import Link from "next/link";

export default function BrandFooter() {
  return (
    <footer data-inspect="BrandFooter" className="mt-12 text-center">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-muted transition-colors hover:text-accent"
      >
        <span aria-hidden>🌳</span> 링크나무로 만들기
      </Link>
    </footer>
  );
}
