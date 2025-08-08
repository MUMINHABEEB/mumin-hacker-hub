import { Linkedin, Github, Mail, Code } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    {
      icon: <Github size={20} />,
      href: 'https://github.com/MUMINHABEEB',
      label: 'GitHub'
    },
    {
      icon: <Linkedin size={20} />,
      href: 'https://www.linkedin.com/in/mumin-habeeb-48628a2ab/',
      label: 'LinkedIn'
    },
    {
      icon: <Mail size={20} />,
      href: 'mailto:muminhabeeb3@gmail.com',
      label: 'Email'
    },
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.8 8.001a2.75 2.75 0 0 0-1.93-1.946C18.2 6 12 6 12 6s-6.2 0-7.87.055A2.75 2.75 0 0 0 2.2 8.001 28.6 28.6 0 0 0 2 12a28.6 28.6 0 0 0 .2 3.999 2.75 2.75 0 0 0 1.93 1.946C5.8 18 12 18 12 18s6.2 0 7.87-.055a2.75 2.75 0 0 0 1.93-1.946A28.6 28.6 0 0 0 22 12a28.6 28.6 0 0 0-.2-3.999zM10 15V9l6 3-6 3z" fill="#FF0000"/></svg>,
      href: 'https://www.youtube.com/channel/UC4K6XtEUCSgH6HjHRoibSgQ',
      label: 'YouTube'
    }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 border-t border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Logo & Description */}
          <div className="text-center md:text-left">
            <button 
              onClick={scrollToTop}
              className="text-2xl font-bold font-cyber text-primary hover:text-primary/80 transition-colors duration-300 mb-2"
            >
              &lt;MH/&gt;
            </button>
            <p className="text-muted-foreground font-mono text-sm">
              Cybersecurity Researcher & Enthusiast
            </p>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-6">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="p-3 bg-card border border-border/50 rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 group"
                aria-label={link.label}
              >
                <span className="text-muted-foreground group-hover:text-primary transition-colors duration-300">
                  {link.icon}
                </span>
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-muted-foreground font-mono text-sm">
              © {currentYear} Mumin Habeeb
            </p>
            <p className="text-muted-foreground font-mono text-xs mt-1">
              Built with passion for cybersecurity
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground font-mono text-sm">
              <Code size={16} className="text-primary" />
              <span>Built with React, TypeScript & Tailwind CSS</span>
            </div>
            
            <div className="flex items-center gap-4 text-muted-foreground font-mono text-sm">
              <span>Open Source</span>
              <span>•</span>
              <span>MIT License</span>
              <span>•</span>
              <a 
                href="#contact" 
                className="text-primary hover:text-primary/80 transition-colors duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Get In Touch
              </a>
            </div>
          </div>
        </div>

        {/* Tech Pattern */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2 text-primary/30 font-mono text-xs">
            <span>&lt;</span>
            <span className="animate-pulse">●</span>
            <span>/&gt;</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;