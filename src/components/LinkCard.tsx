import LinkIcon from "./LinkIcon";

type LinkCardProps = {
  title: string;
  url: string;
};

// 카드 전체가 클릭 영역, 새 탭으로 열림 (L-2, 8.1 터치 영역 48px 이상)
export default function LinkCard({ title, url }: LinkCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative flex min-h-14 w-full items-center rounded-2xl border border-card-border bg-card px-12 py-3 text-center font-medium shadow-sm transition-colors hover:bg-card-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <span className="absolute left-4 text-accent">
        <LinkIcon url={url} />
      </span>
      <span className="flex-1 break-words">{title}</span>
      <span className="sr-only"> (새 탭에서 열림)</span>
    </a>
  );
}
