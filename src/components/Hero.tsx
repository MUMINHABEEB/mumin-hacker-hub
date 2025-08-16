import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Code, Search } from 'lucide-react';
// import profileImage from '@/assets/mumin-profile.jpg';

const Hero = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden cyber-grid">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-cyber-gray/20"></div>
      
      {/* Floating particles - responsive positioning */}
      <div className="absolute inset-0">
        <div className="absolute top-16 sm:top-20 left-4 sm:left-20 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-primary rounded-full animate-float"></div>
        <div className="absolute top-32 sm:top-40 right-8 sm:right-32 w-1 h-1 bg-secondary rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-24 sm:bottom-32 left-1/4 w-1 sm:w-1.5 h-1 sm:h-1.5 bg-accent rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-16 sm:bottom-20 right-4 sm:right-20 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-primary rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-6 sm:space-y-8 animate-slide-up">
            <div className="space-y-2 sm:space-y-3">
              <p className="text-base sm:text-lg text-muted-foreground font-mono">
                <span className="text-primary">$</span> whoami
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-cyber leading-tight">
                Hi, I'm{' '}
                <span className="text-transparent bg-gradient-primary bg-clip-text block sm:inline">
                  Mumin Habeeb
                </span>
              </h1>
              <div className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-mono">
                <span className="text-primary">&gt;</span> <span className="block sm:inline">Cybersecurity Enthusiast</span> <span className="hidden sm:inline">&</span> <span className="block sm:inline">Researcher</span>
              </div>
            </div>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl font-mono leading-relaxed">
              Passionate about exploring the world of cybersecurity, penetration testing, 
              and cloud security. Currently pursuing BCA in Cloud and Security while 
              building a future in digital defense.
            </p>

            <div className="text-xs text-muted-foreground/60 font-mono">
              🚀 Last Deploy: {new Date().toLocaleString()} | Branch: main ✅
            </div>

            {/* Tech badges */}
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start">
              <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 bg-card border border-primary/20 rounded-full">
                <Shield size={14} className="text-primary sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-mono">Penetration Testing</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 bg-card border border-secondary/20 rounded-full">
                <Code size={14} className="text-secondary sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-mono">Python Development</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 bg-card border border-accent/20 rounded-full">
                <Search size={14} className="text-accent sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-mono">SOC Operations</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Button 
                onClick={() => scrollToSection('#projects')}
                className="bg-gradient-primary hover:glow-green transition-all duration-300 font-mono text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 group w-full sm:w-auto"
              >
                Explore My Work
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={18} />
              </Button>
              <Button 
                variant="outline"
                onClick={() => scrollToSection('#contact')}
                className="border-primary/30 hover:border-primary hover:bg-primary/10 font-mono text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 transition-all duration-300 w-full sm:w-auto"
              >
                Get In Touch
              </Button>
            </div>
          </div>

          {/* Profile Image */}
          <div className="flex justify-center lg:justify-end animate-fade-in order-first lg:order-last">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-primary rounded-full blur-xl sm:blur-2xl opacity-30 animate-glow-pulse"></div>
              
              {/* Image container */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full overflow-hidden border-2 sm:border-4 border-primary/20 hover:border-primary/40 transition-all duration-500">
                <img 
                  src="https://i.postimg.cc/6qRbgG0Y/Mumin-Photo-3.png" 
                  alt="Mumin Habeeb - Cybersecurity Researcher"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Decorative elements - responsive sizing */}
              <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-4 sm:w-8 h-4 sm:h-8 bg-primary rounded-full animate-pulse"></div>
              <div className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 w-3 sm:w-6 h-3 sm:h-6 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-5 sm:w-6 h-8 sm:h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <div className="w-1 h-2 sm:h-3 bg-primary rounded-full mt-1.5 sm:mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;