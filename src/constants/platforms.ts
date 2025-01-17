import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export const PLATFORMS = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: Twitter,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
  },
] as const;

export type PlatformId = typeof PLATFORMS[number]['id'];