import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Trash2, Edit, Plus, Save, X, Lock } from 'lucide-react';
import { loadPosts, type Post } from '../lib/posts';

interface NewPost {
  title: string;
  slug: string;
  date: string;
  tags: string[];
  excerpt: string;
  content: string;
}

interface LoginForm {
  username: string;
  password: string;
}

const BlogAdmin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState<LoginForm>({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [newPost, setNewPost] = useState<NewPost>({
    title: '',
    slug: '',
    date: new Date().toISOString().split('T')[0],
    tags: [],
    excerpt: '',
    content: ''
  });

  useEffect(() => {
    // Check if user is already authenticated (session storage)
    const auth = sessionStorage.getItem('blog-admin-auth');
    if (auth === 'authenticated') {
      setIsAuthenticated(true);
      loadPostsData();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple authentication - in production, use proper auth
    if (loginForm.username === 'muminhabeeb' && loginForm.password === '#Mumin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('blog-admin-auth', 'authenticated');
      setLoginError('');
      loadPostsData();
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('blog-admin-auth');
    setLoginForm({ username: '', password: '' });
  };

  const loadPostsData = () => {
    try {
      const allPosts = loadPosts();
      setPosts(allPosts);
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setNewPost(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setNewPost(prev => ({ ...prev, tags }));
  };

  const generateMarkdownContent = (post: NewPost) => {
    return `---
title: "${post.title}"
slug: "${post.slug}"
date: "${post.date}"
tags: [${post.tags.map(tag => `"${tag}"`).join(', ')}]
excerpt: "${post.excerpt}"
---

${post.content}`;
  };

  const downloadPost = (post: NewPost) => {
    const content = generateMarkdownContent(post);
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${post.slug}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setNewPost({
      title: '',
      slug: '',
      date: new Date().toISOString().split('T')[0],
      tags: [],
      excerpt: '',
      content: ''
    });
    setIsCreating(false);
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <Card className="bg-slate-900 border-slate-700 w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl text-cyan-400">Blog Admin Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the blog administration panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Username
                </label>
                <Input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter username"
                  className="bg-slate-800 border-slate-600 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                  className="bg-slate-800 border-slate-600 text-white"
                  required
                />
              </div>
              {loginError && (
                <div className="text-red-400 text-sm text-center">
                  {loginError}
                </div>
              )}
              <Button 
                type="submit" 
                className="w-full bg-cyan-600 hover:bg-cyan-700"
              >
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Blog Admin
            </h1>
            <p className="text-slate-400 mt-2">Manage your blog posts</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => setIsCreating(true)}
              className="bg-cyan-600 hover:bg-cyan-700"
              disabled={isCreating}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              Logout
            </Button>
          </div>
        </div>

        {isCreating && (
          <Card className="bg-slate-900 border-slate-700 mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-cyan-400">Create New Post</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetForm}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <CardDescription>
                Fill in the details below and download the markdown file to add to your src/posts folder
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Title
                  </label>
                  <Input
                    value={newPost.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter post title"
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Slug
                  </label>
                  <Input
                    value={newPost.slug}
                    onChange={(e) => setNewPost(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="url-slug"
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Date
                  </label>
                  <Input
                    type="date"
                    value={newPost.date}
                    onChange={(e) => setNewPost(prev => ({ ...prev, date: e.target.value }))}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tags (comma-separated)
                  </label>
                  <Input
                    value={newPost.tags.join(', ')}
                    onChange={(e) => handleTagsChange(e.target.value)}
                    placeholder="cybersecurity, hacking, tech"
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Excerpt
                </label>
                <Textarea
                  value={newPost.excerpt}
                  onChange={(e) => setNewPost(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Short summary for SEO and listings..."
                  className="bg-slate-800 border-slate-600 text-white"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Content (Markdown)
                </label>
                <Textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your post content in markdown..."
                  className="bg-slate-800 border-slate-600 text-white font-mono"
                  rows={12}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => downloadPost(newPost)}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={!newPost.title || !newPost.slug || !newPost.content}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Download Markdown File
                </Button>
                <Button
                  variant="outline"
                  onClick={resetForm}
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </Button>
              </div>

              {newPost.title && newPost.slug && (
                <div className="mt-4 p-4 bg-slate-800 rounded-lg">
                  <p className="text-sm text-slate-400 mb-2">Preview filename:</p>
                  <code className="text-cyan-400">{newPost.slug}.md</code>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6">
          <h2 className="text-xl font-semibold text-slate-200">Existing Posts</h2>
          {posts.length === 0 ? (
            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="text-center py-8">
                <p className="text-slate-400">No posts found</p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.slug} className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white">{post.title}</CardTitle>
                      <CardDescription className="text-slate-400">
                        {post.date} • {post.slug}.md
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-cyan-400"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {post.excerpt && (
                    <p className="text-slate-300 mb-3">{post.excerpt}</p>
                  )}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-slate-700 text-slate-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogAdmin;
