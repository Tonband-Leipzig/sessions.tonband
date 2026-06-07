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
  Ticket
} from 'lucide-react';
import { api } from '../lib/api';
import type { Tool } from '../lib/api';

const InternalTools = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const { tools } = await api.tools.list();
        const internalTools = tools.filter((t: Tool) => t.is_internal);
        setTools(internalTools);
      } catch (error) {
        console.error('Error fetching internal tools:', error);
        setError('Failed to load internal tools');
      } finally {
        setLoading(false);
      }
    };

    // Fast path for slow mobile networks: render cached tools immediately.
    try {
      const raw = localStorage.getItem('tonband_tools_cache_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.tools)) {
          const internalTools = parsed.tools.filter((t: Tool) => t.is_internal);
          setTools(internalTools);
          setLoading(false);
        }
      }
    } catch {
      // ignore cache read errors
    }

    // Hard timeout guard: never show loading forever on iOS Safari.
    const hardTimeoutId = window.setTimeout(() => {
      setLoading(false);
      setError((prev) => prev || 'Loading timed out. Please check your connection.');
    }, 20000);

    fetchTools().finally(() => window.clearTimeout(hardTimeoutId));
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
    Ticket
  };

  if (loading) {
    return (
      <section className="relative z-10 mt-10 md:mt-16 mb-24">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-white">
            <div className="animate-spin h-5 w-5 border-2 border-[#F471B5] border-t-transparent rounded-full" />
            Loading internal tools...
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative z-10 mt-10 md:mt-16 mb-24">
        <div className="text-center text-red-400">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="relative z-10 mt-10 md:mt-16 mb-24">
      <div className="text-center px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_0_10px_rgba(244,113,181,0.2)] mb-4">
          Interne Tools
        </h2>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 max-w-3xl mx-auto px-4">
        {tools.map((tool, index) => {
          const IconComponent = iconMap[tool.icon] || Music2;
          return (
            <Card
              key={tool.id}
              icon={IconComponent}
              title={tool.title}
              description={tool.description}
              link={tool.link}
              thumbnailUrl={tool.thumbnail_url}
              thumbnailPreviewUrl={tool.thumbnail_preview_url}
              thumbnailFullUrl={tool.thumbnail_full_url}
              isInternal
              borderColor={index % 2 === 0 ? 'cyan' : 'magenta'}
            />
          );
        })}
      </div>
    </section>
  );
};

export default InternalTools;