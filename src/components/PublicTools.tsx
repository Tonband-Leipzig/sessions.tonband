import { useEffect, useState } from 'react';
import Card from './Card';
import { 
  Music2, CalendarClock, Lightbulb, ImageIcon, AudioWaveform, Timer,
  Settings, Users, Video, FileText, Link, Layout, 
  MessageSquare, Mail, Share2, Headphones, 
  BookOpen, Camera, Mic, Radio, 
  PieChart, BarChart2, LineChart, 
  Database, FolderOpen, Files,
  Globe, Cloud, Monitor, Smartphone,
  Palette, Brush, Shapes, Type,
  Play, Pause, SkipBack, SkipForward,
  Upload, Download, RefreshCw, 
  Clock, Calendar, Bell,
  Zap, Star, Heart, Trophy,
  Ticket, Instagram, Youtube, MessageCircle
} from 'lucide-react';
import { api } from '../lib/api';
import type { Tool } from '../lib/api';

const socialMediaTitles = ['Instagram', 'YouTube', 'TikTok', 'Community'];

const socialMediaStyles = {
  'Instagram': {
    bg: 'bg-gradient-to-br from-[#833AB4]/90 via-[#FD1D1D]/90 to-[#F77737]/90',
    iconColor: 'group-hover:text-white text-white',
    textColor: 'text-white',
    hoverBg: 'hover:shadow-[0_0_20px_rgba(253,29,29,0.3)]'
  },
  'YouTube': {
    bg: 'bg-[#FF0000]/90',
    iconColor: 'group-hover:text-white text-white',
    textColor: 'text-white',
    hoverBg: 'hover:shadow-[0_0_20px_rgba(255,0,0,0.3)]'
  },
  'TikTok': {
    bg: 'bg-black/90',
    iconColor: 'group-hover:text-white text-white',
    textColor: 'text-white',
    hoverBg: 'hover:shadow-[0_0_20px_rgba(0,0,0,0.3)]'
  },
  'Community': {
    bg: 'bg-[#25D366]/90',
    iconColor: 'group-hover:text-white text-white',
    textColor: 'text-white',
    hoverBg: 'hover:shadow-[0_0_20px_rgba(37,211,102,0.3)]'
  }
};

const PublicTools = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const { tools } = await api.tools.list();
        const publicTools = tools.filter((t: Tool) => !t.is_internal);
        setTools(publicTools);
      } catch (error) {
        console.error('Error fetching public tools:', error);
        setError('Failed to load public tools');
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  const iconMap: { [key: string]: typeof Music2 } = {
    Music2, CalendarClock, Lightbulb, ImageIcon, AudioWaveform, Timer,
    Settings, Users, Video, FileText, Link, Layout,
    MessageSquare, Mail, Share2, Headphones,
    BookOpen, Camera, Mic, Radio,
    PieChart, BarChart2, LineChart,
    Database, FolderOpen, Files,
    Globe, Cloud, Monitor, Smartphone,
    Palette, Brush, Shapes, Type,
    Play, Pause, SkipBack, SkipForward,
    Upload, Download, RefreshCw,
    Clock, Calendar, Bell,
    Zap, Star, Heart, Trophy,
    Ticket, Instagram, Youtube, MessageCircle
  };

  const socialMediaIcons: { [key: string]: typeof Music2 } = {
    'Instagram': Instagram,
    'YouTube': Youtube,
    'TikTok': Play,
    'Community': MessageCircle
  };

  if (loading) {
    return (
      <section className="mt-8 md:mt-12 mb-16">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-white">
            <div className="animate-spin h-5 w-5 border-2 border-[#3BAAB8] border-t-transparent rounded-full" />
            Loading public tools...
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-8 md:mt-12 mb-16">
        <div className="text-center text-red-400">
          {error}
        </div>
      </section>
    );
  }

  const socialMediaTools = tools.filter(tool => socialMediaTitles.includes(tool.title));
  const otherTools = tools.filter(tool => !socialMediaTitles.includes(tool.title));

  return (
    <section className="mt-8 md:mt-12 mb-16">
      <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto px-4">
        {/* Social Media Card */}
        {socialMediaTools.length > 0 && (
          <div className="bg-white/3 backdrop-blur-[10px] rounded-2xl border border-[#F471B5] 
                       overflow-hidden transition-all duration-300 hover:scale-[1.02] p-6
                       hover:shadow-[0_0_20px_rgba(244,113,181,0.2)]">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Share2 className="text-[#F471B5]" />
              Social Media
            </h3>
            <div className="grid grid-cols-4 gap-2 md:gap-4">
              {socialMediaTools.map((tool) => {
                const IconComponent = socialMediaIcons[tool.title] || Share2;
                const styles = socialMediaStyles[tool.title as keyof typeof socialMediaStyles];
                
                return (
                  <a
                    key={tool.id}
                    href={tool.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex flex-col items-center justify-center h-16 md:h-24 rounded-xl
                             ${styles.bg} transition-all duration-300
                             group ${styles.hoverBg} backdrop-blur-sm`}
                  >
                    <IconComponent 
                      size={24} 
                      className={`${styles.iconColor} group-hover:scale-110 transition-transform duration-300 mb-1 md:mb-2`}
                    />
                    <span className={`text-[10px] md:text-sm ${styles.textColor} text-center font-medium`}>
                      {tool.title}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Other Tools */}
        {otherTools.map((tool, index) => {
          const IconComponent = iconMap[tool.icon] || Music2;
          return (
            <Card
              key={tool.id}
              icon={IconComponent}
              title={tool.title}
              description={tool.description}
              link={tool.link}
              borderColor={index % 2 === 0 ? 'cyan' : 'magenta'}
            />
          );
        })}
      </div>
    </section>
  );
};

export default PublicTools;