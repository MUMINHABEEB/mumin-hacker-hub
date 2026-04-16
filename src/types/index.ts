// Shared data types used by both the frontend and Netlify Functions

export interface Project {
  id: string;
  title: string;
  description: string;
  long_description?: string;
  technologies: string[];
  features?: string[];
  github_url?: string;
  demo_url?: string;
  image_url?: string;
  category?: string;
  slug?: string;
  status?: string;
  project_type?: string;
  display_order?: number;
  project_date?: string;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  tags: string[];
  published: boolean;
  featured?: boolean;
  featured_image?: string;
  author?: string;
  publish_date?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SocialMediaPost {
  id: string;
  title: string;
  content: string;
  platform: string;
  post_url?: string;
  thumbnail_url?: string;
  tags: string[];
  engagement: {
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
  };
  published: boolean;
  featured: boolean;
  post_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'award' | 'certification' | 'recognition' | 'milestone' | 'competition';
  type: 'certificate' | 'achievement' | 'badge' | 'award';
  date: string;
  organization?: string;
  credential_id?: string;
  credential_url?: string;
  image_url?: string;
  video_url?: string;
  skills: string[];
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ErrorLog {
  id: string;
  type: 'javascript' | 'network' | 'component' | 'cms' | 'build';
  level: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  url?: string;
  user_agent?: string;
  metadata?: unknown;
  created_at: string;
}

export const TABLES = {
  PROJECTS: 'projects',
  BLOG_POSTS: 'blog-posts',
  SOCIAL_MEDIA: 'social-media',
  ACHIEVEMENTS: 'achievements',
  ERROR_LOGS: 'error-logs',
} as const;
