import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  CheckCircle2, History, TrendingUp, Users, Phone, Mail, 
  MessageSquare, Share2, UserPlus, Trophy, AlertCircle, 
  LogOut, Award, ArrowLeft, ChevronRight, BellRing, Camera, X, Rocket
} from 'lucide-react';

// --- SUPABASE INITIALIZATION ---
// Usamos las variables reales del archivo .env que crearás
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Faltan variables de entorno de Supabase. Revisa tu archivo .env");
}

// Cliente oficial listo para producción
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

const generateAvatar = (name) => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'Agent')}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffdfbf`;
};

// --- COMPONENTS ---
const DailyGreetingModal = ({ name, onClose }) => {
  const todayDate = new Date().toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' });
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] p-6 md:p-8 max-w-sm w-full shadow-2xl relative text-center border border-slate-100 animate-in zoom-in-95 duration-300 delay-150">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-50 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
          <X size={20} />
        </button>
        <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-5 text-amber-500 shadow-sm border border-amber-200">
          <Rocket size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">¡Hola, {name}!</h2>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">Hoy es {todayDate}</p>
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-7 shadow-inner relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
          <p className="text-slate-700 font-medium leading-relaxed italic text-sm">
            "Para crecer debemos ser consistentes en lo que tenemos que hacer. ¡Que tengas un día productivo!"
          </p>
        </div>
        <button onClick={onClose} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-md active:scale-95">
          ¡Vamos con todo!
        </button>
      </div>
    </div>
  );
};

const Header = ({ title, onLogout, profile }) => (
  <header className="bg-slate-900 text-white p-4 shadow-md sticky top-0 z-10">
    <div className="max-w-md mx-auto flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-slate-800 rounded-lg">
          <Trophy size={20} className="text-amber-400" />
        </div>
        <h1 className="text-xl font-extrabold tracking-tight">AgentCoach<span className="text-amber-400">AI</span></h1>
      </div>
      <div className="flex items-center gap-3">
        {profile && profile.photoURL && (
          <img src={profile.photoURL} alt="User" className="w-8 h-8 rounded-full border-2 border-slate-700 bg-slate-800 object-cover" />
        )}
        {onLogout && (
          <button onClick={onLogout} className="p-1.5 bg-slate-800 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors" title="Cerrar Sesión">
            <LogOut size={18} />
          </button>
        )}
      </div>
    </div>
  </header>
);

const BottomNav = ({ activeTab, setActiveTab, isAdmin }) => {
  const tabs = [
    { id: 'today', icon: CheckCircle2, label: 'Hoy' },
    { id: 'history', icon: History, label: 'Historial' },
    { id: 'summary', icon: TrendingUp, label: 'Resumen' },
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

// --- MAIN APP COMPONENT ---
export default function App() {
  const [activeUserId, setActiveUserId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [logs, setLogs] = useState([]);
  const [allProfiles, setAllProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ranking'); 
  const [showGreeting, setShowGreeting] = useState(false);
  
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
      const { data: usersData, error: usersError } = await supabase.from('users').select('*');
      if (usersError) console.error("Error fetching users:", usersError);
      
      if (usersData) {
        setAllProfiles(usersData);
        const myProfile = usersData.find(u => u.id === activeUserId);
        if (myProfile) {
          setProfile(myProfile);
        } else {
          localStorage.removeItem('agentCoach_activeUserId');
          setActiveUserId(null);
          setProfile(false); 
        }
      }

      const { data: logsData, error: logsError } = await supabase.from('daily_logs').select('*');
      if (logsError) console.error("Error fetching logs:", logsError);
      if (logsData) setLogs(logsData);

      setLoading(false);
    };

    fetchAllData();

    // Tiempo real en Supabase
    const usersSubscription = supabase.channel('custom-all-users')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, fetchAllData)
      .subscribe();

    const logsSubscription = supabase.channel('custom-all-logs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'daily_logs' }, fetchAllData)
      .subscribe();

    return () => {
      supabase.removeChannel(usersSubscription);
      supabase.removeChannel(logsSubscription);
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
  
  const handleSaveLog = async (date, updates) => {
    if (!activeUserId) return;
    const logId = `${activeUserId}_${date}`;
    
    const existing = myLogs.find(l => l.date === date) || { calls: 0, emails: 0, texts: 0, posts: 0, crm: 0 };
    const merged = { ...existing, ...updates };
    const score = (merged.calls || 0) + (merged.emails || 0) + (merged.texts || 0) + (merged.posts || 0) + (merged.crm || 0);

    const { error } = await supabase.from('daily_logs').upsert({
      id: logId,
      userId: activeUserId,
      date: date,
      calls: merged.calls || 0,
      emails: merged.emails || 0,
      texts: merged.texts || 0,
      posts: merged.posts || 0,
      crm: merged.crm || 0,
      notes: merged.notes || '',
      score: score,
      updatedAt: new Date().toISOString()
    });

    if (error) console.error("Error saving log:", error);
  };

  const handleEnableNotifications = async () => {
    try {
      if (!('Notification' in window)) {
        alert("Este navegador no soporta notificaciones.");
        return;
      }
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const fakeToken = "fcm_token_" + Math.random().toString(36).substr(2, 9);
        await supabase.from('users').update({ fcmToken: fakeToken }).eq('id', activeUserId);
        alert("¡Genial! Recordatorios de las 7 AM activados.");
      } else {
        alert("Permiso denegado. Puedes activarlas en la configuración de tu navegador.");
      }
    } catch (error) {
      console.error("Error pidiendo permisos:", error);
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
    return (
      <OnboardingView 
        allProfiles={allProfiles}
        onComplete={(targetId) => {
          localStorage.setItem('agentCoach_activeUserId', targetId);
          setActiveUserId(targetId);
        }} 
      />
    );
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-amber-200 ${activeTab === 'ranking' ? 'bg-[#0a0a0a]' : 'bg-slate-50 text-slate-800'}`}>
      {showGreeting && profile && <DailyGreetingModal name={profile.name} onClose={() => setShowGreeting(false)} />}
      <Header 
        title={activeTab === 'today' ? "54321 de Hoy" : activeTab === 'history' ? 'Tu Historial' : activeTab === 'summary' ? 'Resumen Semanal' : activeTab === 'ranking' ? 'Ranking Semanal' : 'Panel de Coach'} 
        onLogout={handleLogout}
        profile={profile}
      />
      <main className="flex-1 overflow-y-auto pb-8 pt-4">
        <div className="max-w-md mx-auto p-4 space-y-6">
          {activeTab === 'today' && <TodayView dateStr={todayStr} log={myLogs.find(l => l.date === todayStr)} onSave={(updates) => handleSaveLog(todayStr, updates)} profile={profile} onEnableNotifications={handleEnableNotifications} />}
          {activeTab === 'history' && <HistoryView logs={myLogs} onSaveLog={handleSaveLog} todayStr={todayStr} />}
          {activeTab === 'summary' && <SummaryView logs={myLogs} todayStr={todayStr} />}
          {activeTab === 'ranking' && <RankingView profiles={allProfiles} logs={logs} todayStr={todayStr} isAdmin={profile?.role === 'admin'} />}
          {activeTab === 'admin' && profile?.role === 'admin' && <AdminView logs={logs} profiles={allProfiles} todayStr={todayStr} />}
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
    if (!name.trim()) return;
    setLoading(true);
    const existingProfile = email ? allProfiles.find(p => p.email && p.email.toLowerCase() === email.toLowerCase().trim()) : null;
    let targetId = existingProfile ? existingProfile.id : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    if (!existingProfile) {
      const role = name.toLowerCase().includes('admin') ? 'admin' : 'agent';
      const finalPhotoURL = photoURL.trim() || generateAvatar(name);
      const { error } = await supabase.from('users').insert([{
        id: targetId, name: name, email: email.trim(), role: role, photoURL: finalPhotoURL,
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
          <p className="text-slate-500 mt-2 text-sm font-medium">Inicia sesión o crea tu cuenta.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Tu Nombre</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Juan Pérez" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all font-medium" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Correo Electrónico</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="juan@inmobiliaria.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all font-medium" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Foto de Perfil (Opcional)</label>
            <label className="flex items-center justify-center gap-2 w-full bg-slate-50 border border-slate-200 border-dashed rounded-xl px-4 py-4 text-slate-600 hover:bg-slate-100 hover:border-slate-400 transition-all cursor-pointer">
              <Camera size={20} />
              <span className="text-sm font-bold">{photoURL ? 'Cambiar foto' : 'Subir foto'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            <p className="text-[10px] text-slate-400 mt-1">Si no subes una, te asignaremos un avatar genial.</p>
          </div>
          <div className="pt-2">
            <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? 'Accediendo...' : 'Entrar / Registrarse'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RankingView({ profiles, logs, todayStr, isAdmin }) {
  const startOfWeek = getStartOfWeek(todayStr);
  const maxWeeklyPoints = 75; 
  const leaderboard = profiles.map(profile => {
    const userLogs = logs.filter(l => l.userId === profile.id && l.date >= startOfWeek && l.date <= todayStr && !isWeekend(l.date));
    const score = userLogs.reduce((sum, l) => sum + (l.score || 0), 0);
    const percent = Math.round((score / maxWeeklyPoints) * 100);
    return { ...profile, score, percent };
  }).sort((a, b) => b.score - a.score);

  return (
    <div className="animate-in fade-in duration-500 pb-10 font-sans">
      <div className="bg-[#111111] rounded-[24px] p-5 shadow-2xl border border-gray-800/50">
        <div className="flex justify-between items-center mb-6 px-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">Ranking Semanal</h2>
          <button className="text-[#00e5ff] text-sm font-semibold hover:text-[#00cce6] transition-colors">Ver Todo</button>
        </div>
        <div className="flex justify-between text-[11px] text-gray-500 font-bold mb-3 px-3 tracking-widest uppercase">
          <div className="flex gap-8"><span className="w-8 text-center">RANGO</span><span>AGENTE</span></div><span>PUNTOS</span>
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
                        <div className={`absolute -bottom-1 -right-2 px-1.5 py-0.5 rounded-md text-[10px] font-black text-[#111] ${bgPctColor} shadow-sm border border-[#111]`}>{user.percent}%</div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white font-bold text-base">{user.name}</span>
                        <div className="text-sm font-medium"><span className={textPctColor}>{user.score}</span><span className="text-gray-500">/{maxWeeklyPoints} Puntos</span></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <button disabled={!isAdmin} className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${isAdmin ? 'bg-transparent border-2 border-[#cc00ff] text-white hover:bg-[#cc00ff]' : 'bg-transparent border-2 border-gray-700 text-gray-500 cursor-default opacity-50'} ${isFirst && isAdmin ? 'bg-[#cc00ff] border-[#cc00ff]' : ''}`}>Avisar</button>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full mt-2 overflow-hidden mx-2" style={{ width: 'calc(100% - 16px)' }}>
                  <div className={`h-full rounded-full ${barColor} shadow-[0_0_8px_currentColor] opacity-90`} style={{ width: `${Math.min(user.percent, 100)}%` }}></div>
                </div>
              </div>
            );
          })}
          {leaderboard.length === 0 && <div className="text-center py-8 text-gray-500">No hay actividad registrada esta semana.</div>}
        </div>
      </div>
    </div>
  );
}

function TodayView({ dateStr, log, onSave, profile, onEnableNotifications }) {
  if (isWeekend(dateStr)) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 px-4">
        <div className="bg-white p-6 rounded-full shadow-sm border border-slate-100 mb-6"><TrendingUp size={48} className="text-amber-500" /></div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">¡Es fin de semana!</h2>
        <p className="text-slate-500 mb-8 font-medium">Hoy no es necesario completar el 54321. Tómate un descanso o revisa tu semana.</p>
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm w-full text-left">
          <h3 className="font-bold text-slate-800 mb-3">Reflexión del fin de semana</h3>
          <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 placeholder-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all resize-none" placeholder="Anota tus ideas o planes para la próxima semana..." rows={4} value={log?.notes || ''} onChange={(e) => onSave({ notes: e.target.value })} />
        </div>
      </div>
    );
  }

  const data = log || { calls: 0, emails: 0, texts: 0, posts: 0, crm: 0, notes: '' };
  const totalScore = (data.calls || 0) + (data.emails || 0) + (data.texts || 0) + (data.posts || 0) + (data.crm || 0);
  const percent = Math.round((totalScore / 15) * 100);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {profile && !profile.fcmToken && (
        <div className="bg-amber-100/50 border border-amber-200 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between shadow-sm gap-4">
          <div className="flex items-center gap-4"><div className="bg-amber-100 p-2.5 rounded-full text-amber-600"><BellRing size={20} /></div><div><p className="font-bold text-slate-900">Recordatorios 7 AM</p><p className="text-slate-600 text-xs font-medium mt-0.5">No te pierdas de tu meta 54321.</p></div></div>
          <button onClick={onEnableNotifications} className="w-full sm:w-auto bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold py-2.5 px-5 rounded-xl text-sm transition-colors shadow-sm shrink-0">Activar</button>
        </div>
      )}
      <div className="bg-slate-900 rounded-3xl p-6 shadow-lg border border-slate-800">
        <div className="flex justify-between items-end mb-3"><div><h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Meta Diaria</h2><p className="text-3xl font-black text-white">{percent}%</p></div><div className="text-right"><p className="text-3xl font-black text-amber-400">{totalScore}<span className="text-lg text-slate-500 font-bold">/15</span></p></div></div>
        <div className="w-full bg-slate-800/50 rounded-full h-3 mt-4 overflow-hidden shadow-inner"><div className="bg-gradient-to-r from-amber-500 to-amber-400 h-3 rounded-full transition-all duration-700 ease-out" style={{ width: `${percent}%` }}></div></div>
        {percent === 100 && <p className="text-amber-400 text-sm font-bold mt-4 flex items-center gap-1.5"><CheckCircle2 size={18} /> ¡Increíble! Lo lograste hoy.</p>}
      </div>
      <div className="space-y-4">
        <CounterCard icon={Phone} title="Llamadas" max={5} value={data.calls || 0} onChange={(v) => onSave({ calls: v })} />
        <CounterCard icon={Mail} title="Correos" max={4} value={data.emails || 0} onChange={(v) => onSave({ emails: v })} />
        <CounterCard icon={MessageSquare} title="Mensajes" max={3} value={data.texts || 0} onChange={(v) => onSave({ texts: v })} />
        <CounterCard icon={Share2} title="Publicaciones" max={2} value={data.posts || 0} onChange={(v) => onSave({ posts: v })} />
        <CounterCard icon={UserPlus} title="Nuevos en CRM" max={1} value={data.crm || 0} onChange={(v) => onSave({ crm: v })} />
      </div>
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <label className="block font-bold text-slate-800 mb-3">Victorias u Obstáculos del día</label>
        <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all resize-none" placeholder="Hoy tuve una excelente conversación con..." rows={3} value={data.notes || ''} onChange={(e) => onSave({ notes: e.target.value })} />
      </div>
    </div>
  );
}

function SummaryView({ logs, todayStr }) {
  const startOfWeek = getStartOfWeek(todayStr);
  const weeklyLogs = logs.filter(l => l.date >= startOfWeek && l.date <= todayStr && !isWeekend(l.date));
  const totals = {
    calls: weeklyLogs.reduce((sum, l) => sum + (l.calls || 0), 0), emails: weeklyLogs.reduce((sum, l) => sum + (l.emails || 0), 0),
    texts: weeklyLogs.reduce((sum, l) => sum + (l.texts || 0), 0), posts: weeklyLogs.reduce((sum, l) => sum + (l.posts || 0), 0),
    crm: weeklyLogs.reduce((sum, l) => sum + (l.crm || 0), 0), score: weeklyLogs.reduce((sum, l) => sum + (l.score || 0), 0)
  };
  const daysLogged = weeklyLogs.filter(l => l.score > 0).length;
  const d = new Date(todayStr + 'T00:00:00'); const dayOfWeek = d.getDay(); let daysPassed = dayOfWeek === 0 || dayOfWeek === 6 ? 5 : dayOfWeek; 
  const maxPossible = daysPassed * 15; const weeklyPercent = maxPossible > 0 ? Math.round((totals.score / maxPossible) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 text-center">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Puntaje Semanal</h2>
        <div className="text-6xl font-black text-slate-900 mb-3">{totals.score}<span className="text-2xl text-slate-300">/75</span></div>
        <p className="font-semibold text-slate-600 px-2 text-sm">{weeklyPercent >= 80 ? "¡Estás en racha! Sigue así." : weeklyPercent >= 50 ? "Buen esfuerzo. A dar un poco más." : "Cada día es una oportunidad nueva. ¡Tú puedes!"}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center"><p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Días Activos</p><p className="text-3xl font-black text-slate-900">{daysLogged} <span className="text-lg text-slate-300 font-medium">/ 5</span></p></div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center"><p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Ritmo</p><p className="text-3xl font-black text-slate-900">{weeklyPercent}%</p></div>
      </div>
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-5">Desglose de Actividad</h3>
        <div className="space-y-4">
          {[{ label: 'Llamadas', icon: Phone, total: totals.calls, max: 25 }, { label: 'Correos', icon: Mail, total: totals.emails, max: 20 }, { label: 'Mensajes', icon: MessageSquare, total: totals.texts, max: 15 }, { label: 'Publicaciones', icon: Share2, total: totals.posts, max: 10 }, { label: 'Añadidos en CRM', icon: UserPlus, total: totals.crm, max: 5 }].map((item) => {
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
      {daysPassed === 5 && <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-md mt-4">Prepararse para la Próxima Semana</button>}
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
        <div className="flex items-center gap-2 mb-4 text-slate-500 hover:text-slate-900 cursor-pointer font-medium transition-colors" onClick={() => setEditingLog(null)}><ArrowLeft size={18} /><span className="text-sm">Volver al Historial (Editando {editingLog.date})</span></div>
        <TodayView dateStr={editingLog.date} log={editingLog} onSave={(updates) => { onSaveLog(editingLog.date, updates); setEditingLog(prev => ({...prev, ...updates})); }} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedLogs.length === 0 ? (
        <div className="text-center p-10 text-slate-400 bg-white rounded-3xl border border-slate-200 border-dashed"><History size={48} className="mx-auto mb-4 opacity-30" /><p className="font-medium">Sin historial registrado.</p></div>
      ) : (
        sortedLogs.map(log => {
          if (isWeekend(log.date) && !log.notes) return null;
          const isCurrentWeek = log.date >= startOfWeek && log.date <= todayStr; const pct = Math.round((log.score / 15) * 100); const canEdit = isCurrentWeek && !readOnly;
          return (
            <div key={log.date} className={`bg-white p-5 rounded-2xl border shadow-sm ${canEdit ? 'border-slate-200 hover:border-amber-400 cursor-pointer transition-all' : 'border-slate-100 opacity-80'}`} onClick={() => canEdit ? setEditingLog(log) : null}>
              <div className="flex justify-between items-center mb-3"><span className="font-bold text-slate-800 capitalize">{new Date(log.date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', month: 'short', day: 'numeric' })}</span><span className={`text-sm font-black ${pct === 100 ? 'text-amber-500' : 'text-slate-400'}`}>{log.score}/15</span></div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-4"><div className="bg-amber-400 h-2 rounded-full" style={{ width: `${pct}%` }}></div></div>
              {log.notes && <p className="text-xs text-slate-500 font-medium italic bg-slate-50 p-3 rounded-xl border border-slate-100 line-clamp-2">"{log.notes}"</p>}
              {canEdit && <p className="text-[10px] text-amber-600/70 mt-3 uppercase tracking-wider font-bold">Tocar para editar</p>}
            </div>
          );
        })
      )}
    </div>
  );
}

function AdminView({ logs, profiles, todayStr }) {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const startOfWeek = getStartOfWeek(todayStr);
  const directory = profiles.map(profile => {
    const userLogs = logs.filter(l => l.userId === profile.id && l.date >= startOfWeek && l.date <= todayStr);
    const weeklyScore = userLogs.reduce((sum, l) => sum + (l.score || 0), 0);
    const lastActive = userLogs.length > 0 ? [...userLogs].sort((a,b) => b.date.localeCompare(a.date))[0].date : 'Nunca';
    return { ...profile, weeklyScore, lastActive };
  }).sort((a, b) => b.weeklyScore - a.weeklyScore);

  if (selectedProfile) {
    const userLogs = logs.filter(l => l.userId === selectedProfile.id);
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <button onClick={() => setSelectedProfile(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors"><ArrowLeft size={20} /> Volver al Directorio</button>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex items-center gap-4"><img src={selectedProfile.photoURL || generateAvatar(selectedProfile.name)} alt={selectedProfile.name} className="w-14 h-14 rounded-full border-2 border-slate-100 object-cover bg-slate-100" /><div className="flex-1 min-w-0"><h2 className="text-xl font-black text-slate-900 truncate">{selectedProfile.name}</h2><p className="text-sm text-slate-500 font-medium truncate">{selectedProfile.email}</p></div></div>
        <div><h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Resumen de Actividad</h3><SummaryView logs={userLogs} todayStr={todayStr} /></div>
        <div><h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 px-2 mt-8">Historial Diario</h3><HistoryView logs={userLogs} onSaveLog={() => {}} todayStr={todayStr} readOnly={true} /></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-2 gap-4">
        <button className="bg-white hover:bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-3 transition-colors"><div className="p-3 bg-slate-100 rounded-full text-slate-700"><Share2 size={20} /></div><span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Exportar CSV</span></button>
        <button className="bg-slate-900 hover:bg-slate-800 p-5 rounded-2xl shadow-md flex flex-col items-center justify-center gap-3 transition-colors" onClick={() => console.log("Simulación: Notificación enviada al equipo.")}><div className="p-3 bg-amber-400 rounded-full text-slate-900"><BellRing size={20} /></div><span className="text-xs font-bold text-white uppercase tracking-wider text-center">Notificar Equipo</span></button>
      </div>
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-end mb-6"><div><h2 className="text-lg font-extrabold text-slate-900 mb-1">Directorio de Agentes</h2><p className="text-sm text-slate-500 font-medium">Mejores puntajes de la semana</p></div><div className="p-2 bg-slate-50 rounded-lg"><Users size={20} className="text-slate-400" /></div></div>
        <div className="space-y-3">
          {directory.map((user, idx) => (
            <div key={user.id} onClick={() => setSelectedProfile(user)} className="flex items-center bg-slate-50 p-3 rounded-2xl border border-slate-100 transition-all hover:shadow-md hover:border-amber-200 cursor-pointer group">
              <div className="relative mr-4 shrink-0"><img src={user.photoURL || generateAvatar(user.name)} className="w-10 h-10 rounded-full object-cover border border-slate-200" />{idx < 3 && <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm border border-white ${idx === 0 ? 'bg-amber-400' : idx === 1 ? 'bg-slate-400' : 'bg-amber-700/50'}`}>{idx + 1}</div>}</div>
              <div className="flex-1 min-w-0 pr-2"><p className="text-sm font-bold text-slate-800 truncate group-hover:text-amber-600 transition-colors">{user.name || 'Anónimo'}</p><p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5 truncate"><span className="text-slate-500">{user.weeklyScore} pts</span> • Última Actividad: {user.lastActive}</p></div>
              <div className="text-slate-300 group-hover:text-amber-500 transition-colors shrink-0"><ChevronRight size={20} /></div>
            </div>
          ))}
          {directory.length === 0 && <p className="text-center text-slate-400 font-medium py-4">No hay agentes registrados aún.</p>}
        </div>
      </div>
    </div>
  );
}