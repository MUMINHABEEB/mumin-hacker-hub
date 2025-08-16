import { Card } from '@/components/ui/card';
import { Shield, Cloud, Search, Code2, Terminal, Lock, Globe, Zap } from 'lucide-react';

const Skills = () => {
  const skills = [
    {
      icon: <Shield className="text-primary" size={32} />,
      title: 'Penetration Testing',
      description: 'Ethical hacking and vulnerability assessment techniques to identify and exploit security weaknesses in systems.',
      tags: ['Web App Testing', 'Network Security', 'OWASP', 'Vulnerability Assessment'],
      color: 'primary'
    },
    {
      icon: <Cloud className="text-secondary" size={32} />,
      title: 'Cloud Security',
      description: 'Securing cloud infrastructure and implementing best practices for cloud-based applications and services.',
      tags: ['AWS Security', 'Cloud Architecture', 'Identity Management', 'Compliance'],
      color: 'secondary'
    },
    {
      icon: <Search className="text-accent" size={32} />,
      title: 'SOC Operations',
      description: 'Security Operations Center practices including incident response, threat detection, and security monitoring.',
      tags: ['Threat Hunting', 'Incident Response', 'SIEM', 'Security Monitoring'],
      color: 'accent'
    },
    {
      icon: <Code2 className="text-primary" size={32} />,
      title: 'Python Development',
      description: 'Building security tools, automation scripts, and cybersecurity applications using Python programming.',
      tags: ['Security Automation', 'Scripting', 'Tool Development', 'API Integration'],
      color: 'primary'
    }
  ];

  const techStack = [
    { name: 'Python', level: 75, color: 'primary' },
    { name: 'Linux', level: 70, color: 'secondary' },
    { name: 'Networking', level: 65, color: 'accent' },
    { name: 'Web Security', level: 60, color: 'primary' },
    { name: 'Cloud Platforms', level: 55, color: 'secondary' },
    { name: 'SIEM Tools', level: 50, color: 'accent' }
  ];

  const certifications = [
    { name: 'Currently Pursuing BCA', status: 'In Progress', icon: <Terminal /> },
    { name: 'Cybersecurity Fundamentals', status: 'Learning', icon: <Lock /> },
    { name: 'Cloud Security Basics', status: 'Planned', icon: <Globe /> },
    { name: 'Ethical Hacking', status: 'Planned', icon: <Zap /> }
  ];

  return (
    <section id="skills" className="py-16 sm:py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-cyber mb-4">
            Technical <span className="text-transparent bg-gradient-primary bg-clip-text">Skills</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground font-mono max-w-2xl mx-auto">
            <span className="text-primary">//</span> Building expertise in cybersecurity and technology
          </p>
        </div>

        {/* Core Skills */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 mb-12 sm:mb-16">
          {skills.map((skill, index) => (
            <Card 
              key={index} 
              className={`p-6 sm:p-8 bg-card/50 backdrop-blur-sm border-${skill.color}/20 hover:border-${skill.color}/40 transition-all duration-300 hover-lift animate-slide-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className={`p-2 sm:p-3 bg-${skill.color}/10 rounded-lg flex-shrink-0`}>
                  {skill.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold font-cyber mb-2">{skill.title}</h3>
                  <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                    {skill.description}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {skill.tags.map((tag, tagIndex) => (
                  <span 
                    key={tagIndex}
                    className={`px-2 sm:px-3 py-1 text-xs font-mono bg-${skill.color}/10 text-${skill.color} rounded-full border border-${skill.color}/20`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Technical Proficiency */}
          <div className="animate-slide-up">
            <h3 className="text-xl sm:text-2xl font-bold font-cyber mb-6 sm:mb-8">
              <span className="text-secondary">$</span> Technical Proficiency
            </h3>
            <div className="space-y-4 sm:space-y-6">
              {techStack.map((tech, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-foreground text-sm sm:text-base">{tech.name}</span>
                    <span className={`font-mono text-xs sm:text-sm text-${tech.color}`}>{tech.level}%</span>
                  </div>
                  <div className="w-full bg-cyber-gray rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r from-${tech.color} to-${tech.color}/70 transition-all duration-1000 ease-out`}
                      style={{ width: `${tech.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Path */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl sm:text-2xl font-bold font-cyber mb-6 sm:mb-8">
              <span className="text-accent">$</span> Learning Path
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {certifications.map((cert, index) => (
                <Card key={index} className="p-3 sm:p-4 bg-card/30 backdrop-blur-sm border-border/50 hover:border-accent/30 transition-all duration-300">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="text-accent flex-shrink-0">{cert.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-mono font-semibold text-sm sm:text-base truncate">{cert.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full font-mono inline-block mt-1 ${
                        cert.status === 'In Progress' ? 'bg-primary/10 text-primary' :
                        cert.status === 'Learning' ? 'bg-secondary/10 text-secondary' :
                        'bg-muted/20 text-muted-foreground'
                      }`}>
                        {cert.status}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 sm:mt-16">
          <Card className="p-6 sm:p-8 bg-gradient-glow border-primary/20 max-w-2xl mx-auto animate-slide-up">
            <h3 className="text-xl sm:text-2xl font-bold font-cyber mb-4">Continuous Learning</h3>
            <p className="text-muted-foreground font-mono mb-4 sm:mb-6 text-sm sm:text-base">
              "In cybersecurity, learning never stops. Every day brings new challenges, 
              new threats, and new opportunities to grow."
            </p>
            <div className="flex justify-center">
              <div className="px-3 sm:px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
                <span className="font-mono text-primary text-xs sm:text-sm">
                  <span className="animate-blink">|</span> Currently studying...
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Skills;