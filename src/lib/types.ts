// PRD 9장 데이터 모델 중 공개 페이지에 필요한 부분

export type Link = {
  id: string;
  title: string; // 최대 40자
  url: string; // http:// 또는 https://만 허용
  position: number;
  isVisible: boolean;
};

export type User = {
  id: string;
  username: string; // 영문 소문자·숫자·_ 3~20자
  displayName: string; // 최대 30자
  bio?: string; // 최대 80자
  avatarUrl?: string;
  links: Link[];
};

// 공개 페이지에 내보내는 정보 (클릭 수 등은 포함하지 않음, C-4)
export type PublicProfile = {
  username: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  links: Pick<Link, "id" | "title" | "url">[];
};
