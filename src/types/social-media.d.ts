export interface SocialMediaPost {
  id: string;
  title: string;
  description: string;
  platform: 'linkedin' | 'youtube';
  url: string; // The actual LinkedIn or YouTube URL
  thumbnail?: string; // Preview image
  publishDate: string;
  tags: string[];
  content?: string; // Optional additional content
  metrics?: {
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
  };
  featured?: boolean;
  status: 'published' | 'draft' | 'scheduled';
  slug: string;
  filename?: string;
  sha?: string; // GitHub file SHA for updates
}

export type SocialMediaFilter = 'all' | 'linkedin' | 'youtube';
export type SortOrder = 'newest' | 'oldest' | 'popular';

// Sample data structure for markdown frontmatter
export interface SocialMediaFrontmatter {
  title: string;
  description: string;
  platform: 'linkedin' | 'youtube';
  url: string;
  thumbnail?: string;
  publishDate: string;
  tags: string[];
  metrics?: {
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
  };
  featured?: boolean;
  status: 'published' | 'draft' | 'scheduled';
}