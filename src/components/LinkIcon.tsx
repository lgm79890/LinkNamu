// 알려진 도메인이면 서비스 아이콘을 표시 (L-6)

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

const common = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export default function LinkIcon({ url }: { url: string }) {
  switch (getService(url)) {
    case "youtube":
      return (
        <svg {...common}>
          <rect x="2.5" y="5" width="19" height="14" rx="4" />
          <path d="M10 9.5v5l4.5-2.5z" fill="currentColor" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.3" cy="6.7" r="0.8" fill="currentColor" stroke="none" />
        </svg>
      );
    case "github":
      return (
        <svg {...common}>
          <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" />
        </svg>
      );
    case "x":
      return (
        <svg {...common}>
          <path d="M4 4l16 16M20 4L4 20" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M8 10.5V16M8 7.5v.01M11.5 16v-5.5M11.5 13c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5v3" />
        </svg>
      );
    case "blog":
      return (
        <svg {...common}>
          <path d="M4 20l4-1 11-11-3-3L5 16z" />
          <path d="M14 7l3 3" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
          <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
        </svg>
      );
  }
}
