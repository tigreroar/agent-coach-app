import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { 
  CheckCircle2, 
  History, 
  TrendingUp, 
  Users, 
  Phone, 
  Mail, 
  MessageSquare, 
  Share2, 
  UserPlus,
  Trophy,
  LogOut,
  Award,
  ArrowLeft,
  ChevronRight,
  BellRing,
  Camera,
  X,
  Rocket,
  Home,
  Briefcase,
  Send,
  MessageCircle
} from 'lucide-react';

// --- SUPABASE INITIALIZATION ---
let supabaseUrl = '';
let supabaseAnonKey = '';
try { supabaseUrl = import.meta.env.VITE_SUPABASE_URL; } catch (e) {}
try { supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY; } catch (e) {}

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Missing Supabase environment variables. Check your .env file.");
}

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);

// --- HELPER FUNCTIONS ---
const getLocalYYYYMMDD = (date = new Date()) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().split('T')[0];
};

const getStartOfWeek = (dateString) => {
  const d = new Date(dateString + 'T00:00:00');
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
  const monday = new Date(d.setDate(diff));
  return getLocalYYYYMMDD(monday);
};

const isWeekend = (dateString) => {
  const d = new Date(dateString + 'T00:00:00');
  const day = d.getDay();
  return day === 0 || day === 6;
};

const getDaysAgoStr = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return getLocalYYYYMMDD(d);
};

