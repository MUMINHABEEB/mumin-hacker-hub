import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Github, Shield, Code, AlertTriangle, ExternalLink, Calendar, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiHelpers } from '@/lib/api';

// Supabase Project interface
interface Project {
  id: string;
  title: string;
  slug?: string;
  description: string;
  long_description?: string;
  technologies: string[];
  features?: string[];
  github_url?: string;
  demo_url?: string;
  image_url?: string;
  status?: string;
  project_type?: string;
  category?: string;
  display_order?: number;
  featured: boolean;
  project_date?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

// Fallback projects data
const fallbackProjects: Project[] = [
  {
    id: '1',
    title: 'Advanced Threat Detection System',
    slug: 'threat-detection-system',
    description: 'AI-powered cybersecurity solution for real-time threat detection and response automation.',
    long_description: 'A comprehensive threat detection system using machine learning algorithms to identify and respond to security threats in real-time.',
    technologies: ['Python', 'TensorFlow', 'Docker', 'Elasticsearch', 'Kibana'],
    features: ['Real-time monitoring', 'AI threat detection', 'Automated response', 'Custom dashboards'],
    github_url: 'https://github.com/MUMINHABEEB/threat-detection',
    demo_url: 'https://threat-demo.muminhabeeb.info',
    image_url: '/placeholder.svg',
    status: 'Featured',
    project_type: 'Security Tool',
    category: 'cybersecurity',
    display_order: 1,
    featured: true,
    project_date: '2024-09-15',
    published: true,
    created_at: '2024-09-15T00:00:00Z',
    updated_at: '2024-09-15T00:00:00Z'
  },
  {
    id: '2',
    title: 'Vulnerability Assessment Framework',
    slug: 'vulnerability-assessment',
    description: 'Automated vulnerability scanning and assessment framework for web applications.',
    technologies: ['Node.js', 'React', 'PostgreSQL', 'Nmap', 'OWASP ZAP'],
    github_url: 'https://github.com/MUMINHABEEB/vuln-scanner',
    image_url: '/placeholder.svg',
    status: 'Completed',
    category: 'security',
    display_order: 2,
    featured: false,
    published: true,
    created_at: '2024-08-15T00:00:00Z',
    updated_at: '2024-08-15T00:00:00Z'
  },
  {
    id: '3',
    title: 'SOC Dashboard',
    slug: 'soc-dashboard',
    description: 'Real-time security operations center dashboard for monitoring and incident management.',
    technologies: ['React', 'TypeScript', 'D3.js', 'WebSocket', 'Redis'],
    github_url: 'https://github.com/MUMINHABEEB/soc-dashboard',
    demo_url: 'https://soc-demo.muminhabeeb.info',
    image_url: '/placeholder.svg',
    status: 'In Progress',
    category: 'dashboard',
    display_order: 3,
    featured: false,
    published: true,
    created_at: '2024-07-15T00:00:00Z',
    updated_at: '2024-09-15T00:00:00Z'
  }
];

const Projects = () => {
  const [featuredProject, setFeaturedProject] = useState<Project | null>(null);
  const [regularProjects, setRegularProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        // Fetch all published projects
        const projects = await apiHelpers.getPublishedProjects();

        if (projects && projects.length > 0) {
          // Find featured project
          const featured = projects.find(project => project.featured);
          setFeaturedProject(featured || null);
          
          // Set regular projects (non-featured)
          const regular = projects.filter(project => !project.featured);
          setRegularProjects(regular);
        } else {
          // Use fallback data if no projects found
          throw new Error('No projects found in database');
        }
      } catch (error) {
        console.error('Failed to load projects from Supabase, using fallback data:', error);
        
        // Use fallback data
        setUsingFallback(true);
        const featured = fallbackProjects.find(project => project.featured);
        setFeaturedProject(featured || null);
        
        const regular = fallbackProjects.filter(project => !project.featured);
        setRegularProjects(regular);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Featured':
      case 'Completed':
      case 'completed':
        return <Shield className="text-primary" size={24} />;
      case 'In Progress':
      case 'in-progress':
        return <Code className="text-secondary" size={24} />;
      case 'Planning':
      case 'Concept':
      case 'Research':
      case 'planning':
        return <AlertTriangle className="text-accent" size={24} />;
      default:
        return <Code className="text-muted-foreground" size={24} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Featured':
      case 'Completed':
      case 'completed':
        return 'bg-primary/10 text-primary';
      case 'In Progress':
      case 'in-progress':
        return 'bg-secondary/10 text-secondary';
      case 'Planning':
      case 'planning':
        return 'bg-blue-500/10 text-blue-400';
      case 'Concept':
        return 'bg-purple-500/10 text-purple-400';
      case 'Research':
        return 'bg-orange-500/10 text-orange-400';
      default:
        return 'bg-muted/20 text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <section id="projects" className="py-16 sm:py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted/20 rounded w-64 mx-auto"></div>
              <div className="h-4 bg-muted/20 rounded w-96 mx-auto"></div>
            </div>
            <div className="mt-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading projects from Supabase...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-16 sm:py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-cyber mb-4">
            Featured <span className="text-transparent bg-gradient-primary bg-clip-text">Projects</span>
          </h1>
          <p className="text-xl text-muted-foreground font-mono max-w-2xl mx-auto">
            <span className="text-primary">//</span> Building tools to make the digital world safer
          </p>
          
          {usingFallback && (
            <div className="mt-4 p-3 bg-secondary/10 border border-secondary/30 rounded-lg max-w-md mx-auto">
              <p className="text-sm text-secondary font-mono">
                <span className="text-secondary">[INFO]:</span> Displaying demo projects (Supabase connection unavailable)
              </p>
            </div>
          )}
        </div>

        {/* Featured Project */}
        {featuredProject && (
          <div className="mb-12 sm:mb-16 animate-slide-up">
            <Card 
              className="p-6 sm:p-8 md:p-12 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-primary/30 hover:border-primary/50 transition-all duration-500 hover-lift"
              data-project="featured"
              data-title={featuredProject.title}
              data-status={featuredProject.status}
              data-featured="true"
            >
              <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
                {/* Project Image */}
                {featuredProject.image_url && (
                  <div className="w-full mb-6 bg-muted/10 rounded-lg border border-primary/20">
                    <img 
                      src={featuredProject.image_url} 
                      alt={featuredProject.title}
                      className="w-full h-48 sm:h-64 md:h-80 object-contain rounded-lg"
                    />
                  </div>
                )}
                
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-3">
                      <Shield className="text-primary glow-green" size={24} />
                      <span className="px-2 sm:px-3 py-1 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-mono">
                        {featuredProject.project_type || featuredProject.category || 'Project'}
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-cyber text-transparent bg-gradient-primary bg-clip-text project-title" data-title={featuredProject.title}>
                      {featuredProject.title}
                    </h3>
                    <p className="text-base sm:text-lg text-muted-foreground font-mono leading-relaxed project-description">
                      {featuredProject.description}
                    </p>
                  </div>

                  {featuredProject.long_description && (
                    <p className="text-sm sm:text-base text-muted-foreground font-mono leading-relaxed">
                      {featuredProject.long_description}
                    </p>
                  )}

                  {featuredProject.features && featuredProject.features.length > 0 && (
                    <div className="space-y-3 sm:space-y-4">
                      <h4 className="font-cyber text-base sm:text-lg">Key Features:</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {featuredProject.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-primary rounded-full flex-shrink-0"></div>
                            <span className="text-xs sm:text-sm font-mono text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {featuredProject.technologies.map((tech, index) => (
                      <span 
                        key={index}
                        className="px-2 sm:px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs sm:text-sm font-mono border border-secondary/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    {featuredProject.github_url && (
                      <Button asChild variant="outline" className="flex-1">
                        <a 
                          href={featuredProject.github_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2"
                        >
                          <Github size={18} />
                          View Code
                        </a>
                      </Button>
                    )}
                    {featuredProject.demo_url && (
                      <Button asChild className="flex-1">
                        <a 
                          href={featuredProject.demo_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2"
                        >
                          {featuredProject.demo_url.includes('youtube.com') || featuredProject.demo_url.includes('youtu.be') ? (
                            <>
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                              </svg>
                              Watch Demo
                            </>
                          ) : (
                            <>
                              <ExternalLink size={18} />
                              Live Demo
                            </>
                          )}
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Regular Projects Grid */}
        {regularProjects.length > 0 && (
          <div className="space-y-8">
            <h3 className="text-2xl sm:text-3xl font-bold font-cyber text-center">
              Other <span className="text-transparent bg-gradient-primary bg-clip-text">Projects</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {regularProjects.map((project, index) => (
                <Card 
                  key={project.id} 
                  className="group bg-card/60 backdrop-blur-sm border-muted/30 hover:border-primary/30 transition-all duration-300 hover-lift animate-slide-up h-full flex flex-col project-card"
                  style={{ animationDelay: `${index * 100}ms` }}
                  data-project="regular"
                  data-title={project.title}
                  data-status={project.status}
                  data-featured={project.featured ? 'true' : 'false'}
                >
                  {project.image_url && (
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="p-4 sm:p-6 flex flex-col flex-1">
                    <div className="space-y-3 sm:space-y-4 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(project.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-mono ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </div>
                        {project.project_date && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar size={12} />
                            <span>{new Date(project.project_date).getFullYear()}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-lg sm:text-xl font-bold font-cyber group-hover:text-primary transition-colors project-title" data-title={project.title}>
                          {project.title}
                        </h4>
                        <p className="text-sm text-muted-foreground font-mono leading-relaxed line-clamp-3 project-description">
                          {project.description}
                        </p>
                      </div>

                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.slice(0, 3).map((tech, techIndex) => (
                            <Badge key={techIndex} variant="secondary" className="text-xs tech-tag" data-technology={tech}>
                              {tech}
                            </Badge>
                          ))}
                          {project.technologies.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.technologies.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4">
                      {project.github_url && (
                        <Button asChild size="sm" variant="outline" className="flex-1">
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1"
                          >
                            <Github size={14} />
                            Code
                          </a>
                        </Button>
                      )}
                      {project.demo_url && (
                        <Button asChild size="sm" className="flex-1">
                          <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1"
                          >
                            {project.demo_url.includes('youtube.com') || project.demo_url.includes('youtu.be') ? (
                              <>
                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                                Video
                              </>
                            ) : (
                              <>
                                <ExternalLink size={14} />
                                Demo
                              </>
                            )}
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Projects Message */}
        {!featuredProject && regularProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="space-y-4">
              <Code size={48} className="mx-auto text-muted-foreground" />
              <h3 className="text-xl font-bold">No Projects Found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Projects will appear here once they are added via the Supabase admin dashboard.
              </p>
              <Button asChild>
                <a href="/admin" className="inline-flex items-center gap-2">
                  <Shield size={16} />
                  Go to Admin Dashboard
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;