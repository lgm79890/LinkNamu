import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BrandFooter from "@/components/BrandFooter";
import LinkCard from "@/components/LinkCard";
import ProfileHeader from "@/components/ProfileHeader";
import {
  getPublicProfile,
  getPublicUsernames,
  isValidUsername,
} from "@/lib/profile";

// 방문자는 대부분 SNS 등 외부에서 직접 들어오므로, 아이디를 확인한 뒤 렌더링하도록
// 블로킹을 허용한다. (없는 아이디에 404 상태 코드를 정확히 돌려주기 위함)
export const instant = false;

export async function generateStaticParams() {
  const usernames = await getPublicUsernames();
  return usernames.map((username) => ({ username }));
}

async function loadProfile(username: string) {
  if (!isValidUsername(username)) return null;
  return getPublicProfile(username);
}

// SNS 공유 미리보기용 Open Graph (8.5)
export async function generateMetadata({
  params,
}: PageProps<"/[username]">): Promise<Metadata> {
  const { username } = await params;
  const profile = await loadProfile(username);
  if (!profile) return { title: "페이지를 찾을 수 없어요 | 링크나무" };

  const title = `${profile.displayName} | 링크나무`;
  const description = profile.bio ?? `${profile.displayName}님의 링크 모음`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      images: profile.avatarUrl ? [{ url: profile.avatarUrl }] : undefined,
    },
  };
}

export default async function PublicProfilePage({
  params,
}: PageProps<"/[username]">) {
  const { username } = await params;
  const profile = await loadProfile(username);
  if (!profile) notFound();

  return (
    <main className="mx-auto flex w-full max-w-[680px] flex-1 flex-col px-4 pt-12 pb-8 sm:pt-16">
      <ProfileHeader
        displayName={profile.displayName}
        bio={profile.bio}
        avatarUrl={profile.avatarUrl}
      />

      {profile.links.length > 0 ? (
        <ul className="mt-8 flex flex-col gap-5">
          {profile.links.map((link) => (
            <li key={link.id}>
              <LinkCard title={link.title} url={link.url} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 text-center text-muted">아직 등록된 링크가 없어요.</p>
      )}

      <div className="mt-auto">
        <BrandFooter />
      </div>
    </main>
  );
}
