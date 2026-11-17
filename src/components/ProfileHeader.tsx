import Avatar from "./Avatar";

type ProfileHeaderProps = {
  displayName: string;
  bio?: string;
  avatarUrl?: string;
};

export default function ProfileHeader({
  displayName,
  bio,
  avatarUrl,
}: ProfileHeaderProps) {
  return (
    <header data-inspect="ProfileHeader" className="flex flex-col items-center text-center">
      <Avatar name={displayName} src={avatarUrl} size={150} />
      <h1 className="mt-4 text-2xl font-bold">{displayName}</h1>
      {bio && <p className="mt-2 text-base text-muted">{bio}</p>}
    </header>
  );
}
