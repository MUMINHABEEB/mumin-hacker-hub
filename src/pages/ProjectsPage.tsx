import Header from '@/components/Header';
import Projects from '@/components/Projects';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';

const ProjectsPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Seo
        title="Cybersecurity Projects | Mumin Habeeb"
        description="Security tools and projects built by Mumin Habeeb, including phishing detection, vulnerability scanning, and SOC monitoring work."
        path="/projects"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Cybersecurity Projects",
          url: "https://mumin-hacker-hub.lovable.app/projects",
          about: "Cybersecurity tools and projects by Mumin Habeeb",
        }}
      />
      <Header />
      <main>
        <Projects />
      </main>
      <Footer />
    </div>
  );
};

export default ProjectsPage;
