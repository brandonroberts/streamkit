export interface FollowerInfo {
  from_id: string;
  from_name: string;
  to_id: string;
  to_name: string;
  followed_at: string;
}

export interface FollowEvent {
  data: FollowerInfo[]
}