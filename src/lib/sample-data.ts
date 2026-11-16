import type { User } from "./types";

// MongoDB 연결 전까지 사용하는 샘플 데이터
export const sampleUsers: User[] = [
  {
    id: "u1",
    username: "kyungmin",
    displayName: "임경민",
    bio: "만들고, 기록하고, 나눕니다.",
    links: [
      { id: "l1", title: "유튜브 채널", url: "https://www.youtube.com/", position: 0, isVisible: true },
      { id: "l2", title: "인스타그램", url: "https://www.instagram.com/", position: 1, isVisible: true },
      { id: "l3", title: "깃허브", url: "https://github.com/", position: 2, isVisible: true },
      { id: "l4", title: "기술 블로그", url: "https://velog.io/", position: 3, isVisible: true },
      { id: "l5", title: "준비 중인 링크", url: "https://example.com/", position: 4, isVisible: false },
    ],
  },
];
