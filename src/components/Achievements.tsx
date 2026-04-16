import { useState, useEffect } from 'react';
import { apiHelpers, type Achievement } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Award, 
  Calendar, 
  Building, 
  ExternalLink, 
  Play,
  Image as ImageIcon,
  Filter,
  Star,
  Shield,
  Trophy,
  Medal,
  Target
} from 'lucide-react';

const Achievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [certificates, setCertificates] = useState<Achievement[]>([]);
  const [featuredAchievement, setFeaturedAchievement] = useState<Achievement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCertificatesOnly, setShowCertificatesOnly] = useState(false);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      setIsLoading(true);
      const [allAchievements, certificatesList] = await Promise.all([
        apiHelpers.getAchievements(),
        apiHelpers.getCertificates()
      ]);
      
      // Find featured achievement
      const featured = allAchievements.find(achievement => achievement.featured);
      setFeaturedAchievement(featured || null);
      
      setAchievements(allAchievements);
      setCertificates(certificatesList);
    } catch (error) {
      console.error('Failed to load achievements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    if (showCertificatesOnly) return achievement.type === 'certificate';
    if (selectedCategory === 'all') return true;
    return achievement.category === selectedCategory;
  });

  const categories = ['all', 'certification', 'award', 'recognition', 'milestone', 'competition'];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'certification':
        return <Shield className="text-primary" size={24} />;
      case 'award':
        return <Trophy className="text-yellow-500" size={24} />;
      case 'recognition':
        return <Star className="text-purple-500" size={24} />;
      case 'milestone':
        return <Target className="text-green-500" size={24} />;
      case 'competition':
        return <Medal className="text-orange-500" size={24} />;
      default:
        return <Award className="text-primary" size={24} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'certification':
        return 'bg-primary/10 text-primary';
      case 'award':
        return 'bg-yellow-500/10 text-yellow-600';
      case 'recognition':
        return 'bg-purple-500/10 text-purple-600';
      case 'milestone':
        return 'bg-green-500/10 text-green-600';
      case 'competition':
        return 'bg-orange-500/10 text-orange-600';
      default:
        return 'bg-muted/20 text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <section id="achievements" className="py-16 sm:py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted/20 rounded w-64 mx-auto"></div>
              <div className="h-4 bg-muted/20 rounded w-96 mx-auto"></div>
            </div>
            <div className="mt-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading achievements from Supabase...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="achievements" className="py-16 sm:py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-cyber mb-4">
            Professional <span className="text-transparent bg-gradient-primary bg-clip-text">Achievements</span>
          </h2>
          <p className="text-xl text-muted-foreground font-mono max-w-2xl mx-auto">
            <span className="text-primary">//</span> Certifications, awards, and milestones that showcase expertise
          </p>
        </div>

        {/* Featured Achievement */}
        {featuredAchievement && (
          <div className="mb-12 sm:mb-16 animate-slide-up">
            <Card className="p-6 sm:p-8 md:p-12 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-primary/30 hover:border-primary/50 transition-all duration-500 hover-lift">
              <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <Star className="w-8 h-8 text-yellow-500 fill-current" />
                  <Badge className="px-4 py-2 bg-gradient-primary text-primary-foreground">
                    Featured Achievement
                  </Badge>
                  <Star className="w-8 h-8 text-yellow-500 fill-current" />
                </div>
                
                <div className="text-center space-y-4">
                  {getCategoryIcon(featuredAchievement.category)}
                  <h3 className="text-2xl sm:text-3xl font-bold font-cyber text-foreground">
                    {featuredAchievement.title}
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    {featuredAchievement.description}
                  </p>
                  
                  <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(featuredAchievement.date)}</span>
                    </div>
                    {featuredAchievement.organization && (
                      <div className="flex items-center space-x-2">
                        <Building className="w-4 h-4" />
                        <span>{featuredAchievement.organization}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-center space-x-2">
                    <Badge className={getCategoryColor(featuredAchievement.category)}>
                      {featuredAchievement.category}
                    </Badge>
                    <Badge variant="outline">{featuredAchievement.type}</Badge>
                  </div>

                  {featuredAchievement.skills.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      {featuredAchievement.skills.map(skill => (
                        <Badge key={skill} variant="secondary" className="font-mono text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-center space-x-4 mt-6">
                    {featuredAchievement.credential_url && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(featuredAchievement.credential_url, '_blank')}
                        className="border-primary/30 hover:border-primary hover:bg-primary/10"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Credential
                      </Button>
                    )}
                    {featuredAchievement.image_url && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(featuredAchievement.image_url, '_blank')}
                        className="border-primary/30 hover:border-primary hover:bg-primary/10"
                      >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        View Certificate
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Special Certificates Section */}
        {certificates.length > 0 && (
          <div className="mb-12 sm:mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-bold font-cyber mb-4">
                Professional <span className="text-transparent bg-gradient-primary bg-clip-text">Certificates</span>
              </h3>
              <p className="text-muted-foreground font-mono">
                <span className="text-primary">//</span> Industry-recognized certifications
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map(certificate => (
                <Card key={certificate.id} className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 hover-lift">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      {getCategoryIcon(certificate.category)}
                      {certificate.featured && <Star className="w-5 h-5 text-yellow-500 fill-current" />}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-lg mb-2">{certificate.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{certificate.description}</p>
                      
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(certificate.date)}</span>
                        </div>
                        {certificate.organization && (
                          <div className="flex items-center space-x-2">
                            <Building className="w-3 h-3" />
                            <span>{certificate.organization}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-3">
                        {certificate.skills.slice(0, 3).map(skill => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {(certificate.credential_url || certificate.image_url) && (
                      <div className="flex space-x-2 pt-2">
                        {certificate.credential_url && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(certificate.credential_url, '_blank')}
                            className="flex-1 text-xs"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        )}
                        {certificate.image_url && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(certificate.image_url, '_blank')}
                            className="flex-1 text-xs"
                          >
                            <ImageIcon className="w-3 h-3 mr-1" />
                            Certificate
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4 items-center justify-center">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground font-mono">Filter:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                size="sm"
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => {
                  setSelectedCategory(category);
                  setShowCertificatesOnly(false);
                }}
                className="font-mono text-xs"
              >
                {category.replace('_', ' ').charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
            <Button
              size="sm"
              variant={showCertificatesOnly ? "default" : "outline"}
              onClick={() => {
                setShowCertificatesOnly(!showCertificatesOnly);
                setSelectedCategory('all');
              }}
              className="font-mono text-xs"
            >
              Certificates Only
            </Button>
          </div>
        </div>

        {/* Achievements Grid */}
        {filteredAchievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map(achievement => (
              <Card key={achievement.id} className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/40 transition-all duration-300 hover-lift">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    {getCategoryIcon(achievement.category)}
                    {achievement.featured && <Star className="w-5 h-5 text-yellow-500 fill-current" />}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-lg mb-2">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                    
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(achievement.date)}</span>
                      </div>
                      {achievement.organization && (
                        <div className="flex items-center space-x-2">
                          <Building className="w-3 h-3" />
                          <span>{achievement.organization}</span>
                        </div>
                      )}
                      {achievement.credential_id && (
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">ID:</span> {achievement.credential_id}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-3">
                      <Badge className={getCategoryColor(achievement.category)} variant="outline">
                        {achievement.category}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {achievement.type}
                      </Badge>
                    </div>
                    
                    {achievement.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {achievement.skills.slice(0, 4).map(skill => (
                          <Badge key={skill} variant="outline" className="text-xs font-mono">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {(achievement.credential_url || achievement.image_url || achievement.video_url) && (
                    <div className="flex space-x-2 pt-2">
                      {achievement.credential_url && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open(achievement.credential_url, '_blank')}
                          className="flex-1 text-xs"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Credential
                        </Button>
                      )}
                      {achievement.image_url && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open(achievement.image_url, '_blank')}
                          className="flex-1 text-xs"
                        >
                          <ImageIcon className="w-3 h-3 mr-1" />
                          Image
                        </Button>
                      )}
                      {achievement.video_url && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open(achievement.video_url, '_blank')}
                          className="flex-1 text-xs"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Video
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No achievements found</h3>
            <p className="text-muted-foreground font-mono text-sm">
              {selectedCategory !== 'all' 
                ? `No achievements found in the "${selectedCategory}" category.`
                : showCertificatesOnly 
                  ? "No certificates found."
                  : "No achievements have been added yet."
              }
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Achievements;