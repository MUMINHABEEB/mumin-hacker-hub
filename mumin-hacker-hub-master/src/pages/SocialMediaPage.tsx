import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ExternalLink, 
  Linkedin, 
  Youtube, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share, 
  Calendar,
  Filter,
  TrendingUp,
  Clock
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Fallback social media posts when Supabase is unavailable
const fallbackPosts: SocialMediaPost[] = [
  {
    id: 'fallback-1',
    title: 'Amity Online: How to Use AMIGO Portal | Access Lessons, Modules & More',
    platform: 'YouTube',
    content: 'AMIGO Portal Guide This short tutorial shows you how to log in to the AMIGO portal, navigate the dashboard, and access your online lessons, modules, and video lectures easily. 🎯 Whether you\'re a new student or just need help using the platform, this guide will walk you through step-by-step.',
    post_url: 'https://youtube.com/watch?v=example',
    thumbnail_url: null,
    engagement: {
      views: 1250,
      likes: 89,
      comments: 12,
      shares: 5
    },
    tags: ['AmityOnline', 'AMIGO', 'StudentGuide', 'OnlineLearning'],
    published: true,
    post_date: '2025-09-21',
    featured: true,
    created_at: '2025-09-21T00:00:00Z',
    updated_at: '2025-09-21T00:00:00Z'
  },
  {
    id: 'fallback-2',
    title: 'Cybersecurity Career Paths: From Student to Professional',
    platform: 'LinkedIn',
    content: 'Sharing insights on building a successful cybersecurity career. From ethical hacking certifications to hands-on experience with penetration testing tools. The field offers diverse opportunities for those passionate about digital security.',
    post_url: 'https://linkedin.com/posts/example',
    thumbnail_url: null,
    engagement: {
      views: 890,
      likes: 67,
      comments: 23,
      shares: 15
    },
    tags: ['Cybersecurity', 'Career', 'EthicalHacking', 'PenetrationTesting'],
    published: true,
    post_date: '2025-09-20',
    featured: false,
    created_at: '2025-09-20T00:00:00Z',
    updated_at: '2025-09-20T00:00:00Z'
  },
  {
    id: 'fallback-3',
    title: 'Building Secure Web Applications: Best Practices',
    platform: 'LinkedIn',
    content: 'Key principles for developing secure web applications: input validation, authentication mechanisms, and proper error handling. Security should be built into the development process from day one.',
    post_url: 'https://linkedin.com/posts/example-2',
    thumbnail_url: null,
    engagement: {
      views: 1450,
      likes: 92,
      comments: 18,
      shares: 8
    },
    tags: ['WebSecurity', 'Development', 'BestPractices', 'SecureCoding'],
    published: true,
    post_date: '2025-09-19',
    featured: false,
    created_at: '2025-09-19T00:00:00Z',
    updated_at: '2025-09-19T00:00:00Z'
  }
];

