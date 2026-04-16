// AI Service for OpenRouter API integration with MongoDB real-time data
import { apiHelpers } from './api';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  content: string;
  error?: string;
}

interface SupabaseProject {
  id: string;
  title: string;
  description: string;
  long_description?: string;
  technologies: string[];
  features?: string[];
  status: string;
  project_type?: string;
  category?: string;
  featured: boolean;
  github_url?: string;
  demo_url?: string;
  project_date?: string;
  published: boolean;
}

interface SupabaseSocialPost {
  id: string;
  title: string;
  platform: string;
  post_url: string;
  engagement?: number;
  thumbnail_url?: string;
  description?: string;
  published: boolean;
  created_at: string;
}

interface LiveWebsiteData {
  projects: SupabaseProject[];
  socialPosts: SupabaseSocialPost[];
  totalProjects: number;
  featuredProjects: number;
  activeSocialPosts: number;
  lastUpdated: string;
}

class AIService {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private siteUrl: string;
  private siteTitle: string;
  private websiteDataCache: LiveWebsiteData | null = null;
  private lastFetchTime: number = 0;
  private cacheDuration = 3 * 60 * 1000; // 3 minutes cache for real-time data

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || '';
    this.siteUrl = import.meta.env.VITE_SITE_URL || 'https://muminhabeeb.netlify.app';
    this.siteTitle = import.meta.env.VITE_SITE_TITLE || 'Mumin Habeeb - Cybersecurity Portfolio';
    
