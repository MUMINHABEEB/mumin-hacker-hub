import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import profileImage from '@/assets/mumin-profile.jpg';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const navItems = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#experience', label: 'Experience' },
    { href: '#contact', label: 'Contact' }
  ];

  const scrollToSection = (href: string) => {
    // If we're not on the home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation then scroll
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // We're on home page, just scroll
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/90 backdrop-blur-md border-b border-border/50' 
          : 'bg-background/30 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold font-cyber text-primary hover:text-accent transition-colors drop-shadow-lg">
            &lt;MH/&gt;
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="text-foreground/90 hover:text-primary transition-colors duration-300 relative group font-mono text-sm font-medium drop-shadow-sm"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
            <Link to="/blog" className="text-foreground/90 hover:text-primary transition-colors duration-300 relative font-mono text-sm font-medium drop-shadow-sm">
              Blog
              <span className="absolute -bottom-1 left-0 block w-0 h-0.5 bg-gradient-primary transition-all duration-300 hover:w-full" />
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button 
              onClick={() => scrollToSection('#contact')}
              className="bg-gradient-primary hover:glow-green transition-all duration-300 font-mono shadow-lg"
            >
              Get In Touch
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground drop-shadow-lg"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 bg-background/95 backdrop-blur-lg border-t border-border/50 z-40">
            <nav className="container mx-auto px-4 py-8 h-full flex flex-col relative">
              {/* Close Button */}
              <button
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors"
              >
                <X size={24} />
              </button>

              {/* Profile Section */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-primary/20 to-accent/20">
                    <img 
                      src={profileImage} 
                      alt="Mumin Habeeb Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to a gradient background if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-background">MH</div>';
                      }}
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background"></div>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="font-mono text-sm text-muted-foreground">
                    <span className="text-primary">$</span> whoami
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">Hi, I'm</h2>
                  <div className="space-y-1">
                    <div className="text-primary font-cyber text-lg">&gt;</div>
                    <h3 className="text-lg font-semibold text-foreground">Cybersecurity Enthusiast</h3>
                    <h4 className="text-base text-muted-foreground">Researcher</h4>
                  </div>
                  <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                    Passionate about exploring the world of cybersecurity, penetration testing, and cloud security. Currently pursuing BCA in Cloud and Security while building expertise in ethical hacking and digital defense.
                  </p>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 flex flex-col justify-center space-y-6">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => scrollToSection(item.href)}
                    className="text-left text-lg text-muted-foreground hover:text-primary transition-all duration-300 font-mono group relative py-2"
                  >
                    <span className="group-hover:translate-x-2 transition-transform duration-300 inline-block">
                      {item.label}
                    </span>
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
                  </button>
                ))}
                <Link 
                  to="/blog" 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-left text-lg text-muted-foreground hover:text-primary transition-all duration-300 font-mono group relative py-2"
                >
                  <span className="group-hover:translate-x-2 transition-transform duration-300 inline-block">
                    Blog
                  </span>
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </div>

              {/* CTA Button */}
              <div className="mt-8">
                <Button 
                  onClick={() => scrollToSection('#contact')}
                  className="w-full bg-gradient-primary hover:glow-green transition-all duration-300 font-mono text-lg py-3"
                >
                  Get In Touch
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;