const generateAvatar = (name) => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'Agent')}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffdfbf`;
};

// --- COMPONENTS ---
const DailyGreetingModal = ({ name, onClose }) => {
  const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] p-6 md:p-8 max-w-sm w-full shadow-2xl relative text-center border border-slate-100 animate-in zoom-in-95 duration-300 delay-150">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-50 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
          <X size={20} />
        </button>
        <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-5 text-amber-500 shadow-sm border border-amber-200">
          <Rocket size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">Hello, {name}!</h2>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">Today is {todayDate}</p>
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-7 shadow-inner relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
          <p className="text-slate-700 font-medium leading-relaxed italic text-sm">
            "To grow we must be consistent in what we have to do. Have a productive day!"
          </p>
        </div>
        <button onClick={onClose} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-md active:scale-95">
          Let's crush it!
        </button>
      </div>
    </div>
  );
};

const Header = ({ title, onLogout, profile, unreadCount, onOpenInbox, onOpenProfile }) => (
  <header className="bg-slate-900 text-white p-4 shadow-md sticky top-0 z-10">
    <div className="max-w-md mx-auto flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-slate-800 rounded-lg">
          <Trophy size={20} className="text-amber-400" />
        </div>
        <h1 className="text-xl font-extrabold tracking-tight">AgentCoach<span className="text-amber-400">AI</span></h1>
      </div>
      <div className="flex items-center gap-3">
        {profile && (
          <button 
            onClick={onOpenInbox}
            className="relative p-1.5 bg-slate-800 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <BellRing size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse border border-slate-900">
                {unreadCount}
              </span>
            )}
          </button>
        )}
        {profile && profile.photoURL && (
          <button onClick={onOpenProfile} className="transition-transform hover:scale-105 active:scale-95 outline-none rounded-full" title="Edit Profile">
            <img src={profile.photoURL} alt="User" className="w-8 h-8 rounded-full border-2 border-slate-700 bg-slate-800 object-cover shadow-sm" />
          </button>
        )}
        {onLogout && (
          <button onClick={onLogout} className="p-1.5 bg-slate-800 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors" title="Log Out">
            <LogOut size={18} />
          </button>
        )}
      </div>
    </div>
  </header>
);

const BottomNav = ({ activeTab, setActiveTab, isAdmin }) => {
  const tabs = [
    { id: 'today', icon: CheckCircle2, label: 'Today' },
    { id: 'history', icon: History, label: 'History' },
    { id: 'summary', icon: TrendingUp, label: 'Summary' },
    { id: 'ranking', icon: Award, label: 'Ranking' },
    ...(isAdmin ? [{ id: 'admin', icon: Users, label: 'Coach' }] : []),
  ];

  return (
    <nav className="bg-white border-t border-slate-200 pb-safe sticky bottom-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] overflow-x-auto">
      <div className="max-w-md mx-auto flex justify-between px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-3 px-1 flex flex-col items-center gap-1.5 transition-colors min-w-[64px] ${isActive ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-amber-500' : ''} />
              <span className={`text-[9px] sm:text-[10px] uppercase tracking-wider ${isActive ? 'font-bold' : 'font-semibold'}`}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

const CounterCard = ({ icon: Icon, title, max, value, onChange }) => {
  const chips = Array.from({ length: max + 1 }, (_, i) => i);
  const isComplete = value === max;

  return (
    <div className={`bg-white rounded-2xl p-5 shadow-sm border transition-all duration-300 ${isComplete ? 'border-amber-400 bg-amber-50/10' : 'border-slate-200'}`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl transition-colors ${isComplete ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
            <Icon size={20} strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-slate-800 text-base">{title}</span>
        </div>
        <span className="text-sm font-bold text-slate-500">
          <span className={isComplete ? 'text-amber-500' : 'text-slate-800'}>{value}</span> / {max}
        </span>
      </div>
      <div className="flex justify-between gap-2">
        {chips.map((num) => (
          <button key={num} onClick={() => onChange(num)} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${value === num ? 'bg-slate-900 text-white shadow-md transform scale-105 border border-slate-900' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

// --- PROFILE EDIT MODAL ---
function ProfileEditModal({ profile, onClose, onSave }) {
  const [name, setName] = useState(profile?.name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [photoURL, setPhotoURL] = useState(profile?.photoURL || '');
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width, height = img.height;
        if (width > height) { if (width > 400) { height *= 400 / width; width = 400; } } 
        else { if (height > 400) { width *= 400 / height; height = 400; } }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        setPhotoURL(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    
    await onSave({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      photoURL: photoURL.trim() || generateAvatar(name)
    });
    
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-slate-50 animate-in slide-in-from-bottom-full duration-300">
      <header className="bg-slate-900 text-white p-4 shadow-md shrink-0 flex items-center gap-4">
        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-bold">Edit Profile</h2>
      </header>
      
      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
        <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-5">
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <img src={photoURL || generateAvatar(name)} alt="Profile Preview" className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-slate-100 shadow-md object-cover bg-slate-100" />
              <label htmlFor="edit-photo-upload" className="absolute bottom-2 right-0 p-2 bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-full cursor-pointer shadow-lg transition-colors border-2 border-white">
                <Camera size={16} strokeWidth={2.5} />
              </label>
            </div>
            <input type="file" accept="image/*" onChange={handleImageUpload} id="edit-photo-upload" className="hidden" />
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-2">Tap icon to change</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Your Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-medium" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-medium" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-medium" required />
          </div>

          <div className="pt-4">
            <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- INBOX MODAL ---
function InboxModal({ messages, onClose, onMarkAsRead }) {
  useEffect(() => {
    const unreadMessages = messages.filter(m => !m.read);
    if (unreadMessages.length > 0) {
      onMarkAsRead(unreadMessages.map(m => m.id));
    }
  }, [messages, onMarkAsRead]);

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-slate-50 animate-in slide-in-from-bottom-full duration-300">
      <header className="bg-slate-900 text-white p-4 shadow-md shrink-0 flex items-center gap-4">
        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-bold">Coach Messages</h2>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <MessageCircle size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-medium">No messages yet.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                  <Trophy size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Coach Fernando</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-wrap text-sm text-slate-700 font-medium">
                {msg.message}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// --- MAIN APP COMPONENT ---
export default function App() {
  const [activeUserId, setActiveUserId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [logs, setLogs] = useState([]);
  const [allProfiles, setAllProfiles] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ranking'); 
  const [showGreeting, setShowGreeting] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const todayStr = getLocalYYYYMMDD();

  useEffect(() => {
    const storedId = localStorage.getItem('agentCoach_activeUserId');
    if (storedId) {
      setActiveUserId(storedId);
    } else {
      setActiveUserId(null);
      setProfile(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!activeUserId) return;

    const fetchAllData = async () => {
      const { data: usersData } = await supabase.from('users').select('*');
      if (usersData) {
        setAllProfiles(usersData);
        const myProfile = usersData.find(u => u.id === activeUserId);
        if (myProfile) setProfile(myProfile);
        else {
          localStorage.removeItem('agentCoach_activeUserId');
          setActiveUserId(null);
          setProfile(false); 
        }
      }

      const fifteenDaysAgoStr = getDaysAgoStr(15);
      const { data: logsData } = await supabase.from('daily_logs').select('*').gte('date', fifteenDaysAgoStr);
      if (logsData) setLogs(logsData);

      const { data: msgData } = await supabase.from('messages').select('*').order('createdAt', { ascending: false });
      if (msgData) setMessages(msgData);

      setLoading(false);
    };

    fetchAllData();

    const usersSub = supabase.channel('custom-users').on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, fetchAllData).subscribe();
    const logsSub = supabase.channel('custom-logs').on('postgres_changes', { event: '*', schema: 'public', table: 'daily_logs' }, fetchAllData).subscribe();
    const msgSub = supabase.channel('custom-msg').on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, fetchAllData).subscribe();

    return () => {
      supabase.removeChannel(usersSub);
      supabase.removeChannel(logsSub);
      supabase.removeChannel(msgSub);
    };
  }, [activeUserId]);

  useEffect(() => {
    if (profile && profile.name && profile.id) {
      const storageKey = `agentCoach_greeting_${profile.id}`;
      const lastGreetingDate = localStorage.getItem(storageKey);
      if (lastGreetingDate !== todayStr) {
        setShowGreeting(true);
        localStorage.setItem(storageKey, todayStr);
      }
    }
  }, [profile, todayStr]);

  const myLogs = useMemo(() => logs.filter(l => l.userId === activeUserId), [logs, activeUserId]);
  
  const myMessages = useMemo(() => {
    return messages.filter(m => m.receiverId === activeUserId || m.receiverId === null);
  }, [messages, activeUserId]);
  
  const unreadCount = myMessages.filter(m => !m.read).length;

  const handleMarkMessagesAsRead = async (msgIds) => {
    setMessages(prev => prev.map(m => msgIds.includes(m.id) ? { ...m, read: true } : m));
    for (const id of msgIds) {
      await supabase.from('messages').update({ read: true }).eq('id', id);
    }
  };
  
  const handleSaveLog = async (date, updates) => {
    if (!activeUserId) return;
    const logId = `${activeUserId}_${date}`;
    
    const existing = myLogs.find(l => l.date === date) || { calls: 0, emails: 0, texts: 0, posts: 0, crm: 0, openHouse: 0, networking: 0 };
    const merged = { ...existing, ...updates };
    
    // Este SCORE es el puntaje del Ranking ponderado (Llamadas=1, OpenHouse=10, etc)
    const score = (merged.calls || 0) + (merged.emails || 0) + (merged.texts || 0) + (merged.posts || 0) + (merged.crm || 0) + ((merged.openHouse || 0) * 10) + ((merged.networking || 0) * 10);

    const { error } = await supabase.from('daily_logs').upsert({
      id: logId, userId: activeUserId, date: date,
      calls: merged.calls || 0, emails: merged.emails || 0, texts: merged.texts || 0, posts: merged.posts || 0, crm: merged.crm || 0,
      openHouse: merged.openHouse || 0, networking: merged.networking || 0,
      notes: merged.notes || '', score: score, updatedAt: new Date().toISOString()
    });

    if (error) console.error("Error saving log:", error);
  };

  const handleUpdateProfile = async (updatedData) => {
    // Actualización optimista local
    setProfile(prev => ({ ...prev, ...updatedData }));
    
    const { error } = await supabase.from('users').update(updatedData).eq('id', activeUserId);
    if (error) {
      console.error("Error updating profile:", error);
      alert("There was an error updating your profile.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('agentCoach_activeUserId');
    setActiveUserId(null);
    setProfile(false);
    setActiveTab('today');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-slate-900"></div>
      </div>
    );
  }

  if (profile === false) {
    return <OnboardingView allProfiles={allProfiles} onComplete={(tId) => { localStorage.setItem('agentCoach_activeUserId', tId); setActiveUserId(tId); }} />;
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-amber-200 ${activeTab === 'ranking' ? 'bg-[#0a0a0a]' : 'bg-slate-50 text-slate-800'}`}>
      
      {showGreeting && profile && <DailyGreetingModal name={profile.name} onClose={() => setShowGreeting(false)} />}
      
      {isInboxOpen && (
        <InboxModal messages={myMessages} onClose={() => setIsInboxOpen(false)} onMarkAsRead={handleMarkMessagesAsRead} />
      )}

      {isProfileOpen && (
        <ProfileEditModal profile={profile} onClose={() => setIsProfileOpen(false)} onSave={handleUpdateProfile} />
      )}

      <Header 
        title={activeTab === 'today' ? "Today's Activities" : activeTab === 'history' ? 'Your History' : activeTab === 'summary' ? 'Weekly Summary' : activeTab === 'ranking' ? 'Weekly Ranking' : 'Coach Dashboard'} 
        onLogout={handleLogout}
        profile={profile}
        unreadCount={unreadCount}
        onOpenInbox={() => setIsInboxOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />
      
      <main className="flex-1 overflow-y-auto pb-8 pt-4">
        <div className="max-w-md mx-auto p-4 space-y-6">
          {activeTab === 'today' && <TodayView dateStr={todayStr} log={myLogs.find(l => l.date === todayStr)} onSave={(updates) => handleSaveLog(todayStr, updates)} profile={profile} onEnableNotifications={() => {}} />}
          {activeTab === 'history' && <HistoryView logs={myLogs} onSaveLog={handleSaveLog} todayStr={todayStr} />}
          {activeTab === 'summary' && <SummaryView logs={myLogs} todayStr={todayStr} />}
          {activeTab === 'ranking' && <RankingView profiles={allProfiles} logs={logs} todayStr={todayStr} isAdmin={profile?.role === 'admin'} />}
          {activeTab === 'admin' && profile?.role === 'admin' && (
            <AdminView logs={logs} profiles={allProfiles} todayStr={todayStr} activeUserId={activeUserId} supabase={supabase} />
          )}
        </div>
      </main>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={profile?.role === 'admin'} />
    </div>
  );
}

