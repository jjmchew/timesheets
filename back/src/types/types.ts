export interface UserInfo {
  id: number;
  username: string;
  hashedPW: string;
}

export interface ProjectInfo {
  id: number;
  userId: number;
  projectName: string;
  created_on: number;
  display: boolean;
}
