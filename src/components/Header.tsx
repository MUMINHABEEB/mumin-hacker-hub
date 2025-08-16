import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

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

  const navItems = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#experience', label: 'Experience' },
    { href: '#contact', label: 'Contact' }
  ];

  const scrollToSection = (href: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
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
            className="md:hidden text-foreground drop-shadow-lg p-2 rounded-lg hover:bg-muted/20 transition-all duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden bg-slate-900">
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex justify-between items-center p-6 border-b border-slate-700">
                <span className="text-xl font-bold text-primary">&lt;MH/&gt;</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 text-white hover:text-primary">
                  <X size={24} />
                </button>
              </div>
              
              {/* Mobile Menu Items */}
              <div className="flex-1 p-6 bg-slate-900">
                <nav className="space-y-6">
                  {navItems.map((item) => (
                    <button
                      key={item.href}
                      onClick={() => {
                        scrollToSection(item.href);
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left text-xl py-3 text-white hover:text-primary transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                  <Link 
                    to="/blog" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-left text-xl py-3 text-white hover:text-primary transition-colors"
                  >
                    Blog
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;