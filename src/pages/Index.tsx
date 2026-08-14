import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Seo
        title="Mumin Habeeb — Cybersecurity Researcher"
        description="Portfolio of Mumin Habeeb, a cybersecurity researcher focused on penetration testing, cloud security, and SOC operations."
        path="/"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Mumin Habeeb",
            url: "https://mumin-hacker-hub.lovable.app/",
            jobTitle: "Cybersecurity Researcher",
            knowsAbout: [
              "Penetration Testing",
              "Cloud Security",
              "SOC Operations",
              "Python Security Automation",
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Mumin Habeeb — Cybersecurity Portfolio",
            url: "https://mumin-hacker-hub.lovable.app/",
          },
        ]}
      />
      <Header />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