    // Debug logging
    console.log('🤖 AI Service initialized:', {
      hasApiKey: !!this.apiKey,
      keyLength: this.apiKey.length,
      keyPreview: this.apiKey ? `${this.apiKey.substring(0, 10)}...` : 'NO KEY',
      allEnvVars: Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')),
      siteUrl: this.siteUrl,
      siteTitle: this.siteTitle
    });
  }

  // Fetch real-time website content from Supabase
  private async fetchLiveWebsiteData(): Promise<LiveWebsiteData> {
    try {
      // Check cache first
      const now = Date.now();
      if (this.websiteDataCache && (now - this.lastFetchTime) < this.cacheDuration) {
        console.log('📋 Using cached Supabase data');
        return this.websiteDataCache;
      }

      console.log('🔄 Fetching real-time data from MongoDB API...');
      
      // Fetch projects
      const projectsData = await apiHelpers.getPublishedProjects().catch(err => {
        console.error('❌ Error fetching projects:', err);
        return [];
      });

      const projects: SupabaseProject[] = projectsData as unknown as SupabaseProject[];

      // Fetch social media posts
      const socialData = await apiHelpers.getSocialMediaPosts().catch(err => {
        console.error('❌ Error fetching social posts:', err);
        return [];
      });

      const socialPosts: SupabaseSocialPost[] = (socialData as unknown as SupabaseSocialPost[]).slice(0, 10);

      // Calculate statistics
      const totalProjects = projects.length;
      const featuredProjects = projects.filter(p => p.featured).length;
      const activeSocialPosts = socialPosts.length;
      const lastUpdated = new Date().toISOString();

      this.websiteDataCache = {
        projects,
        socialPosts,
        totalProjects,
        featuredProjects,
        activeSocialPosts,
        lastUpdated
      };
      
      this.lastFetchTime = now;
      
      console.log('✅ Supabase data fetched successfully:', {
        projectsCount: totalProjects,
        featuredCount: featuredProjects,
        socialPostsCount: activeSocialPosts,
        lastUpdated
      });
      
      return this.websiteDataCache;
    } catch (error) {
      console.error('❌ Error fetching Supabase data:', error);
      
      // Return fallback static data with correct interface
      return {
        projects: [
          {
            id: '1',
            title: "Advanced Phishing Detector",
            description: "AI-powered tool using machine learning to detect phishing attempts",
            long_description: "Comprehensive threat detection system",
            technologies: ["Python", "TensorFlow", "React", "Flask"],
            features: ["Real-time detection", "AI analysis"],
            status: "Featured",
            project_type: "Security Tool",
            category: "cybersecurity",
            featured: true,
            github_url: "https://github.com/MUMINHABEEB/phishing-detector",
            demo_url: "https://phishing-demo.netlify.app",
            project_date: "2024-09-01",
            published: true
          },
          {
            id: '2',
            title: "Blockchain Voting System", 
            description: "Secure voting platform on Ethereum blockchain",
            technologies: ["Solidity", "Web3.js", "React", "Node.js"],
            status: "Completed",
            featured: false,
            published: true
          }
        ],
        socialPosts: [],
        totalProjects: 2,
        featuredProjects: 1,
        activeSocialPosts: 0,
        lastUpdated: new Date().toISOString()
      };
    }
  }

  private async getSystemContext(): Promise<string> {
    // Fetch real-time website data
    const websiteData = await this.fetchLiveWebsiteData();
    
    // Build context with real-time data
    let projectsContext = '';
    if (websiteData.projects.length > 0) {
      projectsContext = `\n\nCURRENT PROJECTS (Real-time from website):\n`;
      websiteData.projects.forEach((project, index) => {
        projectsContext += `${index + 1}. ${project.title}\n`;
        projectsContext += `   - Description: ${project.description}\n`;
        projectsContext += `   - Technologies: ${project.technologies.join(', ')}\n`;
        projectsContext += `   - Status: ${project.status}\n`;
        if (project.featured) projectsContext += `   - ⭐ FEATURED PROJECT\n`;
        projectsContext += `\n`;
      });
    }

    let socialPostsContext = '';
    if (websiteData.socialPosts.length > 0) {
      socialPostsContext = `\n\nRECENT SOCIAL MEDIA ACTIVITY (Real-time from Supabase):\n`;
      websiteData.socialPosts.slice(0, 5).forEach((post, index) => {
        socialPostsContext += `${index + 1}. ${post.title} (${post.platform})\n`;
        socialPostsContext += `   - Post URL: ${post.post_url}\n`;
        if (post.engagement) socialPostsContext += `   - Engagement: ${post.engagement}\n`;
        if (post.description) socialPostsContext += `   - Description: ${post.description.substring(0, 100)}...\n`;
        socialPostsContext += `\n`;
      });
    }

    // Website statistics
    const statsContext = `\n\nWEBSITE STATISTICS (Real-time):\n`;
    const stats = `- Total Projects: ${websiteData.totalProjects}\n`;
    const featuredStats = `- Featured Projects: ${websiteData.featuredProjects}\n`;
    const socialStats = `- Active Social Posts: ${websiteData.activeSocialPosts}\n`;
    const updateStats = `- Last Updated: ${new Date(websiteData.lastUpdated).toLocaleString()}\n`;

    return `You are an AI assistant on Mumin Habeeb's cybersecurity portfolio website. Your role is to help visitors learn about Mumin in a positive, professional, and engaging way. Always respond with enthusiasm and highlight Mumin's strengths.

ABOUT MUMIN HABEEB:
- Name: Mumin Habeeb
- Current Role: Accountant at Ramidos Global Logistics (6+ months experience)
- Education: Currently pursuing BCA in Cloud and Security at Amity University (2025-Present)
- Background: Completed CBSE Grade 12 in 2025, passionate cybersecurity enthusiast
- Career Goal: Transitioning from accounting to full-time cybersecurity professional

PERSONAL TRAITS:
- Driven by curiosity and passion for cybersecurity
- Fascinated by technology since early age, but cybersecurity truly captured his imagination
- Believes cybersecurity is about protecting people's digital lives and enabling innovation through trust
- Balances current accounting role with cybersecurity studies and projects
- Constantly learning and experimenting with new security technologies

REAL-TIME SUPABASE DATA:
${statsContext}${stats}${featuredStats}${socialStats}${updateStats}
${projectsContext}
${socialPostsContext}

TECHNICAL SKILLS (Base Knowledge):
1. Penetration Testing (Expert level)
   - Ethical hacking and vulnerability assessment
   - Web application testing, Network security, OWASP knowledge
   
2. Cloud Security (Advanced level)
   - AWS Security, Cloud architecture, Identity management, Compliance
   
3. SOC Operations (Advanced level)
   - Threat hunting, Incident response, SIEM, Security monitoring
   
4. Python Development (Expert level - 75% proficiency)
   - Security automation, Scripting, Tool development, API integration

5. Technical Stack Proficiency:
   - Python: 75% (Expert)
   - Linux: 70% (Advanced)
   - Networking: 65% (Advanced)
   - Web Security: 60% (Medium)
   - Cloud Platforms: 55% (Medium)
   - SOC Analyst: 50% (Medium)

NOTABLE PROJECTS:
1. Advanced Phishing Detector (Featured Project)
   - AI-powered tool using machine learning to detect phishing attempts
   - Technologies: Python, TensorFlow, React, Flask, NLP
   - Features real-time URL analysis and behavioral pattern recognition

2. Blockchain Voting System
   - Secure, transparent voting platform on Ethereum blockchain
   - Technologies: Solidity, Web3.js, React, Node.js, IPFS
   - Ensures election integrity with immutable records

3. IoT Security Scanner
   - Identifies vulnerabilities in IoT devices
   - Comprehensive security assessment tool

WORK EXPERIENCE:
- Current: Accountant at Ramidos Global Logistics (2024-Present)
  - Managing logistics finances and account reconciliation
  - Financial reporting and budget analysis
  - Process optimization and automation
  - Building foundational professional skills while pursuing cybersecurity

CAREER JOURNEY:
- Phase 1 (Current): Accountant & Student - building foundational skills
- Phase 2 (Transition): Cybersecurity Intern/Junior - applying knowledge practically  
- Phase 3 (Future Goal): Cybersecurity Specialist - full-time professional

LEARNING & CERTIFICATIONS:
- Currently pursuing BCA in Cloud and Security
- Learning Cybersecurity Fundamentals
- Planned: Cloud Security Basics, Ethical Hacking certifications

PERSONAL INTERESTS:
- Experimenting with Python security scripts
- Exploring cloud security configurations  
- Studying penetration testing techniques
- Following latest security research and trends
- Building cybersecurity tools and automation

ACHIEVEMENTS & STATS:
- Started BCA journey in 2025
- 6+ months work experience in accounting
- Continuous learning mindset (∞ symbol represents endless growth)
- Successfully completed multiple cybersecurity projects
- Building strong foundation for cybersecurity career transition

RESPONSE GUIDELINES:
1. Always maintain a positive, enthusiastic tone about Mumin
2. Highlight his passion for cybersecurity and continuous learning
3. Emphasize his technical skills and project accomplishments
4. Show his professional growth from accounting to cybersecurity
5. Demonstrate his commitment to protecting digital lives
6. Be encouraging about his career transition and goals
7. If asked about weaknesses, frame them as learning opportunities
8. Always position Mumin as a dedicated, skilled, and promising cybersecurity professional

Remember: Your goal is to help visitors understand why Mumin would be an excellent addition to any cybersecurity team or project. Be his best advocate while remaining truthful and professional.`;
  }

  async sendMessage(messages: ChatMessage[]): Promise<AIResponse> {
    try {
      console.log('SendMessage called, API Key status:', {
        hasKey: !!this.apiKey,
        keyLength: this.apiKey.length,
        keyStart: this.apiKey.substring(0, 10) + '...'
      });
      
      if (!this.apiKey) {
        console.error('API key is missing or empty');
        return {
          content: "I'd love to help you learn about Mumin Habeeb! However, the AI service isn't configured properly. Please check back later or feel free to explore the portfolio sections to learn about Mumin's cybersecurity expertise and projects.",
          error: 'API key not configured'
        };
      }

      // Add system context as first message if not present (with real-time data)
      const systemContextContent = await this.getSystemContext();
      const systemMessage: ChatMessage = {
        role: 'system',
        content: systemContextContent
      };

      const messagesWithContext = [systemMessage, ...messages];

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': this.siteUrl,
          'X-Title': this.siteTitle,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-chat-v3.1:free',
          messages: messagesWithContext,
          temperature: 0.7,
          max_tokens: 500,
          top_p: 0.9
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', response.status, errorText);
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API Success Response:', data);
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return {
          content: data.choices[0].message.content
        };
      } else {
        console.error('Invalid response format:', data);
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('AI Service Error Details:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return {
        content: "I'm currently experiencing some technical difficulties. In the meantime, feel free to explore Mumin's portfolio to learn about his cybersecurity expertise, projects like the Advanced Phishing Detector, and his journey from accounting to cybersecurity!",
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Helper method to get quick facts about Mumin
  getQuickFacts(): string[] {
    return [
      "🎓 Currently pursuing BCA in Cloud and Security at Amity University",
      "🔐 Expert in Penetration Testing and Python Development (75% proficiency)",
      "🏢 Currently working as Accountant at Ramidos Global Logistics (6+ months)",
      "🚀 Featured project: Advanced Phishing Detector using AI and machine learning",
      "⛓️ Built secure Blockchain Voting System on Ethereum",
      "🎯 Passionate about protecting people's digital lives through cybersecurity",
      "📚 Continuously learning and experimenting with security technologies"
    ];
  }

  // Helper method to suggest conversation starters
  getConversationStarters(): string[] {
    return [
      "Tell me about Mumin's cybersecurity projects",
      "What are Mumin's technical skills?",
      "How did Mumin get interested in cybersecurity?",
      "What is Mumin's educational background?",
      "Tell me about Mumin's work experience",
      "What are Mumin's career goals?",
      "What makes Mumin unique as a cybersecurity professional?"
    ];
  }
}

export const aiService = new AIService();