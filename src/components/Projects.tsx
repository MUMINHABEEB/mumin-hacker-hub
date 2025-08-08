import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Shield, Code, AlertTriangle } from 'lucide-react';

const Projects = () => {
  const featuredProject = {
    title: 'Phishing Detector',
    description: 'A Python-based cybersecurity tool designed to analyze and detect phishing websites using machine learning algorithms and URL pattern recognition.',
    longDescription: 'This project combines multiple detection techniques including URL analysis, content examination, and behavioral patterns to identify potential phishing attempts. Built with Python, it features real-time scanning capabilities and detailed reporting.',
    tech: ['Python', 'Machine Learning', 'Web Scraping', 'Pattern Recognition'],
    features: [
      'Real-time URL analysis',
      'Pattern recognition algorithms', 
      'Detailed threat reporting',
      'Command-line interface',
      'Extensible detection modules'
    ],
    status: 'Completed',
    type: 'Cybersecurity Tool'
  };

  const upcomingProjects = [
    {
      title: 'Vulnerability Scanner',
      description: 'Network vulnerability assessment tool for identifying security weaknesses.',
      tech: ['Python', 'Nmap', 'Network Security'],
      status: 'Planning',
      icon: <Shield className="text-primary" size={24} />
    },
    {
      title: 'SOC Dashboard',
      description: 'Real-time security monitoring dashboard for incident tracking.',
      tech: ['Python', 'React', 'Security APIs'],
      status: 'Concept',
      icon: <AlertTriangle className="text-secondary" size={24} />
    },
    {
      title: 'Cloud Security Toolkit',
      description: 'Automated security assessment tools for cloud environments.',
      tech: ['Python', 'AWS SDK', 'Cloud Security'],
      status: 'Research',
      icon: <Code className="text-accent" size={24} />
    }
  ];

  return (
    <section id="projects" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-cyber mb-4">
            Featured <span className="text-transparent bg-gradient-primary bg-clip-text">Projects</span>
          </h2>
          <p className="text-xl text-muted-foreground font-mono max-w-2xl mx-auto">
            <span className="text-primary">//</span> Building tools to make the digital world safer
          </p>
        </div>

        {/* Featured Project */}
        <div className="mb-16 animate-slide-up">
          <Card className="p-8 md:p-12 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-primary/30 hover:border-primary/50 transition-all duration-500 hover-lift">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Shield className="text-primary glow-green" size={32} />
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-mono">
                      {featuredProject.type}
                    </span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold font-cyber text-transparent bg-gradient-primary bg-clip-text">
                    {featuredProject.title}
                  </h3>
                  <p className="text-lg text-muted-foreground font-mono leading-relaxed">
                    {featuredProject.description}
                  </p>
                </div>

                <p className="text-muted-foreground font-mono leading-relaxed">
                  {featuredProject.longDescription}
                </p>

                <div className="space-y-4">
                  <h4 className="font-cyber text-lg">Key Features:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {featuredProject.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm font-mono text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {featuredProject.tech.map((tech, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-mono border border-secondary/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button className="bg-gradient-primary hover:glow-green transition-all duration-300 font-mono group">
                    <Github className="mr-2 group-hover:rotate-12 transition-transform duration-300" size={18} />
                    View Code
                  </Button>
                  <Button variant="outline" className="border-primary/30 hover:border-primary hover:bg-primary/10 font-mono">
                    <ExternalLink className="mr-2" size={18} />
                    Live Demo
                  </Button>
                </div>
              </div>

              <div className="relative">
                {/* Code Preview Mock */}
                <Card className="p-6 bg-cyber-dark border-border/50 font-mono text-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-destructive rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="ml-auto text-muted-foreground">phishing_detector.py</span>
                  </div>
                  <div className="space-y-2 text-muted-foreground">
                    <div><span className="text-secondary">import</span> <span className="text-accent">requests</span></div>
                    <div><span className="text-secondary">from</span> <span className="text-accent">urllib.parse</span> <span className="text-secondary">import</span> <span className="text-primary">urlparse</span></div>
                    <div className="h-4"></div>
                    <div><span className="text-secondary">def</span> <span className="text-primary">analyze_url</span><span className="text-foreground">(url):</span></div>
                    <div className="pl-4">
                      <span className="text-muted-foreground"># Analyze URL for phishing indicators</span>
                    </div>
                    <div className="pl-4">
                      <span className="text-accent">parsed_url</span> = <span className="text-primary">urlparse</span><span className="text-foreground">(url)</span>
                    </div>
                    <div className="pl-4">
                      <span className="text-secondary">return</span> <span className="text-primary">detection_score</span>
                    </div>
                    <div className="h-4"></div>
                    <div className="flex items-center">
                      <span className="text-primary animate-blink">|</span>
                      <span className="ml-2 text-accent">Scanning...</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </Card>
        </div>

        {/* Upcoming Projects */}
        <div className="space-y-8">
          <h3 className="text-2xl font-bold font-cyber text-center">
            <span className="text-accent">$</span> Upcoming Projects
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {upcomingProjects.map((project, index) => (
              <Card 
                key={index}
                className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-accent/30 transition-all duration-300 hover-lift animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    {project.icon}
                    <span className={`px-2 py-1 rounded-full text-xs font-mono ${
                      project.status === 'Planning' ? 'bg-primary/10 text-primary' :
                      project.status === 'Concept' ? 'bg-secondary/10 text-secondary' :
                      'bg-muted/20 text-muted-foreground'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-bold font-cyber mb-2">{project.title}</h4>
                    <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {project.tech.map((tech, techIndex) => (
                      <span 
                        key={techIndex}
                        className="px-2 py-1 bg-muted/20 text-muted-foreground rounded text-xs font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className="p-8 bg-gradient-glow border-primary/20 max-w-2xl mx-auto animate-slide-up">
            <h3 className="text-2xl font-bold font-cyber mb-4">Open Source Commitment</h3>
            <p className="text-muted-foreground font-mono mb-6">
              I believe in sharing knowledge and contributing to the cybersecurity community. 
              All my projects will be open-sourced to help others learn and improve digital security.
            </p>
            <Button className="bg-gradient-primary hover:glow-green transition-all duration-300 font-mono">
              <Github className="mr-2" size={18} />
              Follow on GitHub
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Projects;