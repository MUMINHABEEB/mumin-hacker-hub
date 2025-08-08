import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, Linkedin, Github, MapPin, Send, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const { toast } = useToast();

  const contactInfo = [
    {
      icon: <Mail className="text-primary" size={24} />,
      label: 'Email',
      value: 'muminhabeeb3@gmail.com',
      href: 'mailto:muminhabeeb3@gmail.com'
    },
    {
      icon: <Phone className="text-secondary" size={24} />,
      label: 'Phone',
      value: '+971 564 761 686',
      href: 'tel:+971564761686'
    },
    {
      icon: <Linkedin className="text-accent" size={24} />,
      label: 'LinkedIn',
      value: 'linkedin.com/in/mumin-habeeb-48628a2ab',
      href: 'https://www.linkedin.com/in/mumin-habeeb-48628a2ab/'
    },
    {
      icon: <Github className="text-primary" size={24} />,
      label: 'GitHub',
      value: 'github.com/MUMINHABEEB',
      href: 'https://github.com/MUMINHABEEB'
    },
    {
      icon: <Mail className="text-red-600" size={24} />,
      label: 'YouTube',
      value: 'youtube.com/channel/UC4K6XtEUCSgH6HjHRoibSgQ',
      href: 'https://www.youtube.com/channel/UC4K6XtEUCSgH6HjHRoibSgQ'
    },
    {
      icon: <MapPin className="text-secondary" size={24} />,
      label: 'Location',
      value: 'UAE',
      href: null
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    // Simulate form submission
    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out. I'll get back to you soon!",
    });

    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-cyber mb-4">
            Get In <span className="text-transparent bg-gradient-primary bg-clip-text">Touch</span>
          </h2>
          <p className="text-xl text-muted-foreground font-mono max-w-2xl mx-auto">
            <span className="text-primary">//</span> Let's connect and discuss cybersecurity opportunities
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8 animate-slide-up">
            <Card className="p-8 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-primary/30">
              <h3 className="text-2xl font-bold font-cyber mb-6 flex items-center gap-3">
                <MessageSquare className="text-primary" size={28} />
                Let's Connect
              </h3>
              <p className="text-muted-foreground font-mono leading-relaxed mb-8">
                I'm always interested in discussing cybersecurity projects, learning opportunities, 
                or potential collaborations. Whether you're looking for a passionate cybersecurity 
                enthusiast for your team or want to share insights about the field, I'd love to hear from you.
              </p>
              
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 group">
                    <div className="p-3 bg-muted/20 rounded-lg group-hover:bg-muted/30 transition-colors duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-mono">{item.label}</p>
                      {item.href ? (
                        <a 
                          href={item.href}
                          className="font-mono text-foreground hover:text-primary transition-colors duration-300"
                          target={item.href.startsWith('http') ? '_blank' : undefined}
                          rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="font-mono text-foreground">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-secondary/20">
              <h4 className="font-cyber text-lg mb-4">Quick Actions</h4>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-primary/30 hover:border-primary hover:bg-primary/10 font-mono"
                  asChild
                >
                  <a href="mailto:muminhabeeb3@gmail.com">
                    <Mail className="mr-3" size={18} />
                    Send Email
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-secondary/30 hover:border-secondary hover:bg-secondary/10 font-mono"
                  asChild
                >
                  <a href="https://www.linkedin.com/in/mumin-habeeb-48628a2ab/" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="mr-3" size={18} />
                    Connect on LinkedIn
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-accent/30 hover:border-accent hover:bg-accent/10 font-mono"
                  asChild
                >
                  <a href="https://github.com/MUMINHABEEB" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-3" size={18} />
                    Follow on GitHub
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-red-600/30 hover:border-red-600 hover:bg-red-600/10 font-mono"
                  asChild
                >
                  <a href="https://www.youtube.com/channel/UC4K6XtEUCSgH6HjHRoibSgQ" target="_blank" rel="noopener noreferrer">
                    <svg className="mr-3" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.8 8.001a2.75 2.75 0 0 0-1.93-1.946C18.2 6 12 6 12 6s-6.2 0-7.87.055A2.75 2.75 0 0 0 2.2 8.001 28.6 28.6 0 0 0 2 12a28.6 28.6 0 0 0 .2 3.999 2.75 2.75 0 0 0 1.93 1.946C5.8 18 12 18 12 18s6.2 0 7.87-.055a2.75 2.75 0 0 0 1.93-1.946A28.6 28.6 0 0 0 22 12a28.6 28.6 0 0 0-.2-3.999zM10 15V9l6 3-6 3z" fill="#FF0000"/></svg>
                    Subscribe on YouTube
                  </a>
                </Button>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-accent/20 hover:border-accent/40 transition-all duration-300">
              <h3 className="text-2xl font-bold font-cyber mb-6 flex items-center gap-3">
                <Send className="text-accent" size={28} />
                Send Message
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-mono text-muted-foreground">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="bg-background/50 border-border/50 focus:border-accent font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-mono text-muted-foreground">
                    Your Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="bg-background/50 border-border/50 focus:border-accent font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-mono text-muted-foreground">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project, opportunity, or just say hello..."
                    rows={6}
                    className="bg-background/50 border-border/50 focus:border-accent font-mono resize-none"
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-gradient-primary hover:glow-green transition-all duration-300 font-mono text-lg py-6 group"
                >
                  <Send className="mr-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>

        {/* Availability Status */}
        <div className="text-center mt-16">
          <Card className="p-8 bg-gradient-glow border-primary/20 max-w-2xl mx-auto animate-slide-up">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <h3 className="text-2xl font-bold font-cyber">Currently Available</h3>
            </div>
            <p className="text-muted-foreground font-mono mb-6">
              I'm actively seeking cybersecurity opportunities and always open to discussing 
              interesting projects or learning experiences. Response time is typically within 24 hours.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full font-mono text-primary text-sm">
                Open to Opportunities
              </span>
              <span className="px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full font-mono text-secondary text-sm">
                Project Collaborations
              </span>
              <span className="px-4 py-2 bg-accent/10 border border-accent/20 rounded-full font-mono text-accent text-sm">
                Mentorship Welcome
              </span>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;