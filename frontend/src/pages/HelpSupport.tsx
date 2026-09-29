import { useState } from 'react';
import { 
  Search, FileText, Globe, Database, Settings, HelpCircle, 
  ChevronDown, AlertCircle, Phone, Copy, CheckCircle2, Activity, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FAQS = [
  {
    category: 'RESEARCH',
    q: 'How do I search research papers?',
    a: 'Use the global search bar in the top navigation or visit the Research Repository. You can filter by paper, policy, or dataset.'
  },
  {
    category: 'RESEARCH',
    q: 'How do I save research?',
    a: 'Click the bookmark icon on any research paper or document to add it to your Saved Research tab.'
  },
  {
    category: 'GIS & MAPS',
    q: 'How do I open the GIS Studio?',
    a: 'Click "Maps & GIS" under the Geospatial section in the left sidebar to open the interactive studio.'
  },
  {
    category: 'GIS & MAPS',
    q: 'How do I switch to satellite imagery?',
    a: 'Go to Settings > Map and change the Default Map View to Satellite, or use the layer controls directly in the GIS Studio.'
  },
  {
    category: 'POLICY & SIMULATION',
    q: 'How do I run a policy simulation?',
    a: 'Navigate to Policy > Policy Simulation. Adjust the policy parameters in the left panel and click "Run Simulation" to view projected outcomes.'
  },
  {
    category: 'DATA & ANALYTICS',
    q: 'Where can I access datasets?',
    a: 'Go to Data & Analytics > Datasets to browse and download official cadastral and geospatial datasets.'
  },
  {
    category: 'ACCOUNT & SETTINGS',
    q: 'How do I change application settings?',
    a: 'Click the "Settings" link in the bottom left sidebar or the gear icon in the top right to access the Settings Center.'
  }
];

const GUIDES = [
  { title: 'Getting Started', desc: 'Learn how to navigate the Bhu-Setu platform.', icon: HelpCircle, path: '/dashboard' },
  { title: 'Research', desc: 'How to find and save research.', icon: FileText, path: '/research/repository' },
  { title: 'GIS', desc: 'How to use Maps & GIS, layers and satellite imagery.', icon: Globe, path: '/gis/maps' },
  { title: 'Policy', desc: 'How to explore policy documents and simulations.', icon: FileText, path: '/policy/simulation' },
  { title: 'Data', desc: 'How to find and access datasets.', icon: Database, path: '/data/datasets' }
];

const SHORTCUTS = [
  { label: 'Search Documentation', path: '/research/repository', icon: Search },
  { label: 'Open Research', path: '/research/repository', icon: FileText },
  { label: 'Open GIS', path: '/gis/maps', icon: Globe },
  { label: 'Open Policy Simulation', path: '/policy/simulation', icon: FileText },
  { label: 'Open Datasets', path: '/data/datasets', icon: Database },
  { label: 'Open Settings', path: '/settings', icon: Settings }
];

export function HelpSupport() {
  const navigate = useNavigate();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Category state
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // Issue report state
  const [issueType, setIssueType] = useState('Bug');
  const [issueSubject, setIssueSubject] = useState('');
  const [issueDesc, setIssueDesc] = useState('');
  const [issuePriority, setIssuePriority] = useState('Medium');
  const [issueStatus, setIssueStatus] = useState<'idle' | 'saved'>('idle');
  
  // Feedback state
  const [feedbackType, setFeedbackType] = useState('Suggestion');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'saved'>('idle');

  // Filter FAQS
  const filteredFaqs = FAQS.filter(faq => {
    const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory ? faq.category === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueSubject.trim() || !issueDesc.trim()) return;
    
    const report = {
      type: issueType,
      subject: issueSubject,
      description: issueDesc,
      priority: issuePriority,
      date: new Date().toISOString()
    };
    
    const saved = JSON.parse(localStorage.getItem('bhu_issue_reports') || '[]');
    saved.push(report);
    localStorage.setItem('bhu_issue_reports', JSON.stringify(saved));
    
    setIssueStatus('saved');
    setTimeout(() => setIssueStatus('idle'), 5000);
    setIssueSubject('');
    setIssueDesc('');
  };

  const copyIssueReport = () => {
    const text = `Issue Type: ${issueType}\nPriority: ${issuePriority}\nSubject: ${issueSubject}\nDescription: ${issueDesc}`;
    navigator.clipboard.writeText(text);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;
    
    const feedback = {
      type: feedbackType,
      message: feedbackMessage,
      date: new Date().toISOString()
    };
    
    const saved = JSON.parse(localStorage.getItem('bhu_feedback') || '[]');
    saved.push(feedback);
    localStorage.setItem('bhu_feedback', JSON.stringify(saved));
    
    setFeedbackStatus('saved');
    setTimeout(() => setFeedbackStatus('idle'), 5000);
    setFeedbackMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-4 flex items-center justify-center gap-3">
          <HelpCircle className="w-8 h-8 text-bhu-primary" />
          Help & Support
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Find answers, explore platform guidance, or report an issue.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative group">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-bhu-primary transition-colors" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search help, guides, GIS tools, research, settings..."
            className="w-full bg-white border border-slate-200 focus:border-bhu-primary focus:ring-4 focus:ring-bhu-primary/10 rounded-2xl py-3.5 pl-12 pr-4 text-base font-medium text-slate-900 shadow-sm transition-all outline-none"
          />
        </div>
      </div>

      {/* Quick Help Categories */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
        {[
          { label: 'RESEARCH', desc: 'Papers & repo', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', activeBg: 'bg-blue-600 text-white' },
          { label: 'GIS & MAPS', desc: 'Layers & views', icon: Globe, color: 'text-bhu-primary', bg: 'bg-bhu-light', activeBg: 'bg-bhu-primary text-white' },
          { label: 'POLICY & SIMULATION', desc: 'Scenarios', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50', activeBg: 'bg-amber-600 text-white' },
          { label: 'DATA & ANALYTICS', desc: 'Datasets', icon: Database, color: 'text-purple-600', bg: 'bg-purple-50', activeBg: 'bg-purple-600 text-white' },
          { label: 'ACCOUNT & SETTINGS', desc: 'Preferences', icon: Settings, color: 'text-slate-600', bg: 'bg-slate-100', activeBg: 'bg-slate-800 text-white' }
        ].map(cat => {
          const isActive = activeCategory === cat.label;
          return (
            <button 
              key={cat.label}
              onClick={() => setActiveCategory(isActive ? null : cat.label)}
              className={`p-4 rounded-xl border transition-all text-left group flex flex-col ${isActive ? cat.activeBg + ' border-transparent shadow-md' : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}
            >
              <cat.icon className={`w-5 h-5 mb-3 ${isActive ? 'text-white' : cat.color}`} />
              <div className={`text-xs font-bold mb-1 ${isActive ? 'text-white' : 'text-slate-900'}`}>{cat.label}</div>
              <div className={`text-[10px] ${isActive ? 'text-white/80' : 'text-slate-500'}`}>{cat.desc}</div>
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* FAQ Section */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-900">Frequently Asked Questions</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {filteredFaqs.length > 0 ? filteredFaqs.map((faq, i) => (
                <div key={i} className="px-6 py-1">
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full py-4 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-bhu-primary/20 rounded-lg"
                    aria-expanded={openFaq === i}
                  >
                    <span className="text-sm font-bold text-slate-900">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? 'max-h-40 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-sm text-slate-600 leading-relaxed pr-8">{faq.a}</p>
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center text-slate-500 font-medium">
                  No FAQs found for your search.
                </div>
              )}
            </div>
          </div>

          {/* Platform Guides */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-black text-slate-900 mb-6">Platform Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GUIDES.map((guide, i) => (
                <button 
                  key={i} 
                  onClick={() => navigate(guide.path)}
                  className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-300 hover:shadow-sm hover:bg-slate-50 transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-bhu-light flex items-center justify-center shrink-0">
                    <guide.icon className="w-5 h-5 text-bhu-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-1">
                      {guide.title}
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    </div>
                    <div className="text-xs text-slate-500 leading-relaxed">{guide.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Shortcuts */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Shortcuts</h2>
            <div className="space-y-2">
              {SHORTCUTS.map((sc, i) => (
                <button 
                  key={i}
                  onClick={() => navigate(sc.path)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-bhu-primary transition-colors"
                >
                  <sc.icon className="w-4 h-4 text-slate-400" />
                  {sc.label}
                </button>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 text-white">
            <h2 className="text-sm font-black mb-4 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-bhu-success" /> System Status
            </h2>
            <div className="text-[10px] text-slate-400 mb-4 uppercase tracking-widest">Frontend Availability</div>
            <div className="space-y-3">
              {['Dashboard', 'Research', 'GIS Engine', 'Data Catalog'].map((sys, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">{sys}</span>
                  <div className="flex items-center gap-1.5 bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold text-bhu-success">
                    <div className="w-1.5 h-1.5 bg-bhu-success rounded-full animate-pulse"></div> Operational
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Report an Issue */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-slate-50 px-6 py-5 border-b border-slate-100 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-bhu-danger" />
            <h2 className="text-lg font-black text-slate-900">Report an Issue</h2>
          </div>
          <form onSubmit={handleIssueSubmit} className="p-6 flex flex-col gap-4 flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Issue Type</label>
                <select 
                  value={issueType} onChange={e => setIssueType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:border-bhu-primary"
                >
                  <option>Bug</option>
                  <option>Data Issue</option>
                  <option>GIS Issue</option>
                  <option>Account Issue</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Priority</label>
                <select 
                  value={issuePriority} onChange={e => setIssuePriority(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:border-bhu-primary"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Subject</label>
              <input 
                type="text" required
                value={issueSubject} onChange={e => setIssueSubject(e.target.value)}
                placeholder="Brief summary of the issue"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:border-bhu-primary"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Description</label>
              <textarea 
                required rows={4}
                value={issueDesc} onChange={e => setIssueDesc(e.target.value)}
                placeholder="Detailed steps to reproduce..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:border-bhu-primary resize-none"
              />
            </div>

            <div className="mt-auto pt-4 flex items-center justify-between gap-4">
              <button 
                type="button" 
                onClick={copyIssueReport}
                className="text-xs font-bold text-bhu-primary hover:text-bhu-primary/80 flex items-center gap-1.5"
                title="Copy formatted report to clipboard"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Report
              </button>
              
              <button 
                type="submit"
                disabled={!issueSubject.trim() || !issueDesc.trim()}
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {issueStatus === 'saved' ? <><CheckCircle2 className="w-4 h-4" /> Saved Locally</> : 'Submit Report'}
              </button>
            </div>
            {issueStatus === 'saved' && (
              <div className="text-[11px] font-bold text-bhu-success mt-2 text-right">
                Issue report saved locally (frontend only).
              </div>
            )}
          </form>
        </div>

        {/* Contact & Feedback */}
        <div className="flex flex-col gap-8">
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-black text-slate-900 mb-2">Contact Support</h2>
            <p className="text-sm text-slate-500 mb-6">Reach out to our support team for platform assistance.</p>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">Email Support</div>
                <div className="text-xs text-slate-500 italic mt-0.5">Support contact is not configured yet.</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex-1 flex flex-col">
            <h2 className="text-lg font-black text-slate-900 mb-4">Send Feedback</h2>
            <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-4 flex-1">
              <select 
                value={feedbackType} onChange={e => setFeedbackType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:border-bhu-primary"
              >
                <option>Suggestion</option>
                <option>Usability</option>
                <option>Bug</option>
                <option>Other</option>
              </select>
              
              <textarea 
                required rows={3}
                value={feedbackMessage} onChange={e => setFeedbackMessage(e.target.value)}
                placeholder="What can we improve?"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:border-bhu-primary resize-none"
              />
              
              <div className="mt-auto text-right flex items-center justify-between">
                {feedbackStatus === 'saved' ? (
                  <div className="text-[11px] font-bold text-bhu-success">Feedback saved locally.</div>
                ) : <div/>}
                <button 
                  type="submit"
                  disabled={!feedbackMessage.trim()}
                  className="bg-bhu-primary hover:bg-bhu-dark text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {feedbackStatus === 'saved' ? <><CheckCircle2 className="w-4 h-4" /> Saved Locally</> : 'Submit Feedback'}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
      
    </div>
  );
}
