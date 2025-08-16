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
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const GITHUB_OWNER = 'MUMINHABEEB';
  const GITHUB_REPO = 'mumin-hacker-hub';
  const POSTS_PATH = 'src/posts';

  // Check authentication and load token
  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('admin-logged-in');
      const loginTime = localStorage.getItem('admin-login-time');
      
      if (loggedIn && loginTime) {
        const timeDiff = Date.now() - parseInt(loginTime);
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        // Session expires after 24 hours
        if (hoursDiff < 24) {
          setIsLoggedIn(true);
          // Load saved GitHub token
          const savedToken = localStorage.getItem('github-token');
          if (savedToken) {
            setGithubToken(savedToken);
            setIsTokenSet(true);
            loadPostsFromGitHub(savedToken);
          }
        } else {
          // Session expired - clear everything and set logged out
          localStorage.removeItem('admin-logged-in');
          localStorage.removeItem('admin-login-time');
          setIsLoggedIn(false);
        }
      } else {
        // No valid session - ensure logged out state
        setIsLoggedIn(false);
      }
      
      // Authentication check complete
      setIsAuthChecking(false);
    };
    
    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsAuthChecking(false);
    // Load saved GitHub token after login
    const savedToken = localStorage.getItem('github-token');
    if (savedToken) {
      setGithubToken(savedToken);
      setIsTokenSet(true);
      loadPostsFromGitHub(savedToken);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-logged-in');
    localStorage.removeItem('admin-login-time');
    setIsLoggedIn(false);
  };

  // Show loading screen while checking authentication
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-400 text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

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

    // Find frontmatter boundaries
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
      // Parse frontmatter
      const frontmatter = lines.slice(frontmatterStart + 1, frontmatterEnd).join('\n');
      postContent = lines.slice(frontmatterEnd + 1).join('\n').trim();

      // Extract frontmatter fields
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
      // No frontmatter, use filename as title
      title = filename.replace('.md', '').replace(/-/g, ' ');
      date = new Date().toISOString();
    }

    return {
      title,
      slug: generateSlug(title),
      date,
      tags,
      excerpt,
      content: postContent,
      filename,
      sha
    };
  };

  const loadPostsFromGitHub = async (token: string) => {
    setLoading(true);
    setMessage('📥 Loading posts from GitHub...');

    try {
      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${POSTS_PATH}`,
        {
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
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

      // Sort by date (newest first)
      loadedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setPosts(loadedPosts);
      setMessage(`✅ Loaded ${loadedPosts.length} posts from GitHub`);
    } catch (error) {
      console.error('Error loading posts:', error);
      setMessage(`❌ Error loading posts: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const savePostToGitHub = async (post: Post, isEdit: boolean = false) => {
    setLoading(true);
    const action = isEdit ? 'Updating' : 'Creating';
    setMessage(`💾 ${action} post on GitHub...`);

    try {
      const filename = `${post.slug}.md`;
      const content = generateMarkdown(post);
      const encodedContent = btoa(unescape(encodeURIComponent(content)));

      const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${POSTS_PATH}/${filename}`;
      
      const body: any = {
        message: isEdit ? `Update post: ${post.title}` : `Add new post: ${post.title}`,
        content: encodedContent,
        branch: 'master'
      };

      // If editing, get the current SHA first
      if (isEdit) {
        try {
          const getResponse = await fetch(url, {
            headers: {
              'Authorization': `token ${githubToken}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          });
          
          if (getResponse.ok) {
            const fileInfo = await getResponse.json();
            body.sha = fileInfo.sha;
          }
        } catch (error) {
          console.warn('Could not get current file SHA:', error);
        }
      }

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`GitHub API error: ${response.status} - ${errorData.message}`);
      }

      setMessage(`✅ Post ${isEdit ? 'updated' : 'created'} successfully on GitHub! 🚀 Your site will update in 2-3 minutes.`);
      
      // Clear the unified cache so blog page gets fresh data
      clearPostsCache();
      
      // Reload posts to get the latest state
      await loadPostsFromGitHub(githubToken);
      
      // Reset form
      setFormData({ title: '', content: '', tags: '', excerpt: '' });
      setIsCreating(false);
      setEditingPost(null);

    } catch (error) {
      console.error('Error saving post:', error);
      setMessage(`❌ Error saving post: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const deletePostFromGitHub = async (post: Post) => {
    if (!confirm(`Are you sure you want to delete "${post.title}"?`)) {
      return;
    }

    setLoading(true);
    setMessage('🗑️ Deleting post from GitHub...');

    try {
      // Use the original filename if available, otherwise construct from slug
      const filename = post.filename || `${post.slug}.md`;
      
      console.log(`[Delete] Attempting to delete file: ${filename}`);
      console.log(`[Delete] Post object:`, post);
      
      // First, get the current file to get its SHA
      const getUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${POSTS_PATH}/${filename}`;
      console.log(`[Delete] GET URL:`, getUrl);
      
      const getResponse = await fetch(getUrl, {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!getResponse.ok) {
        const errorText = await getResponse.text();
        console.error(`[Delete] GET failed:`, getResponse.status, errorText);
        
        // If file not found, it might already be deleted
        if (getResponse.status === 404) {
          setMessage('⚠️ File not found - it may have already been deleted. Refreshing...');
          await loadPostsFromGitHub(githubToken);
          return;
        }
        
        throw new Error(`Failed to get file info: ${getResponse.status} - ${errorText}`);
      }

      const fileInfo = await getResponse.json();
      console.log(`[Delete] File info retrieved:`, fileInfo.sha);
      
      // Now delete with the correct SHA
      const deleteUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${POSTS_PATH}/${filename}`;

      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Delete post: ${post.title}`,
          sha: fileInfo.sha,
          branch: 'master'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`GitHub API error: ${response.status} - ${errorData.message}`);
      }

      setMessage('✅ Post deleted successfully from GitHub! 🚀 Your site will update in 2-3 minutes.');
      
      // Clear the unified cache so blog page gets fresh data
      clearPostsCache();
      
      await loadPostsFromGitHub(githubToken);

    } catch (error) {
      console.error('Error deleting post:', error);
      setMessage(`❌ Error deleting post: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      setMessage('❌ Please enter a title');
      return;
    }

    const post: Post = {
      title: formData.title,
      slug: generateSlug(formData.title),
      date: editingPost?.date || new Date().toISOString(),
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      excerpt: formData.excerpt || formData.content.substring(0, 150) + '...',
      content: formData.content,
      sha: editingPost?.sha
    };

    savePostToGitHub(post, !!editingPost);
  };

  const startEdit = (post: Post) => {
    setFormData({
      title: post.title,
      content: post.content,
      tags: post.tags?.join(', ') || '',
      excerpt: post.excerpt || ''
    });
    setEditingPost(post);
    setIsCreating(true);
  };

  const cancelEdit = () => {
    setFormData({ title: '', content: '', tags: '', excerpt: '' });
    setIsCreating(false);
    setEditingPost(null);
  };

  // Show token input if not set
  if (!isTokenSet) {
    return (
      <div className="min-h-screen bg-black text-green-400 p-4">
        <div className="max-w-2xl mx-auto">
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

  return (
    <div className="min-h-screen bg-black text-green-400 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 relative">
          <h1 className="text-4xl font-mono mb-4 text-cyan-400">
            🚀 GITHUB BLOG ADMIN
          </h1>
          <p className="text-green-300">Managing posts in your GitHub repository</p>
          
          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            variant="outline"
            className="absolute top-0 right-0 border-red-400 text-red-400 hover:bg-red-400 hover:text-black"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Status Message */}
        {message && (
          <div className={`mb-4 p-3 rounded border ${
            message.includes('❌') ? 'border-red-400 text-red-400' : 'border-green-400 text-green-400'
          }`}>
            {message}
          </div>
        )}

        {/* Action Buttons */}
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

        {/* Create/Edit Form */}
        {isCreating && (
          <Card className="mb-6 bg-gray-900 border-green-400">
            <CardHeader>
              <CardTitle className="text-cyan-400">
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
              
              <Textarea
                placeholder="Excerpt (optional)"
                value={formData.excerpt}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                className="bg-black border-green-400 text-green-400"
                rows={3}
              />
              
              <Textarea
                placeholder="Post content (Markdown)"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="bg-black border-green-400 text-green-400"
                rows={15}
              />
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={loading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingPost ? 'Update Post' : 'Save to GitHub'}
                </Button>
                <Button 
                  onClick={cancelEdit}
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

        {/* Posts List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-mono text-cyan-400">
            Your Posts ({posts.length})
          </h2>
          
          {posts.length === 0 && !loading ? (
            <Card className="bg-gray-900 border-yellow-400">
              <CardContent className="p-6 text-center">
                <p className="text-yellow-400">No posts found in GitHub repository.</p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.slug} className="bg-gray-900 border-green-400">
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
                        disabled={loading}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => deletePostFromGitHub(post)}
                        className="bg-red-600 hover:bg-red-700"
                        disabled={loading}
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GitHubBlogAdmin;
