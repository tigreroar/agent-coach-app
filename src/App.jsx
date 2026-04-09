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
  MessageCircle,
  FileText,
  DollarSign,
  Gift,
  BookOpen,
  Copy,
  Info
} from 'lucide-react';

// --- SUPABASE INITIALIZATION ---
let supabaseUrl = '';
let supabaseAnonKey = '';
try { supabaseUrl = import.meta.env.VITE_SUPABASE_URL; } catch (e) {}
try { supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY; } catch (e) {}

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

const copyToClipboard = (text) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try { document.execCommand('copy'); } catch (err) {}
  document.body.removeChild(textArea);
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

const Header = ({ onLogout, profile, unreadCount, onOpenInbox, onOpenProfile }) => (
  <header className="bg-slate-900 text-white p-4 shadow-md sticky top-0 z-10">
    <div className="max-w-md mx-auto flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-800 rounded-lg">
            <Trophy size={20} className="text-amber-400" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight flex items-baseline gap-1.5 flex-wrap">
            <span>AgentCoach<span className="text-amber-400">AI</span></span>
            <span className="text-xs font-bold text-slate-300 italic whitespace-nowrap">"The Perfect Week"</span>
          </h1>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {profile && (
            <button onClick={onOpenInbox} className="relative p-1.5 bg-slate-800 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
              <BellRing size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse border border-slate-900">
                  {unreadCount}
                </span>
              )}
            </button>
          )}
          {profile?.photoURL && (
            <button onClick={onOpenProfile} className="transition-transform hover:scale-105 active:scale-95 outline-none rounded-full">
              <img src={profile.photoURL} alt="User" className="w-8 h-8 rounded-full border-2 border-slate-700 bg-slate-800 object-cover shadow-sm" />
            </button>
          )}
          {onLogout && (
            <button onClick={onLogout} className="p-1.5 bg-slate-800 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
              <LogOut size={18} />
            </button>
          )}
        </div>
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

// --- SUB-VIEWS ---

function OnboardingView({ onComplete }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [photoURL, setPhotoURL] = useState('');
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
    if (!name.trim() || !email.trim()) return;
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    const { data: existingUsers } = await supabase.from('users').select('*').eq('email', cleanEmail);
    const existingProfile = existingUsers?.[0];
    let targetId = existingProfile?.id || crypto.randomUUID();

    if (!existingProfile) {
      const role = name.toLowerCase().includes('admin') ? 'admin' : 'agent';
      await supabase.from('users').insert([{
        id: targetId, name: name.trim(), email: cleanEmail, phone: phone.trim(), 
        role: role, photoURL: photoURL || generateAvatar(name), timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, 
        createdAt: new Date().toISOString()
      }]);

      // MAGIA DE REFERIDOS: Liberar puntos al que invitó
      const { data: referredLogs } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('referralEmail', cleanEmail)
        .eq('referralStatus', 'pending');

      if (referredLogs?.length > 0) {
        for (const rLog of referredLogs) {
          const newScore = (rLog.score || 0) + 20; 
          await supabase.from('daily_logs').update({ referralStatus: 'registered', score: newScore }).eq('id', rLog.id);
        }
      }
    }
    setLoading(false);
    onComplete(targetId);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-6 items-center justify-center">
      <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md"><Trophy size={40} className="text-amber-400" /></div>
          <h1 className="text-2xl font-extrabold text-slate-900">AgentCoach<span className="text-amber-500">AI</span></h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">Log in or create your account.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium" required />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium" required />
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium" />
          <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl transition-all shadow-md">
            {loading ? 'Accessing...' : 'Log in / Sign up'}
          </button>
        </form>
      </div>
    </div>
  );
}

