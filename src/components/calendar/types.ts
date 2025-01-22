import { PlatformId } from "@/constants/platforms";

export interface Post {
  id: string;
  content: string;
  date: Date;
  platforms: PlatformId[];
  image?: string;
  status: 'draft' | 'scheduled';
  time?: string;
  campaign?: {
    id: string;
    name: string;
    description: string;
  };
}