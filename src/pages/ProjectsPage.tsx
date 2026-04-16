import Header from '@/components/Header';
import Projects from '@/components/Projects';
import Footer from '@/components/Footer';

const ProjectsPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />
      <main>
        <Projects />
      </main>
      <Footer />
    </div>
  );
};

export default ProjectsPage;
