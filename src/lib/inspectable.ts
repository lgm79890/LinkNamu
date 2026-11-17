// 개발 화면에서 클릭해 수정할 수 있는 구성요소 목록.
// 각 컴포넌트의 최상위 요소에 data-inspect="이름"을 붙이고, 여기에 파일 경로를 등록한다.
// 수정 API는 이 목록에 있는 파일만 수정 대상으로 지정한다.
export const INSPECTABLE = {
  PublicProfilePage: { label: "공개 페이지", file: "src/app/[username]/page.tsx" },
  ProfileHeader: { label: "프로필 영역", file: "src/components/ProfileHeader.tsx" },
  Avatar: { label: "프로필 사진", file: "src/components/Avatar.tsx" },
  LinkCard: { label: "링크 카드", file: "src/components/LinkCard.tsx" },
  LinkIcon: { label: "링크 아이콘", file: "src/components/LinkIcon.tsx" },
  BrandFooter: { label: "하단 로고", file: "src/components/BrandFooter.tsx" },
} as const;

export type InspectableName = keyof typeof INSPECTABLE;

export function isInspectableName(value: unknown): value is InspectableName {
  return typeof value === "string" && Object.hasOwn(INSPECTABLE, value);
}
