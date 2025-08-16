import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Trash2, Edit, Plus, Save, X, RefreshCw, Github, Key, ExternalLink, LogOut } from 'lucide-react';
import { clearPostsCache } from '../lib/posts';
import AdminLogin from './AdminLogin';

interface Post {
  title: string;
  slug: string;
  date: string;
  tags?: string[];
  excerpt?: string;
  content: string;
  filename?: string;
  sha?: string; // GitHub file SHA for updates
}

const GitHubBlogAdmin: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [isTokenSet, setIsTokenSet] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    excerpt: ''
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const GITHUB_OWNER = 'MUMINHABEEB';
  const GITHUB_REPO = 'mumin-hacker-hub';
  const POSTS_PATH = 'src/posts';

  // Initialize authentication on component mount
  useEffect(() => {
    const initAuth = () => {
      try {
        const adminLoggedIn = localStorage.getItem('admin-logged-in');
        const loginTime = localStorage.getItem('admin-login-time');
        
        if (adminLoggedIn === 'true' && loginTime) {
          const timeDiff = Date.now() - parseInt(loginTime);
          const hoursDiff = timeDiff / (1000 * 60 * 60);
          
          if (hoursDiff < 24) {
            setIsLoggedIn(true);
            const savedToken = localStorage.getItem('github-token');
            if (savedToken) {
              setGithubToken(savedToken);
              setIsTokenSet(true);
            }
          } else {
            localStorage.removeItem('admin-logged-in');
            localStorage.removeItem('admin-login-time');
            setIsLoggedIn(false);
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Auth error:', error);
        setIsLoggedIn(false);
      }
      setIsInitialized(true);
    };

    initAuth();
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    const savedToken = localStorage.getItem('github-token');
    if (savedToken) {
      setGithubToken(savedToken);
      setIsTokenSet(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-logged-in');
    localStorage.removeItem('admin-login-time');
    setIsLoggedIn(false);
    setGithubToken('');
    setIsTokenSet(false);
    setPosts([]);
  };

  // Auto-save token when it changes
  const handleTokenChange = (token: string) => {
    setGithubToken(token);
    if (token.trim()) {
      localStorage.setItem('github-token', token);
      setIsTokenSet(true);
      setMessage('✅ GitHub token saved automatically!');
    } else {
      localStorage.removeItem('github-token');
      setIsTokenSet(false);
    }
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const generateMarkdown = (post: Post): string => {
    const frontmatter = `---
title: "${post.title}"
date: "${post.date}"
tags: [${post.tags?.map(tag => `"${tag}"`).join(', ') || ''}]
excerpt: "${post.excerpt || ''}"
---

${post.content}`;
    return frontmatter;
  };

  const parseMarkdown = (content: string, filename: string, sha?: string): Post => {
    const lines = content.split('\n');
    let frontmatterEnd = -1;
    let frontmatterStart = -1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() === '---') {
        if (frontmatterStart === -1) {
          frontmatterStart = i;
        } else {
          frontmatterEnd = i;
          break;
        }
      }
    }

    let title = '';
    let date = '';
    let tags: string[] = [];
    let excerpt = '';
    let postContent = content;

    if (frontmatterStart !== -1 && frontmatterEnd !== -1) {
      const frontmatter = lines.slice(frontmatterStart + 1, frontmatterEnd).join('\n');
      postContent = lines.slice(frontmatterEnd + 1).join('\n').trim();

      const titleMatch = frontmatter.match(/title:\s*"([^"]+)"/);
      const dateMatch = frontmatter.match(/date:\s*"([^"]+)"/);
      const tagsMatch = frontmatter.match(/tags:\s*\[([^\]]+)\]/);
      const excerptMatch = frontmatter.match(/excerpt:\s*"([^"]+)"/);

      title = titleMatch ? titleMatch[1] : filename.replace('.md', '');
      date = dateMatch ? dateMatch[1] : new Date().toISOString();
      excerpt = excerptMatch ? excerptMatch[1] : '';
      
      if (tagsMatch) {
        tags = tagsMatch[1].split(',').map(tag => tag.trim().replace(/"/g, ''));
      }
    } else {
      title = filename.replace('.md', '').replace(/-/g, ' ');
      date = new Date().toISOString();
    }

    return {
      title,
      slug: generateSlug(title),
      date,
      tags,
      excerpt: excerpt || postContent.substring(0, 150) + '...',
      content: postContent,
      filename,
      sha
    };
  };

  const loadPostsFromGitHub = async (token: string) => {
    setLoading(true);
    setMessage('');
    
    try {
      const headers = {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      };

      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${POSTS_PATH}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }

      const files = await response.json();
      const markdownFiles = files.filter((file: any) => file.name.endsWith('.md'));
      const loadedPosts: Post[] = [];

      for (const file of markdownFiles) {
        try {
          const fileResponse = await fetch(file.download_url);
          const content = await fileResponse.text();
          const post = parseMarkdown(content, file.name, file.sha);
          loadedPosts.push(post);
        } catch (error) {
          console.error(`Error loading ${file.name}:`, error);
        }
      }

      const sortedPosts = loadedPosts.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setPosts(sortedPosts);
      setMessage(`✅ Loaded ${sortedPosts.length} posts from GitHub`);
      
      // Clear the unified posts cache
      clearPostsCache();
      
    } catch (error) {
      console.error('Error loading posts:', error);
      setMessage(`❌ Error loading posts: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const savePostToGitHub = async (post: Post, isNew: boolean = false) => {
    if (!githubToken) {
      setMessage('❌ GitHub token required');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const filename = `${post.slug}.md`;
      const content = generateMarkdown(post);
      const encodedContent = btoa(unescape(encodeURIComponent(content)));

      const headers = {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      };

      const body: any = {
        message: isNew ? `Add new post: ${post.title}` : `Update post: ${post.title}`,
        content: encodedContent,
        branch: 'master'
      };

      if (!isNew && post.sha) {
        body.sha = post.sha;
      }

      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${POSTS_PATH}/${filename}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify(body)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      setMessage(`✅ Post ${isNew ? 'created' : 'updated'} successfully`);
      await loadPostsFromGitHub(githubToken);
      
      // Clear forms
      setIsCreating(false);
      setEditingPost(null);
      setFormData({ title: '', content: '', tags: '', excerpt: '' });
      
      // Clear the unified posts cache
      clearPostsCache();
      
    } catch (error) {
      console.error('Error saving post:', error);
      setMessage(`❌ Error saving post: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const deletePostFromGitHub = async (post: Post) => {
    if (!githubToken || !post.filename) {
      setMessage('❌ GitHub token and filename required');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // First, get the current file info to get the SHA
      const headers = {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      };

      const getResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${POSTS_PATH}/${post.filename}`,
        { headers }
      );

      if (!getResponse.ok) {
        throw new Error(`Failed to get file info: ${getResponse.status}`);
      }

      const fileInfo = await getResponse.json();
      const sha = fileInfo.sha;

      // Now delete the file
      const deleteResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${POSTS_PATH}/${post.filename}`,
        {
          method: 'DELETE',
          headers,
          body: JSON.stringify({
            message: `Delete post: ${post.title}`,
            sha: sha,
            branch: 'master'
          })
        }
      );

      if (!deleteResponse.ok) {
        const errorData = await deleteResponse.json();
        throw new Error(errorData.message || `HTTP ${deleteResponse.status}`);
      }

      setMessage(`✅ Post deleted successfully`);
      await loadPostsFromGitHub(githubToken);
      
      // Clear the unified posts cache
      clearPostsCache();
      
    } catch (error) {
      console.error('Error deleting post:', error);
      setMessage(`❌ Error deleting post: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (post: Post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      tags: post.tags?.join(', ') || '',
      excerpt: post.excerpt || ''
    });
  };

  const handleSave = () => {
    if (!formData.title || !formData.content) {
      setMessage('❌ Title and content are required');
      return;
    }

    const post: Post = {
      title: formData.title,
      slug: generateSlug(formData.title),
      date: editingPost?.date || new Date().toISOString(),
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [],
      excerpt: formData.excerpt,
      content: formData.content,
      filename: editingPost?.filename,
      sha: editingPost?.sha
    };

    savePostToGitHub(post, !editingPost);
  };

  // Show loading while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  // Token setup screen
  if (!isTokenSet) {
    return (
      <div className="min-h-screen bg-black p-4">
        <div className="max-w-2xl mx-auto mt-20">
          <Card className="bg-gray-900 border-cyan-400">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <Key className="w-5 h-5" />
                GitHub Authentication Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-green-300">
                To manage your blog posts stored in GitHub, please enter your Personal Access Token:
              </p>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="GitHub Personal Access Token"
                  value={githubToken}
                  onChange={(e) => handleTokenChange(e.target.value)}
                  className="bg-black border-green-400 text-green-400"
                />
                <p className="text-sm text-gray-400">
                  Need a token? Go to GitHub Settings → Developer settings → Personal access tokens → Generate new token.
                  Required permissions: repo (full control of private repositories)
                </p>
                <p className="text-sm text-cyan-400">
                  💾 Token is automatically saved and will be remembered for future sessions
                </p>
              </div>
              {isTokenSet && (
                <Button 
                  onClick={() => loadPostsFromGitHub(githubToken)} 
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Github className="w-4 h-4 mr-2" />
                  Load Posts from GitHub
                </Button>
              )}
              {message && (
                <p className={`text-sm ${message.includes('❌') ? 'text-red-400' : 'text-green-400'}`}>
                  {message}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main admin interface
  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 relative">
          <h1 className="text-4xl font-mono mb-4 text-cyan-400">
            🚀 GITHUB BLOG ADMIN
          </h1>
          <p className="text-green-300">Managing posts in your GitHub repository</p>
          
          <Button
            onClick={handleLogout}
            variant="outline"
            className="absolute top-0 right-0 border-red-400 text-red-400 hover:bg-red-400 hover:text-black"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded border ${
            message.includes('❌') ? 'border-red-400 text-red-400' : 'border-green-400 text-green-400'
          }`}>
            {message}
          </div>
        )}

        <div className="flex gap-4 mb-6 flex-wrap">
          <Button 
            onClick={() => setIsCreating(true)}
            className="bg-green-600 hover:bg-green-700"
            disabled={loading || isCreating}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Post
          </Button>
          <Button 
            onClick={() => loadPostsFromGitHub(githubToken)}
            variant="outline"
            className="border-cyan-400 text-cyan-400"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh from GitHub
          </Button>
          <Button 
            onClick={() => {
              clearPostsCache();
              window.open('/blog', '_blank');
            }}
            variant="outline"
            className="border-purple-400 text-purple-400"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Blog
          </Button>
        </div>

        {(isCreating || editingPost) && (
          <Card className="mb-6 bg-gray-900 border-green-400">
            <CardHeader>
              <CardTitle className="text-green-400">
                {editingPost ? `Edit: ${editingPost.title}` : 'Create New Post'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Post title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="bg-black border-green-400 text-green-400"
              />
              <Input
                placeholder="Tags (comma separated)"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                className="bg-black border-green-400 text-green-400"
              />
              <Input
                placeholder="Excerpt (optional)"
                value={formData.excerpt}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                className="bg-black border-green-400 text-green-400"
              />
              <Textarea
                placeholder="Post content (Markdown)"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="bg-black border-green-400 text-green-400 min-h-[200px]"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={loading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingPost ? 'Update' : 'Create'} Post
                </Button>
                <Button 
                  onClick={() => {
                    setIsCreating(false);
                    setEditingPost(null);
                    setFormData({ title: '', content: '', tags: '', excerpt: '' });
                  }}
                  variant="outline"
                  className="border-red-400 text-red-400"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {posts.length === 0 && !loading && (
            <Card className="bg-gray-900 border-gray-600">
              <CardContent className="p-6 text-center">
                <p className="text-gray-400">No posts found. Create your first post or refresh from GitHub.</p>
              </CardContent>
            </Card>
          )}
          
          {posts.map((post) => (
            <Card key={post.slug} className="bg-gray-900 border-cyan-400">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-cyan-400">{post.title}</CardTitle>
                    <p className="text-green-300 text-sm mt-1">
                      {new Date(post.date).toLocaleDateString()} • {post.filename}
                    </p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs border-cyan-400 text-cyan-400">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => startEdit(post)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => deletePostFromGitHub(post)}
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-green-400 text-sm">{post.excerpt}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GitHubBlogAdmin;
