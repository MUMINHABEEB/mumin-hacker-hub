import Header from '@/components/Header';
import Achievements from '@/components/Achievements';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';

const AchievementsPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Seo
        title="Achievements & Certifications | Mumin Habeeb"
        description="Certifications, awards, and milestones earned by Mumin Habeeb across cybersecurity, cloud security, and SOC operations."
        path="/achievements"
      />
      <Header />
      <main>
        <Achievements />
      </main>
      <Footer />
    </div>
  );
};

export default AchievementsPage;