// --- SUB-VIEWS ---

function OnboardingView({ allProfiles, onComplete }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [loading, setLoading] = useState(false);

  // La función handleImageUpload ya existía, ahora el UI la usará
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width, height = img.height;
        if (width > height) { if (width > 400) { height *= 400 / width; width = 400; } } 
        else { if (height > 400) { width *= 400 / height; height = 400; } }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        setPhotoURL(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    
    const existingProfile = email ? allProfiles.find(p => p.email && p.email.toLowerCase() === email.toLowerCase().trim()) : null;
    let targetId = existingProfile ? existingProfile.id : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    if (!existingProfile) {
      const role = name.toLowerCase().includes('admin') ? 'admin' : 'agent';
      const finalPhotoURL = photoURL.trim() || generateAvatar(name);
      
      const { error } = await supabase.from('users').insert([{
        id: targetId, name: name, email: email.trim(), phone: phone.trim(), role: role, photoURL: finalPhotoURL,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, createdAt: new Date().toISOString(), fcmToken: null
      }]);
      if (error) console.error("Error creating user:", error);
    }
    setLoading(false);
    onComplete(targetId);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-6 items-center justify-center">
      <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <div className="text-center mb-6">
          {photoURL || name ? (
            <img src={photoURL || generateAvatar(name)} alt="Preview" className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-slate-100 shadow-md bg-slate-100 object-cover" />
          ) : (
            <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md"><Trophy size={40} className="text-amber-400" /></div>
          )}
          <h1 className="text-2xl font-extrabold text-slate-900">AgentCoach<span className="text-amber-500">AI</span></h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">Log in or create your account.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Your Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Jane Doe" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all font-medium" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@realestate.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all font-medium" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 234 567 8900" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all font-medium" required />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Profile Photo (Optional)</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              id="photo-upload" 
              className="hidden" 
            />
            <label 
              htmlFor="photo-upload" 
              className="flex items-center justify-center gap-2 w-full bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl px-4 py-3 text-slate-600 hover:bg-slate-100 hover:border-slate-400 cursor-pointer transition-all font-medium"
            >
              <Camera size={20} className={photoURL ? "text-amber-500" : "text-slate-400"} />
              <span className="text-sm">{photoURL ? 'Photo uploaded - Click to change' : 'Upload a Profile Photo'}</span>
            </label>
          </div>

          <div className="pt-2">
            <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? 'Accessing...' : 'Log in / Sign up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RankingView({ profiles, logs, todayStr, isAdmin }) {
  const startOfWeek = getStartOfWeek(todayStr);
  const maxWeeklyPoints = 175; // 175 PUNTOS (Ponderados con OH y Networking a 10pts)
  
  const leaderboard = profiles.map(profile => {
    // Al filtrar por startOfWeek, cada Lunes esto empieza en 0 automáticamente
    const userLogs = logs.filter(l => l.userId === profile.id && l.date >= startOfWeek && l.date <= todayStr && !isWeekend(l.date));
    // La DB guarda el puntaje (score) ponderado sumado previamente
    const score = userLogs.reduce((sum, l) => sum + (l.score || 0), 0);
    const percent = Math.round((score / maxWeeklyPoints) * 100);
    return { ...profile, score, percent };
  }).sort((a, b) => b.score - a.score);

  return (
    <div className="animate-in fade-in duration-500 pb-10 font-sans">
      <div className="bg-[#111111] rounded-[24px] p-5 shadow-2xl border border-gray-800/50">
        <div className="flex justify-between items-center mb-6 px-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">Weekly Rankings</h2>
        </div>
        <div className="flex justify-between text-[11px] text-gray-500 font-bold mb-3 px-3 tracking-widest uppercase">
          <div className="flex gap-8"><span className="w-8 text-center">RANK</span><span>AGENT</span></div><span>SCORE</span>
        </div>
        <div className="space-y-4">
          {leaderboard.map((user, index) => {
            const rank = index + 1; const isFirst = rank === 1; const isGood = user.percent >= 50;
            const textPctColor = isGood ? 'text-[#00e5ff]' : 'text-[#ff3366]';
            const bgPctColor = isGood ? 'bg-[#00e5ff]' : 'bg-[#ff3366]';
            const barColor = isGood ? 'bg-[#b2ff05]' : 'bg-[#ff3366]';
            return (
              <div key={user.id} className="relative flex flex-col group">
                <div className="flex justify-between items-center px-2 py-2">
                  <div className="flex items-center gap-5">
                    <div className={`w-8 flex justify-center text-lg font-bold ${isFirst ? 'text-[#b2ff05]' : 'text-white'}`}>
                      {isFirst ? <div className="w-8 h-8 rounded-full border border-[#b2ff05] flex items-center justify-center">{rank}</div> : rank}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={user.photoURL || generateAvatar(user.name)} alt={user.name} className="w-12 h-12 rounded-full object-cover bg-gray-800" style={isFirst ? { boxShadow: '0 0 15px rgba(178, 255, 5, 0.4)' } : {}} />
                        <div className={`absolute -bottom-1 -right-2 px-1.5 py-0.5 rounded-md text-[10px] font-black text-[#111] ${bgPctColor} shadow-sm border border-[#111]`}>{Math.min(user.percent, 100)}%</div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white font-bold text-base">{user.name}</span>
                        <div className="text-sm font-medium"><span className={textPctColor}>{user.score}</span><span className="text-gray-500">/{maxWeeklyPoints} Pts</span></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full mt-2 overflow-hidden mx-2" style={{ width: 'calc(100% - 16px)' }}>
                  <div className={`h-full rounded-full ${barColor} shadow-[0_0_8px_currentColor] opacity-90`} style={{ width: `${Math.min(user.percent, 100)}%` }}></div>
                </div>
              </div>
            );
          })}
          {leaderboard.length === 0 && <div className="text-center py-8 text-gray-500">No activity recorded this week yet.</div>}
        </div>
      </div>
    </div>
  );
}

function TodayView({ dateStr, log, onSave, profile }) {
  if (isWeekend(dateStr)) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 px-4">
        <div className="bg-white p-6 rounded-full shadow-sm border border-slate-100 mb-6"><TrendingUp size={48} className="text-amber-500" /></div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">It's the Weekend!</h2>
        <p className="text-slate-500 mb-8 font-medium">No activities required today. Take a break or review your week.</p>
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm w-full text-left">
          <h3 className="font-bold text-slate-800 mb-3">Weekend Reflection</h3>
          <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 placeholder-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all resize-none" placeholder="Jot down your ideas or plans for next week..." rows={4} value={log?.notes || ''} onChange={(e) => onSave({ notes: e.target.value })} />
        </div>
      </div>
    );
  }

  const data = log || { calls: 0, emails: 0, texts: 0, posts: 0, crm: 0, openHouse: 0, networking: 0, notes: '' };
  
  // Para la vista Today solo contamos la cantidad de ITEMS o ACTIVIDADES completadas (Max 17)
  const totalItems = (data.calls || 0) + (data.emails || 0) + (data.texts || 0) + (data.posts || 0) + (data.crm || 0) + (data.openHouse || 0) + (data.networking || 0);
  const percent = Math.round((totalItems / 17) * 100);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-900 rounded-3xl p-6 shadow-lg border border-slate-800">
        <div className="flex justify-between items-end mb-3"><div><h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Daily Goal</h2><p className="text-3xl font-black text-white">{percent}%</p></div><div className="text-right"><p className="text-3xl font-black text-amber-400">{totalItems}<span className="text-lg text-slate-500 font-bold">/17</span></p></div></div>
        <div className="w-full bg-slate-800/50 rounded-full h-3 mt-4 overflow-hidden shadow-inner"><div className="bg-gradient-to-r from-amber-500 to-amber-400 h-3 rounded-full transition-all duration-700 ease-out" style={{ width: `${Math.min(percent, 100)}%` }}></div></div>
        {percent >= 100 && <p className="text-amber-400 text-sm font-bold mt-4 flex items-center gap-1.5"><CheckCircle2 size={18} /> Incredible! You crushed it today.</p>}
      </div>
      <div className="space-y-4">
        <CounterCard icon={Phone} title="Calls" max={5} value={data.calls || 0} onChange={(v) => onSave({ calls: v })} />
        <CounterCard icon={Mail} title="Emails" max={4} value={data.emails || 0} onChange={(v) => onSave({ emails: v })} />
        <CounterCard icon={MessageSquare} title="Texts" max={3} value={data.texts || 0} onChange={(v) => onSave({ texts: v })} />
        <CounterCard icon={Share2} title="Social Posts" max={2} value={data.posts || 0} onChange={(v) => onSave({ posts: v })} />
        <CounterCard icon={UserPlus} title="CRM Adds" max={1} value={data.crm || 0} onChange={(v) => onSave({ crm: v })} />
        <CounterCard icon={Home} title="Open House" max={1} value={data.openHouse || 0} onChange={(v) => onSave({ openHouse: v })} />
        <CounterCard icon={Briefcase} title="Networking Event" max={1} value={data.networking || 0} onChange={(v) => onSave({ networking: v })} />
      </div>
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <label className="block font-bold text-slate-800 mb-3">Today's Wins / Obstacles</label>
        <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all resize-none" placeholder="Had an excellent conversation with..." rows={3} value={data.notes || ''} onChange={(e) => onSave({ notes: e.target.value })} />
      </div>
    </div>
  );
}

