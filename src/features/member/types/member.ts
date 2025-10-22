export type MemberPosition = {
  centerX: number;
  centerY: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
};

export type MemberInfo = {
  email: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string | null;
};

export type MemberInfoPatchRequest = {
  name: string;
  bio: string;
  avatarUrl: string;
};
