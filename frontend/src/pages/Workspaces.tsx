import { useState, useEffect } from 'react';
import { Users, FileText, Plus, MessageSquare, History } from 'lucide-react';

export function Workspaces() {
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/workspace')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'SUCCESS') setWorkspaces(data.workspaces);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCreateWorkspace = () => {
    alert("Creating new workspace...");
  };

  const handleInvite = () => {
    alert("Invite member modal opened.");
  };

  if (selectedWorkspace) {
    return (
      <div className="p-6 max-w-6xl mx-auto animate-in fade-in zoom-in-95">
        <button onClick={() => setSelectedWorkspace(null)} className="text-sm text-gov-blue mb-4 font-semibold hover:underline">
          &larr; Back to Workspaces
        </button>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Users className="text-gov-blue" />
              {selectedWorkspace.name}
            </h1>
            <p className="text-slate-500 text-sm mt-1">{selectedWorkspace.description}</p>
          </div>
          <button onClick={handleInvite} className="bg-gov-blue text-white px-4 py-2 rounded text-sm font-medium hover:bg-gov-navy transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Invite Member
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
              <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gov-saffron" /> Shared Resources & Documents
              </h2>
              <div className="text-sm text-slate-500 italic p-8 text-center border-2 border-dashed border-slate-100 rounded">
                No items in this workspace yet. Click to upload datasets or policies.
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
              <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gov-blue" /> Real-time Discussion
              </h2>
              <div className="space-y-4 mb-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gov-blue/10 flex items-center justify-center text-gov-blue font-bold text-xs shrink-0">JD</div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm text-slate-700 w-full">
                    <div className="font-semibold text-xs text-slate-500 mb-1">Jane Doe • 10 mins ago</div>
                    I've added the latest LULC changes for Rangareddy. Can we run the simulation?
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <input type="text" placeholder="Type a comment..." className="flex-1 border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gov-blue" />
                <button className="bg-gov-blue text-white px-4 py-2 rounded text-sm font-medium hover:bg-gov-navy">Post</button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
              <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-500" /> Members
              </h2>
              <div className="flex items-center justify-between text-sm py-2 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                  <span className="font-medium text-slate-700">You (Owner)</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm py-2 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                  <span className="font-medium text-slate-700">Jane Doe</span>
                </div>
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded">Contributor</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
              <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <History className="w-4 h-4 text-slate-500" /> Version History
              </h2>
              <ul className="relative border-l border-slate-200 ml-2 space-y-4">
                <li className="pl-4 relative">
                  <div className="absolute w-2 h-2 bg-gov-blue rounded-full -left-1.5 top-1.5 border-2 border-white"></div>
                  <p className="text-xs font-semibold text-slate-800">Workspace Created</p>
                  <p className="text-[10px] text-slate-400 font-mono">Today, 10:00 AM</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-gov-blue" />
            Collaborative Workspaces
          </h1>
          <p className="text-slate-500 text-sm mt-1">Create secure environments for multi-disciplinary policy research.</p>
        </div>
        <button onClick={handleCreateWorkspace} className="bg-gov-blue text-white px-4 py-2 rounded text-sm font-medium hover:bg-gov-navy transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Workspace
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse flex gap-4">
          <div className="w-1/3 h-32 bg-slate-100 rounded-lg"></div>
          <div className="w-1/3 h-32 bg-slate-100 rounded-lg"></div>
        </div>
      ) : workspaces.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg p-12 text-center">
          <Users className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-700">No Workspaces Found</h3>
          <p className="text-slate-500 text-sm mb-4">Create your first collaborative workspace to start building evidence.</p>
          <button onClick={handleCreateWorkspace} className="bg-gov-blue text-white px-4 py-2 rounded text-sm font-medium">Create Workspace</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map(ws => (
            <div 
              key={ws.id} 
              onClick={() => setSelectedWorkspace(ws)}
              className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-slate-800">{ws.name}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${ws.is_public ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                  {ws.is_public ? 'Public' : 'Private'}
                </span>
              </div>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1">{ws.description}</p>
              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-3 mt-auto">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white"></div>
                  <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white"></div>
                </div>
                <span>Created {new Date(ws.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
