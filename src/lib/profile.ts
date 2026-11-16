import { sampleUsers } from "./sample-data";
import type { PublicProfile } from "./types";

const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;

export function isValidUsername(username: string): boolean {
  return USERNAME_PATTERN.test(username);
}

// http/https 스킴만 허용 (L-7, 8.3 XSS 방지)
export function isSafeUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

export async function getPublicProfile(
  username: string,
): Promise<PublicProfile | null> {
  "use cache";

  // TODO: MongoDB 연결 후 DB 조회로 교체
  const user = sampleUsers.find((u) => u.username === username);
  if (!user) return null;

  return {
    username: user.username,
    displayName: user.displayName,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    links: user.links
      .filter((link) => link.isVisible && isSafeUrl(link.url))
      .sort((a, b) => a.position - b.position)
      .map(({ id, title, url }) => ({ id, title, url })),
  };
}

export async function getPublicUsernames(): Promise<string[]> {
  return sampleUsers.map((u) => u.username);
}
