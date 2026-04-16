import { useState, useEffect } from 'react';
import { apiHelpers, type Project, type BlogPost, type SocialMediaPost, type Achievement } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AdminAuth from '@/components/AdminAuth';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Database,
  FileText,
  Share2,
  Settings,
  CheckCircle,
  AlertTriangle,
  Award
} from 'lucide-react';

type ContentType = 'projects' | 'blog_posts' | 'social_media' | 'achievements';

export function SupabaseAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<ContentType>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialMediaPost[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Authentication handlers
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Load data
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      switch (activeTab) {
        case 'projects':
          const projectsData = await apiHelpers.getProjects();
          setProjects(projectsData);
          break;
        case 'blog_posts':
          const blogData = await apiHelpers.getBlogPosts(false); // Include unpublished
          setBlogPosts(blogData);
          break;
        case 'social_media':
          const socialData = await apiHelpers.getAllSocialMediaPosts();
          setSocialPosts(socialData);
          break;
        case 'achievements':
          const achievementsData = await apiHelpers.getAchievements();
          setAchievements(achievementsData);
          break;
      }
    } catch (err: any) {
      setError(`Failed to load ${activeTab}: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (message: string, type: 'success' | 'error') => {
    if (type === 'success') {
      setSuccess(message);
      setError(null);
    } else {
      setError(message);
      setSuccess(null);
    }
    setTimeout(() => {
      setSuccess(null);
      setError(null);
    }, 3000);
  };

  // Project operations
  const handleSaveProject = async (project: Partial<Project>) => {
    try {
      setIsLoading(true);
      if (project.id) {
        await apiHelpers.updateProject(project.id, project);
        showMessage('Project updated successfully!', 'success');
      } else {
        await apiHelpers.createProject(project as Omit<Project, 'id' | 'created_at' | 'updated_at'>);
        showMessage('Project created successfully!', 'success');
      }
      setEditingItem(null);
      setShowAddForm(false);
      loadData();
    } catch (err: unknown) {
      showMessage(`Failed to save project: ${err instanceof Error ? err.message : String(err)}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await apiHelpers.deleteProject(id);
      showMessage('Project deleted successfully!', 'success');
      loadData();
    } catch (err: unknown) {
      showMessage(`Failed to delete project: ${err instanceof Error ? err.message : String(err)}`, 'error');
    }
  };

  // Blog post operations
  const handleSaveBlogPost = async (post: Partial<BlogPost>) => {
    try {
      setIsLoading(true);
      if (post.id) {
        await apiHelpers.updateBlogPost(post.id, post);
        showMessage('Blog post updated successfully!', 'success');
      } else {
        await apiHelpers.createBlogPost(post as Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>);
        showMessage('Blog post created successfully!', 'success');
      }
      setEditingItem(null);
      setShowAddForm(false);
      loadData();
    } catch (err: unknown) {
      showMessage(`Failed to save blog post: ${err instanceof Error ? err.message : String(err)}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBlogPost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await apiHelpers.deleteBlogPost(id);
      showMessage('Blog post deleted successfully!', 'success');
      loadData();
    } catch (err: unknown) {
      showMessage(`Failed to delete blog post: ${err instanceof Error ? err.message : String(err)}`, 'error');
    }
  };

  // Social media operations
  const handleSaveSocialPost = async (post: Partial<SocialMediaPost>) => {
    try {
      setIsLoading(true);
      if (post.id) {
        await apiHelpers.updateSocialMediaPost(post.id, post);
        showMessage('Social media post updated successfully!', 'success');
      } else {
        await apiHelpers.createSocialMediaPost(post as Omit<SocialMediaPost, 'id' | 'created_at' | 'updated_at'>);
        showMessage('Social media post created successfully!', 'success');
      }
      setEditingItem(null);
      setShowAddForm(false);
      loadData();
    } catch (err: unknown) {
      showMessage(`Failed to save social media post: ${err instanceof Error ? err.message : String(err)}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSocialPost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this social media post?')) return;
    try {
      await apiHelpers.deleteSocialMediaPost(id);
      showMessage('Social media post deleted successfully!', 'success');
      loadData();
    } catch (err: unknown) {
      showMessage(`Failed to delete social media post: ${err instanceof Error ? err.message : String(err)}`, 'error');
    }
  };

  // Achievement operations
  const handleSaveAchievement = async (achievement: Partial<Achievement>) => {
    try {
      setIsLoading(true);
      if (achievement.id) {
        await apiHelpers.updateAchievement(achievement.id, achievement);
        showMessage('Achievement updated successfully!', 'success');
      } else {
        await apiHelpers.createAchievement(achievement as Omit<Achievement, 'id' | 'created_at' | 'updated_at'>);
        showMessage('Achievement created successfully!', 'success');
      }
      setEditingItem(null);
      setShowAddForm(false);
      loadData();
    } catch (err: unknown) {
      showMessage(`Failed to save achievement: ${err instanceof Error ? err.message : String(err)}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAchievement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this achievement?')) return;
    try {
      await apiHelpers.deleteAchievement(id);
      showMessage('Achievement deleted successfully!', 'success');
      loadData();
    } catch (err: unknown) {
      showMessage(`Failed to delete achievement: ${err instanceof Error ? err.message : String(err)}`, 'error');
    }
  };

  const ProjectForm = ({ project, onSave, onCancel }: { project?: Project, onSave: (p: any) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState({
      title: project?.title || '',
      description: project?.description || '',
      technologies: project?.technologies?.join(', ') || '',
      github_url: project?.github_url || '',
      demo_url: project?.demo_url || '',
      image_url: project?.image_url || '',
      category: project?.category || 'web',
      featured: project?.featured || false
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave({
        ...project,
        ...formData,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean)
      });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground font-mono">
            <span className="text-accent">&gt;</span> Project Title
          </label>
          <Input
            placeholder="Enter project title..."
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="bg-input/50 border-border/50 focus:border-primary font-mono"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground font-mono">
            <span className="text-accent">&gt;</span> Description
          </label>
          <Textarea
            placeholder="Describe your project..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="bg-input/50 border-border/50 focus:border-primary font-mono min-h-[100px]"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground font-mono">
            <span className="text-accent">&gt;</span> Technologies
          </label>
          <Input
            placeholder="React, TypeScript, Node.js..."
            value={formData.technologies}
            onChange={(e) => setFormData({...formData, technologies: e.target.value})}
            className="bg-input/50 border-border/50 focus:border-primary font-mono"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground font-mono">
              <span className="text-accent">&gt;</span> GitHub URL
            </label>
            <Input
              placeholder="https://github.com/..."
              value={formData.github_url}
              onChange={(e) => setFormData({...formData, github_url: e.target.value})}
              className="bg-input/50 border-border/50 focus:border-primary font-mono"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground font-mono">
              <span className="text-accent">&gt;</span> Demo URL
            </label>
            <Input
              placeholder="https://demo.example.com"
              value={formData.demo_url}
              onChange={(e) => setFormData({...formData, demo_url: e.target.value})}
              className="bg-input/50 border-border/50 focus:border-primary font-mono"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground font-mono">
            <span className="text-accent">&gt;</span> Image URL
          </label>
          <Input
            placeholder="https://example.com/image.jpg"
            value={formData.image_url}
            onChange={(e) => setFormData({...formData, image_url: e.target.value})}
            className="bg-input/50 border-border/50 focus:border-primary font-mono"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground font-mono">
            <span className="text-accent">&gt;</span> Category
          </label>
          <select 
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full p-3 bg-input/50 border border-border/50 rounded-md focus:border-primary text-foreground font-mono"
          >
            <option value="web">Web Development</option>
            <option value="mobile">Mobile Apps</option>
            <option value="security">Cybersecurity</option>
            <option value="blockchain">Blockchain</option>
            <option value="ai">AI/ML</option>
          </select>
        </div>
        <div className="flex items-center space-x-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData({...formData, featured: e.target.checked})}
            className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary"
          />
          <label className="text-sm font-medium text-foreground font-mono">
            <span className="text-primary">★</span> Featured Project
          </label>
        </div>
        <div className="flex gap-3 pt-4">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-gradient-primary hover:glow-green transition-all duration-300 font-mono"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Project
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="border-border/50 text-muted-foreground hover:bg-muted/50 hover:border-border font-mono"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </form>
    );
  };

  const BlogPostForm = ({ post, onSave, onCancel }: { post?: BlogPost, onSave: (p: any) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState({
      title: post?.title || '',
      content: post?.content || '',
      excerpt: post?.excerpt || '',
      slug: post?.slug || '',
      tags: post?.tags?.join(', ') || '',
      published: post?.published || false,
      featured_image: post?.featured_image || '',
      author: post?.author || 'Mumin Habeeb'
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave({
        ...post,
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        published_at: formData.published ? new Date().toISOString() : null
      });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Post Title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
        <Input
          placeholder="Slug (URL-friendly)"
          value={formData.slug}
          onChange={(e) => setFormData({...formData, slug: e.target.value})}
          required
        />
        <Textarea
          placeholder="Excerpt"
          value={formData.excerpt}
          onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
        />
        <Textarea
          placeholder="Content (Markdown supported)"
          value={formData.content}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
          rows={10}
          required
        />
        <Input
          placeholder="Tags (comma-separated)"
          value={formData.tags}
          onChange={(e) => setFormData({...formData, tags: e.target.value})}
        />
        <Input
          placeholder="Featured Image URL"
          value={formData.featured_image}
          onChange={(e) => setFormData({...formData, featured_image: e.target.value})}
        />
        <Input
          placeholder="Author"
          value={formData.author}
          onChange={(e) => setFormData({...formData, author: e.target.value})}
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.published}
            onChange={(e) => setFormData({...formData, published: e.target.checked})}
          />
          <span>Published</span>
        </label>
        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </form>
    );
  };

  const SocialMediaForm = ({ post, onSave, onCancel }: { post?: SocialMediaPost, onSave: (p: any) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState({
      title: post?.title || '',
      content: post?.content || '',
      platform: post?.platform || '',
      post_url: post?.post_url || post?.url || '',
      thumbnail_url: post?.thumbnail_url || '',
      tags: post?.tags?.join(', ') || '',
      engagement: post?.engagement || post?.metrics || { views: 0, likes: 0, comments: 0, shares: 0 },
      published: post?.published || false,
      featured: post?.featured || false
    });

    // Auto-detect platform from URL
    const detectPlatformFromUrl = (url: string): string => {
      if (!url) return '';
      
      const lowercaseUrl = url.toLowerCase();
      
      if (lowercaseUrl.includes('linkedin.com')) {
        return 'linkedin';
      } else if (lowercaseUrl.includes('youtube.com') || lowercaseUrl.includes('youtu.be')) {
        return 'youtube';
      } else if (lowercaseUrl.includes('twitter.com') || lowercaseUrl.includes('x.com')) {
        return 'twitter';
      } else if (lowercaseUrl.includes('instagram.com')) {
        return 'instagram';
      }
      
      return 'linkedin'; // default
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave({
        ...post,
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground font-mono">
            <span className="text-accent">&gt;</span> Post Title
          </label>
          <Input
            placeholder="Enter post title..."
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="bg-input/50 border-border/50 focus:border-primary font-mono"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground font-mono">
            <span className="text-accent">&gt;</span> Post URL
          </label>
          <Input
            type="url"
            placeholder="https://linkedin.com/posts/... or https://youtube.com/watch?v=..."
            value={formData.post_url}
            onChange={(e) => {
              const url = e.target.value;
              const detectedPlatform = detectPlatformFromUrl(url);
              
              setFormData({
                ...formData, 
                post_url: url,
                // Auto-update platform if it was empty or matches the detection
                platform: formData.platform === '' || formData.platform === detectedPlatform 
                  ? detectedPlatform 
                  : formData.platform
              });
            }}
            className="bg-input/50 border-border/50 focus:border-primary font-mono"
          />
          <p className="text-xs text-muted-foreground font-mono">
            <span className="text-accent">//</span> Platform will be automatically detected from the URL
          </p>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground font-mono">
            <span className="text-accent">&gt;</span> Platform
          </label>
          <select
            value={formData.platform}
            onChange={(e) => setFormData({...formData, platform: e.target.value})}
            className="w-full p-3 bg-input/50 border border-border/50 rounded-md focus:border-primary text-foreground font-mono"
          >
            <option value="">Auto-detect from URL</option>
            <option value="linkedin">LinkedIn</option>
            <option value="youtube">YouTube</option>
            <option value="twitter">Twitter</option>
            <option value="instagram">Instagram</option>
          </select>
          {formData.post_url && (
            <p className="text-xs text-accent font-mono">
              <span className="text-accent">[DETECTED]:</span> {detectPlatformFromUrl(formData.post_url)}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground font-mono">
            <span className="text-accent">&gt;</span> Content
          </label>
          <Textarea
            placeholder="Enter post content..."
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            rows={4}
            className="bg-input/50 border-border/50 focus:border-primary font-mono min-h-[120px]"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground font-mono">
            <span className="text-accent">&gt;</span> Thumbnail URL
          </label>
          <Input
            type="url"
            placeholder="https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg"
            value={formData.thumbnail_url}
            onChange={(e) => setFormData({...formData, thumbnail_url: e.target.value})}
            className="bg-input/50 border-border/50 focus:border-primary font-mono"
          />
          <p className="text-xs text-muted-foreground font-mono">
            <span className="text-accent">//</span> For YouTube: https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg
          </p>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground font-mono">
            <span className="text-accent">&gt;</span> Tags
          </label>
          <Input
            placeholder="cybersecurity, social-media, content..."
            value={formData.tags}
            onChange={(e) => setFormData({...formData, tags: e.target.value})}
            className="bg-input/50 border-border/50 focus:border-primary font-mono"
          />
        </div>
        
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground font-mono">
            <span className="text-accent">&gt;</span> Engagement Metrics
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-mono">Views</label>
              <Input
                type="number"
                placeholder="0"
                value={formData.engagement.views || ''}
                onChange={(e) => setFormData({
                  ...formData, 
                  engagement: { ...formData.engagement, views: parseInt(e.target.value) || 0 }
                })}
                className="bg-input/50 border-border/50 focus:border-primary font-mono text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-mono">Likes</label>
              <Input
                type="number"
                placeholder="0"
                value={formData.engagement.likes || ''}
                onChange={(e) => setFormData({
                  ...formData, 
                  engagement: { ...formData.engagement, likes: parseInt(e.target.value) || 0 }
                })}
                className="bg-input/50 border-border/50 focus:border-primary font-mono text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-mono">Comments</label>
              <Input
                type="number"
                placeholder="0"
                value={formData.engagement.comments || ''}
                onChange={(e) => setFormData({
                  ...formData, 
                  engagement: { ...formData.engagement, comments: parseInt(e.target.value) || 0 }
                })}
                className="bg-input/50 border-border/50 focus:border-primary font-mono text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-mono">Shares</label>
              <Input
                type="number"
                placeholder="0"
                value={formData.engagement.shares || ''}
                onChange={(e) => setFormData({
                  ...formData, 
                  engagement: { ...formData.engagement, shares: parseInt(e.target.value) || 0 }
                })}
                className="bg-input/50 border-border/50 focus:border-primary font-mono text-sm"
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <input
            type="checkbox"
            checked={formData.published}
            onChange={(e) => setFormData({...formData, published: e.target.checked})}
            className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary"
          />
          <label className="text-sm font-medium text-foreground font-mono">
            <span className="text-primary">📢</span> Published
          </label>
        </div>
        
        <div className="flex gap-3 pt-4">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-gradient-primary hover:glow-green transition-all duration-300 font-mono"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Post
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="border-border/50 text-muted-foreground hover:bg-muted/50 hover:border-border font-mono"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </form>
    );
  };

  const AchievementForm = ({ achievement, onSave, onCancel }: { achievement?: Achievement, onSave: (a: any) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState({
      title: achievement?.title || '',
      description: achievement?.description || '',
      category: achievement?.category || 'certification',
      type: achievement?.type || 'certificate',
      date: achievement?.date || '',
      organization: achievement?.organization || '',
      credential_id: achievement?.credential_id || '',
      credential_url: achievement?.credential_url || '',
      image_url: achievement?.image_url || '',
      video_url: achievement?.video_url || '',
      skills: achievement?.skills?.join(', ') || '',
      featured: achievement?.featured || false
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave({
        ...achievement,
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Achievement Title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
        <Textarea
          placeholder="Achievement Description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows={3}
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value as Achievement['category']})}
              className="w-full p-2 border rounded-md bg-background"
              required
            >
              <option value="certification">Certification</option>
              <option value="award">Award</option>
              <option value="recognition">Recognition</option>
              <option value="milestone">Milestone</option>
              <option value="competition">Competition</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value as Achievement['type']})}
              className="w-full p-2 border rounded-md bg-background"
              required
            >
              <option value="certificate">Certificate</option>
              <option value="achievement">Achievement</option>
              <option value="badge">Badge</option>
              <option value="award">Award</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
          </div>
          <Input
            placeholder="Organization/Issuer"
            value={formData.organization}
            onChange={(e) => setFormData({...formData, organization: e.target.value})}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Credential ID (optional)"
            value={formData.credential_id}
            onChange={(e) => setFormData({...formData, credential_id: e.target.value})}
          />
          <Input
            type="url"
            placeholder="Credential URL (optional)"
            value={formData.credential_url}
            onChange={(e) => setFormData({...formData, credential_url: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Media (optional)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="url"
              placeholder="Image URL"
              value={formData.image_url}
              onChange={(e) => setFormData({...formData, image_url: e.target.value})}
            />
            <Input
              type="url"
              placeholder="Video URL"
              value={formData.video_url}
              onChange={(e) => setFormData({...formData, video_url: e.target.value})}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Upload images/videos to your preferred hosting service and provide URLs
          </p>
        </div>
        <Input
          placeholder="Skills (comma-separated)"
          value={formData.skills}
          onChange={(e) => setFormData({...formData, skills: e.target.value})}
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData({...formData, featured: e.target.checked})}
          />
          <span>Featured Achievement</span>
        </label>
        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </form>
    );
  };

  return (
    <>
      <AdminAuth 
        onAuthSuccess={handleAuthSuccess}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
      
      {isAuthenticated && (
        <div className="min-h-screen bg-background text-foreground p-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 p-6 bg-gradient-to-r from-card/80 to-card/40 backdrop-blur-sm border border-primary/30 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <Database className="w-8 h-8 text-primary" />
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <h1 className="text-3xl font-bold font-cyber text-foreground">
                  <span className="text-primary">&lt;</span>
                  Supabase
                  <span className="text-transparent bg-gradient-primary bg-clip-text"> Admin</span>
                  <span className="text-primary">/&gt;</span>
                </h1>
              </div>
              <p className="text-muted-foreground font-mono text-sm">
                <span className="text-accent">//</span> Real-time content management system
              </p>
            </div>

        {/* Messages */}
        {success && (
          <Alert className="mb-4 border-primary/50 bg-primary/10">
            <CheckCircle className="w-4 h-4 text-primary" />
            <AlertDescription className="text-primary font-mono text-sm">
              <span className="text-primary">[SUCCESS]:</span> {success}
            </AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert className="mb-4 border-destructive/50 bg-destructive/10">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <AlertDescription className="text-destructive font-mono text-sm">
              <span className="text-destructive">[ERROR]:</span> {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'projects', label: 'Projects', icon: Settings },
            { id: 'blog_posts', label: 'Blog Posts', icon: FileText },
            { id: 'social_media', label: 'Social Media', icon: Share2 },
            { id: 'achievements', label: 'Achievements', icon: Award }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ContentType)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium font-mono transition-all duration-300 border ${
                  activeTab === tab.id
                    ? 'bg-gradient-primary text-primary-foreground border-primary glow-green'
                    : 'bg-card/60 text-muted-foreground border-border hover:bg-card hover:border-primary/50 hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Add Button */}
          <div className="flex justify-between items-center p-4 bg-card/40 backdrop-blur-sm border border-border/50 rounded-lg">
            <h2 className="text-xl font-semibold font-cyber text-foreground capitalize">
              <span className="text-accent">&gt;</span> {activeTab.replace('_', ' ')}
            </h2>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-primary hover:glow-green transition-all duration-300 font-mono"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New
            </Button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-primary/30">
              <CardHeader>
                <CardTitle className="text-foreground font-cyber">
                  <span className="text-primary">&lt;</span>
                  Add New {activeTab.replace('_', ' ')}
                  <span className="text-primary">/&gt;</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeTab === 'projects' && (
                  <ProjectForm 
                    onSave={handleSaveProject}
                    onCancel={() => setShowAddForm(false)}
                  />
                )}
                {activeTab === 'blog_posts' && (
                  <BlogPostForm
                    onSave={handleSaveBlogPost}
                    onCancel={() => setShowAddForm(false)}
                  />
                )}
                {activeTab === 'social_media' && (
                  <SocialMediaForm
                    onSave={handleSaveSocialPost}
                    onCancel={() => setShowAddForm(false)}
                  />
                )}
                {activeTab === 'achievements' && (
                  <AchievementForm
                    onSave={handleSaveAchievement}
                    onCancel={() => setShowAddForm(false)}
                  />
                )}
              </CardContent>
            </Card>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground font-mono">
                <span className="text-accent">//</span> Loading data...
              </p>
            </div>
          )}

          {/* Content Lists */}
          {!isLoading && (
            <div className="grid gap-4">
              {/* Projects */}
              {activeTab === 'projects' && projects.map(project => (
                <Card key={project.id} className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300">
                  <CardContent className="p-6">
                    {editingItem?.id === project.id ? (
                      <ProjectForm
                        project={project}
                        onSave={handleSaveProject}
                        onCancel={() => setEditingItem(null)}
                      />
                    ) : (
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <h3 className="font-semibold font-cyber text-foreground">{project.title}</h3>
                            {project.featured && (
                              <Badge className="bg-primary/20 text-primary border-primary/40 font-mono">
                                Featured
                              </Badge>
                            )}
                            <Badge variant="outline" className="border-secondary/40 text-secondary font-mono">
                              {project.category}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3 font-mono text-sm leading-relaxed">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {project.technologies.map(tech => (
                              <Badge key={tech} variant="secondary" className="bg-accent/20 text-accent border-accent/30 font-mono text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setEditingItem(project)}
                            className="border-primary/40 text-primary hover:bg-primary/10 hover:border-primary"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteProject(project.id)}
                            className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Blog Posts */}
              {activeTab === 'blog_posts' && blogPosts.map(post => (
                <Card key={post.id} className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300">
                  <CardContent className="p-6">
                    {editingItem?.id === post.id ? (
                      <BlogPostForm
                        post={post}
                        onSave={handleSaveBlogPost}
                        onCancel={() => setEditingItem(null)}
                      />
                    ) : (
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <h3 className="font-semibold font-cyber text-foreground">{post.title}</h3>
                            <Badge 
                              variant={post.published ? 'default' : 'secondary'}
                              className={post.published 
                                ? 'bg-primary/20 text-primary border-primary/40 font-mono'
                                : 'bg-muted/60 text-muted-foreground border-muted font-mono'
                              }
                            >
                              {post.published ? 'Published' : 'Draft'}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3 font-mono text-sm leading-relaxed">
                            {post.excerpt}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {post.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="border-accent/40 text-accent font-mono text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setEditingItem(post)}
                            className="border-primary/40 text-primary hover:bg-primary/10 hover:border-primary"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteBlogPost(post.id)}
                            className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Social Media Posts */}
              {activeTab === 'social_media' && socialPosts.map(post => (
                <Card key={post.id} className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300">
                  <CardContent className="p-6">
                    {editingItem?.id === post.id ? (
                      <SocialMediaForm
                        post={post}
                        onSave={handleSaveSocialPost}
                        onCancel={() => setEditingItem(null)}
                      />
                    ) : (
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <h3 className="font-semibold font-cyber text-foreground">{post.title}</h3>
                            <Badge variant="outline" className="border-secondary/40 text-secondary font-mono">
                              {post.platform}
                            </Badge>
                            <Badge 
                              variant={post.published ? 'default' : 'secondary'}
                              className={post.published 
                                ? 'bg-primary/20 text-primary border-primary/40 font-mono'
                                : 'bg-muted/60 text-muted-foreground border-muted font-mono'
                              }
                            >
                              {post.published ? 'Published' : 'Draft'}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3 font-mono text-sm leading-relaxed">
                            {post.content.substring(0, 200)}...
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {post.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="border-accent/40 text-accent font-mono text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setEditingItem(post)}
                            className="border-primary/40 text-primary hover:bg-primary/10 hover:border-primary"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteSocialPost(post.id)}
                            className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Achievements */}
              {activeTab === 'achievements' && achievements.map(achievement => (
                <Card key={achievement.id} className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300">
                  <CardContent className="p-6">
                    {editingItem?.id === achievement.id ? (
                      <AchievementForm
                        achievement={achievement}
                        onSave={handleSaveAchievement}
                        onCancel={() => setEditingItem(null)}
                      />
                    ) : (
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <h3 className="font-semibold font-cyber text-foreground">{achievement.title}</h3>
                            <Badge variant="outline" className="border-secondary/40 text-secondary font-mono">
                              {achievement.category}
                            </Badge>
                            <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30 font-mono">
                              {achievement.type}
                            </Badge>
                            {achievement.featured && (
                              <Badge className="bg-primary/20 text-primary border-primary/40 font-mono">
                                Featured
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground mb-3 font-mono text-sm leading-relaxed">
                            {achievement.description}
                          </p>
                          <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground font-mono">
                            <span className="flex items-center gap-1">
                              <span className="text-accent">📅</span> 
                              {new Date(achievement.date).toLocaleDateString()}
                            </span>
                            {achievement.organization && (
                              <span className="flex items-center gap-1">
                                <span className="text-accent">🏢</span> 
                                {achievement.organization}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {achievement.skills.map(skill => (
                              <Badge key={skill} variant="outline" className="border-accent/40 text-accent font-mono text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setEditingItem(achievement)}
                            className="border-primary/40 text-primary hover:bg-primary/10 hover:border-primary"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteAchievement(achievement.id)}
                            className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
      )}
    </>
  );
}