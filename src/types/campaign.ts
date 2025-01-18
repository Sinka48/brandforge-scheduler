export interface Campaign {
  id: string;
  name: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  platforms: string[];
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Template {
  id: string;
  name: string;
  topic: string;
  platforms: string[];
  duration: number;
  tone: string;
  time_slots: Array<{
    time: string;
    days: string[];
  }>;
  hashtags: string[];
  created_at: string;
  user_id: string;
}