// Supabase social media post interface
interface SocialMediaPost {
  id: string;
  title: string;
  platform: string;
  content: string;
  post_url?: string;           // ← This might be missing
  thumbnail_url?: string;      // ← This might be missing  
  engagement: {                // ← This structure might be different
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
  };
  tags: string[];
  published: boolean;
  post_date?: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

const SocialMediaPage = () => {
  const [allPosts, setAllPosts] = useState<SocialMediaPost[]>([]);
  const [linkedInPosts, setLinkedInPosts] = useState<SocialMediaPost[]>([]);
  const [youtubePosts, setYoutubePosts] = useState<SocialMediaPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [linkedInSort, setLinkedInSort] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [youtubeSort, setYoutubeSort] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [activeSection, setActiveSection] = useState<'all' | 'linkedin' | 'youtube'>('all');

  // Sort posts function
  const sortPosts = (posts: SocialMediaPost[], sortType: 'newest' | 'oldest' | 'popular') => {
    return [...posts].sort((a, b) => {
      switch (sortType) {
        case 'newest':
          return new Date(b.post_date || b.created_at).getTime() - new Date(a.post_date || a.created_at).getTime();
        case 'oldest':
          return new Date(a.post_date || a.created_at).getTime() - new Date(b.post_date || b.created_at).getTime();
        case 'popular':
          const aEngagement = (a.engagement?.views || 0) + (a.engagement?.likes || 0) + (a.engagement?.comments || 0);
          const bEngagement = (b.engagement?.views || 0) + (b.engagement?.likes || 0) + (b.engagement?.comments || 0);
          return bEngagement - aEngagement;
        default:
          return 0;
      }
    });
  };

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        
        // Fetch all published social media posts from Supabase
        const { data: posts, error } = await supabase
          .from('social_media')
          .select('*')
          .eq('published', true)
          .order('post_date', { ascending: false });

        if (error) {
          console.error('Supabase error, using fallback data:', error);
          // Use fallback data when Supabase fails
          const postsData = fallbackPosts;
          setAllPosts(postsData);
          
          const linkedIn = postsData.filter(post => post.platform.toLowerCase() === 'linkedin');
          const youtube = postsData.filter(post => post.platform.toLowerCase() === 'youtube');
          
          setLinkedInPosts(sortPosts(linkedIn, linkedInSort));
          setYoutubePosts(sortPosts(youtube, youtubeSort));
          return;
        }

        const postsData = posts && posts.length > 0 ? posts : fallbackPosts;
        setAllPosts(postsData);
        
        const linkedIn = postsData.filter(post => post.platform.toLowerCase() === 'linkedin');
        const youtube = postsData.filter(post => post.platform.toLowerCase() === 'youtube');
        
        setLinkedInPosts(sortPosts(linkedIn, linkedInSort));
        setYoutubePosts(sortPosts(youtube, youtubeSort));
      } catch (error) {
        console.error('Failed to load social media posts, using fallback:', error);
        // Use fallback data when any error occurs
        const postsData = fallbackPosts;
        setAllPosts(postsData);
        
        const linkedIn = postsData.filter(post => post.platform.toLowerCase() === 'linkedin');
        const youtube = postsData.filter(post => post.platform.toLowerCase() === 'youtube');
        
        setLinkedInPosts(sortPosts(linkedIn, linkedInSort));
        setYoutubePosts(sortPosts(youtube, youtubeSort));
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  useEffect(() => {
    const linkedIn = allPosts.filter(post => post.platform.toLowerCase() === 'linkedin');
    setLinkedInPosts(sortPosts(linkedIn, linkedInSort));
  }, [linkedInSort, allPosts]);

  useEffect(() => {
    const youtube = allPosts.filter(post => post.platform.toLowerCase() === 'youtube');
    setYoutubePosts(sortPosts(youtube, youtubeSort));
  }, [youtubeSort, allPosts]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatNumber = (num: number | undefined) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getSortIcon = (sortType: string) => {
    switch (sortType) {
      case 'newest':
        return <Clock className="w-4 h-4" />;
      case 'oldest':
        return <Calendar className="w-4 h-4" />;
      case 'popular':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Filter className="w-4 h-4" />;
    }
  };

  const getSortLabel = (sortType: string) => {
    switch (sortType) {
      case 'newest':
        return 'Newest First';
      case 'oldest':
        return 'Oldest First';
      case 'popular':
        return 'Most Popular';
      default:
        return 'Sort';
    }
  };

  const PostCard = ({ post }: { post: SocialMediaPost }) => {
    const cardContent = (
      <Card className="group hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50 hover:border-accent/30 cursor-pointer">
        <CardContent className="p-0">
        {/* Thumbnail */}
        {post.thumbnail_url && (
          <div className="relative overflow-hidden rounded-t-lg">
            <img 
              src={post.thumbnail_url} 
              alt={post.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 left-3">
              <Badge className={`${
                post.platform.toLowerCase() === 'linkedin' 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-red-600 hover:bg-red-700'
              } text-white border-0`}>
                {post.platform.toLowerCase() === 'linkedin' ? (
                  <><Linkedin className="w-3 h-3 mr-1" /> LinkedIn</>
                ) : (
                  <><Youtube className="w-3 h-3 mr-1" /> YouTube</>
                )}
              </Badge>
            </div>
            {post.featured && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-yellow-600 text-black border-0">
                  Featured
                </Badge>
              </div>
            )}
          </div>
        )}

        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="font-bold text-base sm:text-lg leading-tight group-hover:text-accent transition-colors">
              {post.title}
            </h3>
            {!post.thumbnail_url && (
              <div className="flex gap-2 flex-shrink-0">
                <Badge className={`${
                  post.platform.toLowerCase() === 'linkedin' 
                    ? 'bg-blue-600/10 text-blue-400 border-blue-400/30' 
                    : 'bg-red-600/10 text-red-400 border-red-400/30'
                } text-xs`}>
                  {post.platform.toLowerCase() === 'linkedin' ? (
                    <><Linkedin className="w-3 h-3 mr-1" /> LinkedIn</>
                  ) : (
                    <><Youtube className="w-3 h-3 mr-1" /> YouTube</>
                  )}
                </Badge>
                {post.featured && (
                  <Badge className="bg-yellow-600/10 text-yellow-400 border-yellow-400/30 text-xs">
                    Featured
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-muted-foreground mb-4 leading-relaxed text-sm sm:text-base">
            {post.content}
          </p>

          {/* Metrics */}
          {post.engagement && (
            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-4 flex-wrap">
              {post.engagement.views && (
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                  {formatNumber(post.engagement.views)}
                </span>
              )}
              {post.engagement.likes && (
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                  {formatNumber(post.engagement.likes)}
                </span>
              )}
              {post.engagement.comments && (
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  {formatNumber(post.engagement.comments)}
                </span>
              )}
              {post.engagement.shares && (
                <span className="flex items-center gap-1">
                  <Share className="w-3 h-3 sm:w-4 sm:h-4" />
                  {formatNumber(post.engagement.shares)}
                </span>
              )}
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              {formatDate(post.post_date || post.created_at)}
            </div>
            {post.post_url && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-accent">
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                View {post.platform.toLowerCase() === 'linkedin' ? 'Post' : 'Video'}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
    );

    // Make entire card clickable if post_url exists
    if (post.post_url) {
      return (
        <a href={post.post_url} target="_blank" rel="noopener noreferrer">
          {cardContent}
        </a>
      );
    }

    return cardContent;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted/20 rounded w-96 mx-auto"></div>
              <div className="h-4 bg-muted/20 rounded w-64 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Social Media <span className="text-transparent bg-gradient-primary bg-clip-text">Content</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground font-mono max-w-2xl mx-auto px-4">
            <span className="text-primary">//</span> Sharing cybersecurity insights across platforms
          </p>
        </div>

        {/* Platform Filter Tabs */}
        <div className="flex justify-center mb-8 px-4">
          <div className="flex flex-col sm:flex-row bg-muted/20 rounded-lg p-1 w-full sm:w-auto">
            <Button
              variant={activeSection === 'all' ? 'default' : 'ghost'}
              onClick={() => setActiveSection('all')}
              className="px-4 sm:px-6 mb-1 sm:mb-0"
            >
              All Posts
            </Button>
            <Button
              variant={activeSection === 'linkedin' ? 'default' : 'ghost'}
              onClick={() => setActiveSection('linkedin')}
              className="px-4 sm:px-6 mb-1 sm:mb-0"
            >
              <Linkedin className="w-4 h-4 mr-2" />
              LinkedIn
            </Button>
            <Button
              variant={activeSection === 'youtube' ? 'default' : 'ghost'}
              onClick={() => setActiveSection('youtube')}
              className="px-4 sm:px-6"
            >
              <Youtube className="w-4 h-4 mr-2" />
              YouTube
            </Button>
          </div>
        </div>

        {/* All Posts Section */}
        {activeSection === 'all' && (
          <div className="space-y-12">
            {/* LinkedIn Section */}
            {linkedInPosts.length > 0 && (
              <section>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                  <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
                    <Linkedin className="text-blue-600" />
                    LinkedIn Posts
                  </h2>
                  <Select value={linkedInSort} onValueChange={(value: 'newest' | 'oldest' | 'popular') => setLinkedInSort(value)}>
                    <SelectTrigger className="w-full sm:w-48">
                      <div className="flex items-center gap-2">
                        {getSortIcon(linkedInSort)}
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Newest First
                        </div>
                      </SelectItem>
                      <SelectItem value="oldest">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Oldest First
                        </div>
                      </SelectItem>
                      <SelectItem value="popular">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Most Popular
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {linkedInPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            )}

            {/* YouTube Section */}
            {youtubePosts.length > 0 && (
              <section>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                  <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
                    <Youtube className="text-red-600" />
                    YouTube Videos
                  </h2>
                  <Select value={youtubeSort} onValueChange={(value: 'newest' | 'oldest' | 'popular') => setYoutubeSort(value)}>
                    <SelectTrigger className="w-full sm:w-48">
                      <div className="flex items-center gap-2">
                        {getSortIcon(youtubeSort)}
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Newest First
                        </div>
                      </SelectItem>
                      <SelectItem value="oldest">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Oldest First
                        </div>
                      </SelectItem>
                      <SelectItem value="popular">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Most Popular
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {youtubePosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            )}

            {/* No Posts Message */}
            {linkedInPosts.length === 0 && youtubePosts.length === 0 && (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold mb-2">No social media posts found</h3>
                <p className="text-muted-foreground">Check back later for new content!</p>
              </div>
            )}
          </div>
        )}

        {/* LinkedIn Only Section */}
        {activeSection === 'linkedin' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
                <Linkedin className="text-blue-600" />
                LinkedIn Posts ({linkedInPosts.length})
              </h2>
              <Select value={linkedInSort} onValueChange={(value: 'newest' | 'oldest' | 'popular') => setLinkedInSort(value)}>
                <SelectTrigger className="w-full sm:w-48">
                  <div className="flex items-center gap-2">
                    {getSortIcon(linkedInSort)}
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Newest First
                    </div>
                  </SelectItem>
                  <SelectItem value="oldest">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Oldest First
                    </div>
                  </SelectItem>
                  <SelectItem value="popular">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Most Popular
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {linkedInPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            {linkedInPosts.length === 0 && (
              <div className="text-center py-16">
                <Linkedin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No LinkedIn posts found</h3>
                <p className="text-muted-foreground">Check back later for new LinkedIn content!</p>
              </div>
            )}
          </div>
        )}

        {/* YouTube Only Section */}
        {activeSection === 'youtube' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
                <Youtube className="text-red-600" />
                YouTube Videos ({youtubePosts.length})
              </h2>
              <Select value={youtubeSort} onValueChange={(value: 'newest' | 'oldest' | 'popular') => setYoutubeSort(value)}>
                <SelectTrigger className="w-full sm:w-48">
                  <div className="flex items-center gap-2">
                    {getSortIcon(youtubeSort)}
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Newest First
                    </div>
                  </SelectItem>
                  <SelectItem value="oldest">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Oldest First
                    </div>
                  </SelectItem>
                  <SelectItem value="popular">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Most Popular
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {youtubePosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            {youtubePosts.length === 0 && (
              <div className="text-center py-16">
                <Youtube className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No YouTube videos found</h3>
                <p className="text-muted-foreground">Check back later for new YouTube content!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialMediaPage;