import Header from '@/components/Header';
import Achievements from '@/components/Achievements';
import Footer from '@/components/Footer';

const AchievementsPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />
      <main>
        <Achievements />
      </main>
      <Footer />
    </div>
  );
};

export default AchievementsPage;