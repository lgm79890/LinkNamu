import type { CSSProperties, ReactNode } from "react";

// 알려진 도메인이면 서비스 아이콘을 표시 (L-6)
// 서비스별 색상 원형 배지 안에 흰색 아이콘을 넣어 눈에 잘 띄게 한다.

type Service =
  | "youtube"
  | "instagram"
  | "github"
  | "x"
  | "linkedin"
  | "blog"
  | "default";

const DOMAIN_SERVICES: [string, Service][] = [
  ["youtube.com", "youtube"],
  ["youtu.be", "youtube"],
  ["instagram.com", "instagram"],
  ["github.com", "github"],
  ["x.com", "x"],
  ["twitter.com", "x"],
  ["linkedin.com", "linkedin"],
  ["velog.io", "blog"],
  ["tistory.com", "blog"],
  ["blog.naver.com", "blog"],
  ["medium.com", "blog"],
  ["brunch.co.kr", "blog"],
];

function getService(url: string): Service {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    const match = DOMAIN_SERVICES.find(
      ([domain]) => host === domain || host.endsWith(`.${domain}`),
    );
    return match ? match[1] : "default";
  } catch {
    return "default";
  }
}

// 배지 배경 (흰색 아이콘과 명도 대비 확보)
const BADGE_BACKGROUND: Record<Service, string> = {
  youtube: "#e00026",
  instagram: "linear-gradient(45deg, #f58529 0%, #dd2a7b 50%, #8134af 100%)",
  github: "#24292f",
  x: "#000000",
  linkedin: "#0a66c2",
  blog: "var(--accent)",
  default: "var(--accent)",
};

const ICONS: Record<Service, ReactNode> = {
  youtube: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="4" />
      <path d="M10 9.5v5l4.5-2.5z" fill="currentColor" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  github: <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" />,
  x: <path d="M4 4l16 16M20 4L4 20" />,
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10.5V16M8 7.5v.01M11.5 16v-5.5M11.5 13c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5v3" />
    </>
  ),
  blog: (
    <>
      <path d="M4 20l4-1 11-11-3-3L5 16z" />
      <path d="M14 7l3 3" />
    </>
  ),
  default: (
    <>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
    </>
  ),
};

export default function LinkIcon({ url }: { url: string }) {
  const service = getService(url);
  const badgeStyle: CSSProperties = { background: BADGE_BACKGROUND[service] };

  return (
    <span
      data-inspect="LinkIcon"
      aria-hidden
      className="flex h-10 w-10 items-center justify-center rounded-full text-white shadow-md ring-2 ring-white/70 dark:ring-white/10"
      style={badgeStyle}
    >
      <svg
        width={22}
        height={22}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {ICONS[service]}
      </svg>
    </span>
  );
}
