import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import type { Tool } from '../lib/api';
import { auth } from '../lib/auth';
import {
  PlusCircle, Pencil, Trash2, Save, X, AlertCircle, Search, LogOut, Home, ArrowUp, ArrowDown,
  // Tool & App Icons
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
import Background from './Background';

const iconGroups = {
  'Media & Audio': {
    Music2: 'Music',
    AudioWaveform: 'Audio Waveform',
    Headphones: 'Headphones',
    Radio: 'Radio',
    Mic: 'Microphone',
    Video: 'Video',
    Camera: 'Camera',
    ImageIcon: 'Image',
    Play: 'Play',
    Pause: 'Pause',
    SkipBack: 'Skip Back',
    SkipForward: 'Skip Forward'
  },
  'Time & Schedule': {
    Timer: 'Timer',
    Clock: 'Clock',
    Calendar: 'Calendar',
    CalendarClock: 'Calendar with Clock',
    Bell: 'Bell'
  },
  'Content & Documents': {
    FileText: 'Text File',
    Files: 'Files',
    FolderOpen: 'Folder',
    BookOpen: 'Book',
    Type: 'Typography',
    Ticket: 'Ticket'
  },
  'Communication': {
    MessageSquare: 'Message',
    Mail: 'Mail',
    Share2: 'Share',
    Globe: 'Globe',
    Cloud: 'Cloud'
  },
  'Data & Analytics': {
    Database: 'Database',
    PieChart: 'Pie Chart',
    BarChart2: 'Bar Chart',
    LineChart: 'Line Chart'
  },
  'Design & Creative': {
    Palette: 'Palette',
    Brush: 'Brush',
    Shapes: 'Shapes',
    Lightbulb: 'Lightbulb'
  },
  'Devices & Display': {
    Monitor: 'Monitor',
    Smartphone: 'Smartphone',
    Layout: 'Layout'
  },
  'Utils & Actions': {
    Settings: 'Settings',
    Upload: 'Upload',
    Download: 'Download',
    RefreshCw: 'Refresh',
    Link: 'Link'
  },
  'Users & Social': {
    Users: 'Users',
    Heart: 'Heart',
    Star: 'Star',
    Trophy: 'Trophy',
    Zap: 'Zap'
  }
};

const iconMap: { [key: string]: React.ElementType } = {
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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tools, setTools] = useState<Tool[]>([]);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterInternal, setFilterInternal] = useState<boolean | null>(null);

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      setError(null);
      const { tools: data } = await api.tools.list();
      setTools(data || []);
    } catch (error) {
      console.error('Error fetching tools:', error);
      setError('Failed to load tools. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (tool: Tool) => {
    try {
      setSaveLoading(true);
      setError(null);

      if (tool.id) {
        await api.tools.update(tool.id, {
          title: tool.title,
          description: tool.description,
          link: tool.link,
          icon: tool.icon,
          is_internal: tool.is_internal,
        });
      } else {
        await api.tools.create({
          title: tool.title,
          description: tool.description,
          link: tool.link,
          icon: tool.icon,
          is_internal: tool.is_internal,
        });
      }

      setEditingTool(null);
      await fetchTools();
    } catch (error) {
      console.error('Error saving tool:', error);
      setError('Failed to save tool. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tool?')) return;

    try {
      setError(null);
      await api.tools.delete(id);
      await fetchTools();
    } catch (error) {
      console.error('Error deleting tool:', error);
      setError('Failed to delete tool. Please try again.');
    }
  };

  const handleMoveUp = async (tool: Tool) => {
    try {
      const prevTool = tools
        .filter(t => t.is_internal === tool.is_internal && t.display_order < tool.display_order)
        .sort((a, b) => b.display_order - a.display_order)[0];

      if (!prevTool) return;

      await api.tools.update(tool.id, { display_order: prevTool.display_order });
      await api.tools.update(prevTool.id, { display_order: tool.display_order });

      await fetchTools();
    } catch (error) {
      console.error('Error moving tool up:', error);
      setError('Failed to reorder tools. Please try again.');
    }
  };

  const handleMoveDown = async (tool: Tool) => {
    try {
      const nextTool = tools
        .filter(t => t.is_internal === tool.is_internal && t.display_order > tool.display_order)
        .sort((a, b) => a.display_order - b.display_order)[0];

      if (!nextTool) return;

      await api.tools.update(tool.id, { display_order: nextTool.display_order });
      await api.tools.update(nextTool.id, { display_order: tool.display_order });

      await fetchTools();
    } catch (error) {
      console.error('Error moving tool down:', error);
      setError('Failed to reorder tools. Please try again.');
    }
  };

  const handleLogout = () => {
    auth.signOut();
    navigate('/');
  };

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterInternal === null || tool.is_internal === filterInternal;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white flex items-center gap-2">
          <div className="animate-spin h-5 w-5 border-2 border-[#3BAAB8] border-t-transparent rounded-full" />
          Loading tools...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-dark text-white flex flex-col">
      <Background />
      
      <div className="flex-1 px-6 py-8 max-w-6xl mx-auto w-full relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-6 py-2.5 bg-white/5 backdrop-blur-sm border border-[#3BAAB8] rounded-xl 
                       text-white hover:shadow-[0_0_15px_rgba(59,170,184,0.2)] hover:border-[#3BAAB8]/80
                       transition-all duration-300 font-medium"
            >
              <Home size={18} />
              Main Page
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-2.5 bg-white/5 backdrop-blur-sm border border-[#3BAAB8] rounded-xl 
                       text-white hover:shadow-[0_0_15px_rgba(59,170,184,0.2)] hover:border-[#3BAAB8]/80
                       transition-all duration-300 font-medium"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-[#3BAAB8] rounded-xl text-white placeholder-white/40 
                       focus:outline-none focus:ring-2 focus:ring-[#3BAAB8] focus:border-transparent
                       hover:border-[#3BAAB8]/80 transition-all duration-300"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setFilterInternal(null)}
              className={`px-6 py-2.5 rounded-xl transition-all duration-300 font-medium 
                ${filterInternal === null 
                  ? 'bg-white/5 backdrop-blur-sm border-2 border-[#3BAAB8] text-white shadow-[0_0_15px_rgba(59,170,184,0.2)]' 
                  : 'bg-white/5 backdrop-blur-sm border border-[#3BAAB8] text-white hover:shadow-[0_0_15px_rgba(59,170,184,0.2)]'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterInternal(false)}
              className={`px-6 py-2.5 rounded-xl transition-all duration-300 font-medium 
                ${filterInternal === false 
                  ? 'bg-white/5 backdrop-blur-sm border-2 border-[#3BAAB8] text-white shadow-[0_0_15px_rgba(59,170,184,0.2)]' 
                  : 'bg-white/5 backdrop-blur-sm border border-[#3BAAB8] text-white hover:shadow-[0_0_15px_rgba(59,170,184,0.2)]'}`}
            >
              Public
            </button>
            <button
              onClick={() => setFilterInternal(true)}
              className={`px-6 py-2.5 rounded-xl transition-all duration-300 font-medium 
                ${filterInternal === true 
                  ? 'bg-white/5 backdrop-blur-sm border-2 border-[#F471B5] text-white shadow-[0_0_15px_rgba(244,113,181,0.2)]' 
                  : 'bg-white/5 backdrop-blur-sm border border-[#F471B5] text-white hover:shadow-[0_0_15px_rgba(244,113,181,0.2)]'}`}
            >
              Internal
            </button>
          </div>

          <button
            onClick={() => setEditingTool({ id: '', title: '', description: '', link: '', icon: 'Music2', is_internal: false, display_order: 0 })}
            className="md:ml-4 flex items-center justify-center gap-2 bg-white/5 backdrop-blur-sm border border-[#3BAAB8] 
                      text-white px-6 py-2.5 rounded-xl hover:shadow-[0_0_15px_rgba(59,170,184,0.2)] 
                      transition-all duration-300 font-medium"
          >
            <PlusCircle size={20} />
            Add New Tool
          </button>
        </div>

        <div className="grid gap-6">
          {filteredTools.map((tool) => {
            const IconComponent = iconMap[tool.icon] || Music2;
            const isFirstInCategory = !tools.find(t => 
              t.is_internal === tool.is_internal && t.display_order < tool.display_order
            );
            const isLastInCategory = !tools.find(t => 
              t.is_internal === tool.is_internal && t.display_order > tool.display_order
            );

            return (
              <div 
                key={tool.id} 
                className={`bg-white/3 backdrop-blur-[10px] rounded-2xl border overflow-hidden transition-all duration-300 hover:scale-[1.02] p-6
                           ${tool.is_internal ? 'border-[#F471B5] hover:shadow-[0_0_20px_rgba(244,113,181,0.2)]' : 'border-[#3BAAB8] hover:shadow-[0_0_20px_rgba(59,170,184,0.2)]'}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className={`${tool.is_internal ? 'text-[#F471B5]' : 'text-[#3BAAB8]'} transition-all duration-300`}>
                        <IconComponent size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-white">{tool.title}</h3>
                    </div>
                    <p className="text-neutral-300 mt-2">{tool.description}</p>
                    <p className="text-sm text-neutral-400 mt-2">Link: {tool.link}</p>
                    <div className="mt-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tool.is_internal 
                          ? 'bg-[#F471B5]/10 text-[#F471B5] shadow-[0_0_10px_rgba(244,113,181,0.2)]' 
                          : 'bg-[#3BAAB8]/10 text-[#3BAAB8] shadow-[0_0_10px_rgba(59,170,184,0.2)]'
                      }`}>
                        {tool.is_internal ? 'Internal' : 'Public'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!isFirstInCategory && (
                      <button
                        onClick={() => handleMoveUp(tool)}
                        className={`p-2 text-neutral-300 hover:${tool.is_internal ? 'text-[#F471B5]' : 'text-[#3BAAB8]'} transition-colors`}
                      >
                        <ArrowUp size={20} />
                      </button>
                    )}
                    {!isLastInCategory && (
                      <button
                        onClick={() => handleMoveDown(tool)}
                        className={`p-2 text-neutral-300 hover:${tool.is_internal ? 'text-[#F471B5]' : 'text-[#3BAAB8]'} transition-colors`}
                      >
                        <ArrowDown size={20} />
                      </button>
                    )}
                    <button
                      onClick={() => setEditingTool(tool)}
                      className={`p-2 text-neutral-300 hover:${tool.is_internal ? 'text-[#F471B5]' : 'text-[#3BAAB8]'} transition-colors`}
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(tool.id)}
                      className="p-2 text-neutral-300 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {editingTool && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-bg-dark p-6 rounded-xl w-full max-w-2xl border border-[#3BAAB8] shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingTool.id ? 'Edit Tool' : 'Add New Tool'}
              </h3>
              <button
                onClick={() => setEditingTool(null)}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Title</label>
                <input
                  type="text"
                  value={editingTool.title}
                  onChange={(e) => setEditingTool({ ...editingTool, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-[#3BAAB8] text-white 
                           focus:outline-none focus:ring-2 focus:ring-[#3BAAB8] focus:border-transparent
                           hover:border-[#3BAAB8]/80 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Description</label>
                <textarea
                  value={editingTool.description}
                  onChange={(e) => setEditingTool({ ...editingTool, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-[#3BAAB8] text-white 
                           focus:outline-none focus:ring-2 focus:ring-[#3BAAB8] focus:border-transparent
                           hover:border-[#3BAAB8]/80 transition-all duration-300"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Link</label>
                <input
                  type="url"
                  value={editingTool.link}
                  onChange={(e) => setEditingTool({ ...editingTool, link: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-[#3BAAB8] text-white 
                           focus:outline-none focus:ring-2 focus:ring-[#3BAAB8] focus:border-transparent
                           hover:border-[#3BAAB8]/80 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Icon</label>
                <select
                  value={editingTool.icon}
                  onChange={(e) => setEditingTool({ ...editingTool, icon: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-[#3BAAB8] text-white 
                           focus:outline-none focus:ring-2 focus:ring-[#3BAAB8] focus:border-transparent
                           hover:border-[#3BAAB8]/80 transition-all duration-300"
                >
                  {Object.entries(iconGroups).map(([groupName, icons]) => (
                    <optgroup key={groupName} label={groupName}>
                      {Object.entries(icons).map(([iconName, label]) => (
                        <option key={iconName} value={iconName}>
                          {label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_internal"
                  checked={editingTool.is_internal}
                  onChange={(e) => setEditingTool({ ...editingTool, is_internal: e.target.checked })}
                  className="rounded bg-white/5 border-[#3BAAB8] text-[#3BAAB8] focus:ring-[#3BAAB8]
                           transition-all duration-300"
                />
                <label htmlFor="is_internal" className="text-sm font-medium text-neutral-300">
                  Internal Tool
                </label>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setEditingTool(null)}
                  className="px-6 py-2.5 bg-white/5 backdrop-blur-sm border border-[#3BAAB8] rounded-xl 
                           text-white hover:shadow-[0_0_15px_rgba(59,170,184,0.2)] hover:border-[#3BAAB8]/80
                           transition-all duration-300 font-medium"
                  disabled={saveLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSave(editingTool)}
                  disabled={saveLoading}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#3BAAB8] to-[#F471B5] text-white rounded-xl 
                           hover:shadow-[0_0_15px_rgba(59,170,184,0.2)] transition-all duration-300 
                           flex items-center gap-2 disabled:opacity-50 font-medium"
                >
                  {saveLoading ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Save
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;