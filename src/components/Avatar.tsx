import Image from "next/image";

type AvatarProps = {
  name: string;
  src?: string;
  size?: number;
};

// 프로필 사진(원형). 사진이 없으면 이름 첫 글자 아바타 (P-3, P-4)
export default function Avatar({ name, src, size = 96 }: AvatarProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={`${name} 프로필 사진`}
        width={size}
        height={size}
        priority
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  const initial = Array.from(name.trim())[0] ?? "?";

  return (
    <div
      role="img"
      aria-label={`${name} 기본 프로필 아바타`}
      className="flex items-center justify-center rounded-full bg-accent font-semibold text-accent-foreground"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initial}
    </div>
  );
}
