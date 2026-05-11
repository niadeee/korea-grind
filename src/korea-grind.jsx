import React, { useState, useEffect, useMemo } from 'react';
import { DollarSign, Shield, Plane, Book, CheckCircle2, Circle, Flame, Trash2, TrendingUp, Lightbulb, ChevronRight, Plus, X, Target, Zap, Award, Snowflake, ArrowUp, ArrowDown, Calendar, Lock, AlertCircle, Edit2, Settings } from 'lucide-react';

const ACCENT = '#0047FF';
const SUCCESS = '#10B981';
const DANGER = '#EF4444';
const BG_CARD = '#F8FAFC';
const TEXT_MUTED = '#64748B';
const BORDER_COLOR = '#E2E8F0';
const DEPARTURE = new Date('2026-09-01T00:00:00');
const SAVINGS_GOAL = 15000;

const MILESTONES = [
  { id: 'm-100', type: 'savings', threshold: 100, label: 'first hundred', desc: 'logged $100. start of something.' },
  { id: 'm-1k', type: 'savings', threshold: 1000, label: 'first grand', desc: '$1,000 banked. real momentum.' },
  { id: 'm-5k', type: 'savings', threshold: 5000, label: 'a third of the way', desc: '$5,000. you can taste it now.' },
  { id: 'm-10k', type: 'savings', threshold: 10000, label: 'two-thirds', desc: '$10,000. only a sprint left.' },
  { id: 'm-15k', type: 'savings', threshold: 15000, label: 'goal hit', desc: '$15,000. korea fund secured.' },
  { id: 'thm-1', type: 'thm', threshold: 1, label: 'first room', desc: 'one TryHackMe room cleared.' },
  { id: 'thm-10', type: 'thm', threshold: 10, label: 'in the trenches', desc: '10 rooms. you are doing it.' },
  { id: 'thm-25', type: 'thm', threshold: 25, label: 'building reps', desc: '25 rooms. recruiters will notice.' },
  { id: 'thm-50', type: 'thm', threshold: 50, label: 'half a hundred', desc: '50 rooms. legit portfolio.' },
  { id: 'thm-100', type: 'thm', threshold: 100, label: 'the centurion', desc: '100 rooms. cyber is in your blood.' },
  { id: 'streak-7', type: 'streak', threshold: 7, label: 'one week locked', desc: '7-day Korean streak.' },
  { id: 'streak-30', type: 'streak', threshold: 30, label: 'a month deep', desc: '30 days of Korean. habit formed.' },
  { id: 'streak-90', type: 'streak', threshold: 90, label: 'three months', desc: '90 days. different person now.' },
  { id: 'check-25', type: 'checklist', threshold: 0.25, label: 'wheels turning', desc: '25% of pre-flight done.' },
  { id: 'check-50', type: 'checklist', threshold: 0.5, label: 'halfway gone', desc: 'half of pre-flight done.' },
  { id: 'check-100', type: 'checklist', threshold: 1, label: 'flight ready', desc: 'every pre-flight task done. time to fly.' },
];

function defaultChecklist() {
  return {
    'white-card': false, 'labour-hire': false, 'doordash': false, 'ing-account': false,
    'korea-savings': false, 'tax-return': false, 'sec-plus-booked': false, 'sec-plus-passed': false,
    'h1-visa': false, 'health-insurance': false, 'flight-booked': false, 'idp-license': false,
    'police-check': false, 'reference-letters': false, 'goshiwon-booked': false, 'wise-account': false,
    'phone-unlocked': false, 'docs-cloud': false, 'diploma-done': false, 'gf-flight': false,
    'cars-sold': false, 'gf-license': false,
  };
}

const DEFAULT_BILLS = [
  { id: 'b1', name: 'Phone', amount: 50, frequency: 'monthly', nextDue: null, paid: [] },
  { id: 'b2', name: 'Car insurance', amount: 120, frequency: 'monthly', nextDue: null, paid: [] },
  { id: 'b3', name: 'Car rego', amount: 800, frequency: 'yearly', nextDue: null, paid: [] },
  { id: 'b4', name: 'Fuel', amount: 80, frequency: 'weekly', nextDue: null, paid: [] },
];

const DEFAULT_DATA = {
  transactions: [],
  cyber: { thmRooms: 0, secPlusProgress: 0, sessions: [] },
  korean: { streak: 0, longestStreak: 0, lastChecked: null, history: [], freezesAvailable: 1, freezeWeekStart: null },
  journal: {},
  checklist: defaultChecklist(),
  unlockedMilestones: [],
  bills: DEFAULT_BILLS,
  splitPerPay: 100,
};

