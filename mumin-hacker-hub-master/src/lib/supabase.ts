import { createClient } from '@supabase/supabase-js'

// Supabase configuration with proper fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'

// Log configuration status (only in development)
if (import.meta.env.DEV) {
  console.log('Supabase Configuration:', {
    url: supabaseUrl,
    hasValidUrl: supabaseUrl !== 'https://placeholder.supabase.co',
    hasValidKey: supabaseAnonKey !== 'placeholder-anon-key'
  });
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database table names
export const TABLES = {
  PROJECTS: 'projects',
  BLOG_POSTS: 'blog_posts',
  SOCIAL_MEDIA: 'social_media',
  ACHIEVEMENTS: 'achievements',
  ERROR_LOGS: 'error_logs'
} as const

// Type definitions for database tables
export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  github_url?: string
  demo_url?: string
  image_url?: string
  category: string
  featured: boolean
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  tags: string[]
  published: boolean
  featured_image?: string
  author: string
  created_at: string
  updated_at: string
  published_at?: string
}

export interface SocialMediaPost {
  id: string
  title: string
  content: string
  platform: 'linkedin' | 'youtube' | 'twitter' | 'instagram'
  url?: string
  tags: string[]
  metrics: {
    views?: number
    likes?: number
    shares?: number
    comments?: number
  }
  published: boolean
  created_at: string
  updated_at: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  category: 'award' | 'certification' | 'recognition' | 'milestone' | 'competition'
  type: 'certificate' | 'achievement' | 'badge' | 'award'
  date: string
  organization?: string
  credential_id?: string
  credential_url?: string
  image_url?: string
  video_url?: string
  skills: string[]
  featured: boolean
  created_at: string
  updated_at: string
}

export interface ErrorLog {
  id: string
  type: 'javascript' | 'network' | 'component' | 'cms' | 'build'
  level: 'error' | 'warning' | 'info'
  message: string
  stack?: string
  url?: string
  user_agent?: string
  metadata?: any
  created_at: string
}

// Helper functions for common operations
export const supabaseHelpers = {
  // Projects
  async getProjects() {
    const { data, error } = await supabase
      .from(TABLES.PROJECTS)
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Project[]
  },

  async getFeaturedProjects() {
    const { data, error } = await supabase
      .from(TABLES.PROJECTS)
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Project[]
  },

  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from(TABLES.PROJECTS)
      .insert(project)
      .select()
      .single()
    
    if (error) throw error
    return data as Project
  },

  // Blog Posts
  async getBlogPosts(published = true) {
    let query = supabase
      .from(TABLES.BLOG_POSTS)
      .select('*')
      .order('published_at', { ascending: false })
    
    if (published) {
      query = query.eq('published', true)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data as BlogPost[]
  },

  async getBlogPostBySlug(slug: string) {
    const { data, error } = await supabase
      .from(TABLES.BLOG_POSTS)
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()
    
    if (error) throw error
    return data as BlogPost
  },

  async createBlogPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from(TABLES.BLOG_POSTS)
      .insert(post)
      .select()
      .single()
    
    if (error) throw error
    return data as BlogPost
  },

  // Social Media
  async getSocialMediaPosts() {
    const { data, error } = await supabase
      .from(TABLES.SOCIAL_MEDIA)
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as SocialMediaPost[]
  },

  async createSocialMediaPost(post: Omit<SocialMediaPost, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from(TABLES.SOCIAL_MEDIA)
      .insert(post)
      .select()
      .single()
    
    if (error) throw error
    return data as SocialMediaPost
  },

  // Achievements
  async getAchievements(featured = false) {
    let query = supabase
      .from(TABLES.ACHIEVEMENTS)
      .select('*')
      .order('date', { ascending: false })
    
    if (featured) {
      query = query.eq('featured', true)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data as Achievement[]
  },

  async getAchievementsByCategory(category: Achievement['category']) {
    const { data, error } = await supabase
      .from(TABLES.ACHIEVEMENTS)
      .select('*')
      .eq('category', category)
      .order('date', { ascending: false })
    
    if (error) throw error
    return data as Achievement[]
  },

  async getCertificates() {
    const { data, error } = await supabase
      .from(TABLES.ACHIEVEMENTS)
      .select('*')
      .eq('type', 'certificate')
      .order('date', { ascending: false })
    
    if (error) throw error
    return data as Achievement[]
  },

  async createAchievement(achievement: Omit<Achievement, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from(TABLES.ACHIEVEMENTS)
      .insert(achievement)
      .select()
      .single()
    
    if (error) throw error
    return data as Achievement
  },

  // Error Logging
  async logError(errorLog: Omit<ErrorLog, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from(TABLES.ERROR_LOGS)
      .insert(errorLog)
      .select()
      .single()
    
    if (error) throw error
    return data as ErrorLog
  },

  async getErrorLogs(limit = 100) {
    const { data, error } = await supabase
      .from(TABLES.ERROR_LOGS)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data as ErrorLog[]
  }
}

// Real-time subscriptions
export const subscribeToTable = (
  table: keyof typeof TABLES,
  callback: (payload: any) => void
) => {
  return supabase
    .channel(`${table}_changes`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
    .subscribe()
}

export default supabase