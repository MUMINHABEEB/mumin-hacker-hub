import { Card } from '@/components/ui/card';
import { Building, Calendar, ArrowRight, Target, TrendingUp } from 'lucide-react';

const Experience = () => {
  const experience = {
    title: 'Accountant',
    company: 'Ramidos Global Logistics',
    duration: '6 months (Current)',
    period: '2024 - Present',
    description: 'Managing financial operations and logistics accounting while preparing for transition into cybersecurity field.',
    responsibilities: [
      'Managing logistics finances and account reconciliation',
      'Financial reporting and budget analysis',
      'Vendor management and payment processing',
      'Compliance with financial regulations',
      'Process optimization and automation'
    ],
    skills: ['Financial Analysis', 'Data Management', 'Process Optimization', 'Attention to Detail'],
    achievements: [
      'Improved financial process efficiency',
      'Maintained accurate financial records',
      'Collaborated with cross-functional teams'
    ]
  };

  const careerPath = [
    {
      phase: 'Current',
      title: 'Accountant & Student',
      description: 'Gaining professional experience while pursuing cybersecurity education',
      focus: 'Building foundational skills and financial acumen',
      status: 'active'
    },
    {
      phase: 'Transition',
      title: 'Cybersecurity Intern/Junior',
      description: 'Applying cybersecurity knowledge in real-world scenarios',
      focus: 'Hands-on experience in SOC operations and penetration testing',
      status: 'planned'
    },
    {
      phase: 'Future',
      title: 'Cybersecurity Specialist',
      description: 'Full-time cybersecurity professional',
      focus: 'Advanced threat detection and security architecture',
      status: 'goal'
    }
  ];

  return (
    <section id="experience" className="py-16 sm:py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-cyber mb-4">
            Professional <span className="text-transparent bg-gradient-primary bg-clip-text">Experience</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground font-mono max-w-2xl mx-auto">
            <span className="text-primary">//</span> Building experience while transitioning to cybersecurity
          </p>
        </div>

        {/* Current Role */}
        <div className="mb-12 sm:mb-16 animate-slide-up">
          <Card className="p-6 sm:p-8 md:p-12 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-primary/30 hover:border-primary/50 transition-all duration-500 hover-lift">
            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <Building className="text-primary flex-shrink-0" size={24} />
                    <span className="px-2 sm:px-3 py-1 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-mono">
                      Current Role
                    </span>
                    <span className="px-2 sm:px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs sm:text-sm font-mono">
                      {experience.duration}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-cyber">{experience.title}</h3>
                  <p className="text-lg sm:text-xl text-primary font-mono">{experience.company}</p>
                  <p className="text-muted-foreground font-mono flex items-center gap-2 text-sm sm:text-base">
                    <Calendar size={16} className="flex-shrink-0" />
                    {experience.period}
                  </p>
                </div>

                <p className="text-base sm:text-lg text-muted-foreground font-mono leading-relaxed">
                  {experience.description}
                </p>

                <div className="space-y-3 sm:space-y-4">
                  <h4 className="font-cyber text-base sm:text-lg">Key Responsibilities:</h4>
                  <div className="space-y-2">
                    {experience.responsibilities.map((responsibility, index) => (
                      <div key={index} className="flex items-start gap-2 sm:gap-3">
                        <ArrowRight className="text-primary mt-1 flex-shrink-0" size={14} />
                        <span className="text-muted-foreground font-mono text-xs sm:text-sm">{responsibility}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <h4 className="font-cyber text-base sm:text-lg">Skills Developed:</h4>
                  <div className="flex flex-wrap gap-2">
                    {experience.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-2 sm:px-3 py-1 bg-accent/10 text-accent rounded-full text-xs sm:text-sm font-mono border border-accent/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <Card className="p-4 sm:p-6 bg-secondary/5 border-secondary/20">
                  <h4 className="font-cyber text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                    <Target className="text-secondary flex-shrink-0" size={18} />
                    Achievements
                  </h4>
                  <div className="space-y-2 sm:space-y-3">
                    {experience.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-xs sm:text-sm font-mono text-muted-foreground">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-4 sm:p-6 bg-accent/5 border-accent/20">
                  <h4 className="font-cyber text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                    <TrendingUp className="text-accent flex-shrink-0" size={18} />
                    Transition Focus
                  </h4>
                  <p className="text-xs sm:text-sm font-mono text-muted-foreground leading-relaxed">
                    While excelling in my current role, I'm actively preparing for a career transition 
                    into cybersecurity through continuous learning and skill development.
                  </p>
                </Card>
              </div>
            </div>
          </Card>
        </div>

        {/* Career Path */}
        <div className="space-y-6 sm:space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-xl sm:text-2xl font-bold font-cyber text-center">
            <span className="text-secondary">$</span> Career Transition Roadmap
          </h3>
          
          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            {careerPath.map((phase, index) => (
              <Card 
                key={index}
                className={`p-4 sm:p-6 transition-all duration-300 hover-lift ${
                  phase.status === 'active' 
                    ? 'bg-primary/10 border-primary/30 hover:border-primary/50' 
                    : phase.status === 'planned'
                    ? 'bg-secondary/10 border-secondary/30 hover:border-secondary/50'
                    : 'bg-accent/10 border-accent/30 hover:border-accent/50'
                }`}
              >
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-mono font-bold ${
                      phase.status === 'active' 
                        ? 'bg-primary text-primary-foreground' 
                        : phase.status === 'planned'
                        ? 'bg-secondary text-secondary-foreground'
                        : 'bg-accent text-accent-foreground'
                    }`}>
                      {phase.phase}
                    </span>
                    {phase.status === 'active' && (
                      <div className="w-2 sm:w-3 h-2 sm:h-3 bg-primary rounded-full animate-pulse"></div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-base sm:text-lg font-bold font-cyber mb-2">{phase.title}</h4>
                    <p className="text-muted-foreground font-mono text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3">
                      {phase.description}
                    </p>
                    <p className={`text-xs sm:text-sm font-mono font-semibold ${
                      phase.status === 'active' ? 'text-primary' :
                      phase.status === 'planned' ? 'text-secondary' : 'text-accent'
                    }`}>
                      Focus: {phase.focus}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 sm:mt-16">
          <Card className="p-6 sm:p-8 bg-gradient-glow border-primary/20 max-w-2xl mx-auto animate-slide-up">
            <h3 className="text-xl sm:text-2xl font-bold font-cyber mb-4">Ready for New Challenges</h3>
            <p className="text-muted-foreground font-mono mb-4 sm:mb-6 text-sm sm:text-base">
              I'm actively seeking opportunities to apply my growing cybersecurity knowledge 
              in real-world scenarios. Open to internships, entry-level positions, or collaborative projects.
            </p>
            <div className="flex justify-center">
              <span className="px-3 sm:px-4 py-2 bg-primary/10 border border-primary/20 rounded-full font-mono text-primary text-xs sm:text-sm">
                Available for cybersecurity opportunities
              </span>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Experience;