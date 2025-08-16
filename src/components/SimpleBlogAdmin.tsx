import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Trash2, Edit, Plus, Save, X, RefreshCw } from 'lucide-react';
import { loadPosts, addPost, updatePost, deletePost, generateSlug, type Post } from '../lib/posts';

const SimpleBlogAdmin: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    excerpt: ''
  });

  // Load posts on component mount
  useEffect(() => {
    refreshPosts();
  }, []);

  const refreshPosts = () => {
    const loadedPosts = loadPosts();
    setPosts(loadedPosts);
    console.log('Loaded posts:', loadedPosts);
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }

    const slug = generateSlug(formData.title);
    const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
    
    const postData: Post = {
      title: formData.title,
      slug: slug,
      date: new Date().toISOString(),
      tags: tagsArray,
      excerpt: formData.excerpt || formData.content.substring(0, 150) + '...',
      content: formData.content
    };

    try {
      if (editingId) {
        updatePost(editingId, postData);
        alert('Post updated successfully!');
      } else {
        addPost(postData);
        alert('Post created successfully!');
      }
      
      // Reset form and refresh
      setFormData({ title: '', content: '', tags: '', excerpt: '' });
      setIsCreating(false);
      setEditingId(null);
      refreshPosts();
    } catch (error) {
      alert('Error saving post: ' + (error as Error).message);
    }
  };

  const handleEdit = (post: Post) => {
    setFormData({
      title: post.title,
      content: post.content,
      tags: post.tags?.join(', ') || '',
      excerpt: post.excerpt || ''
    });
    setEditingId(post.slug);
    setIsCreating(true);
  };

  const handleDelete = (slug: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        deletePost(slug);
        alert('Post deleted successfully!');
        refreshPosts();
      } catch (error) {
        alert('Error deleting post: ' + (error as Error).message);
      }
    }
  };

  const handleCancel = () => {
    setFormData({ title: '', content: '', tags: '', excerpt: '' });
    setIsCreating(false);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-black text-green-400 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-mono mb-4 text-cyan-400">
            🚀 SIMPLE BLOG ADMIN
          </h1>
          <p className="text-green-300">No login required - Just works!</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <Button 
            onClick={() => setIsCreating(true)}
            className="bg-green-600 hover:bg-green-700"
            disabled={isCreating}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Post
          </Button>
          <Button 
            onClick={refreshPosts}
            variant="outline"
            className="border-cyan-400 text-cyan-400"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Posts
          </Button>
        </div>

        {/* Create/Edit Form */}
        {isCreating && (
          <Card className="mb-6 bg-gray-900 border-green-400">
            <CardHeader>
              <CardTitle className="text-cyan-400">
                {editingId ? 'Edit Post' : 'Create New Post'}
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
                placeholder="Post content (Markdown supported)"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="bg-black border-green-400 text-green-400"
                rows={10}
              />
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? 'Update Post' : 'Save Post'}
                </Button>
                <Button 
                  onClick={handleCancel}
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
          
          {posts.length === 0 ? (
            <Card className="bg-gray-900 border-yellow-400">
              <CardContent className="p-6 text-center">
                <p className="text-yellow-400">No posts yet. Create your first post!</p>
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
                        {new Date(post.date).toLocaleDateString()} • {post.slug}
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
                        onClick={() => handleEdit(post)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDelete(post.slug)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-green-400 text-sm">{post.excerpt}</p>
                  <details className="mt-2">
                    <summary className="text-cyan-400 cursor-pointer hover:text-cyan-300">
                      Show Content
                    </summary>
                    <pre className="text-green-300 text-xs mt-2 whitespace-pre-wrap bg-black p-2 rounded border border-green-700">
                      {post.content}
                    </pre>
                  </details>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleBlogAdmin;