function SummaryView({ logs, todayStr }) {
  const startOfWeek = getStartOfWeek(todayStr);
  const weeklyLogs = logs.filter(l => l.date >= startOfWeek && l.date <= todayStr && !isWeekend(l.date));
  
  const totals = {
    calls: weeklyLogs.reduce((sum, l) => sum + (l.calls || 0), 0), 
    emails: weeklyLogs.reduce((sum, l) => sum + (l.emails || 0), 0),
    texts: weeklyLogs.reduce((sum, l) => sum + (l.texts || 0), 0), 
    posts: weeklyLogs.reduce((sum, l) => sum + (l.posts || 0), 0),
    crm: weeklyLogs.reduce((sum, l) => sum + (l.crm || 0), 0), 
    openHouse: weeklyLogs.reduce((sum, l) => sum + (l.openHouse || 0), 0),
    networking: weeklyLogs.reduce((sum, l) => sum + (l.networking || 0), 0)
  };

  // Para Summary contamos ACTIVIDADES (Max 85)
  const totalItems = totals.calls + totals.emails + totals.texts + totals.posts + totals.crm + totals.openHouse + totals.networking;
  
  const daysLogged = weeklyLogs.filter(l => ((l.calls || 0) + (l.emails || 0) + (l.texts || 0) + (l.posts || 0) + (l.crm || 0) + (l.openHouse || 0) + (l.networking || 0)) > 0).length;
  
  const d = new Date(todayStr + 'T00:00:00'); const dayOfWeek = d.getDay(); let daysPassed = dayOfWeek === 0 || dayOfWeek === 6 ? 5 : dayOfWeek; 
  const maxPossible = daysPassed * 17; // 17 Actividades máximas por día
  const weeklyPercent = maxPossible > 0 ? Math.round((totalItems / maxPossible) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 text-center">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Activities Completed</h2>
        <div className="text-6xl font-black text-slate-900 mb-3">{totalItems}<span className="text-2xl text-slate-300">/85</span></div>
        <p className="font-semibold text-slate-600 px-2 text-sm">{weeklyPercent >= 80 ? "You're on a roll! Keep the momentum." : weeklyPercent >= 50 ? "Good effort. Let's push a little more." : "Every day is a new opportunity. You got this!"}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center"><p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Active Days</p><p className="text-3xl font-black text-slate-900">{daysLogged} <span className="text-lg text-slate-300 font-medium">/ 5</span></p></div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center"><p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Pacing</p><p className="text-3xl font-black text-slate-900">{weeklyPercent}%</p></div>
      </div>
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-5">Activity Breakdown</h3>
        <div className="space-y-4">
          {[
            { label: 'Calls', icon: Phone, total: totals.calls, max: 25 }, 
            { label: 'Emails', icon: Mail, total: totals.emails, max: 20 }, 
            { label: 'Texts', icon: MessageSquare, total: totals.texts, max: 15 }, 
            { label: 'Social Posts', icon: Share2, total: totals.posts, max: 10 }, 
            { label: 'CRM Adds', icon: UserPlus, total: totals.crm, max: 5 },
            { label: 'Open House', icon: Home, total: totals.openHouse, max: 5 },
            { label: 'Networking', icon: Briefcase, total: totals.networking, max: 5 }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3"><div className="p-2 bg-slate-50 rounded-lg"><Icon size={16} className="text-slate-500" /></div><span className="text-slate-700 font-medium text-sm">{item.label}</span></div>
                <div className="flex items-center gap-4"><div className="w-28 bg-slate-100 h-2.5 rounded-full overflow-hidden"><div className="bg-amber-400 h-2.5 rounded-full" style={{ width: `${Math.min((item.total / item.max) * 100, 100)}%` }}></div></div><span className="text-sm font-black text-slate-900 w-6 text-right">{item.total}</span></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function HistoryView({ logs, onSaveLog, todayStr, readOnly = false }) {
  const [editingLog, setEditingLog] = useState(null);
  const startOfWeek = getStartOfWeek(todayStr);
  const sortedLogs = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (editingLog) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4 text-slate-500 hover:text-slate-900 cursor-pointer font-medium transition-colors" onClick={() => setEditingLog(null)}><ArrowLeft size={18} /><span className="text-sm">Back to History (Editing {editingLog.date})</span></div>
        <TodayView dateStr={editingLog.date} log={editingLog} onSave={(updates) => { onSaveLog(editingLog.date, updates); setEditingLog(prev => ({...prev, ...updates})); }} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedLogs.length === 0 ? (
        <div className="text-center p-10 text-slate-400 bg-white rounded-3xl border border-slate-200 border-dashed"><History size={48} className="mx-auto mb-4 opacity-30" /><p className="font-medium">No history recorded yet.</p></div>
      ) : (
        sortedLogs.map(log => {
          if (isWeekend(log.date) && !log.notes) return null;
          
          const isCurrentWeek = log.date >= startOfWeek && log.date <= todayStr; 
          
          // History cuenta ITEMS, no Puntos
          const totalItems = (log.calls || 0) + (log.emails || 0) + (log.texts || 0) + (log.posts || 0) + (log.crm || 0) + (log.openHouse || 0) + (log.networking || 0);
          const pct = Math.round((totalItems / 17) * 100); 
          const canEdit = isCurrentWeek && !readOnly;

          return (
            <div key={log.date} className={`bg-white p-5 rounded-2xl border shadow-sm ${canEdit ? 'border-slate-200 hover:border-amber-400 cursor-pointer transition-all' : 'border-slate-100 opacity-80'}`} onClick={() => canEdit ? setEditingLog(log) : null}>
              <div className="flex justify-between items-center mb-3"><span className="font-bold text-slate-800 capitalize">{new Date(log.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span><span className={`text-sm font-black ${pct >= 100 ? 'text-amber-500' : 'text-slate-400'}`}>{totalItems}/17</span></div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-4"><div className="bg-amber-400 h-2 rounded-full" style={{ width: `${Math.min(pct, 100)}%` }}></div></div>
              {log.notes && <p className="text-xs text-slate-500 font-medium italic bg-slate-50 p-3 rounded-xl border border-slate-100 line-clamp-2">"{log.notes}"</p>}
              {canEdit && <p className="text-[10px] text-amber-600/70 mt-3 uppercase tracking-wider font-bold">Tap to edit</p>}
            </div>
          );
        })
      )}
    </div>
  );
}

// --- ADMIN / COACH VIEW ---
function AdminView({ logs, profiles, todayStr, activeUserId, supabase }) {
  const [selectedProfile, setSelectedProfile] = useState(null);
  
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageTargetType, setMessageTargetType] = useState('team'); 
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const startOfWeek = getStartOfWeek(todayStr);
  const directory = profiles.map(profile => {
    const userLogs = logs.filter(l => l.userId === profile.id && l.date >= startOfWeek && l.date <= todayStr);
    // Para Coach, sí mostramos los Puntos Ponderados del Ranking
    const weeklyScore = userLogs.reduce((sum, l) => sum + (l.score || 0), 0);
    const lastActive = userLogs.length > 0 ? [...userLogs].sort((a,b) => b.date.localeCompare(a.date))[0].date : 'Never';
    return { ...profile, weeklyScore, lastActive };
  }).sort((a, b) => b.weeklyScore - a.weeklyScore);

  const handleOpenCompose = (type) => {
    setMessageTargetType(type);
    setSelectedAgentId(type === 'agent' && directory.length > 0 ? directory[0].id : '');
    setMessageText('');
    setIsMessageModalOpen(true);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    setIsSending(true);

    const fullMessage = messageText.trim() + '\n\nSincerely, Fernando, your COACH';
    const receiverId = messageTargetType === 'agent' ? selectedAgentId : null;
    
    const { error } = await supabase.from('messages').insert([{
      id: Math.random().toString(36).substring(2, 15),
      senderId: activeUserId,
      receiverId: receiverId,
      message: fullMessage,
      createdAt: new Date().toISOString(),
      read: false
    }]);

    setIsSending(false);
    if (!error) {
      setIsMessageModalOpen(false);
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification("Message Sent!", { body: "Your agents will see this in their inbox." });
      } else {
        alert("Message sent successfully!");
      }
    } else {
      console.error("Error sending msg", error);
      alert("Error sending message.");
    }
  };

  if (selectedProfile) {
    const userLogs = logs.filter(l => l.userId === selectedProfile.id);
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <button onClick={() => setSelectedProfile(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors"><ArrowLeft size={20} /> Back to Directory</button>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex items-center gap-4">
          <img src={selectedProfile.photoURL || generateAvatar(selectedProfile.name)} alt={selectedProfile.name} className="w-14 h-14 rounded-full border-2 border-slate-100 object-cover bg-slate-100" />
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-black text-slate-900 truncate">{selectedProfile.name}</h2>
            <p className="text-sm text-slate-500 font-medium truncate">{selectedProfile.email}</p>
            {selectedProfile.phone && (
              <p className="text-sm text-amber-600 font-semibold truncate mt-0.5 flex items-center gap-1"><Phone size={14} /> {selectedProfile.phone}</p>
            )}
          </div>
        </div>
        <div><h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Activity Summary</h3><SummaryView logs={userLogs} todayStr={todayStr} /></div>
        <div><h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 px-2 mt-8">Daily History</h3><HistoryView logs={userLogs} onSaveLog={() => {}} todayStr={todayStr} readOnly={true} /></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 relative">
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => handleOpenCompose('agent')} className="bg-white hover:bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-3 transition-colors group">
          <div className="p-3 bg-slate-100 group-hover:bg-amber-100 group-hover:text-amber-600 rounded-full text-slate-700 transition-colors"><MessageSquare size={20} /></div>
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider text-center">Notify Agent</span>
        </button>
        <button onClick={() => handleOpenCompose('team')} className="bg-slate-900 hover:bg-slate-800 p-5 rounded-2xl shadow-md flex flex-col items-center justify-center gap-3 transition-colors">
          <div className="p-3 bg-amber-400 rounded-full text-slate-900"><BellRing size={20} /></div>
          <span className="text-xs font-bold text-white uppercase tracking-wider text-center">Notify Team</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-end mb-6"><div><h2 className="text-lg font-extrabold text-slate-900 mb-1">Agent Directory</h2><p className="text-sm text-slate-500 font-medium">Top scores of the week</p></div><div className="p-2 bg-slate-50 rounded-lg"><Users size={20} className="text-slate-400" /></div></div>
        <div className="space-y-3">
          {directory.map((user, idx) => (
            <div key={user.id} onClick={() => setSelectedProfile(user)} className="flex items-center bg-slate-50 p-3 rounded-2xl border border-slate-100 transition-all hover:shadow-md hover:border-amber-200 cursor-pointer group">
              <div className="relative mr-4 shrink-0"><img src={user.photoURL || generateAvatar(user.name)} className="w-10 h-10 rounded-full object-cover border border-slate-200" />{idx < 3 && <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm border border-white ${idx === 0 ? 'bg-amber-400' : idx === 1 ? 'bg-slate-400' : 'bg-amber-700/50'}`}>{idx + 1}</div>}</div>
              <div className="flex-1 min-w-0 pr-2"><p className="text-sm font-bold text-slate-800 truncate group-hover:text-amber-600 transition-colors">{user.name || 'Anonymous'}</p><p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5 truncate"><span className="text-slate-500">{user.weeklyScore} pts</span> • Last Act: {user.lastActive}</p></div>
              <div className="text-slate-300 group-hover:text-amber-500 transition-colors shrink-0"><ChevronRight size={20} /></div>
            </div>
          ))}
          {directory.length === 0 && <p className="text-center text-slate-400 font-medium py-4">No agents registered yet.</p>}
        </div>
      </div>

      {isMessageModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] p-6 max-w-md w-full shadow-2xl relative border border-slate-100 animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300">
            <button onClick={() => setIsMessageModalOpen(false)} className="absolute top-4 right-4 p-2 bg-slate-50 text-slate-400 hover:text-slate-700 rounded-full transition-colors"><X size={20} /></button>
            <h2 className="text-xl font-black text-slate-900 mb-1">{messageTargetType === 'team' ? 'Broadcast to Team' : 'Message Agent'}</h2>
            <p className="text-slate-500 text-sm font-medium mb-6">Send an in-app notification instantly.</p>

            {messageTargetType === 'agent' && (
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Select Agent</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:border-amber-400" value={selectedAgentId} onChange={(e) => setSelectedAgentId(e.target.value)}>
                  {directory.map(agent => (
                    <option key={agent.id} value={agent.id}>{agent.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Message</label>
              <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-all resize-none" placeholder="Type your message here..." rows={4} value={messageText} onChange={(e) => setMessageText(e.target.value)} />
              <div className="mt-3 p-3 bg-slate-100 rounded-lg border border-slate-200">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Preview Signature:</p>
                <p className="text-sm font-medium text-slate-700 italic">...<br/><br/>Sincerely, Fernando, your COACH</p>
              </div>
            </div>

            <button onClick={handleSendMessage} disabled={isSending || !messageText.trim()} className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2">
              {isSending ? 'Sending...' : <><Send size={18} /> Send Message</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
