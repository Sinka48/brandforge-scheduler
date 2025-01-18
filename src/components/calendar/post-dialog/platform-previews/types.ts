export interface PlatformLimits {
  maxLength: number;
  name: string;
  hashtags?: boolean;
  threads?: boolean;
}

export interface PreviewProps {
  content: string;
  imageUrl?: string;
  remainingChars?: number;
  hashtags?: string[];
}

export const PLATFORM_LIMITS: Record<string, PlatformLimits> = {
  twitter: { 
    maxLength: 280, 
    name: 'Twitter',
    hashtags: true,
    threads: true 
  },
  facebook: { 
    maxLength: 63206, 
    name: 'Facebook',
    hashtags: false,
    threads: false 
  },
  instagram: { 
    maxLength: 2200, 
    name: 'Instagram',
    hashtags: true,
    threads: false 
  },
  linkedin: { 
    maxLength: 3000, 
    name: 'LinkedIn',
    hashtags: true,
    threads: false 
  },
};