function RankingView({ profiles, logs, todayStr }) {
  const startOfWeek = getStartOfWeek(todayStr);
  const maxWeeklyPoints = 835; 
  
  const leaderboard = profiles.map(profile => {
    const userLogs = logs.filter(l => l.userId === profile.id && l.date >= startOfWeek && l.date <= todayStr && !isWeekend(l.date));
    const score = userLogs.reduce((sum, l) => sum + (l.score || 0), 0);
    const percent = Math.round((score / maxWeeklyPoints) * 100);
    return { ...profile, score, percent };
  }).sort((a, b) => b.score - a.score);

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <div className="bg-[#111111] rounded-[24px] p-5 shadow-2xl border border-gray-800/50">
        <h2 className="text-2xl font-bold text-white mb-6">Weekly Rankings</h2>
        <div className="space-y-4">
          {leaderboard.map((user, index) => {
            const rank = index + 1;
            const isGood = user.percent >= 50;
            return (
              <div key={user.id} className="flex flex-col">
                <div className="flex justify-between items-center py-2 px-1">
                  <div className="flex items-center gap-4">
                    <span className={`text-lg font-bold w-6 ${rank === 1 ? 'text-amber-400' : 'text-white'}`}>{rank}</span>
                    <img src={user.photoURL || generateAvatar(user.name)} className="w-10 h-10 rounded-full border border-gray-700" />
                    <div>
                      <p className="text-white font-bold text-sm">{user.name}</p>
                      <p className="text-gray-500 text-xs">{user.score} / {maxWeeklyPoints} Pts</p>
                    </div>
                  </div>
                  <div className={`text-xs font-black px-2 py-1 rounded ${isGood ? 'bg-cyan-500/20 text-cyan-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {Math.min(user.percent, 100)}%
                  </div>
                </div>
                <div className="w-full h-1 bg-gray-800 rounded-full mt-1">
                  <div className={`h-full rounded-full ${isGood ? 'bg-cyan-400' : 'bg-rose-500'}`} style={{ width: `${Math.min(user.percent, 100)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TodayView({ dateStr, log, onSave, profile }) {
  const data = log || { 
    conversations: 0, followUpEmail: 0, texts: 0, socialPosts: 0, authorityAction: 0, contactsAdded: 0, 
    openHouse: 0, openHouseAddress: '', networkingEvent: 0, networkingEventName: '', 
    listingAppointment: 0, listingAppointmentAddress: '', buyerConsultation: 0, buyerConsultationAddress: '', 
    transactionClose: 0, transactionCloseAddress: '', referralName: '', referralEmail: '', referralStatus: 'none', notes: '' 
  };

  // Estados locales para los inputs condicionales
  const [localOHAddr, setLocalOHAddr] = useState(data.openHouseAddress || '');
  const [localNetName, setLocalNetName] = useState(data.networkingEventName || '');
  const [localListAddr, setLocalListAddr] = useState(data.listingAppointmentAddress || '');
  const [localBuyerAddr, setLocalBuyerAddr] = useState(data.buyerConsultationAddress || '');
  const [localTransAddr, setLocalTransAddr] = useState(data.transactionCloseAddress || '');
  const [localNotes, setLocalNotes] = useState(data.notes || '');

  // Estados específicos para Referidos
  const [localRefName, setLocalRefName] = useState('');
  const [localRefEmail, setLocalRefEmail] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLocalOHAddr(data.openHouseAddress || '');
    setLocalNetName(data.networkingEventName || '');
    setLocalListAddr(data.listingAppointmentAddress || '');
    setLocalBuyerAddr(data.buyerConsultationAddress || '');
    setLocalTransAddr(data.transactionCloseAddress || '');
    setLocalNotes(data.notes || '');
  }, [data.id, dateStr]);

  const totalItems = (data.conversations || 0) + (data.followUpEmail || 0) + (data.texts || 0) + 
                    (data.socialPosts || 0) + (data.authorityAction || 0) + (data.contactsAdded || 0) + 
                    (data.openHouseAddress?.trim() ? (data.openHouse || 0) : 0) + 
                    (data.networkingEventName?.trim() ? (data.networkingEvent || 0) : 0) + 
                    (data.listingAppointmentAddress?.trim() ? (data.listingAppointment || 0) : 0) + 
                    (data.buyerConsultationAddress?.trim() ? (data.buyerConsultation || 0) : 0) + 
                    (data.transactionCloseAddress?.trim() ? (data.transactionClose || 0) : 0);

  const percent = Math.round((totalItems / 30) * 100);

  const handleCopyInvite = () => {
    if (!localRefName.trim() || !localRefEmail.trim()) return;
    const msg = `${profile?.name || 'A user'} has invited you to Agent Coach AI! Join here: https://agentcoachai.com`;
    copyToClipboard(msg);
    
    // Guardamos en DB con estado 'pending'
    onSave({ 
      referralName: localRefName, 
      referralEmail: localRefEmail.toLowerCase(), 
      referralStatus: 'pending' 
    });

    // Limpiamos campos y damos feedback
    setLocalRefName('');
    setLocalRefEmail('');
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (isWeekend(dateStr)) {
    return (
      <div className="text-center py-12 px-4">
        <div className="bg-white p-6 rounded-full shadow-sm border border-slate-100 mb-6 w-fit mx-auto"><TrendingUp size={48} className="text-amber-500" /></div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">It's the Weekend!</h2>
        <p className="text-slate-500 mb-8 font-medium">Take a break or review your week.</p>
        <textarea className="w-full bg-white border rounded-xl p-4 text-sm" placeholder="Weekend Reflection..." value={localNotes} onChange={(e) => setLocalNotes(e.target.value)} onBlur={() => onSave({ notes: localNotes })} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="bg-slate-900 rounded-3xl p-6 shadow-lg border border-slate-800">
        <div className="flex justify-between items-end mb-3">
          <div><h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Daily Goal</h2><p className="text-3xl font-black text-white">{percent}%</p></div>
          <div className="text-right"><p className="text-3xl font-black text-amber-400">{totalItems}<span className="text-lg text-slate-500 font-bold">/30</span></p></div>
        </div>
        <div className="w-full bg-slate-800/50 rounded-full h-3 mt-4 overflow-hidden shadow-inner">
          <div className="bg-gradient-to-r from-amber-500 to-amber-400 h-3 rounded-full transition-all duration-700" style={{ width: `${Math.min(percent, 100)}%` }}></div>
        </div>
      </div>

      <div className="space-y-4">
        <CounterCard icon={Phone} title="Conversations" max={5} value={data.conversations || 0} onChange={(v) => onSave({ conversations: v })} />
        <CounterCard icon={Mail} title="Follow-Up Email" max={4} value={data.followUpEmail || 0} onChange={(v) => onSave({ followUpEmail: v })} />
        <CounterCard icon={MessageSquare} title="Texts" max={3} value={data.texts || 0} onChange={(v) => onSave({ texts: v })} />
        <CounterCard icon={Share2} title="Social Posts" max={2} value={data.socialPosts || 0} onChange={(v) => onSave({ socialPosts: v })} />
        <CounterCard icon={UserPlus} title="Authority Action" max={1} value={data.authorityAction || 0} onChange={(v) => onSave({ authorityAction: v })} />
        <CounterCard icon={BookOpen} title="Contacts in CRM" max={3} value={data.contactsAdded || 0} onChange={(v) => onSave({ contactsAdded: v })} />

        <div className="py-2 border-t border-slate-200 mt-6" />

        {/* HIGH VALUE SECTIONS */}
        <div className="space-y-4">
          <div>
            <CounterCard icon={Home} title="Open House (10 Pts)" max={1} value={data.openHouse || 0} onChange={(v) => onSave({ openHouse: v })} />
            {data.openHouse > 0 && (
              <input type="text" placeholder="Address..." className="w-full mt-2 p-3 bg-white border border-slate-200 rounded-xl text-sm" value={localOHAddr} onChange={(e) => setLocalOHAddr(e.target.value)} onBlur={() => onSave({ openHouseAddress: localOHAddr })} />
            )}
          </div>
          <div>
            <CounterCard icon={Briefcase} title="Networking (10 Pts)" max={1} value={data.networkingEvent || 0} onChange={(v) => onSave({ networkingEvent: v })} />
            {data.networkingEvent > 0 && (
              <input type="text" placeholder="Event Name..." className="w-full mt-2 p-3 bg-white border border-slate-200 rounded-xl text-sm" value={localNetName} onChange={(e) => setLocalNetName(e.target.value)} onBlur={() => onSave({ networkingEventName: localNetName })} />
            )}
          </div>
          <div>
            <CounterCard icon={FileText} title="Listing Agreement (10 Pts)" max={3} value={data.listingAppointment || 0} onChange={(v) => onSave({ listingAppointment: v })} />
            {data.listingAppointment > 0 && (
              <input type="text" placeholder="Address..." className="w-full mt-2 p-3 bg-white border border-slate-200 rounded-xl text-sm" value={localListAddr} onChange={(e) => setLocalListAddr(e.target.value)} onBlur={() => onSave({ listingAppointmentAddress: localListAddr })} />
            )}
          </div>
        </div>

        {/* REFERRAL SYSTEM */}
        <div className={`bg-white rounded-2xl p-5 shadow-sm border transition-all duration-300 ${data.referralStatus === 'registered' ? 'border-amber-400 bg-amber-50/10' : 'border-slate-200'}`}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${data.referralStatus === 'registered' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                <Gift size={20} strokeWidth={2.5} />
              </div>
              <span className="font-semibold text-slate-800 text-base">Invite An Agent</span>
            </div>
            {data.referralStatus === 'registered' && <span className="text-sm font-bold text-amber-500">+20 Pts Unlocked!</span>}
          </div>

          {data.referralStatus !== 'registered' ? (
            <div className="space-y-3">
              {copied ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center animate-in zoom-in-95 duration-200">
                  <p className="text-amber-700 font-bold text-sm flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} /> Pending referral to Subscription
                  </p>
                  <p className="text-[10px] text-amber-500 uppercase tracking-widest mt-1">Invitation copied & saved in DB</p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-slate-500 font-medium mb-1">Enter details below to generate your invite message.</p>
                  <input type="text" placeholder="Agent Name" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium" value={localRefName} onChange={(e) => setLocalRefName(e.target.value)} />
                  <input type="email" placeholder="Agent Email Address" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium" value={localRefEmail} onChange={(e) => setLocalRefEmail(e.target.value)} />
                  
                  {localRefName.trim() && localRefEmail.trim() && (
                    <button onClick={handleCopyInvite} className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 mt-2">
                      <Copy size={16} /> Copy Message & Save
                    </button>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="p-3 bg-amber-100/50 rounded-xl border border-amber-200">
              <p className="text-sm font-medium text-slate-700">🎉 Success! <strong>{data.referralName}</strong> joined. Points added to ranking.</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mt-6">
        <label className="block font-bold text-slate-800 mb-3">Today's Wins / Obstacles</label>
        <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm resize-none" placeholder="Notes..." rows={3} value={localNotes} onChange={(e) => setLocalNotes(e.target.value)} onBlur={() => onSave({ notes: localNotes })} />
      </div>
    </div>
  );
}

// --- APP COMPONENT ---

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
    if (storedId) setActiveUserId(storedId);
    else { setActiveUserId(null); setProfile(false); setLoading(false); }
  }, []);

  useEffect(() => {
    if (!activeUserId) return;
    const fetchAllData = async () => {
      const { data: usersData } = await supabase.from('users').select('*');
      if (usersData) {
        setAllProfiles(usersData);
        const myProfile = usersData.find(u => u.id === activeUserId);
        if (myProfile) setProfile(myProfile);
        else { localStorage.removeItem('agentCoach_activeUserId'); setActiveUserId(null); setProfile(false); }
      }
      const { data: logsData } = await supabase.from('daily_logs').select('*').gte('date', getDaysAgoStr(15));
      if (logsData) setLogs(logsData);
      const { data: msgData } = await supabase.from('messages').select('*').order('createdAt', { ascending: false });
      if (msgData) setMessages(msgData);
      setLoading(false);
    };
    fetchAllData();
    const chan = supabase.channel('realtime').on('postgres_changes', { event: '*', schema: 'public' }, fetchAllData).subscribe();
    return () => { supabase.removeChannel(chan); };
  }, [activeUserId]);

  const myLogs = useMemo(() => logs.filter(l => l.userId === activeUserId), [logs, activeUserId]);
  const myMessages = useMemo(() => messages.filter(m => m.receiverId === activeUserId), [messages, activeUserId]);
  const unreadCount = myMessages.filter(m => !m.read).length;

  const handleSaveLog = async (date, updates) => {
    if (!activeUserId) return;
    const logId = `${activeUserId}_${date}`;
    const existing = myLogs.find(l => l.date === date) || {};
    const merged = { ...existing, ...updates };

    // Point Calculation logic
    const basePts = (merged.conversations || 0) + (merged.followUpEmail || 0) + (merged.texts || 0) + (merged.socialPosts || 0) + (merged.authorityAction || 0) + (merged.contactsAdded || 0);
    const highPts = (merged.openHouseAddress?.trim() ? (merged.openHouse || 0) * 10 : 0) + 
                    (merged.networkingEventName?.trim() ? (merged.networkingEvent || 0) * 10 : 0) + 
                    (merged.listingAppointmentAddress?.trim() ? (merged.listingAppointment || 0) * 10 : 0) +
                    (merged.buyerConsultationAddress?.trim() ? (merged.buyerConsultation || 0) * 10 : 0) +
                    (merged.transactionCloseAddress?.trim() ? (merged.transactionClose || 0) * 10 : 0);
    
    // Sólo sumar 20 puntos si el estado es 'registered'
    const referralPts = merged.referralStatus === 'registered' ? 20 : 0;
    const score = basePts + highPts + referralPts;

    const newRecord = {
      ...merged,
      id: logId, userId: activeUserId, userName: profile?.name || 'Agent', date: date,
      score: score, updatedAt: new Date().toISOString()
    };

    setLogs(prev => {
      const idx = prev.findIndex(l => l.id === logId);
      if (idx >= 0) { const n = [...prev]; n[idx] = newRecord; return n; }
      return [...prev, newRecord];
    });
    await supabase.from('daily_logs').upsert(newRecord);
  };

  const handleLogout = () => { localStorage.removeItem('agentCoach_activeUserId'); setActiveUserId(null); setProfile(false); };

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-slate-900" /></div>;
  if (profile === false) return <OnboardingView onComplete={(id) => { localStorage.setItem('agentCoach_activeUserId', id); setActiveUserId(id); }} />;

  return (
    <div className={`min-h-screen flex flex-col ${activeTab === 'ranking' ? 'bg-[#0a0a0a]' : 'bg-slate-50'}`}>
      <Header profile={profile} unreadCount={unreadCount} onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto pt-4">
        <div className="max-w-md mx-auto p-4">
          {activeTab === 'today' && <TodayView dateStr={todayStr} log={myLogs.find(l => l.date === todayStr)} onSave={(upd) => handleSaveLog(todayStr, upd)} profile={profile} />}
          {activeTab === 'history' && <RankingView profiles={allProfiles} logs={logs} todayStr={todayStr} />} {/* Placeholder logic for brevity */}
          {activeTab === 'ranking' && <RankingView profiles={allProfiles} logs={logs} todayStr={todayStr} />}
        </div>
      </main>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={profile?.role === 'admin'} />
    </div>
  );
}
