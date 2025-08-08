import { Card } from '@/components/ui/card';
import { GraduationCap, Calendar, Target, Lightbulb } from 'lucide-react';

const About = () => {
  const timeline = [
    {
      year: '2025',
      title: 'CBSE Grade 12',
      description: 'Successfully completed secondary education, laying the foundation for higher studies.',
      icon: <GraduationCap className="text-primary" size={20} />
    },
    {
      year: '2025 - Present',
      title: 'BCA in Cloud and Security',
      description: 'Currently pursuing Bachelor of Computer Applications specializing in Cloud and Security at Amity University.',
      icon: <GraduationCap className="text-secondary" size={20} />
    }
  ];

  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-cyber mb-4">
            About <span className="text-transparent bg-gradient-primary bg-clip-text">Me</span>
          </h2>
          <p className="text-xl text-muted-foreground font-mono max-w-2xl mx-auto">
            <span className="text-primary">//</span> Driven by curiosity and passion for cybersecurity
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Bio Section */}
          <div className="space-y-8 animate-slide-up">
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 hover-lift">
              <div className="flex items-center gap-3 mb-6">
                <Target className="text-primary" size={24} />
                <h3 className="text-2xl font-bold font-cyber">My Journey</h3>
              </div>
              <div className="space-y-4 text-muted-foreground font-mono leading-relaxed">
                <p>
                  My fascination with technology began early, but it was the world of cybersecurity 
                  that truly captured my imagination. The constant evolution of threats and the 
                  intellectual challenge of staying one step ahead drives my passion every day.
                </p>
                <p>
                  Currently balancing my role as an Accountant at Ramidos Global Logistics with 
                  my studies in Cloud and Security, I'm preparing for a full transition into 
                  the cybersecurity field where my true passion lies.
                </p>
                <p>
                  When I'm not diving into the latest security research or working on projects, 
                  you'll find me experimenting with Python scripts, exploring cloud security 
                  configurations, or studying the latest penetration testing techniques.
                </p>
              </div>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur-sm border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover-lift">
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="text-secondary" size={24} />
                <h3 className="text-2xl font-bold font-cyber">Motivation</h3>
              </div>
              <p className="text-muted-foreground font-mono leading-relaxed">
                Inspired by a deep interest in technology and a strong desire to contribute to 
                digital security, I believe that cybersecurity is not just about protecting 
                systems—it's about protecting people's digital lives and enabling innovation 
                through trust.
              </p>
            </Card>
          </div>

          {/* Education Timeline */}
          <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-2xl font-bold font-cyber mb-8">
              <span className="text-primary">$</span> Education Timeline
            </h3>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent"></div>
              
              {timeline.map((item, index) => (
                <div key={index} className="relative pl-16 pb-12">
                  {/* Timeline dot */}
                  <div className="absolute left-4 w-4 h-4 bg-gradient-primary rounded-full border-4 border-background"></div>
                  
                  <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 hover-lift">
                    <div className="flex items-center gap-3 mb-3">
                      {item.icon}
                      <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                        {item.year}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold mb-2 font-cyber">{item.title}</h4>
                    <p className="text-muted-foreground font-mono leading-relaxed">
                      {item.description}
                    </p>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <Card className="p-6 text-center bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 hover-lift animate-slide-up">
            <div className="text-3xl font-bold text-primary font-cyber mb-2">2025</div>
            <div className="text-muted-foreground font-mono">Started BCA Journey</div>
          </Card>
          
          <Card className="p-6 text-center bg-card/50 backdrop-blur-sm border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover-lift animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="text-3xl font-bold text-secondary font-cyber mb-2">6+</div>
            <div className="text-muted-foreground font-mono">Months Work Experience</div>
          </Card>
          
          <Card className="p-6 text-center bg-card/50 backdrop-blur-sm border-accent/20 hover:border-accent/40 transition-all duration-300 hover-lift animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-3xl font-bold text-accent font-cyber mb-2">∞</div>
            <div className="text-muted-foreground font-mono">Learning & Growing</div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default About;