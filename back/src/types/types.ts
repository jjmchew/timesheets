export interface UserInfo {
  id: number;
  username: string;
  hashedPW: string;
}

export interface ProjectInfo {
  id: number;
  user_id: number;
  project_name: string;
  created_on: number;
  display: number; // 0 is false; 1 is true
}

export interface TimerInfo {
  id: number;
  project_id: number;
  start_time: number;
  end_time: number | null;
  exported: number; // 0 is false; 1 is true
}
