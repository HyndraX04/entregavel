export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  duration: string;
  description: string;
  videoPlaceholderUrl?: string;
  summaryPoints?: string[];
  resources?: { title: string; url: string; type: string }[];
}

export interface Module {
  id: string;
  number: number;
  title: string;
  description: string;
  badge?: string;
  lessons: Lesson[];
  level?: string;
  iconName?: string;
}

export interface Offer {
  id: string;
  title: string;
  tagline: string;
  badge: string;
  description: string;
  price: string;
  originalPrice?: string;
  features: string[];
  ctaText: string;
  isPopular?: boolean;
  accentColor?: string;
}

export interface UserProfile {
  name: string;
  role: string;
  tier: string;
  lastLessonId: string;
}
