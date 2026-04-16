import matter from "gray-matter";

export interface Project {
  title: string;
  slug: string;
  order: number;
  status: 'Featured' | 'Completed' | 'In Progress' | 'Planning' | 'Concept' | 'Research';
  type: string;
  description: string;
  longDescription?: string;
  image?: string;
  githubUrl?: string;
  liveUrl?: string;
  technologies: string[];
  features?: string[];
  featured: boolean;
  date: string;
  content?: string;
  filename?: string;
  sha?: string; // GitHub file SHA for updates
}

// GitHub repository configuration
const GITHUB_OWNER = 'MUMINHABEEB';
const GITHUB_REPO = 'mumin-hacker-hub';
const PROJECTS_PATH = 'src/projects';

// Cache for projects
let cached: Project[] | null = null;
let lastFetch: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Parse markdown content with frontmatter
const parseMarkdown = (content: string, filename: string, sha?: string): Project => {
  const { data: frontmatter, content: markdownContent } = matter(content);
  
  const slug = filename.replace('.md', '');
  
  return {
    title: frontmatter.title || slug,
    slug,
    order: frontmatter.order || 0,
    status: frontmatter.status || 'Planning',
    type: frontmatter.type || 'Project',
    description: frontmatter.description || '',
    longDescription: frontmatter.longDescription,
    image: frontmatter.image,
    githubUrl: frontmatter.githubUrl,
    liveUrl: frontmatter.liveUrl,
    technologies: frontmatter.technologies || [],
    features: frontmatter.features || [],
    featured: frontmatter.featured || false,
    date: frontmatter.date || new Date().toISOString(),
    content: markdownContent,
    filename,
    sha
  };
};

// Fetch projects from GitHub
const fetchProjectsFromGitHub = async (): Promise<Project[]> => {
  try {
    // In development, try to load from local files first
    if (import.meta.env.DEV) {
      try {
        const localProjects = await loadLocalProjects();
        if (localProjects.length > 0) {
          console.log('Loaded projects from local files:', localProjects);
          return localProjects;
        }
      } catch (localError) {
        console.log('Local files not available, trying GitHub API...');
      }
    }

    const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${PROJECTS_PATH}`);
    
    if (!response.ok) {
      console.warn('Projects folder not found in GitHub, using static data');
      return getStaticProjects();
    }

    const files = await response.json();
    const markdownFiles = Array.isArray(files) ? files.filter((file: any) => file.name.endsWith('.md')) : [];

    const projects = await Promise.all(
      markdownFiles.map(async (file: any) => {
        const contentResponse = await fetch(file.download_url);
        const content = await contentResponse.text();
        return parseMarkdown(content, file.name, file.sha);
      })
    );

    return projects.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Error fetching projects from GitHub:', error);
    return getStaticProjects();
  }
};

// Load projects from local files (development)
const loadLocalProjects = async (): Promise<Project[]> => {
  const projects: Project[] = [];
  
  // Try to load the phishing detector project
  try {
    const response = await fetch('/src/projects/phishing-detector.md');
    if (response.ok) {
      const content = await response.text();
      projects.push(parseMarkdown(content, 'phishing-detector.md'));
    }
  } catch (error) {
    console.log('Could not load phishing-detector.md');
  }

  // Try to load other projects
  const projectFiles = ['blockchain-voting.md', 'iot-security-scanner.md'];
  for (const file of projectFiles) {
    try {
      const response = await fetch(`/src/projects/${file}`);
      if (response.ok) {
        const content = await response.text();
        projects.push(parseMarkdown(content, file));
      }
    } catch (error) {
      console.log(`Could not load ${file}`);
    }
  }

  return projects.sort((a, b) => a.order - b.order);
};

// Clear projects cache
export const clearProjectsCache = () => {
  cached = null;
  lastFetch = 0;
};

// Get all projects with caching
export const getAllProjects = async (): Promise<Project[]> => {
  const now = Date.now();
  
  // In development, always refresh to see changes
  if (import.meta.env.DEV || !cached || (now - lastFetch) > CACHE_DURATION) {
    console.log('Loading fresh projects data...');
    const projects = await fetchProjectsFromGitHub();
    cached = projects;
    lastFetch = now;
    console.log('Loaded projects:', projects);
    return projects;
  }
  
  return cached;
};

// Get featured project
export const getFeaturedProject = async (): Promise<Project | null> => {
  const projects = await getAllProjects();
  return projects.find(project => project.featured) || null;
};

// Get regular (non-featured) projects
export const getRegularProjects = async (): Promise<Project[]> => {
  const projects = await getAllProjects();
  return projects.filter(project => !project.featured);
};

// Get project by slug
export const getProjectBySlug = async (slug: string): Promise<Project | null> => {
  const projects = await getAllProjects();
  return projects.find(project => project.slug === slug) || null;
};

// Static fallback data
const getStaticProjects = (): Project[] => [
  {
    title: 'Advanced Phishing Detector',
    slug: 'phishing-detector',
    order: 1,
    status: 'Featured',
    type: 'Cybersecurity Tool',
    description: 'AI-powered tool that analyzes emails and websites to detect phishing attempts using machine learning algorithms and real-time threat intelligence.',
    longDescription: 'This project combines multiple detection techniques including URL analysis, content examination, and behavioral patterns to identify potential phishing attempts. Built with Python, it features real-time scanning capabilities and detailed reporting.',
    image: 'https://image2url.com/images/1758367446422-a17c57f8-9f4c-40d3-b977-f04057939dc7.png',
    githubUrl: 'https://github.com/mumin-hacker/phishing-detector',
    liveUrl: 'https://phishing-detector-demo.netlify.app',
    technologies: ['Python', 'TensorFlow', 'React', 'Flask', 'NLP'],
    features: [
      'Real-time URL analysis',
      'Pattern recognition algorithms', 
      'Detailed threat reporting',
      'Command-line interface',
      'Extensible detection modules'
    ],
    featured: true,
    date: '2024-01-15T00:00:00.000Z'
  },
  {
    title: 'Vulnerability Scanner',
    slug: 'vulnerability-scanner',
    order: 2,
    status: 'Planning',
    type: 'Network Security Tool',
    description: 'Network vulnerability assessment tool for identifying security weaknesses.',
    technologies: ['Python', 'Nmap', 'Network Security'],
    features: [
      'Port scanning capabilities',
      'Service detection',
      'Vulnerability database integration',
      'Automated reporting'
    ],
    featured: false,
    date: '2024-03-01T00:00:00.000Z'
  },
  {
    title: 'SOC Dashboard',
    slug: 'soc-dashboard',
    order: 3,
    status: 'Concept',
    type: 'Security Operations',
    description: 'Real-time security monitoring dashboard for incident tracking.',
    technologies: ['Python', 'React', 'Security APIs'],
    features: [
      'Real-time monitoring',
      'Incident tracking',
      'Alert management',
      'Performance metrics'
    ],
    featured: false,
    date: '2024-04-01T00:00:00.000Z'
  },
  {
    title: 'Cloud Security Toolkit',
    slug: 'cloud-security-toolkit',
    order: 4,
    status: 'Research',
    type: 'Cloud Security',
    description: 'Automated security assessment tools for cloud environments.',
    technologies: ['Python', 'AWS SDK', 'Cloud Security'],
    features: [
      'Cloud asset discovery',
      'Security policy assessment',
      'Compliance checking',
      'Risk scoring'
    ],
    featured: false,
    date: '2024-05-01T00:00:00.000Z'
  }
];