// Frontend API layer — replaces @supabase/supabase-js client
// All requests go to /api/* which Netlify proxies to /.netlify/functions/api

import type { Project, BlogPost, SocialMediaPost, Achievement, ErrorLog } from '@/types';

export type { Project, BlogPost, SocialMediaPost, Achievement, ErrorLog };
export { TABLES } from '@/types';

// ─── Token helpers ────────────────────────────────────────────────────────────

export function getAdminToken(): string | null {
  return localStorage.getItem('admin_token');
}

export function setAdminToken(token: string): void {
  localStorage.setItem('admin_token', token);
}

export function clearAdminToken(): void {
  localStorage.removeItem('admin_token');
}

export function isAdminAuthenticated(): boolean {
  return !!getAdminToken();
}

// ─── Base fetch helpers ───────────────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json() as Promise<T>;
}

function authHeaders(): Record<string, string> {
  const token = getAdminToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function authFetch<T>(path: string, options?: RequestInit): Promise<T> {
  return apiFetch<T>(path, {
    ...options,
    headers: { ...authHeaders(), ...(options?.headers || {}) },
  });
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  async login(email: string, password: string): Promise<{ token: string }> {
    return apiFetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  },
};

// ─── API helpers (mirrors the old supabaseHelpers interface) ──────────────────

export const apiHelpers = {
  // ── Projects ────────────────────────────────────────────────────────────────

  async getProjects(): Promise<Project[]> {
    return apiFetch('/projects');
  },

  async getPublishedProjects(): Promise<Project[]> {
    return apiFetch('/projects?published=true&sort=display_order&asc=true');
  },

  async getFeaturedProjects(): Promise<Project[]> {
    return apiFetch('/projects?featured=true');
  },

  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    return authFetch('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  },

  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    return authFetch(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    });
  },

  async deleteProject(id: string): Promise<void> {
    return authFetch(`/projects/${id}`, { method: 'DELETE' });
  },

  // ── Blog Posts ──────────────────────────────────────────────────────────────

  async getBlogPosts(publishedOnly = true): Promise<BlogPost[]> {
    const qs = publishedOnly ? '?published=true' : '';
    return authFetch(`/blog-posts${qs}`);
  },

  async getBlogPostBySlug(slug: string): Promise<BlogPost> {
    return apiFetch(`/blog-posts?slug=${encodeURIComponent(slug)}`);
  },

  async createBlogPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost> {
    return authFetch('/blog-posts', {
      method: 'POST',
      body: JSON.stringify(post),
    });
  },

  async updateBlogPost(id: string, post: Partial<BlogPost>): Promise<BlogPost> {
    return authFetch(`/blog-posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(post),
    });
  },

  async deleteBlogPost(id: string): Promise<void> {
    return authFetch(`/blog-posts/${id}`, { method: 'DELETE' });
  },

  // ── Social Media ────────────────────────────────────────────────────────────

  async getSocialMediaPosts(): Promise<SocialMediaPost[]> {
    return apiFetch('/social-media?published=true');
  },

  async getAllSocialMediaPosts(): Promise<SocialMediaPost[]> {
    return authFetch('/social-media');
  },

  async createSocialMediaPost(post: Omit<SocialMediaPost, 'id' | 'created_at' | 'updated_at'>): Promise<SocialMediaPost> {
    return authFetch('/social-media', {
      method: 'POST',
      body: JSON.stringify(post),
    });
  },

  async updateSocialMediaPost(id: string, post: Partial<SocialMediaPost>): Promise<SocialMediaPost> {
    return authFetch(`/social-media/${id}`, {
      method: 'PUT',
      body: JSON.stringify(post),
    });
  },

  async deleteSocialMediaPost(id: string): Promise<void> {
    return authFetch(`/social-media/${id}`, { method: 'DELETE' });
  },

  // ── Achievements ────────────────────────────────────────────────────────────

  async getAchievements(featuredOnly = false): Promise<Achievement[]> {
    const qs = featuredOnly ? '?featured=true' : '';
    return apiFetch(`/achievements${qs}`);
  },

  async getAchievementsByCategory(category: Achievement['category']): Promise<Achievement[]> {
    return apiFetch(`/achievements?category=${encodeURIComponent(category)}`);
  },

  async getCertificates(): Promise<Achievement[]> {
    return apiFetch('/achievements?type=certificate');
  },

  async createAchievement(achievement: Omit<Achievement, 'id' | 'created_at' | 'updated_at'>): Promise<Achievement> {
    return authFetch('/achievements', {
      method: 'POST',
      body: JSON.stringify(achievement),
    });
  },

  async updateAchievement(id: string, achievement: Partial<Achievement>): Promise<Achievement> {
    return authFetch(`/achievements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(achievement),
    });
  },

  async deleteAchievement(id: string): Promise<void> {
    return authFetch(`/achievements/${id}`, { method: 'DELETE' });
  },

  // ── Error Logs ──────────────────────────────────────────────────────────────

  async logError(errorLog: Omit<ErrorLog, 'id' | 'created_at'>): Promise<ErrorLog> {
    return apiFetch('/error-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorLog),
    });
  },

  async getErrorLogs(limit = 100): Promise<ErrorLog[]> {
    return authFetch(`/error-logs?limit=${limit}`);
  },
};

// Backward-compat alias
export const supabaseHelpers = apiHelpers;