export default function KoreaGrind() {
  const [activeTab, setActiveTab] = useState('home');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pulse, setPulse] = useState(null);
  const [unlockedToast, setUnlockedToast] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get('koreaGrindV2');
        if (result && result.value) {
          const loaded = JSON.parse(result.value);
          setData({
            ...DEFAULT_DATA,
            ...loaded,
            checklist: { ...defaultChecklist(), ...(loaded.checklist || {}) },
            bills: loaded.bills || DEFAULT_BILLS,
            splitPerPay: loaded.splitPerPay ?? 100,
          });
        } else {
          setData(DEFAULT_DATA);
        }
      } catch {
        setData(DEFAULT_DATA);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveData = async (newData) => {
    setData(newData);
    try { await window.storage.set('koreaGrindV2', JSON.stringify(newData)); } catch (e) { console.error(e); }
  };

  const triggerPulse = (key) => {
    setPulse(key);
    setTimeout(() => setPulse(null), 600);
  };

  const today = new Date().toISOString().split('T')[0];
  const daysToKorea = data ? Math.max(0, Math.ceil((DEPARTURE - new Date()) / (1000 * 60 * 60 * 24))) : 0;
  const weeksToKorea = Math.max(1, Math.ceil(daysToKorea / 7));

  const totalIncome = data ? data.transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0) : 0;
  const totalExpenses = data ? data.transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0) : 0;
  const netSaved = totalIncome - totalExpenses;
  const remaining = Math.max(0, SAVINGS_GOAL - netSaved);
  const savingsPercent = Math.min(100, (netSaved / SAVINGS_GOAL) * 100);
  const weeklyTarget = remaining / weeksToKorea;

  const checklistComplete = data ? Object.values(data.checklist).filter(Boolean).length : 0;
  const checklistTotal = data ? Object.keys(data.checklist).length : 22;
  const checklistPercent = checklistComplete / checklistTotal;

  // Milestone detection
  useEffect(() => {
    if (!data) return;
    const newlyUnlocked = MILESTONES.filter(m => {
      if (data.unlockedMilestones.includes(m.id)) return false;
      if (m.type === 'savings' && netSaved >= m.threshold) return true;
      if (m.type === 'thm' && data.cyber.thmRooms >= m.threshold) return true;
      if (m.type === 'streak' && data.korean.longestStreak >= m.threshold) return true;
      if (m.type === 'checklist' && checklistPercent >= m.threshold) return true;
      return false;
    });
    if (newlyUnlocked.length > 0) {
      saveData({ ...data, unlockedMilestones: [...data.unlockedMilestones, ...newlyUnlocked.map(m => m.id)] });
      setUnlockedToast(newlyUnlocked[0]);
      setTimeout(() => setUnlockedToast(null), 4500);
    }
  }, [netSaved, data?.cyber.thmRooms, data?.korean.longestStreak, checklistPercent]);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-black font-mono text-xs tracking-widest">LOADING</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col md:flex-row bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900" style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800;900&family=Archivo+Black&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes pulseScale { 0% { transform: scale(1); } 50% { transform: scale(1.04); } 100% { transform: scale(1); } }
        @keyframes slideUp { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
        .pulse-anim { animation: pulseScale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .fade-in { animation: fadeIn 0.3s ease-in; }
        .progress-fill { transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .heading { font-family: 'Archivo Black', sans-serif; letter-spacing: -0.02em; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .card { background: #FFFFFF; border-radius: 12px; border: 1px solid #E2E8F0; padding: 20px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); transition: all 0.2s ease; }
        .card:hover { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); }
        .stat-card { background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%); }
        .btn-primary { background: #0047FF; color: white; border: none; border-radius: 8px; padding: 10px 16px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-primary:hover { background: #0038CC; transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0, 71, 255, 0.2); }
        .btn-secondary { background: #F1F5F9; color: #1E293B; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px 16px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        .btn-secondary:hover { background: #E2E8F0; }
      `}</style>

      

      {/* Desktop Sidebar Navigation */}
      <nav className="hidden md:flex flex-col w-48 bg-gradient-to-b from-slate-900 to-slate-800 text-white border-r border-slate-700 overflow-y-auto">
        <div className="px-4 py-5 border-b border-slate-700">
          <div className="heading text-xs font-black text-slate-400 uppercase tracking-widest">Navigation</div>
        </div>
        <NavBtn icon={<Target size={18} strokeWidth={2.5} />} label="home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <NavBtn icon={<DollarSign size={18} strokeWidth={2.5} />} label="money" active={activeTab === 'money'} onClick={() => setActiveTab('money')} />
        <NavBtn icon={<Shield size={18} strokeWidth={2.5} />} label="cyber" active={activeTab === 'cyber'} onClick={() => setActiveTab('cyber')} />
        <NavBtn icon={<CheckCircle2 size={18} strokeWidth={2.5} />} label="list" active={activeTab === 'list'} onClick={() => setActiveTab('list')} />
        <NavBtn icon={<Book size={18} strokeWidth={2.5} />} label="log" active={activeTab === 'log'} onClick={() => setActiveTab('log')} />
        <NavBtn icon={<Lightbulb size={18} strokeWidth={2.5} />} label="tips" active={activeTab === 'tips'} onClick={() => setActiveTab('tips')} />
      </nav>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
{unlockedToast && (
        <div className="fixed top-4 left-4 right-4 z-[60] slide-up">
          <div className="bg-black text-white rounded-2xl p-4 flex items-center gap-3 shadow-2xl">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: ACCENT }}>
              <Award size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-widest opacity-60">milestone unlocked</div>
              <div className="font-bold text-sm">{unlockedToast.label}</div>
              <div className="text-xs opacity-70">{unlockedToast.desc}</div>
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="px-5 md:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: ACCENT }}>
              <Target size={20} className="text-white" strokeWidth={3} />
            </div>
            <div>
              <div className="heading text-xl leading-none font-black">KOREA GRIND</div>
              <div className="text-[10px] mono uppercase tracking-widest text-slate-500 mt-0.5">busan • sept 26</div>
            </div>
          </div>
          <div className="card stat-card bg-white" style={{ padding: '12px 20px' }}>
            <div className="text-center">
              <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Days Left</div>
              <div className="heading text-2xl mt-1" style={{ color: ACCENT }}>{daysToKorea}</div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        {activeTab === 'home' && <Home data={data} saveData={saveData} netSaved={netSaved} savingsPercent={savingsPercent} weeklyTarget={weeklyTarget} weeksToKorea={weeksToKorea} daysToKorea={daysToKorea} today={today} checklistComplete={checklistComplete} checklistTotal={checklistTotal} checklistPercent={checklistPercent} setActiveTab={setActiveTab} triggerPulse={triggerPulse} pulse={pulse} />}
        {activeTab === 'money' && <Money data={data} saveData={saveData} netSaved={netSaved} totalIncome={totalIncome} totalExpenses={totalExpenses} savingsPercent={savingsPercent} weeklyTarget={weeklyTarget} triggerPulse={triggerPulse} pulse={pulse} />}
        {activeTab === 'cyber' && <Cyber data={data} saveData={saveData} triggerPulse={triggerPulse} pulse={pulse} />}
        {activeTab === 'list' && <Checklist data={data} saveData={saveData} checklistComplete={checklistComplete} checklistTotal={checklistTotal} checklistPercent={checklistPercent} triggerPulse={triggerPulse} pulse={pulse} />}
        {activeTab === 'log' && <Journal data={data} saveData={saveData} today={today} />}
        {activeTab === 'tips' && <Tips />}
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-slate-200 z-50">
        <div className="grid grid-cols-6">
          <NavBtn icon={<Target size={18} strokeWidth={2.5} />} label="home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <NavBtn icon={<DollarSign size={18} strokeWidth={2.5} />} label="money" active={activeTab === 'money'} onClick={() => setActiveTab('money')} />
          <NavBtn icon={<Shield size={18} strokeWidth={2.5} />} label="cyber" active={activeTab === 'cyber'} onClick={() => setActiveTab('cyber')} />
          <NavBtn icon={<CheckCircle2 size={18} strokeWidth={2.5} />} label="list" active={activeTab === 'list'} onClick={() => setActiveTab('list')} />
          <NavBtn icon={<Book size={18} strokeWidth={2.5} />} label="log" active={activeTab === 'log'} onClick={() => setActiveTab('log')} />
          <NavBtn icon={<Lightbulb size={18} strokeWidth={2.5} />} label="tips" active={activeTab === 'tips'} onClick={() => setActiveTab('tips')} />
        </div>
      </nav>
      
      {/* Mobile-only spacer to prevent content overlap */}
      <div className="md:hidden h-24"></div>
      </div>
    </div>
  );
}

function NavBtn({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full px-4 py-3 flex flex-col items-center gap-2 transition-all relative ${active ? 'bg-slate-100' : 'hover:bg-slate-50'}`} style={{ color: active ? ACCENT : '#94A3B8' }}>
      {active && <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full" style={{ background: ACCENT }}></div>}
      <div className="transition-transform" style={{ transform: active ? 'scale(1.1)' : 'scale(1)' }}>
        {icon}
      </div>
      <span className="text-[8px] font-semibold uppercase tracking-widest">{label}</span>
    </button>
  );
  );
}

function Home({ data, saveData, netSaved, savingsPercent, weeklyTarget, daysToKorea, today, checklistComplete, checklistTotal, checklistPercent, setActiveTab, triggerPulse, pulse }) {
  const koreanCheckedToday = data.korean.history.includes(today);

  const smartTasks = useMemo(() => {
    const tasks = [];
    const dayNum = new Date(today).getDay();
    const isWeekend = dayNum === 0 || dayNum === 6;
    
    const weekAgo = new Date(Date.now() - 7 * 86400000);
    const weekIncome = data.transactions.filter(t => t.type === 'income' && new Date(t.date) > weekAgo).reduce((s, t) => s + t.amount, 0);
    const weekShortage = weeklyTarget - weekIncome;
    
    if (!koreanCheckedToday) {
      tasks.push({ id: 'k', text: 'Korean: 15 min Anki + speak 1 sentence with gf', urgency: 'core', tab: null });
    }
    
    if (weekShortage > 100) {
      tasks.push({ id: 'm', text: `Behind $${Math.ceil(weekShortage)} this week. Pick up a shift or DoorDash tonight`, urgency: 'high', tab: 'money' });
    } else {
      tasks.push({ id: 'm', text: 'Log today\'s shift income', urgency: 'med', tab: 'money' });
    }
    
    if (isWeekend) {
      tasks.push({ id: 'c', text: 'Cyber block: 2 hrs Sec+ study OR knock out a TryHackMe room', urgency: 'high', tab: 'cyber' });
    } else {
      tasks.push({ id: 'c', text: 'Cyber: 30 min Sec+ video or Anki flashcards', urgency: 'med', tab: 'cyber' });
    }
    
    const incompleteCount = checklistTotal - checklistComplete;
    if (daysToKorea < 60 && incompleteCount > 5) {
      tasks.push({ id: 'l', text: `${incompleteCount} pre-flight items left. Knock one off today`, urgency: 'high', tab: 'list' });
    } else if (incompleteCount > 0) {
      tasks.push({ id: 'l', text: 'Tick off one pre-flight checklist item', urgency: 'med', tab: 'list' });
    }
    
    if (!data.journal[today]) {
      tasks.push({ id: 'j', text: 'Log 3 lines tonight: wins, struggles, tomorrow', urgency: 'low', tab: 'log' });
    }
    
    return tasks.slice(0, 5);
  }, [data, today, weeklyTarget, daysToKorea, checklistComplete, checklistTotal, koreanCheckedToday]);

  const toggleKorean = () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (koreanCheckedToday) {
      const newHistory = data.korean.history.filter(d => d !== today);
      saveData({
        ...data,
        korean: { ...data.korean, streak: Math.max(0, data.korean.streak - 1), history: newHistory, lastChecked: yesterday }
      });
    } else {
      const last = data.korean.lastChecked;
      let newStreak = (last === yesterday) ? data.korean.streak + 1 : 1;
      const newLongest = Math.max(data.korean.longestStreak, newStreak);
      saveData({
        ...data,
        korean: { ...data.korean, streak: newStreak, longestStreak: newLongest, lastChecked: today, history: [...data.korean.history, today] }
      });
      triggerPulse('korean');
    }
  };

  const useStreakFreeze = () => {
    if (data.korean.freezesAvailable < 1) return;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    saveData({
      ...data,
      korean: { ...data.korean, freezesAvailable: data.korean.freezesAvailable - 1, lastChecked: yesterday }
    });
  };

  useEffect(() => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1);
    const weekStartStr = weekStart.toISOString().split('T')[0];
    if (data.korean.freezeWeekStart !== weekStartStr) {
      saveData({ ...data, korean: { ...data.korean, freezeWeekStart: weekStartStr, freezesAvailable: 1 } });
    }
  }, []);

  const velocityData = useMemo(() => {
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const ds = d.toISOString().split('T')[0];
      const dayIncome = data.transactions.filter(t => t.type === 'income' && t.date.startsWith(ds)).reduce((s, t) => s + t.amount, 0);
      const dayExpense = data.transactions.filter(t => t.type === 'expense' && t.date.startsWith(ds)).reduce((s, t) => s + t.amount, 0);
      days.push({ date: ds, net: dayIncome - dayExpense, label: d.getDate() });
    }
    return days;
  }, [data.transactions]);

  const cumulativeData = useMemo(() => {
    let cum = 0;
    return velocityData.map(d => { cum += d.net; return { ...d, cum }; });
  }, [velocityData]);

  const totalWeeks = 17;
  const weeksRemaining = Math.ceil(daysToKorea / 7);
  const expectedAtThisPoint = SAVINGS_GOAL * (totalWeeks - weeksRemaining) / totalWeeks;
  const onTrack = netSaved >= expectedAtThisPoint;
  const milestoneCount = data.unlockedMilestones.length;

  return (
    <div className="space-y-4 slide-up">
      <div className="rounded-3xl border-2 border-black bg-white p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 mono text-[9px] uppercase tracking-widest p-3 text-neutral-500">north star</div>
        <div className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-1">korea fund</div>
        <div className="flex items-baseline gap-2 mb-1">
          <div className="heading text-6xl" style={{ color: ACCENT }}>${Math.floor(netSaved).toLocaleString()}</div>
          <div className="mono text-sm text-neutral-400">/ ${SAVINGS_GOAL.toLocaleString()}</div>
        </div>
        <div className="h-3 bg-neutral-100 rounded-full overflow-hidden mb-3">
          <div className="h-full progress-fill rounded-full" style={{ width: `${savingsPercent}%`, background: ACCENT }}></div>
        </div>
        <div className="flex justify-between mono text-[11px]">
          <div>
            <span className="text-neutral-500">need </span>
            <span className="font-bold">${Math.ceil(weeklyTarget).toLocaleString()}</span>
            <span className="text-neutral-500">/wk</span>
          </div>
          <div className={`font-bold flex items-center gap-1 ${onTrack ? 'text-green-600' : 'text-red-500'}`}>
            {onTrack ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {onTrack ? 'on track' : 'behind'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <StatTile label="streak" value={data.korean.streak} suffix="d" icon={<Flame size={12} />} />
        <StatTile label="thm rooms" value={data.cyber.thmRooms} icon={<Shield size={12} />} />
        <StatTile label="badges" value={milestoneCount} icon={<Award size={12} />} />
      </div>

      <div className="rounded-3xl border-2 border-black p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="mono text-[10px] uppercase tracking-widest text-neutral-500">today's focus</div>
            <div className="heading text-xl mt-0.5">DO THIS.</div>
          </div>
          <Zap size={24} style={{ color: ACCENT }} />
        </div>
        <div className="space-y-2">
          {smartTasks.map(t => (
            <div key={t.id} className={`p-3 rounded-2xl border-2 ${t.urgency === 'high' ? 'border-red-500 bg-red-50' : t.urgency === 'core' ? 'border-black' : 'border-neutral-200'}`}>
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${t.urgency === 'high' ? 'bg-red-500' : t.urgency === 'core' ? 'bg-black' : 'bg-neutral-400'}`}></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm leading-snug">{t.text}</div>
                  {t.tab && (
                    <button onClick={() => setActiveTab(t.tab)} className="mono text-[10px] uppercase tracking-widest mt-1.5 font-bold flex items-center gap-1" style={{ color: ACCENT }}>
                      open {t.tab} <ChevronRight size={10} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {smartTasks.length === 0 && (
            <div className="text-center py-6 text-neutral-500 text-sm">all clear today. rest is part of the grind.</div>
          )}
        </div>
      </div>

      <div className={`rounded-3xl border-2 border-black p-5 ${pulse === 'korean' ? 'pulse-anim' : ''}`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="mono text-[10px] uppercase tracking-widest text-neutral-500">korean today</div>
            <div className="text-sm text-neutral-700 mt-0.5">15 mins counts. tap when done.</div>
          </div>
          <div className="flex items-center gap-1.5">
            <Flame size={20} style={{ color: koreanCheckedToday ? ACCENT : '#a3a3a3' }} fill={koreanCheckedToday ? ACCENT : 'none'} />
            <span className="heading text-2xl" style={{ color: koreanCheckedToday ? ACCENT : '#a3a3a3' }}>{data.korean.streak}</span>
          </div>
        </div>
        <button onClick={toggleKorean} className={`w-full py-4 rounded-2xl font-bold mono uppercase tracking-widest text-sm transition-all ${koreanCheckedToday ? 'bg-black text-white' : 'border-2 border-black'}`}
          style={!koreanCheckedToday ? { color: ACCENT } : {}}>
          {koreanCheckedToday ? '✓ done · tap to undo' : 'check in'}
        </button>
        <div className="mt-3 flex items-center justify-between mono text-[10px] uppercase tracking-widest">
          <span className="text-neutral-500">longest: {data.korean.longestStreak}d</span>
          <button onClick={useStreakFreeze} disabled={data.korean.freezesAvailable < 1}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black disabled:opacity-30 disabled:cursor-not-allowed">
            <Snowflake size={11} />
            <span className="font-bold">freeze {data.korean.freezesAvailable}/1</span>
          </button>
        </div>
      </div>

      <div className="rounded-3xl border-2 border-black p-5">
        <div className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-1">velocity · 14d</div>
        <div className="heading text-lg mb-4">DAILY NET</div>
        <BarChart data={velocityData} />
      </div>

      <div className="rounded-3xl border-2 border-black p-5">
        <div className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-1">building up · 14d</div>
        <div className="heading text-lg mb-4">CUMULATIVE</div>
        <LineChart data={cumulativeData} />
      </div>

      <button onClick={() => setActiveTab('list')} className="w-full text-left rounded-3xl border-2 border-black p-5 hover:bg-neutral-50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="mono text-[10px] uppercase tracking-widest text-neutral-500">pre-flight</div>
            <div className="heading text-lg mt-0.5">CHECKLIST</div>
          </div>
          <div className="text-right">
            <div className="heading text-2xl" style={{ color: ACCENT }}>{checklistComplete}<span className="text-neutral-300 text-base">/{checklistTotal}</span></div>
          </div>
        </div>
        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div className="h-full progress-fill rounded-full" style={{ width: `${checklistPercent * 100}%`, background: ACCENT }}></div>
        </div>
      </button>

      <Milestones data={data} netSaved={netSaved} checklistPercent={checklistPercent} />
    </div>
  );
}

function BarChart({ data }) {
  const max = Math.max(...data.map(d => Math.abs(d.net)), 100);
  return (
    <div className="flex items-end gap-1 h-24">
      {data.map((d, i) => {
        const h = Math.abs(d.net) / max * 100;
        const positive = d.net >= 0;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex items-end" style={{ height: '80px' }}>
              {d.net !== 0 && (
                <div className="w-full rounded-t-sm progress-fill" style={{ height: `${Math.max(2, h)}%`, background: positive ? ACCENT : DANGER }}></div>
              )}
            </div>
            <div className="mono text-[8px] text-neutral-400">{d.label}</div>
          </div>
        );
      })}
    </div>
  );
}

function LineChart({ data }) {
  const max = Math.max(...data.map(d => d.cum), 100);
  const min = Math.min(...data.map(d => d.cum), 0);
  const range = max - min || 1;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.cum - min) / range) * 90 - 5;
    return `${x},${y}`;
  }).join(' ');
  
  const lastValue = data[data.length - 1]?.cum || 0;
  
  return (
    <div className="relative">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-24">
        <polyline points={points} fill="none" stroke={ACCENT} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * 100;
          const y = 100 - ((d.cum - min) / range) * 90 - 5;
          return <circle key={i} cx={x} cy={y} r="1.5" fill={ACCENT} />;
        })}
      </svg>
      <div className="flex justify-between mono text-[9px] text-neutral-400 mt-1">
        <span>14d ago</span>
        <span className="font-bold" style={{ color: ACCENT }}>${Math.floor(lastValue).toLocaleString()}</span>
      </div>
    </div>
  );
}

function StatTile({ label, value, suffix = '', icon }) {
  return (
    <div className="rounded-2xl border-2 border-black p-3">
      <div className="flex items-center gap-1 mono text-[9px] uppercase tracking-widest text-neutral-500 mb-1.5">
        {icon}{label}
      </div>
      <div className="heading text-2xl">{value}{suffix}</div>
    </div>
  );
}

function Milestones({ data, netSaved, checklistPercent }) {
  const next = MILESTONES.find(m => !data.unlockedMilestones.includes(m.id));
  if (!next) return null;
  
  let current = 0;
  if (next.type === 'savings') current = netSaved;
  if (next.type === 'thm') current = data.cyber.thmRooms;
  if (next.type === 'streak') current = data.korean.longestStreak;
  if (next.type === 'checklist') current = checklistPercent;
  
  const pct = Math.min(100, (current / next.threshold) * 100);
  const recent = data.unlockedMilestones.slice(-3).map(id => MILESTONES.find(m => m.id === id)).filter(Boolean);
  
  return (
    <div className="rounded-3xl border-2 border-black p-5">
      <div className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-1">next milestone</div>
      <div className="heading text-lg mb-3">{next.label.toUpperCase()}</div>
      <div className="text-sm text-neutral-700 mb-3">{next.desc}</div>
      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden mb-2">
        <div className="h-full progress-fill rounded-full" style={{ width: `${pct}%`, background: ACCENT }}></div>
      </div>
      <div className="flex justify-between mono text-[10px] uppercase tracking-widest text-neutral-500">
        <span>{Math.floor(current * (next.type === 'checklist' ? 100 : 1))}{next.type === 'checklist' ? '%' : ''}</span>
        <span>{next.type === 'checklist' ? `${Math.floor(next.threshold * 100)}%` : next.threshold}</span>
      </div>
      {recent.length > 0 && (
        <>
          <div className="mt-5 mono text-[10px] uppercase tracking-widest text-neutral-500 mb-2">recent unlocks</div>
          <div className="space-y-1.5">
            {recent.map(m => (
              <div key={m.id} className="flex items-center gap-2 text-xs">
                <Award size={12} style={{ color: ACCENT }} />
                <span className="font-medium">{m.label}</span>
                <span className="text-neutral-400 truncate">— {m.desc}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Money({ data, saveData, netSaved, totalIncome, totalExpenses, savingsPercent, weeklyTarget, triggerPulse, pulse }) {
  const [showAdd, setShowAdd] = useState(null);
  const [showBillModal, setShowBillModal] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todayDate = new Date();

  // Korea fund = sum of all "fund" portions of incomes
  const koreaFund = data.transactions
    .filter(t => t.type === 'income')
    .reduce((s, t) => s + (t.fundSplit || 0), 0);
  
  // Spending account = total income (minus fund splits) minus all expenses
  const spendingIn = data.transactions
    .filter(t => t.type === 'income')
    .reduce((s, t) => s + (t.amount - (t.fundSplit || 0)), 0);
  const spendingOut = totalExpenses;
  const spendingBalance = spendingIn - spendingOut;

  // Calculate next pay date (assume next pay = average gap between recent incomes, default 3 days)
  const incomeDates = data.transactions
    .filter(t => t.type === 'income')
    .map(t => new Date(t.date))
    .sort((a, b) => b - a);
  
  let avgPayGapDays = 3; // default for irregular work
  if (incomeDates.length >= 2) {
    const gaps = [];
    for (let i = 0; i < Math.min(incomeDates.length - 1, 10); i++) {
      gaps.push((incomeDates[i] - incomeDates[i + 1]) / 86400000);
    }
    avgPayGapDays = Math.max(2, Math.round(gaps.reduce((s, g) => s + g, 0) / gaps.length));
  }
  
  const lastPayDate = incomeDates[0] || todayDate;
  const nextPayDate = new Date(lastPayDate.getTime() + avgPayGapDays * 86400000);
  const daysToNextPay = Math.max(1, Math.ceil((nextPayDate - todayDate) / 86400000));

  // Compute upcoming bills with next due dates
  const billsWithDates = data.bills.map(bill => {
    let nextDue = bill.nextDue ? new Date(bill.nextDue) : null;
    
    // Auto-calculate if no nextDue or if it's in the past
    if (!nextDue || nextDue < todayDate) {
      const today0 = new Date(todayDate);
      today0.setHours(0, 0, 0, 0);
      
      if (bill.frequency === 'weekly') {
        nextDue = new Date(today0.getTime() + 7 * 86400000);
      } else if (bill.frequency === 'fortnightly') {
        nextDue = new Date(today0.getTime() + 14 * 86400000);
      } else if (bill.frequency === 'monthly') {
        nextDue = new Date(today0);
        nextDue.setMonth(nextDue.getMonth() + 1);
      } else if (bill.frequency === 'yearly') {
        nextDue = new Date(today0);
        nextDue.setFullYear(nextDue.getFullYear() + 1);
      }
    }
    
    const daysUntil = Math.ceil((nextDue - todayDate) / 86400000);
    return { ...bill, nextDueDate: nextDue, daysUntil };
  }).sort((a, b) => a.daysUntil - b.daysUntil);

  // Bills due before next pay
  const billsDueBeforePay = billsWithDates.filter(b => b.daysUntil <= daysToNextPay && b.daysUntil >= 0);
  const billsTotalBeforePay = billsDueBeforePay.reduce((s, b) => s + b.amount, 0);

  // Safe to spend = spending balance - bills due before next pay
  const safeToSpend = spendingBalance - billsTotalBeforePay;
  const dailyAllowance = safeToSpend / daysToNextPay;

  let safetyColor = '#00B96B'; // green
  let safetyLabel = 'safe';
  if (safeToSpend < 0) { safetyColor = '#E5484D'; safetyLabel = 'overspending'; }
  else if (dailyAllowance < 20) { safetyColor = '#F76B15'; safetyLabel = 'tight'; }

  const addTransaction = (type, transaction) => {
    const fundSplit = type === 'income' ? Math.min(data.splitPerPay, transaction.amount) : 0;
    const newData = {
      ...data,
      transactions: [{
        ...transaction,
        type,
        fundSplit,
        id: Date.now(),
        date: new Date().toISOString()
      }, ...data.transactions]
    };
    saveData(newData);
    setShowAdd(null);
    triggerPulse('money');
  };

  const deleteTransaction = (id) => saveData({ ...data, transactions: data.transactions.filter(t => t.id !== id) });

  const markBillPaid = (billId) => {
    const bill = data.bills.find(b => b.id === billId);
    if (!bill) return;
    
    // Add as expense
    const expenseTx = {
      type: 'expense',
      amount: bill.amount,
      label: bill.name,
      category: 'bill',
      id: Date.now(),
      date: new Date().toISOString()
    };
    
    // Roll forward next due date
    let newDue = new Date(bill.nextDueDate || todayDate);
    if (bill.frequency === 'weekly') newDue = new Date(newDue.getTime() + 7 * 86400000);
    else if (bill.frequency === 'fortnightly') newDue = new Date(newDue.getTime() + 14 * 86400000);
    else if (bill.frequency === 'monthly') newDue.setMonth(newDue.getMonth() + 1);
    else if (bill.frequency === 'yearly') newDue.setFullYear(newDue.getFullYear() + 1);
    
    const updatedBills = data.bills.map(b =>
      b.id === billId ? { ...b, nextDue: newDue.toISOString(), paid: [...(b.paid || []), today] } : b
    );
    
    saveData({
      ...data,
      transactions: [expenseTx, ...data.transactions],
      bills: updatedBills
    });
    triggerPulse('money');
  };

  const addOrUpdateBill = (bill) => {
    if (bill.id && data.bills.find(b => b.id === bill.id)) {
      saveData({ ...data, bills: data.bills.map(b => b.id === bill.id ? bill : b) });
    } else {
      saveData({ ...data, bills: [...data.bills, { ...bill, id: 'b' + Date.now(), paid: [] }] });
    }
    setShowBillModal(null);
  };

  const deleteBill = (id) => saveData({ ...data, bills: data.bills.filter(b => b.id !== id) });

  const updateSplit = (val) => saveData({ ...data, splitPerPay: parseFloat(val) || 0 });

  const weekAgo = new Date(Date.now() - 7 * 86400000);
  const weekIncome = data.transactions.filter(t => t.type === 'income' && new Date(t.date) > weekAgo).reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-4 slide-up">
      {/* SAFE TO SPEND - hero */}
      <div className={`rounded-3xl border-2 border-black p-6 ${pulse === 'money' ? 'pulse-anim' : ''}`} style={{ background: safetyColor + '08' }}>
        <div className="flex items-center justify-between mb-1">
          <div className="mono text-[10px] uppercase tracking-widest text-neutral-500">safe to spend</div>
          <div className="mono text-[10px] uppercase tracking-widest font-bold" style={{ color: safetyColor }}>{safetyLabel}</div>
        </div>
        <div className="heading text-6xl mb-3" style={{ color: safetyColor }}>${Math.floor(safeToSpend).toLocaleString()}</div>
        <div className="flex justify-between mono text-[11px]">
          <div>
            <span className="text-neutral-500">next pay in </span>
            <span className="font-bold">{daysToNextPay}d</span>
          </div>
          <div>
            <span className="text-neutral-500">daily </span>
            <span className="font-bold" style={{ color: safetyColor }}>${Math.floor(dailyAllowance)}</span>
          </div>
        </div>
      </div>

      {/* Two account cards: Korea Fund + Spending */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border-2 border-black p-4 text-white relative overflow-hidden" style={{ background: ACCENT }}>
          <div className="flex items-center gap-1 mono text-[9px] uppercase tracking-widest opacity-70 mb-2">
            <Lock size={11} /> korea fund
          </div>
          <div className="heading text-2xl">${Math.floor(koreaFund).toLocaleString()}</div>
          <div className="mono text-[9px] uppercase tracking-widest opacity-70 mt-1">/ ${SAVINGS_GOAL.toLocaleString()}</div>
          <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full progress-fill" style={{ width: `${Math.min(100, (koreaFund/SAVINGS_GOAL)*100)}%` }}></div>
          </div>
        </div>
        <div className="rounded-2xl border-2 border-black p-4">
          <div className="flex items-center gap-1 mono text-[9px] uppercase tracking-widest text-neutral-500 mb-2">
            <DollarSign size={11} /> spending
          </div>
          <div className="heading text-2xl">${Math.floor(spendingBalance).toLocaleString()}</div>
          <div className="mono text-[9px] uppercase tracking-widest text-neutral-500 mt-1">balance</div>
          <div className="mt-2 flex justify-between mono text-[9px]">
            <span className="text-green-600">+${Math.floor(spendingIn)}</span>
            <span className="text-red-500">-${Math.floor(spendingOut)}</span>
          </div>
        </div>
      </div>

      {/* Split setting */}
      <button onClick={() => setShowSettings(true)} className="w-full rounded-2xl border-2 border-neutral-200 p-3 flex items-center justify-between text-left">
        <div className="flex items-center gap-2">
          <Settings size={14} className="text-neutral-500" />
          <span className="mono text-[10px] uppercase tracking-widest text-neutral-500">auto-split per pay</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-bold" style={{ color: ACCENT }}>${data.splitPerPay}</span>
          <ChevronRight size={14} className="text-neutral-400" />
        </div>
      </button>

      {/* UPCOMING BILLS */}
      <div className="rounded-3xl border-2 border-black p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="mono text-[10px] uppercase tracking-widest text-neutral-500">bills</div>
            <div className="heading text-lg mt-0.5">UPCOMING</div>
          </div>
          <button onClick={() => setShowBillModal({ name: '', amount: '', frequency: 'monthly' })} className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ background: ACCENT }}>
            <Plus size={16} strokeWidth={3} />
          </button>
        </div>
        <div className="space-y-2">
          {billsWithDates.map(b => {
            const isUrgent = b.daysUntil <= 3;
            const isDue = b.daysUntil <= 0;
            return (
              <div key={b.id} className={`p-3 rounded-2xl border-2 ${isDue ? 'border-red-500 bg-red-50' : isUrgent ? 'border-orange-400 bg-orange-50' : 'border-neutral-200'}`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{b.name}</div>
                    <div className="mono text-[10px] uppercase tracking-widest mt-0.5" style={{ color: isDue ? '#E5484D' : isUrgent ? '#F76B15' : '#737373' }}>
                      {isDue ? 'due now' : `in ${b.daysUntil}d`} · {b.frequency}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="heading text-lg">${b.amount}</div>
                  </div>
                  <button onClick={() => markBillPaid(b.id)} className="px-3 py-1.5 rounded-full text-white mono text-[10px] uppercase tracking-widest font-bold shrink-0" style={{ background: ACCENT }}>
                    pay
                  </button>
                  <button onClick={() => setShowBillModal(b)} className="p-1.5 text-neutral-400">
                    <Edit2 size={12} />
                  </button>
                </div>
              </div>
            );
          })}
          {data.bills.length === 0 && (
            <div className="text-center py-6 text-neutral-400 text-sm">no bills set up. tap + to add.</div>
          )}
        </div>
      </div>

      {/* This week summary */}
      <div className="rounded-3xl border-2 border-black p-5">
        <div className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-3">last 7 days</div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="heading text-xl text-green-600">${Math.floor(weekIncome)}</div>
            <div className="mono text-[9px] uppercase text-neutral-400">earned</div>
          </div>
          <div>
            <div className="heading text-xl" style={{ color: ACCENT }}>${Math.floor(weekIncome > 0 ? Math.min(data.splitPerPay * data.transactions.filter(t => t.type === 'income' && new Date(t.date) > weekAgo).length, weekIncome) : 0)}</div>
            <div className="mono text-[9px] uppercase text-neutral-400">to fund</div>
          </div>
          <div>
            <div className="heading text-xl">${Math.ceil(weeklyTarget)}</div>
            <div className="mono text-[9px] uppercase text-neutral-400">target</div>
          </div>
        </div>
      </div>

      {/* Add buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => setShowAdd('income')} className="rounded-2xl border-2 border-black p-4 flex items-center justify-center gap-2 font-bold mono uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-colors">
          <Plus size={16} strokeWidth={3} /> income
        </button>
        <button onClick={() => setShowAdd('expense')} className="rounded-2xl border-2 border-black p-4 flex items-center justify-center gap-2 font-bold mono uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-colors">
          <Plus size={16} strokeWidth={3} /> expense
        </button>
      </div>

      {showAdd && <AddTransactionModal type={showAdd} splitPerPay={data.splitPerPay} onAdd={addTransaction} onClose={() => setShowAdd(null)} />}
      {showBillModal && <BillModal bill={showBillModal} onSave={addOrUpdateBill} onDelete={deleteBill} onClose={() => setShowBillModal(null)} />}
      {showSettings && <SettingsModal split={data.splitPerPay} onSave={updateSplit} onClose={() => setShowSettings(false)} />}

      {/* Recent */}
      <div>
        <div className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-3">recent</div>
        <div className="space-y-2">
          {data.transactions.slice(0, 15).map(t => (
            <div key={t.id} className="rounded-2xl border-2 border-neutral-200 p-3 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{t.label}</div>
                <div className="mono text-[10px] uppercase tracking-widest text-neutral-400">
                  {new Date(t.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })} · {t.category}
                  {t.fundSplit > 0 && <span style={{ color: ACCENT }}> · ${t.fundSplit} → fund</span>}
                </div>
              </div>
              <div className={`heading text-base mr-2 ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                {t.type === 'income' ? '+' : '-'}${Math.floor(t.amount)}
              </div>
              <button onClick={() => deleteTransaction(t.id)} className="text-neutral-400 hover:text-red-500 p-1">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {data.transactions.length === 0 && (
            <div className="text-center py-12 text-neutral-400 text-sm">no transactions yet. log your first shift.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function AddTransactionModal({ type, splitPerPay, onAdd, onClose }) {
  const [amount, setAmount] = useState('');
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState(type === 'income' ? 'construction' : 'fuel');

  const cats = type === 'income' ? ['construction', 'doordash', 'hospo', 'tips', 'other'] : ['fuel', 'phone', 'car', 'food', 'bill', 'other'];
  const willSplit = type === 'income' && amount ? Math.min(splitPerPay, parseFloat(amount) || 0) : 0;
  const willSpend = type === 'income' && amount ? Math.max(0, (parseFloat(amount) || 0) - willSplit) : 0;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end" onClick={onClose}>
      <div className="w-full bg-white border-t-2 border-black rounded-t-3xl p-6 space-y-4 slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <div className="heading text-xl">{type === 'income' ? 'LOG INCOME' : 'LOG EXPENSE'}</div>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div>
          <div className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-2">amount $</div>
          <input type="number" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0"
            className="w-full bg-neutral-50 border-2 border-neutral-200 rounded-2xl px-4 py-3 heading text-3xl focus:border-black focus:outline-none" autoFocus />
        </div>

        {type === 'income' && amount && (
          <div className="rounded-2xl p-3" style={{ background: ACCENT + '10' }}>
            <div className="mono text-[9px] uppercase tracking-widest mb-2" style={{ color: ACCENT }}>auto split</div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1.5">
                <Lock size={12} style={{ color: ACCENT }} />
                <span>korea fund</span>
              </div>
              <span className="font-bold" style={{ color: ACCENT }}>+${willSplit}</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-1.5">
              <div className="flex items-center gap-1.5">
                <DollarSign size={12} className="text-neutral-500" />
                <span>spending</span>
              </div>
              <span className="font-bold">+${willSpend}</span>
            </div>
          </div>
        )}

        <div>
          <div className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-2">label</div>
          <input type="text" value={label} onChange={e => setLabel(e.target.value)} placeholder={type === 'income' ? 'e.g. fri site shift' : 'e.g. fuel up'}
            className="w-full bg-neutral-50 border-2 border-neutral-200 rounded-2xl px-4 py-3 focus:border-black focus:outline-none" />
        </div>
        <div>
          <div className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-2">category</div>
          <div className="grid grid-cols-3 gap-2">
            {cats.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-3 py-2.5 rounded-xl mono text-[10px] uppercase tracking-widest font-bold border-2 transition-all ${category === c ? 'bg-black text-white border-black' : 'bg-white text-neutral-600 border-neutral-200'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => amount && label && onAdd(type, { amount: parseFloat(amount), label, category })}
          disabled={!amount || !label}
          className="w-full text-white font-bold py-4 rounded-2xl mono uppercase tracking-widest text-sm disabled:opacity-30"
          style={{ background: ACCENT }}>save</button>
      </div>
    </div>
  );
}

function BillModal({ bill, onSave, onDelete, onClose }) {
  const [name, setName] = useState(bill.name || '');
  const [amount, setAmount] = useState(bill.amount?.toString() || '');
  const [frequency, setFrequency] = useState(bill.frequency || 'monthly');
  const [nextDue, setNextDue] = useState(bill.nextDue ? bill.nextDue.split('T')[0] : '');
  const isEdit = !!bill.id;

  const frequencies = ['weekly', 'fortnightly', 'monthly', 'yearly'];

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end" onClick={onClose}>
      <div className="w-full bg-white border-t-2 border-black rounded-t-3xl p-6 space-y-4 slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <div className="heading text-xl">{isEdit ? 'EDIT BILL' : 'ADD BILL'}</div>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div>
          <div className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-2">name</div>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. phone, rego"
            className="w-full bg-neutral-50 border-2 border-neutral-200 rounded-2xl px-4 py-3 focus:border-black focus:outline-none" autoFocus />
        </div>
        <div>
          <div className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-2">amount $</div>
          <input type="number" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0"
            className="w-full bg-neutral-50 border-2 border-neutral-200 rounded-2xl px-4 py-3 heading text-2xl focus:border-black focus:outline-none" />
        </div>
        <div>
          <div className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-2">frequency</div>
          <div className="grid grid-cols-2 gap-2">
            {frequencies.map(f => (
              <button key={f} onClick={() => setFrequency(f)}
                className={`px-3 py-2.5 rounded-xl mono text-[10px] uppercase tracking-widest font-bold border-2 ${frequency === f ? 'bg-black text-white border-black' : 'bg-white text-neutral-600 border-neutral-200'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-2">next due (optional)</div>
          <input type="date" value={nextDue} onChange={e => setNextDue(e.target.value)}
            className="w-full bg-neutral-50 border-2 border-neutral-200 rounded-2xl px-4 py-3 focus:border-black focus:outline-none" />
        </div>
        <div className="flex gap-2">
          {isEdit && (
            <button onClick={() => { onDelete(bill.id); onClose(); }}
              className="px-4 border-2 border-red-500 text-red-500 font-bold py-4 rounded-2xl mono uppercase tracking-widest text-xs">
              delete
            </button>
          )}
          <button onClick={() => name && amount && onSave({
            id: bill.id,
            name,
            amount: parseFloat(amount),
            frequency,
            nextDue: nextDue ? new Date(nextDue).toISOString() : null,
            paid: bill.paid || []
          })}
            disabled={!name || !amount}
            className="flex-1 text-white font-bold py-4 rounded-2xl mono uppercase tracking-widest text-sm disabled:opacity-30"
            style={{ background: ACCENT }}>save</button>
        </div>
      </div>
    </div>
  );
}

function SettingsModal({ split, onSave, onClose }) {
  const [val, setVal] = useState(split.toString());
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end" onClick={onClose}>
      <div className="w-full bg-white border-t-2 border-black rounded-t-3xl p-6 space-y-4 slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <div className="heading text-xl">AUTO SPLIT</div>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div className="text-sm text-neutral-700">
          When you log income, this amount automatically goes to your Korea fund. The rest goes to spending.
        </div>
        <div>
          <div className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-2">$ per pay</div>
          <input type="number" inputMode="decimal" value={val} onChange={e => setVal(e.target.value)}
            className="w-full bg-neutral-50 border-2 border-neutral-200 rounded-2xl px-4 py-3 heading text-3xl focus:border-black focus:outline-none" autoFocus />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[50, 100, 150, 200].map(v => (
            <button key={v} onClick={() => setVal(v.toString())}
              className={`px-3 py-2.5 rounded-xl mono text-[10px] uppercase tracking-widest font-bold border-2 ${parseFloat(val) === v ? 'bg-black text-white border-black' : 'bg-white text-neutral-600 border-neutral-200'}`}>
              ${v}
            </button>
          ))}
        </div>
        <button onClick={() => { onSave(val); onClose(); }}
          className="w-full text-white font-bold py-4 rounded-2xl mono uppercase tracking-widest text-sm"
          style={{ background: ACCENT }}>save</button>
      </div>
    </div>
  );
}

function Cyber({ data, saveData, triggerPulse, pulse }) {
  const [showLog, setShowLog] = useState(false);

  const incrementRoom = () => { saveData({ ...data, cyber: { ...data.cyber, thmRooms: data.cyber.thmRooms + 1 } }); triggerPulse('thm'); };
  const decrementRoom = () => saveData({ ...data, cyber: { ...data.cyber, thmRooms: Math.max(0, data.cyber.thmRooms - 1) } });
  const updateSecPlus = (val) => saveData({ ...data, cyber: { ...data.cyber, secPlusProgress: val } });

  const logSession = (session) => {
    saveData({ ...data, cyber: { ...data.cyber, sessions: [{ ...session, id: Date.now(), date: new Date().toISOString() }, ...data.cyber.sessions] } });
    setShowLog(false);
  };

  const totalHours = data.cyber.sessions.reduce((s, sess) => s + (sess.minutes || 0), 0) / 60;
  const lastWeek = data.cyber.sessions.filter(s => new Date(s.date) > new Date(Date.now() - 7 * 86400000));
  const last30 = data.cyber.sessions.filter(s => new Date(s.date) > new Date(Date.now() - 30 * 86400000));

  return (
    <div className="space-y-4 slide-up">
      <div className={`rounded-3xl border-2 border-black p-6 ${pulse === 'thm' ? 'pulse-anim' : ''}`}>
        <div className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-1">tryhackme</div>
        <div className="flex items-baseline gap-3 mb-4">
          <div className="heading text-7xl" style={{ color: ACCENT }}>{data.cyber.thmRooms}</div>
          <div className="text-neutral-500">rooms</div>
        </div>
        <div className="flex gap-2">
          <button onClick={decrementRoom} className="px-5 py-3 border-2 border-neutral-200 rounded-2xl font-bold mono">-1</button>
          <button onClick={incrementRoom} className="flex-1 text-white font-bold py-3 rounded-2xl mono uppercase tracking-widest text-sm" style={{ background: ACCENT }}>
            <Plus size={14} strokeWidth={3} className="inline mr-1" />room cleared
          </button>
        </div>
      </div>

      <div className="rounded-3xl border-2 border-black p-5">
        <div className="flex justify-between items-baseline mb-1">
          <div className="mono text-[10px] uppercase tracking-widest text-neutral-500">sec+</div>
          <div className="heading text-xl" style={{ color: ACCENT }}>{data.cyber.secPlusProgress}%</div>
        </div>
        <div className="h-3 bg-neutral-100 rounded-full overflow-hidden mb-4">
          <div className="h-full progress-fill rounded-full" style={{ width: `${data.cyber.secPlusProgress}%`, background: ACCENT }}></div>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {[0, 25, 50, 75, 100].map(v => (
            <button key={v} onClick={() => updateSecPlus(v)}
              className={`py-2.5 rounded-xl mono text-[10px] uppercase tracking-widest font-bold border-2 ${data.cyber.secPlusProgress === v ? 'bg-black text-white border-black' : 'border-neutral-200 text-neutral-600'}`}>
              {v}%
            </button>
          ))}
        </div>
        <div className="mt-3 mono text-[10px] uppercase tracking-widest text-neutral-500 leading-relaxed">
          target: book exam mid-aug · ~14 weeks prep · prof messer + sybex
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <StatTile label="total hrs" value={totalHours.toFixed(1)} icon={<Shield size={12} />} />
        <StatTile label="7d" value={lastWeek.length} icon={<TrendingUp size={12} />} />
        <StatTile label="30d" value={last30.length} icon={<Zap size={12} />} />
      </div>

      <button onClick={() => setShowLog(true)} className="w-full rounded-2xl border-2 border-black p-4 flex items-center justify-center gap-2 font-bold mono uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-colors">
        <Plus size={16} strokeWidth={3} /> log session
      </button>

      {showLog && <SessionLogModal onLog={logSession} onClose={() => setShowLog(false)} />}

      {data.cyber.sessions.length > 0 && (
        <div>
          <div className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-3">sessions</div>
          <div className="space-y-2">
            {data.cyber.sessions.slice(0, 15).map(s => (
              <div key={s.id} className="rounded-2xl border-2 border-neutral-200 p-3 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{s.topic}</div>
                  <div className="mono text-[10px] uppercase tracking-widest text-neutral-400">
                    {new Date(s.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
                <div className="heading text-lg" style={{ color: ACCENT }}>{s.minutes}m</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-3xl border-2 border-black p-5">
        <div className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-1">cyber path</div>
        <div className="heading text-lg mb-4">2-3 YEAR ARC</div>
        <ol className="space-y-3">
          {[['1', 'THM Pre-Security', 'foundations · now'], ['2', 'THM Cyber Sec 101', 'core · may'], ['3', 'Sec+ exam', 'industry std · aug'],
            ['4', 'THM Jr Pen Tester', 'offensive · jun-aug'], ['5', 'HTB Academy', 'serious · post sec+'],
            ['6', 'Network+ + CySA+', 'yr 1 in korea'], ['7', 'OSCP', 'real cred · yr 2']].map(([num, label, sub]) => (
            <li key={num} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center text-white text-xs font-bold shrink-0 mono">{num}</div>
              <div className="flex-1">
                <div className="font-medium">{label}</div>
                <div className="mono text-[10px] uppercase tracking-widest text-neutral-400">{sub}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function SessionLogModal({ onLog, onClose }) {
  const [topic, setTopic] = useState('');
  const [minutes, setMinutes] = useState('');

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end" onClick={onClose}>
      <div className="w-full bg-white border-t-2 border-black rounded-t-3xl p-6 space-y-4 slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <div className="heading text-xl">LOG SESSION</div>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div>
          <div className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-2">topic</div>
          <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. THM linux fundamentals"
            className="w-full bg-neutral-50 border-2 border-neutral-200 rounded-2xl px-4 py-3 focus:border-black focus:outline-none" autoFocus />
        </div>
        <div>
          <div className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-2">minutes</div>
          <input type="number" inputMode="numeric" value={minutes} onChange={e => setMinutes(e.target.value)} placeholder="60"
            className="w-full bg-neutral-50 border-2 border-neutral-200 rounded-2xl px-4 py-3 heading text-3xl focus:border-black focus:outline-none" />
        </div>
        <button onClick={() => topic && minutes && onLog({ topic, minutes: parseInt(minutes) })}
          disabled={!topic || !minutes}
          className="w-full text-white font-bold py-4 rounded-2xl mono uppercase tracking-widest text-sm disabled:opacity-30"
          style={{ background: ACCENT }}>save</button>
      </div>
    </div>
  );
}

function Checklist({ data, saveData, checklistComplete, checklistTotal, checklistPercent, triggerPulse, pulse }) {
  const toggle = (key) => {
    saveData({ ...data, checklist: { ...data.checklist, [key]: !data.checklist[key] } });
    if (!data.checklist[key]) triggerPulse('check');
  };

  const sections = [
    { title: 'now / may', items: [
      { key: 'white-card', label: 'White Card (online, $50-80, 6hr)', sub: 'required for any construction site' },
      { key: 'labour-hire', label: 'Sign up to 4 labour hire agencies', sub: 'Hays, Programmed, WorkPac, OneKey' },
      { key: 'doordash', label: 'DoorDash / Uber Eats active', sub: 'weekend grind income' },
      { key: 'ing-account', label: 'Open ING or Macquarie account', sub: 'no overseas ATM fees' },
      { key: 'korea-savings', label: 'Separate Korea fund account', sub: 'auto-transfer every paycheck' },
    ]},
    { title: 'jun - jul', items: [
      { key: 'tax-return', label: 'File tax return (early jul)', sub: 'refund → Korea fund' },
      { key: 'sec-plus-booked', label: 'Book Sec+ exam for august', sub: '~$500 voucher' },
      { key: 'gf-license', label: 'Gf refresher driving lessons', sub: 'korean-speaking instructor sunnybank' },
    ]},
    { title: 'jul - aug', items: [
      { key: 'h1-visa', label: 'H-1 visa applied', sub: 'korean consulate sydney, mid-jul' },
      { key: 'health-insurance', label: 'Health insurance (KRW 40m+)', sub: 'world nomads / allianz, ~$500-700' },
      { key: 'flight-booked', label: 'Flight bri → incheon', sub: '~$1,200-1,500, early sept' },
      { key: 'gf-flight', label: 'Gf flight 7-10 days behind yours', sub: 'you arrive first to set up' },
      { key: 'goshiwon-booked', label: 'Goshiwon in busan (1 month)', sub: 'seomyeon, ~KRW 400-450k' },
      { key: 'sec-plus-passed', label: 'Sec+ passed', sub: 'industry-standard cert' },
    ]},
    { title: 'aug - sep', items: [
      { key: 'idp-license', label: 'International driver permit', sub: 'racq, $45' },
      { key: 'police-check', label: 'National police check', sub: 'AFP, $42' },
      { key: 'reference-letters', label: 'Employment reference letters', sub: 'english, letterhead, signed' },
      { key: 'wise-account', label: 'Wise multi-currency card', sub: 'lock AUD→KRW when rate is good' },
      { key: 'phone-unlocked', label: 'Phone unlocked', sub: 'ready for korean SIM' },
      { key: 'docs-cloud', label: 'Docs to cloud + USB', sub: 'passport, visa, certs, diploma' },
      { key: 'diploma-done', label: 'EQC Diploma completed', sub: 'before flying ideally' },
      { key: 'cars-sold', label: 'Both cars sold', sub: 'list mid-aug, sell early sept' },
    ]},
  ];

  return (
    <div className={`space-y-4 slide-up ${pulse === 'check' ? 'pulse-anim' : ''}`}>
      <div className="rounded-3xl border-2 border-black p-6">
        <div className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-1">pre-flight</div>
        <div className="flex items-baseline gap-3 mb-3">
          <div className="heading text-6xl" style={{ color: ACCENT }}>{checklistComplete}</div>
          <div className="mono text-2xl text-neutral-300">/{checklistTotal}</div>
        </div>
        <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
          <div className="h-full progress-fill rounded-full" style={{ width: `${checklistPercent * 100}%`, background: ACCENT }}></div>
        </div>
      </div>

      {sections.map(section => (
        <div key={section.title}>
          <div className="heading text-sm mb-2 uppercase">{section.title}</div>
          <div className="space-y-2">
            {section.items.map(item => (
              <button key={item.key} onClick={() => toggle(item.key)}
                className={`w-full flex items-start gap-3 p-3.5 rounded-2xl text-left transition-all border-2 ${data.checklist[item.key] ? 'border-black bg-black text-white' : 'border-neutral-200 bg-white'}`}>
                <div className="mt-0.5 shrink-0">
                  {data.checklist[item.key] ? <CheckCircle2 size={18} className="text-white" /> : <Circle size={18} className="text-neutral-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm leading-snug font-medium ${data.checklist[item.key] ? 'line-through opacity-60' : ''}`}>{item.label}</div>
                  <div className={`mono text-[10px] uppercase tracking-wider mt-0.5 ${data.checklist[item.key] ? 'opacity-50' : 'text-neutral-400'}`}>{item.sub}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Journal({ data, saveData, today }) {
  const [entry, setEntry] = useState(data.journal[today] || '');
  const [savedAt, setSavedAt] = useState(null);

  const saveEntry = () => {
    saveData({ ...data, journal: { ...data.journal, [today]: entry } });
    setSavedAt(Date.now());
    setTimeout(() => setSavedAt(null), 2000);
  };

  const recentEntries = Object.entries(data.journal).filter(([d, t]) => d !== today && t).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 10);

  return (
    <div className="space-y-4 slide-up">
      <div className="rounded-3xl border-2 border-black p-5">
        <div className="flex justify-between mb-1">
          <div className="mono text-[10px] uppercase tracking-widest text-neutral-500">today</div>
          {savedAt && <div className="mono text-[10px] uppercase tracking-widest" style={{ color: SUCCESS }}>saved</div>}
        </div>
        <div className="heading text-lg mb-3">{new Date(today).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}</div>
        <textarea value={entry} onChange={e => setEntry(e.target.value)} onBlur={saveEntry}
          placeholder="3 lines: what went well · what was hard · one thing for tomorrow"
          className="w-full bg-neutral-50 border-2 border-neutral-200 rounded-2xl px-4 py-3 focus:border-black focus:outline-none resize-none" rows={6} />
        <button onClick={saveEntry} className="mt-3 w-full text-white font-bold py-3 rounded-2xl mono uppercase tracking-widest text-sm" style={{ background: ACCENT }}>save</button>
      </div>

      {recentEntries.length > 0 && (
        <div>
          <div className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-3">past entries</div>
          <div className="space-y-3">
            {recentEntries.map(([date, text]) => (
              <div key={date} className="rounded-2xl border-2 border-neutral-200 p-4">
                <div className="mono text-[10px] uppercase tracking-widest mb-2" style={{ color: ACCENT }}>
                  {new Date(date).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })}
                </div>
                <div className="text-sm leading-relaxed whitespace-pre-wrap">{text}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Tips() {
  const [open, setOpen] = useState(null);

  const sections = [
    { key: 'money', icon: <DollarSign size={16} strokeWidth={2.5} />, title: 'MONEY', items: [
      { h: 'Stack labour hire', b: "Sign up to 3-4 agencies (Hays Trades, Programmed, WorkPac, OneKey). They share work, you get more shifts. White Card required." },
      { h: 'DoorDash hot zones', b: "Brisbane CBD, Fortitude Valley, West End on Friday/Saturday nights = surge gold. $30-40/hr after fuel." },
      { h: 'Track every dollar', b: "Use this app. Not knowing where money goes is how $300/week disappears. Log within 24 hours." },
      { h: 'Split your accounts', b: "ING for daily, separate for Korea fund only. Auto-transfer 70%+ of every paycheck." },
      { h: 'Tax return = bonus', b: "File early July. Most casual workers get $1,500-3,000 back. All to Korea fund." },
      { h: "Don't get a credit card", b: "Tempting but lethal. Stick to debit. You don't need a credit score for Korea." },
    ]},
    { key: 'cyber', icon: <Shield size={16} strokeWidth={2.5} />, title: 'CYBER', items: [
      { h: 'Sec+ first, always', b: "Most globally recognised entry-level cert. ~$500 AUD. Pass = 750/900. Use Professor Messer + Sybex book + Jason Dion practice." },
      { h: 'Public portfolio > certs', b: "Recruiters Google your name. GitHub with TryHackMe write-ups, Hashnode blog, active LinkedIn." },
      { h: 'TryHackMe daily', b: "Even 30 mins a day on a free room beats 4 hours once a week. Top 5% by September." },
      { h: 'Path: Sec+ → Network+ → CySA+', b: "Don't waste money on CEH or bootcamps. CompTIA stack + hands-on platforms is the real path." },
      { h: 'OSCP is the real cred', b: "Year+ project. Foundations first. Year 2 of Korea, not now." },
      { h: 'Korea cyber needs Korean', b: "Most domestic firms hire only Korean speakers. Foreign-friendly: Mandiant Seoul, Palo Alto Korea, S2W, Theori. Mostly Seoul." },
    ]},
    { key: 'korean', icon: <Book size={16} strokeWidth={2.5} />, title: 'KOREAN', items: [
      { h: 'Hangul in 1 week', b: "Ryan Estrada's free comic. Then drill on Anki. End of week 1 you're reading street signs." },
      { h: 'TTMIK', b: "Free podcasts + paid workbooks. Levels 1-3 covers A1-A2." },
      { h: '15 min Anki, every day', b: "Non-negotiable. 20 new cards/day = 600 words/month. Korean 6000 deck or TTMIK's." },
      { h: 'Speak with gf daily', b: "Free native tutor. Even 1 sentence a day. Ask her to correct you explicitly." },
      { h: 'iTalki tutor 1-2x/wk', b: "$10-15 USD per 30-min session. You'll be terrible. That's the point." },
      { h: 'TOPIK 3 = employability', b: "Year 1 in Korea aim TOPIK 2. Year 2, TOPIK 3-4. That's when E-7 jobs become real." },
    ]},
    { key: 'visa', icon: <Plane size={16} strokeWidth={2.5} />, title: 'VISA', items: [
      { h: 'H-1 working holiday', b: "Korean Consulate Sydney. Need: passport (12+ mo), bank statement showing AUD$3,300+, return/onward flight, KRW 40m+ insurance, form, photos. ~7 day processing." },
      { h: 'After H-1: D-4 student', b: "Korean language school at uni gives 1-2 years stable status. ~KRW 1.5-1.8m per 10-week term. Need ~KRW 16m frozen." },
      { h: 'F-6 marriage = long game', b: "Cleanest path. Lets you work anywhere. Korean immigration scrutinises hard. Don't rush." },
      { h: 'E-7 cyber path', b: "Need bachelor's + experience + Korean. Realistic by year 3. Entry: KRW 35-45m/year." },
      { h: 'Goshiwon month 1', b: "KRW 350-450k/mo. Tiny but cheap, no deposit. Allo Korea, GoshiPlace. Seomyeon (Busan)." },
      { h: 'ARC within 90 days', b: "Required for bank, phone, real job. Passport + visa + address + photo + ~30k won. Local immigration office." },
      { h: 'Banks for foreigners', b: "KEB Hana, Woori, Shinhan most foreigner-friendly. Need ARC. Get a Korean debit card." },
    ]},
    { key: 'rel', icon: <Target size={16} strokeWidth={2.5} />, title: 'RELATIONSHIP', items: [
      { h: 'You arrive 7-10 days first', b: "Handle the boring setup. Meeting her family jet-lagged on day 1 = bad look." },
      { h: 'Weekly proper conversations', b: "Not just texting. First 6 months will be hardest on you, year 2 hardest on her if your Korean stays weak." },
      { h: "Her parents' approval matters", b: "Find out where they stand. Affects everything if F-6 ever comes up." },
      { h: "Don't be her project", b: "Be useful. Cook, clean, learn the language, get a job. Don't be the foreign boyfriend she has to manage." },
      { h: 'Busan→Ulsan = fine', b: "30-40 min by KTX. Weekend trips easy. Don't overthink it." },
    ]},
    { key: 'admin', icon: <CheckCircle2 size={16} strokeWidth={2.5} />, title: 'ADMIN', items: [
      { h: 'Wise multi-currency', b: "Better rates than ANZ/Commbank. Lock AUD→KRW when rate is good (>900 KRW per AUD)." },
      { h: 'Keep 1 AU bank active', b: "ING or Macquarie. Don't burn the bridge. Tax, future transfers, plan B." },
      { h: 'IDP from RACQ', b: "$45, 5 mins, valid 1 year. Drive in Korea on AU license." },
      { h: 'AFP police check', b: "$42 online. Useful for any future Korean visa applications." },
      { h: 'Reference letters', b: "Every employer. English. Letterhead. Signed. BEFORE you fly. Chasing former bosses from Korea is hell." },
      { h: 'Cloud + USB backup', b: "Passport, visa, diploma, certs. Google Drive + USB carried separately." },
      { h: 'Pack lean', b: "Korean apartments are tiny. One big bag + carry-on. Buy winter gear there." },
    ]},
    { key: 'mind', icon: <Zap size={16} strokeWidth={2.5} />, title: 'MINDSET', items: [
      { h: 'Year 1 will feel slow', b: "Hospo worker who studies cyber on the side. That's the path. Don't compare to Aussie mates earning $80k." },
      { h: "Don't isolate", b: "Find one foreigner community. One friend outside the relationship is critical." },
      { h: 'Schedule rest days', b: "Saturday lie-in. Sunday hike. Don't grind 7 days/week or burn out by month 4." },
      { h: 'Honest journaling', b: "3 lines a day. The Log tab. Re-read past entries when you doubt the plan." },
      { h: 'Plan B exists', b: "If Korea doesn't work in 2-3 years, going home is fine. Korean, cyber skills, cultural fluency, a story. Not failure." },
    ]},
  ];

  return (
    <div className="space-y-3 slide-up">
      <div className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-1">tips & reference</div>
      {sections.map(s => (
        <div key={s.key} className="rounded-3xl border-2 border-black overflow-hidden">
          <button onClick={() => setOpen(open === s.key ? null : s.key)}
            className="w-full p-4 flex items-center gap-3 text-left hover:bg-neutral-50">
            <div style={{ color: ACCENT }}>{s.icon}</div>
            <div className="heading text-base flex-1">{s.title}</div>
            <ChevronRight size={16} className={`text-neutral-400 transition-transform ${open === s.key ? 'rotate-90' : ''}`} />
          </button>
          {open === s.key && (
            <div className="px-4 pb-4 space-y-3 border-t-2 border-black">
              {s.items.map((item, i) => (
                <div key={i} className="pt-3">
                  <div className="mono text-[10px] uppercase tracking-widest font-bold mb-1" style={{ color: ACCENT }}>{item.h}</div>
                  <div className="text-sm leading-relaxed text-neutral-700">{item.b}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
