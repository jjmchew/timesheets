export interface UserInfo {
  id: number;
  username: string;
  pw: string;
}

export interface ProjectInfo {
  id: number;
  user_id: number;
  project_name: string;
  created_on: string;
  display: number; // 0 is false; 1 is true
}

export interface TimerInfo {
  id: number;
  project_id: number;
  start_time: string;
  end_time: string;
  exported: number; // 0 is false; 1 is true
}

/*
export interface Props {
  projects?: ProjectInfo[];
  [key: string]: any;
}
*/
