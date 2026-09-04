import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ThumbsUp, 
  CheckSquare, 
  Square, 
  Plus, 
  Copy, 
  Check, 
  Trash2,
  X,
  Key,
  UserCheck,
  Clock
} from 'lucide-react';
import { Place, TeamWorkspace, Task, TeamMember } from '../types';

interface TeamWorkspaceViewProps {
  team: TeamWorkspace;
  places: Place[];
  onUpdateTeam: (updatedTeam: TeamWorkspace) => void;
}

export const TeamWorkspaceView: React.FC<TeamWorkspaceViewProps> = ({
  team,
  places,
  onUpdateTeam,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showJoinCodeModal, setShowJoinCodeModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  // Paste Code state
  const [pastedCode, setPastedCode] = useState('');
  const [codeFeedback, setCodeFeedback] = useState<{ text: string; isError: boolean } | null>(null);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(team.code);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleToggleTask = (taskId: string) => {
    const updatedTasks = team.tasks.map(t => 
      t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
    );
    onUpdateTeam({ ...team, tasks: updatedTasks });
  };

  const handleDeleteTask = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    const updatedTasks = team.tasks.filter(t => t.id !== taskId);
    onUpdateTeam({ ...team, tasks: updatedTasks });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      teamId: team.id,
      title: newTaskTitle,
      assigneeName: "Harish",
      dueDate: "2026-08-14",
      isCompleted: false,
      category: "General"
    };

    onUpdateTeam({ ...team, tasks: [...team.tasks, newTask] });
    setNewTaskTitle('');
  };

  // Send Invite (creates a Pending member)
  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const newMember: TeamMember = {
      id: `mem-${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
      role: 'Traveler',
      status: 'Pending' // Requires invite acceptance or code entry to become Active
    };

    onUpdateTeam({ ...team, members: [...team.members, newMember] });
    setInviteName('');
    setInviteEmail('');
    setShowInviteModal(false);
  };

  // Accept Invite (activates member)
  const handleAcceptInvite = (memberId: string) => {
    const updatedMembers = team.members.map(m => 
      m.id === memberId ? { ...m, status: 'Active' as const } : m
    );
    onUpdateTeam({ ...team, members: updatedMembers });
  };

  // Remove Member
  const handleRemoveMember = (memberId: string) => {
    const updatedMembers = team.members.filter(m => m.id !== memberId);
    onUpdateTeam({ ...team, members: updatedMembers });
  };

  // Join Team by Code (pasting/entering invite code)
  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    setCodeFeedback(null);

    const code = pastedCode.trim().toUpperCase();
    if (!code) {
      setCodeFeedback({ text: 'Please enter or paste a valid workspace code.', isError: true });
      return;
    }

    if (code === team.code.toUpperCase()) {
      // Check if there is any pending invite
      const pendingMember = team.members.find(m => m.status === 'Pending');
      if (pendingMember) {
        // Activate the pending invite
        const updatedMembers = team.members.map(m => 
          m.id === pendingMember.id ? { ...m, status: 'Active' as const } : m
        );
        onUpdateTeam({ ...team, members: updatedMembers });
        setCodeFeedback({ text: `Invite Accepted! ${pendingMember.name} is now an active team member.`, isError: false });
      } else {
        // Add new active traveler member
        const newMember: TeamMember = {
          id: `mem-${Date.now()}`,
          name: 'New Team Traveler',
          email: 'traveler@explorex.ai',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          role: 'Traveler',
          status: 'Active'
        };
        onUpdateTeam({ ...team, members: [...team.members, newMember] });
        setCodeFeedback({ text: `Code verified! You have joined ${team.name}.`, isError: false });
      }

      setPastedCode('');
      setTimeout(() => {
        setShowJoinCodeModal(false);
        setCodeFeedback(null);
      }, 2000);
    } else {
      setCodeFeedback({ text: `Invalid code "${code}". Correct code is ${team.code}`, isError: true });
    }
  };

  const handleVote = (placeId: string) => {
    const currentMemberName = "Harish";
    const updatedVotes = team.votes.map(v => {
      if (v.placeId === placeId) {
        const hasUpvoted = v.upvotes.includes(currentMemberName);
        let newUpvotes = [...v.upvotes];
        newUpvotes = hasUpvoted 
          ? newUpvotes.filter(n => n !== currentMemberName)
          : [...newUpvotes, currentMemberName];
        return { ...v, upvotes: newUpvotes };
      }
      return v;
    });

    onUpdateTeam({ ...team, votes: updatedVotes });
  };

  return (
    <div className="space-y-6 pb-12 font-sans max-w-6xl mx-auto text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{team.name} Workspace</h1>
            <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Team Collab
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-xs mt-1 font-medium">
            Collaborate with team members, vote on destination candidates, and assign tasks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowJoinCodeModal(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Paste Code & Join</span>
          </button>

          <button
            onClick={handleCopyCode}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? "Code Copied!" : `Code: ${team.code}`}</span>
          </button>

          <button
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite</span>
          </button>
        </div>
      </div>

      {/* Grid: Members & Voting */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Members List */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-slate-900 dark:text-white text-base">Members ({team.members.length})</h2>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Invited members join once invite is accepted or code is entered</p>
            </div>
            <button onClick={() => setShowInviteModal(true)} className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer">
              + Invite
            </button>
          </div>

          <div className="space-y-3">
            {team.members.map((mem) => {
              const isPending = mem.status === 'Pending';

              return (
                <div 
                  key={mem.id} 
                  className={`p-3.5 rounded-2xl border transition space-y-2 ${
                    isPending 
                      ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60' 
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={mem.avatar} alt={mem.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/20" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-xs text-slate-900 dark:text-white">{mem.name}</p>
                          {isPending ? (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-300/80 dark:border-amber-700 flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              Pending Invite
                            </span>
                          ) : (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700 flex items-center gap-0.5">
                              <UserCheck className="w-2.5 h-2.5" />
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">{mem.email}</p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      mem.role === 'Organizer' ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                    }`}>
                      {mem.role}
                    </span>
                  </div>

                  {/* Accept Invite Action for Pending Members */}
                  {isPending && (
                    <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/60 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-amber-800 dark:text-amber-300 font-semibold">Invite pending acceptance</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleAcceptInvite(mem.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center gap-1 shadow-2xs transition cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                          <span>Accept Invite</span>
                        </button>
                        <button
                          onClick={() => handleRemoveMember(mem.id)}
                          className="p-1 rounded-lg bg-slate-200/80 dark:bg-slate-700 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer"
                          title="Cancel Invite"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Voting Module */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xs">
          <h2 className="font-extrabold text-slate-900 dark:text-white text-base">Destination Voting Pool</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Team members upvote offbeat spots before finalizing the itinerary.</p>

          <div className="space-y-3">
            {places.slice(0, 3).map((place) => {
              const voteRecord = team.votes.find(v => v.placeId === place.id) || { upvotes: [] };
              const hasUpvoted = voteRecord.upvotes.includes("Harish");

              return (
                <div key={place.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={place.imageUrl} alt={place.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{place.name}</h4>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{place.crowdLevel}% Crowd • {place.region}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleVote(place.id)}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
                      hasUpvoted
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{voteRecord.upvotes.length} Votes</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Shared Task Board */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xs">
        <h2 className="font-extrabold text-slate-900 dark:text-white text-base">Task Preparation Board</h2>

        <form onSubmit={handleAddTask} className="flex gap-2">
          <input
            type="text"
            placeholder="Add new task (e.g. Reserve Villa Cimbrone or check flight deals)..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-medium"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 transition shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </form>

        <div className="space-y-2 pt-1">
          {team.tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => handleToggleTask(task.id)}
              className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between group ${
                task.isCompleted
                  ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 line-through'
                  : 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                {task.isCompleted ? (
                  <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                )}
                <span className="text-xs font-semibold">{task.title}</span>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-600 dark:text-slate-400">
                <span className="font-medium">{task.assigneeName}</span>
                <span className="px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold">{task.category}</span>
                <button
                  onClick={(e) => handleDeleteTask(e, task.id)}
                  className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                  title="Delete Task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Paste / Enter Code Modal */}
      {showJoinCodeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Join Workspace with Code</h3>
              </div>
              <button onClick={() => setShowJoinCodeModal(false)} className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              If you received a team invite code from an organizer, paste or type it below to accept the invite and join the team.
            </p>

            {codeFeedback && (
              <div className={`p-3 rounded-xl text-xs font-bold ${
                codeFeedback.isError 
                  ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800' 
                  : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
              }`}>
                {codeFeedback.text}
              </div>
            )}

            <form onSubmit={handleJoinByCode} className="space-y-3 text-xs font-medium">
              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Enter / Paste Invite Code</label>
                <input
                  type="text"
                  required
                  placeholder={`e.g. ${team.code}`}
                  value={pastedCode}
                  onChange={(e) => setPastedCode(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-indigo-500 font-mono font-extrabold tracking-widest text-slate-900 dark:text-slate-100 uppercase"
                />
              </div>

              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800 text-[11px] text-indigo-900 dark:text-indigo-200 font-semibold">
                Tip: The current demo workspace code is <span className="font-mono font-extrabold underline">{team.code}</span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowJoinCodeModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Accept Invite & Join</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Invite Team Member</h3>
              <button onClick={() => setShowInviteModal(false)} className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-3 text-xs font-medium">
              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Lin"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. maya@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-800 space-y-1">
                <span className="font-bold text-blue-900 dark:text-blue-200 text-[11px] block">Workspace Join Code</span>
                <p className="font-mono font-extrabold text-blue-700 dark:text-blue-300 text-sm tracking-wider">{team.code}</p>
                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                  The member will be sent an invitation code. Once accepted or code entered, they become active.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
