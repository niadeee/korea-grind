import React, { useState, useEffect, useMemo } from 'react';
import { DollarSign, Shield, Plane, Book, CheckCircle2, Circle, Flame, Trash2, TrendingUp, Lightbulb, ChevronRight, Plus, X, Target, Zap, Award, Snowflake, ArrowUp, ArrowDown, Calendar, Lock, AlertCircle, Edit2, Settings, Home as HomeIcon, Menu } from 'lucide-react';

// ââ Design Tokens ââ
const ACCENT = '#0047FF';
const ACCENT_LIGHT = '#EBF0FF';
const SUCCESS = '#10B981';
const DANGER = '#EF4444';
const WARNING = '#F59E0B';
const TEXT_PRIMARY = '#0F172A';
const TEXT_SECONDARY = '#475569';
const TEXT_MUTED = '#94A3B8';
const BG_PAGE = '#F8FAFC';
const BG_CARD = '#FFFFFF';
const BORDER_LIGHT = '#E2E8F0';
const BORDER_MEDIUM = '#CBD5E1';
const SHADOW_SM = '0 1px 2px rgba(0,0,0,0.05)';
const SHADOW_MD = '0 4px 12px rgba(0,0,0,0.08)';
const SHADOW_LG = '0 8px 24px rgba(0,0,0,0.12)';
const SIDEBAR_BG = '#0F172A';
const SIDEBAR_W = 240;
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

// ââ Shared Styles ââ
const cardStyle = {
  background: BG_CARD,
  borderRadius: 16,
  border: `1px solid ${BORDER_LIGHT}`,
  padding: 24,
  boxShadow: SHADOW_SM,
  transition: 'box-shadow 0.2s ease, transform 0.2s ease',
};
const cardHeroStyle = {
  ...cardStyle,
  border: `2px solid ${TEXT_PRIMARY}`,
  boxShadow: SHADOW_MD,
};
const cardAccentStyle = {
  ...cardStyle,
  background: ACCENT,
  border: `2px solid ${ACCENT}`,
  color: '#FFFFFF',
};
const btnPrimary = {
  background: ACCENT,
  color: '#FFFFFF',
  border: 'none',
  borderRadius: 12,
  padding: '12px 20px',
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  transition: 'all 0.2s ease',
};
const btnSecondary = {
  background: 'transparent',
  color: TEXT_PRIMARY,
  border: `2px solid ${BORDER_LIGHT}`,
  borderRadius: 12,
  padding: '12px 20px',
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  transition: 'all 0.2s ease',
};
const inputStyle = {
  width: '100%',
  background: '#F8FAFC',
  border: `2px solid ${BORDER_LIGHT}`,
  borderRadius: 12,
  padding: '12px 16px',
  fontSize: 15,
  outline: 'none',
  fontFamily: "'Inter Tight', sans-serif",
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
};
const labelStyle = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 10,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: TEXT_MUTED,
  marginBottom: 8,
  display: 'block',
};
const headingFont = { fontFamily: "'Archivo Black', sans-serif", letterSpacing: '-0.02em' };
const monoFont = { fontFamily: "'JetBrains Mono', monospace" };
const bodyFont = { fontFamily: "'Inter Tight', system-ui, sans-serif" };

// ââ Responsive Hook ââ
function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return mobile;
}

// ââ Root Component ââ
export default function KoreaGrind() {
  const [activeTab, setActiveTab] = useState('home');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pulse, setPulse] = useState(null);
  const [unlockedToast, setUnlockedToast] = useState(null);
  const isMobile = useIsMobile();

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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFFFFF' }}>
        <div style={{ ...monoFont, fontSize: 11, letterSpacing: '0.2em', color: TEXT_MUTED, textTransform: 'uppercase' }}>loading</div>
      </div>
    );
  }

  const navItems = [
    { key: 'home', icon: <Target size={18} strokeWidth={2.5} />, label: 'Home' },
    { key: 'money', icon: <DollarSign size={18} strokeWidth={2.5} />, label: 'Money' },
    { key: 'cyber', icon: <Shield size={18} strokeWidth={2.5} />, label: 'Cyber' },
    { key: 'list', icon: <CheckCircle2 size={18} strokeWidth={2.5} />, label: 'Checklist' },
    { key: 'log', icon: <Book size={18} strokeWidth={2.5} />, label: 'Journal' },
    { key: 'tips', icon: <Lightbulb size={18} strokeWidth={2.5} />, label: 'Tips' },
  ];

  const contentProps = { data, saveData, netSaved, totalIncome, totalExpenses, savingsPercent, weeklyTarget, weeksToKorea, daysToKorea, today, checklistComplete, checklistTotal, checklistPercent, setActiveTab, triggerPulse, pulse, isMobile };

  return (
    <div style={{ display: 'flex', height: '100vh', background: BG_PAGE, color: TEXT_PRIMARY, ...bodyFont }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800;900&family=Archivo+Black&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes pulseScale { 0%{transform:scale(1)} 50%{transform:scale(1.03)} 100%{transform:scale(1)} }
        @keyframes slideUp { 0%{opacity:0;transform:translateY(16px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { 0%{opacity:0} 100%{opacity:1} }
        @keyframes toastIn { 0%{opacity:0;transform:translateY(-12px)} 100%{opacity:1;transform:translateY(0)} }
        .pulse-anim{animation:pulseScale 0.4s cubic-bezier(.34,1.56,.64,1)}
        .slide-up{animation:slideUp 0.35s cubic-bezier(.16,1,.3,1)}
        .fade-in{animation:fadeIn 0.3s ease-in}
        .toast-in{animation:toastIn 0.4s cubic-bezier(.16,1,.3,1)}
        .progress-fill{transition:width 0.6s cubic-bezier(.16,1,.3,1)}
        *{box-sizing:border-box}
        input:focus,textarea:focus{border-color:${ACCENT}!important;outline:none}
        button{cursor:pointer;border:none;background:none;font-family:inherit}
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${BORDER_LIGHT};border-radius:3px}
        ::-webkit-scrollbar-thumb:hover{background:${BORDER_MEDIUM}}
      `}</style>

      {/* ââ Toast ââ */}
      {unlockedToast && (
        <div style={{ position: 'fixed', top: 16, left: 16, right: 16, zIndex: 100 }} className="toast-in">
          <div style={{ background: TEXT_PRIMARY, color: '#FFF', borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: SHADOW_LG }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Award size={20} color="#FFF" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...monoFont, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.5 }}>milestone unlocked</div>
              <div style={{ fontWeight: 700, fontSize: 14, marginTop: 2 }}>{unlockedToast.label}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>{unlockedToast.desc}</div>
            </div>
          </div>
        </div>
      )}

      {/* ââ Desktop Sidebar ââ */}
      {!isMobile && (
        <nav style={{ width: SIDEBAR_W, background: SIDEBAR_BG, display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.08)', flexShrink: 0, height: '100vh', position: 'sticky', top: 0 }}>
          {/* Logo area */}
          <div style={{ padding: '28px 24px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Target size={18} color="#FFF" strokeWidth={3} />
              </div>
              <div>
                <div style={{ ...headingFont, fontSize: 16, color: '#FFF', lineHeight: 1 }}>KOREA GRIND</div>
                <div style={{ ...monoFont, fontSize: 9, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 3 }}>busan Â· sept 26</div>
              </div>
            </div>
          </div>

          {/* Countdown chip */}
          <div style={{ margin: '0 20px 20px', padding: '14px 16px', background: 'rgba(255,255,255,0.06)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ ...monoFont, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>days left</div>
            <div style={{ ...headingFont, fontSize: 32, color: ACCENT, lineHeight: 1 }}>{daysToKorea}</div>
          </div>

          {/* Savings mini bar */}
          <div style={{ margin: '0 20px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ ...monoFont, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)' }}>korea fund</span>
              <span style={{ ...monoFont, fontSize: 10, color: ACCENT, fontWeight: 700 }}>{Math.round(savingsPercent)}%</span>
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
              <div className="progress-fill" style={{ height: '100%', background: ACCENT, borderRadius: 2, width: `${savingsPercent}%` }}></div>
            </div>
          </div>

          {/* Nav items */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, padding: '0 12px' }}>
            {navItems.map(item => {
              const isActive = activeTab === item.key;
              return (
                <button key={item.key} onClick={() => setActiveTab(item.key)} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 10,
                  background: isActive ? 'rgba(0,71,255,0.12)' : 'transparent',
                  color: isActive ? ACCENT : 'rgba(255,255,255,0.5)',
                  transition: 'all 0.15s ease', position: 'relative', width: '100%', textAlign: 'left',
                }}>
                  {isActive && <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: 20, borderRadius: 2, background: ACCENT }}></div>}
                  {item.icon}
                  <span style={{ ...monoFont, fontSize: 11, fontWeight: isActive ? 700 : 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* ââ Main Content ââ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Mobile header */}
        {isMobile && (
          <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${BORDER_LIGHT}`, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Target size={18} color="#FFF" strokeWidth={3} />
              </div>
              <div>
                <div style={{ ...headingFont, fontSize: 18, lineHeight: 1 }}>KOREA GRIND</div>
                <div style={{ ...monoFont, fontSize: 9, color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>busan Â· sept 26</div>
              </div>
            </div>
            <div style={{ ...cardStyle, padding: '8px 16px', borderRadius: 12 }}>
              <div style={{ ...monoFont, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', color: TEXT_MUTED, textAlign: 'center' }}>days</div>
              <div style={{ ...headingFont, fontSize: 22, color: ACCENT, textAlign: 'center', lineHeight: 1, marginTop: 2 }}>{daysToKorea}</div>
            </div>
          </header>
        )}

        {/* Scrollable content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '20px 16px 100px' : '32px 40px 40px' }}>
          <div style={{ maxWidth: 672, margin: '0 auto' }}>
            {activeTab === 'home' && <Home {...contentProps} />}
            {activeTab === 'money' && <Money {...contentProps} />}
            {activeTab === 'cyber' && <Cyber {...contentProps} />}
            {activeTab === 'list' && <Checklist {...contentProps} />}
            {activeTab === 'log' && <Journal {...contentProps} />}
            {activeTab === 'tips' && <Tips isMobile={isMobile} />}
          </div>
        </main>

        {/* Mobile bottom nav */}
        {isMobile && (
          <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderTop: `1px solid ${BORDER_LIGHT}`, zIndex: 50, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', padding: '6px 0 env(safe-area-inset-bottom, 8px)' }}>
            {navItems.map(item => {
              const isActive = activeTab === item.key;
              return (
                <button key={item.key} onClick={() => setActiveTab(item.key)} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '8px 4px',
                  color: isActive ? ACCENT : TEXT_MUTED, transition: 'color 0.15s',
                }}>
                  <div style={{ transform: isActive ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.15s' }}>{item.icon}</div>
                  <span style={{ ...monoFont, fontSize: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
}

// ââ Home Page ââ
function Home({ data, saveData, netSaved, savingsPercent, weeklyTarget, daysToKorea, today, checklistComplete, checklistTotal, checklistPercent, setActiveTab, triggerPulse, pulse, isMobile }) {
  const koreanCheckedToday = data.korean.history.includes(today);

  const smartTasks = useMemo(() => {
    const tasks = [];
    const dayNum = new Date(today).getDay();
    const isWeekend = dayNum === 0 || dayNum === 6;
    const weekAgo = new Date(Date.now() - 7 * 86400000);
    const weekIncome = data.transactions.filter(t => t.type === 'income' && new Date(t.date) > weekAgo).reduce((s, t) => s + t.amount, 0);
    const weekShortage = weeklyTarget - weekIncome;

    if (!koreanCheckedToday) tasks.push({ id: 'k', text: 'Korean: 15 min Anki + speak 1 sentence with gf', urgency: 'core', tab: null });
    if (weekShortage > 100) tasks.push({ id: 'm', text: `Behind $${Math.ceil(weekShortage)} this week. Pick up a shift or DoorDash tonight`, urgency: 'high', tab: 'money' });
    else tasks.push({ id: 'm', text: "Log today's shift income", urgency: 'med', tab: 'money' });
    if (isWeekend) tasks.push({ id: 'c', text: 'Cyber block: 2 hrs Sec+ study OR knock out a TryHackMe room', urgency: 'high', tab: 'cyber' });
    else tasks.push({ id: 'c', text: 'Cyber: 30 min Sec+ video or Anki flashcards', urgency: 'med', tab: 'cyber' });
    const incompleteCount = checklistTotal - checklistComplete;
    if (daysToKorea < 60 && incompleteCount > 5) tasks.push({ id: 'l', text: `${incompleteCount} pre-flight items left. Knock one off today`, urgency: 'high', tab: 'list' });
    else if (incompleteCount > 0) tasks.push({ id: 'l', text: 'Tick off one pre-flight checklist item', urgency: 'med', tab: 'list' });
    if (!data.journal[today]) tasks.push({ id: 'j', text: 'Log 3 lines tonight: wins, struggles, tomorrow', urgency: 'low', tab: 'log' });
    return tasks.slice(0, 5);
  }, [data, today, weeklyTarget, daysToKorea, checklistComplete, checklistTotal, koreanCheckedToday]);

  const toggleKorean = () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (koreanCheckedToday) {
      const newHistory = data.korean.history.filter(d => d !== today);
      saveData({ ...data, korean: { ...data.korean, streak: Math.max(0, data.korean.streak - 1), history: newHistory, lastChecked: yesterday } });
    } else {
      const last = data.korean.lastChecked;
      let newStreak = (last === yesterday) ? data.korean.streak + 1 : 1;
      const newLongest = Math.max(data.korean.longestStreak, newStreak);
      saveData({ ...data, korean: { ...data.korean, streak: newStreak, longestStreak: newLongest, lastChecked: today, history: [...data.korean.history, today] } });
      triggerPulse('korean');
    }
  };

  const useStreakFreeze = () => {
    if (data.korean.freezesAvailable < 1) return;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    saveData({ ...data, korean: { ...data.korean, freezesAvailable: data.korean.freezesAvailable - 1, lastChecked: yesterday } });
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
    <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Korea Fund Hero */}
      <div style={{ ...cardHeroStyle, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 12, right: 16, ...monoFont, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: TEXT_MUTED }}>north star</div>
        <div style={{ ...monoFont, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: TEXT_MUTED, marginBottom: 4 }}>korea fund</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
          <div style={{ ...headingFont, fontSize: isMobile ? 48 : 56, color: ACCENT, lineHeight: 1 }}>${Math.floor(netSaved).toLocaleString()}</div>
          <div style={{ ...monoFont, fontSize: 14, color: TEXT_MUTED }}>/ ${SAVINGS_GOAL.toLocaleString()}</div>
        </div>
        <div style={{ height: 10, background: '#F1F5F9', borderRadius: 5, overflow: 'hidden', marginBottom: 14 }}>
          <div className="progress-fill" style={{ height: '100%', borderRadius: 5, background: ACCENT, width: `${savingsPercent}%` }}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...monoFont, fontSize: 11 }}>
          <div><span style={{ color: TEXT_MUTED }}>need </span><span style={{ fontWeight: 700 }}>${Math.ceil(weeklyTarget).toLocaleString()}</span><span style={{ color: TEXT_MUTED }}>/wk</span></div>
          <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, color: onTrack ? SUCCESS : DANGER }}>
            {onTrack ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {onTrack ? 'on track' : 'behind'}
          </div>
        </div>
      </div>

      {/* Stat Tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        <StatTile label="streak" value={data.korean.streak} suffix="d" icon={<Flame size={12} />} />
        <StatTile label="thm rooms" value={data.cyber.thmRooms} icon={<Shield size={12} />} />
        <StatTile label="badges" value={milestoneCount} icon={<Award size={12} />} />
      </div>

      {/* Smart Tasks */}
      <div style={cardHeroStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ ...monoFont, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: TEXT_MUTED }}>today's focus</div>
            <div style={{ ...headingFont, fontSize: 20, marginTop: 4 }}>DO THIS.</div>
          </div>
          <Zap size={22} color={ACCENT} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {smartTasks.map(t => (
            <div key={t.id} style={{
              padding: '12px 14px', borderRadius: 12,
              border: `2px solid ${t.urgency === 'high' ? DANGER : t.urgency === 'core' ? TEXT_PRIMARY : BORDER_LIGHT}`,
              background: t.urgency === 'high' ? '#FEF2F2' : 'transparent',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, marginTop: 6, flexShrink: 0, background: t.urgency === 'high' ? DANGER : t.urgency === 'core' ? TEXT_PRIMARY : TEXT_MUTED }}></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, lineHeight: 1.5 }}>{t.text}</div>
                  {t.tab && (
                    <button onClick={() => setActiveTab(t.tab)} style={{ ...monoFont, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 6, fontWeight: 700, color: ACCENT, display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                      open {t.tab} <ChevronRight size={10} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {smartTasks.length === 0 && (
            <div style={{ textAlign: 'center', padding: '24px 0', color: TEXT_MUTED, fontSize: 14 }}>all clear today. rest is part of the grind.</div>
          )}
        </div>
      </div>

      {/* Korean Check-in */}
      <div className={pulse === 'korean' ? 'pulse-anim' : ''} style={cardHeroStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ ...monoFont, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: TEXT_MUTED }}>korean today</div>
            <div style={{ fontSize: 14, color: TEXT_SECONDARY, marginTop: 4 }}>15 mins counts. tap when done.</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Flame size={20} color={koreanCheckedToday ? ACCENT : TEXT_MUTED} fill={koreanCheckedToday ? ACCENT : 'none'} />
            <span style={{ ...headingFont, fontSize: 28, color: koreanCheckedToday ? ACCENT : TEXT_MUTED }}>{data.korean.streak}</span>
          </div>
        </div>
        <button onClick={toggleKorean} style={{
          width: '100%', padding: '14px 0', borderRadius: 12, fontWeight: 700, ...monoFont, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: 13, transition: 'all 0.2s',
          ...(koreanCheckedToday ? { background: TEXT_PRIMARY, color: '#FFF', border: 'none' } : { background: 'transparent', color: ACCENT, border: `2px solid ${TEXT_PRIMARY}` }),
        }}>
          {koreanCheckedToday ? 'â done Â· tap to undo' : 'check in'}
        </button>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', ...monoFont, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          <span style={{ color: TEXT_MUTED }}>longest: {data.korean.longestStreak}d</span>
          <button onClick={useStreakFreeze} disabled={data.korean.freezesAvailable < 1} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20,
            border: `1px solid ${TEXT_PRIMARY}`, opacity: data.korean.freezesAvailable < 1 ? 0.3 : 1,
            cursor: data.korean.freezesAvailable < 1 ? 'not-allowed' : 'pointer', background: 'transparent',
          }}>
            <Snowflake size={11} color={TEXT_PRIMARY} />
            <span style={{ fontWeight: 700, color: TEXT_PRIMARY }}>freeze {data.korean.freezesAvailable}/1</span>
          </button>
        </div>
      </div>

      {/* Charts */}
      <div style={cardHeroStyle}>
        <div style={{ ...monoFont, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: TEXT_MUTED, marginBottom: 4 }}>velocity Â· 14d</div>
        <div style={{ ...headingFont, fontSize: 18, marginBottom: 16 }}>DAILY NET</div>
        <BarChart data={velocityData} />
      </div>

      <div style={cardHeroStyle}>
        <div style={{ ...monoFont, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: TEXT_MUTED, marginBottom: 4 }}>building up Â· 14d</div>
        <div style={{ ...headingFont, fontSize: 18, marginBottom: 16 }}>CUMULATIVE</div>
        <LineChart data={cumulativeData} />
      </div>

      {/* Checklist Preview */}
      <button onClick={() => setActiveTab('list')} style={{ ...cardHeroStyle, width: '100%', textAlign: 'left', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ ...monoFont, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: TEXT_MUTED }}>pre-flight</div>
            <div style={{ ...headingFont, fontSize: 18, marginTop: 4 }}>CHECKLIST</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ ...headingFont, fontSize: 28, color: ACCENT }}>{checklistComplete}</span>
            <span style={{ ...headingFont, fontSize: 16, color: TEXT_MUTED }}>/{checklistTotal}</span>
          </div>
        </div>
        <div style={{ height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
          <div className="progress-fill" style={{ height: '100%', borderRadius: 4, background: ACCENT, width: `${checklistPercent * 100}%` }}></div>
        </div>
      </button>

      <Milestones data={data} netSaved={netSaved} checklistPercent={checklistPercent} />
    </div>
  );
}

// ââ Charts ââ
function BarChart({ data }) {
  const max = Math.max(...data.map(d => Math.abs(d.net)), 100);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 96 }}>
      {data.map((d, i) => {
        const h = Math.abs(d.net) / max * 100;
        const positive = d.net >= 0;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end', height: 80 }}>
              {d.net !== 0 && (
                <div className="progress-fill" style={{ width: '100%', borderRadius: '3px 3px 0 0', height: `${Math.max(2, h)}%`, background: positive ? ACCENT : DANGER }}></div>
              )}
            </div>
            <div style={{ ...monoFont, fontSize: 8, color: TEXT_MUTED }}>{d.label}</div>
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
    <div style={{ position: 'relative' }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: 96 }}>
        <polyline points={points} fill="none" stroke={ACCENT} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * 100;
          const y = 100 - ((d.cum - min) / range) * 90 - 5;
          return <circle key={i} cx={x} cy={y} r="1.5" fill={ACCENT} />;
        })}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', ...monoFont, fontSize: 9, color: TEXT_MUTED, marginTop: 4 }}>
        <span>14d ago</span>
        <span style={{ fontWeight: 700, color: ACCENT }}>${Math.floor(lastValue).toLocaleString()}</span>
      </div>
    </div>
  );
}

function StatTile({ label, value, suffix = '', icon }) {
  return (
    <div style={{ ...cardStyle, padding: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, ...monoFont, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: TEXT_MUTED, marginBottom: 6 }}>
        {icon}{label}
      </div>
      <div style={{ ...headingFont, fontSize: 24 }}>{value}{suffix}</div>
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
    <div style={cardHeroStyle}>
      <div style={{ ...monoFont, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: TEXT_MUTED, marginBottom: 4 }}>next milestone</div>
      <div style={{ ...headingFont, fontSize: 18, marginBottom: 12 }}>{next.label.toUpperCase()}</div>
      <div style={{ fontSize: 14, color: TEXT_SECONDARY, marginBottom: 12 }}>{next.desc}</div>
      <div style={{ height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
        <div className="progress-fill" style={{ height: '100%', borderRadius: 4, background: ACCENT, width: `${pct}%` }}></div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', ...monoFont, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: TEXT_MUTED }}>
        <span>{Math.floor(current * (next.type === 'checklist' ? 100 : 1))}{next.type === 'checklist' ? '%' : ''}</span>
        <span>{next.type === 'checklist' ? `${Math.floor(next.threshold * 100)}%` : next.threshold}</span>
      </div>
      {recent.length > 0 && (
        <>
          <div style={{ marginTop: 20, ...monoFont, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: TEXT_MUTED, marginBottom: 8 }}>recent unlocks</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {recent.map(m => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <Award size={12} color={ACCENT} />
                <span style={{ fontWeight: 600 }}>{m.label}</span>
                <span style={{ color: TEXT_MUTED }}>â {m.desc}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ââ Modal Overlay (bottom sheet mobile, centered desktop) ââ
function ModalOverlay({ children, onClose, isMobile }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', zIndex: 60, display: 'flex', alignItems: isMobile ? 'flex-end' : 'center', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} className="slide-up" style={{
        width: isMobile ? '100%' : '100%', maxWidth: isMobile ? '100%' : 480,
        background: '#FFF', borderRadius: isMobile ? '20px 20px 0 0' : 20,
        padding: 24, maxHeight: isMobile ? '85vh' : '80vh', overflowY: 'auto',
        border: `2px solid ${TEXT_PRIMARY}`, borderBottom: isMobile ? 'none' : `2px solid ${TEXT_PRIMARY}`,
      }}>
        {children}
      </div>
    </div>
  );
}

// ââ Money Page ââ
function Money({ data, saveData, netSaved, totalIncome, totalExpenses, savingsPercent, weeklyTarget, triggerPulse, pulse, isMobile }) {
  const [showAdd, setShowAdd] = useState(null);
  const [showBillModal, setShowBillModal] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const todayDate = new Date();

  const koreaFund = data.transactions.filter(t => t.type === 'income').reduce((s, t) => s + (t.fundSplit || 0), 0);
  const spendingIn = data.transactions.filter(t => t.type === 'income').reduce((s, t) => s + (t.amount - (t.fundSplit || 0)), 0);
  const spendingOut = totalExpenses;
  const spendingBalance = spendingIn - spendingOut;

  const incomeDates = data.transactions.filter(t => t.type === 'income').map(t => new Date(t.date)).sort((a, b) => b - a);
  let avgPayGapDays = 3;
  if (incomeDates.length >= 2) {
    const gaps = [];
    for (let i = 0; i < Math.min(incomeDates.length - 1, 10); i++) gaps.push((incomeDates[i] - incomeDates[i + 1]) / 86400000);
    avgPayGapDays = Math.max(2, Math.round(gaps.reduce((s, g) => s + g, 0) / gaps.length));
  }
  const lastPayDate = incomeDates[0] || todayDate;
  const nextPayDate = new Date(lastPayDate.getTime() + avgPayGapDays * 86400000);
  const daysToNextPay = Math.max(1, Math.ceil((nextPayDate - todayDate) / 86400000));

  const billsWithDates = data.bills.map(bill => {
    let nextDue = bill.nextDue ? new Date(bill.nextDue) : null;
    if (!nextDue || nextDue < todayDate) {
      const today0 = new Date(todayDate); today0.setHours(0,0,0,0);
      if (bill.frequency === 'weekly') nextDue = new Date(today0.getTime() + 7 * 86400000);
      else if (bill.frequency === 'fortnightly') nextDue = new Date(today0.getTime() + 14 * 86400000);
      else if (bill.frequency === 'monthly') { nextDue = new Date(today0); nextDue.setMonth(nextDue.getMonth() + 1); }
      else if (bill.frequency === 'yearly') { nextDue = new Date(today0); nextDue.setFullYear(nextDue.getFullYear() + 1); }
    }
    const daysUntil = Math.ceil((nextDue - todayDate) / 86400000);
    return { ...bill, nextDueDate: nextDue, daysUntil };
  }).sort((a, b) => a.daysUntil - b.daysUntil);

  const billsDueBeforePay = billsWithDates.filter(b => b.daysUntil <= daysToNextPay && b.daysUntil >= 0);
  const billsTotalBeforePay = billsDueBeforePay.reduce((s, b) => s + b.amount, 0);
  const safeToSpend = spendingBalance - billsTotalBeforePay;
  const dailyAllowance = safeToSpend / daysToNextPay;

  let safetyColor = SUCCESS;
  let safetyLabel = 'safe';
  if (safeToSpend < 0) { safetyColor = DANGER; safetyLabel = 'overspending'; }
  else if (dailyAllowance < 20) { safetyColor = WARNING; safetyLabel = 'tight'; }

  const addTransaction = (type, transaction) => {
    const fundSplit = type === 'income' ? Math.min(data.splitPerPay, transaction.amount) : 0;
    saveData({ ...data, transactions: [{ ...transaction, type, fundSplit, id: Date.now(), date: new Date().toISOString() }, ...data.transactions] });
    setShowAdd(null);
    triggerPulse('money');
  };
  const deleteTransaction = (id) => saveData({ ...data, transactions: data.transactions.filter(t => t.id !== id) });

  const markBillPaid = (billId) => {
    const bill = data.bills.find(b => b.id === billId);
    if (!bill) return;
    const expenseTx = { type: 'expense', amount: bill.amount, label: bill.name, category: 'bill', id: Date.now(), date: new Date().toISOString() };
    let newDue = new Date(bill.nextDueDate || todayDate);
    if (bill.frequency === 'weekly') newDue = new Date(newDue.getTime() + 7 * 86400000);
    else if (bill.frequency === 'fortnightly') newDue = new Date(newDue.getTime() + 14 * 86400000);
    else if (bill.frequency === 'monthly') newDue.setMonth(newDue.getMonth() + 1);
    else if (bill.frequency === 'yearly') newDue.setFullYear(newDue.getFullYear() + 1);
    const updatedBills = data.bills.map(b => b.id === billId ? { ...b, nextDue: newDue.toISOString(), paid: [...(b.paid || []), today] } : b);
    saveData({ ...data, transactions: [expenseTx, ...data.transactions], bills: updatedBills });
    triggerPulse('money');
  };

  const addOrUpdateBill = (bill) => {
    if (bill.id && data.bills.find(b => b.id === bill.id)) saveData({ ...data, bills: data.bills.map(b => b.id === bill.id ? bill : b) });
    else saveData({ ...data, bills: [...data.bills, { ...bill, id: 'b' + Date.now(), paid: [] }] });
    setShowBillModal(null);
  };
  const deleteBill = (id) => saveData({ ...data, bills: data.bills.filter(b => b.id !== id) });
  const updateSplit = (val) => saveData({ ...data, splitPerPay: parseFloat(val) || 0 });

  const weekAgo = new Date(Date.now() - 7 * 86400000);
  const weekIncome = data.transactions.filter(t => t.type === 'income' && new Date(t.date) > weekAgo).reduce((s, t) => s + t.amount, 0);

  return (
    <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Safe to Spend Hero */}
      <div className={pulse === 'money' ? 'pulse-anim' : ''} style={{ ...cardHeroStyle, background: safetyColor + '08' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div style={{ ...monoFont, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: TEXT_MUTED }}>safe to spend</div>
          <div style={{ ...monoFont, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, color: safetyColor }}>{safetyLabel}</div>
        </div>
        <div style={{ ...headingFont, fontSize: isMobile ? 48 : 56, color: safetyColor, marginBottom: 12, lineHeight: 1 }}>${Math.floor(safeToSpend).toLocaleString()}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...monoFont, fontSize: 11 }}>
          <div><span style={{ color: TEXT_MUTED }}>next pay in </span><span style={{ fontWeight: 700 }}>{daysToNextPay}d</span></div>
          <div><span style={{ color: TEXT_MUTED }}>daily </span><span style={{ fontWeight: 700, color: safetyColor }}>${Math.floor(dailyAllowance)}</span></div>
        </div>
      </div>

      {/* Dual Accounts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ ...cardAccentStyle, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, ...monoFont, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7, marginBottom: 8 }}>
            <Lock size={11} /> korea fund
          </div>
          <div style={{ ...headingFont, fontSize: 24 }}>${Math.floor(koreaFund).toLocaleString()}</div>
          <div style={{ ...monoFont, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7, marginTop: 4 }}>/ ${SAVINGS_GOAL.toLocaleString()}</div>
          <div style={{ marginTop: 10, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 2, overflow: 'hidden' }}>
            <div className="progress-fill" style={{ height: '100%', background: '#FFF', borderRadius: 2, width: `${Math.min(100, (koreaFund/SAVINGS_GOAL)*100)}%` }}></div>
          </div>
        </div>
        <div style={{ ...cardStyle, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, ...monoFont, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: TEXT_MUTED, marginBottom: 8 }}>
            <DollarSign size={11} /> spending
          </div>
          <div style={{ ...headingFont, fontSize: 24 }}>${Math.floor(spendingBalance).toLocaleString()}</div>
          <div style={{ ...monoFont, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: TEXT_MUTED, marginTop: 4 }}>balance</div>
          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', ...monoFont, fontSize: 9 }}>
            <span style={{ color: SUCCESS }}>+${Math.floor(spendingIn)}</span>
            <span style={{ color: DANGER }}>-${Math.floor(spendingOut)}</span>
          </div>
        </div>
      </div>

      {/* Split Setting */}
      <button onClick={() => setShowSettings(true)} style={{ ...cardStyle, padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Settings size={14} color={TEXT_MUTED} />
          <span style={{ ...monoFont, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: TEXT_MUTED }}>auto-split per pay</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontWeight: 700, color: ACCENT }}>${data.splitPerPay}</span>
          <ChevronRight size={14} color={TEXT_MUTED} />
        </div>
      </button>

      {/* Upcoming Bills */}
      <div style={cardHeroStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ ...monoFont, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: TEXT_MUTED }}>bills</div>
            <div style={{ ...headingFont, fontSize: 18, marginTop: 4 }}>UPCOMING</div>
          </div>
          <button onClick={() => setShowBillModal({ name: '', amount: '', frequency: 'monthly' })} style={{ width: 34, height: 34, borderRadius: 17, background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
            <Plus size={16} strokeWidth={3} color="#FFF" />
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {billsWithDates.map(b => {
            const isUrgent = b.daysUntil <= 3;
            const isDue = b.daysUntil <= 0;
            return (
              <div key={b.id} style={{ padding: '12px 14px', borderRadius: 12, border: `2px solid ${isDue ? DANGER : isUrgent ? WARNING : BORDER_LIGHT}`, background: isDue ? '#FEF2F2' : isUrgent ? '#FFFBEB' : 'transparent' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{b.name}</div>
                    <div style={{ ...monoFont, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2, color: isDue ? DANGER : isUrgent ? WARNING : TEXT_MUTED }}>
                      {isDue ? 'due now' : `in ${b.daysUntil}d`} Â· {b.frequency}
                    </div>
                  </div>
                  <div style={{ ...headingFont, fontSize: 18, flexShrink: 0 }}>${b.amount}</div>
                  <button onClick={() => markBillPaid(b.id)} style={{ ...btnPrimary, padding: '6px 14px', borderRadius: 20, fontSize: 10 }}>pay</button>
                  <button onClick={() => setShowBillModal(b)} style={{ padding: 6, color: TEXT_MUTED }}><Edit2 size={12} /></button>
                </div>
              </div>
            );
          })}
          {data.bills.length === 0 && <div style={{ textAlign: 'center', padding: '24px 0', color: TEXT_MUTED, fontSize: 14 }}>no bills set up. tap + to add.</div>}
        </div>
      </div>

      {/* Week Summary */}
      <div style={cardHeroStyle}>
        <div style={{ ...monoFont, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: TEXT_MUTED, marginBottom: 14 }}>last 7 days</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, textAlign: 'center' }}>
          <div>
            <div style={{ ...headingFont, fontSize: 20, color: SUCCESS }}>${Math.floor(weekIncome)}</div>
            <div style={{ ...monoFont, fontSize: 9, textTransform: 'uppercase', color: TEXT_MUTED }}>earned</div>
          </div>
          <div>
            <div style={{ ...headingFont, fontSize: 20, color: ACCENT }}>${Math.floor(weekIncome > 0 ? Math.min(data.splitPerPay * data.transactions.filter(t => t.type === 'income' && new Date(t.date) > weekAgo).length, weekIncome) : 0)}</div>
            <div style={{ ...monoFont, fontSize: 9, textTransform: 'uppercase', color: TEXT_MUTED }}>to fund</div>
          </div>
          <div>
            <div style={{ ...headingFont, fontSize: 20 }}>${Math.ceil(weeklyTarget)}</div>
            <div style={{ ...monoFont, fontSize: 9, textTransform: 'uppercase', color: TEXT_MUTED }}>target</div>
          </div>
        </div>
      </div>

      {/* Add Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <button onClick={() => setShowAdd('income')} style={{ ...btnSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16 }}>
          <Plus size={16} strokeWidth={3} /> income
        </button>
        <button onClick={() => setShowAdd('expense')} style={{ ...btnSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16 }}>
          <Plus size={16} strokeWidth={3} /> expense
        </button>
      </div>

      {showAdd && <AddTransactionModal type={showAdd} splitPerPay={data.splitPerPay} onAdd={addTransaction} onClose={() => setShowAdd(null)} isMobile={isMobile} />}
      {showBillModal && <BillModal bill={showBillModal} onSave={addOrUpdateBill} onDelete={deleteBill} onClose={() => setShowBillModal(null)} isMobile={isMobile} />}
      {showSettings && <SettingsModal split={data.splitPerPay} onSave={updateSplit} onClose={() => setShowSettings(false)} isMobile={isMobile} />}

      {/* Recent Transactions */}
      <div>
        <div style={{ ...monoFont, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: TEXT_MUTED, marginBottom: 12 }}>recent</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {data.transactions.slice(0, 15).map(t => (
            <div key={t.id} style={{ ...cardStyle, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{t.label}</div>
                <div style={{ ...monoFont, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', color: TEXT_MUTED, marginTop: 2 }}>
                  {new Date(t.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })} Â· {t.category}
                  {t.fundSplit > 0 && <span style={{ color: ACCENT }}> Â· ${t.fundSplit} â fund</span>}
                </div>
              </div>
              <div style={{ ...headingFont, fontSize: 16, marginRight: 8, color: t.type === 'income' ? SUCCESS : DANGER }}>
                {t.type === 'income' ? '+' : '-'}${Math.floor(t.amount)}
              </div>
              <button onClick={() => deleteTransaction(t.id)} style={{ color: TEXT_MUTED, padding: 4 }}><Trash2 size={14} /></button>
            </div>
          ))}
          {data.transactions.length === 0 && <div style={{ textAlign: 'center', padding: '48px 0', color: TEXT_MUTED, fontSize: 14 }}>no transactions yet. log your first shift.</div>}
        </div>
      </div>
    </div>
  );
}

// ââ Modals ââ
function ChipSelect({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(opt => (
        <button key={opt} onClick={() => onChange(opt)} style={{
          padding: '10px 16px', borderRadius: 12, ...monoFont, fontSize: 10, textTransform: 'uppercase',
          letterSpacing: '0.08em', fontWeight: 700, transition: 'all 0.15s', border: `2px solid ${value === opt ? TEXT_PRIMARY : BORDER_LIGHT}`,
          background: value === opt ? TEXT_PRIMARY : '#FFF', color: value === opt ? '#FFF' : TEXT_SECONDARY,
        }}>{opt}</button>
      ))}
    </div>
  );
}

function AddTransactionModal({ type, splitPerPay, onAdd, onClose, isMobile }) {
  const [amount, setAmount] = useState('');
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState(type === 'income' ? 'construction' : 'fuel');
  const cats = type === 'income' ? ['construction', 'doordash', 'hospo', 'tips', 'other'] : ['fuel', 'phone', 'car', 'food', 'bill', 'other'];
  const willSplit = type === 'income' && amount ? Math.min(splitPerPay, parseFloat(amount) || 0) : 0;
  const willSpend = type === 'income' && amount ? Math.max(0, (parseFloat(amount) || 0) - willSplit) : 0;

  return (
    <ModalOverlay onClose={onClose} isMobile={isMobile}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ ...headingFont, fontSize: 20 }}>{type === 'income' ? 'LOG INCOME' : 'LOG EXPENSE'}</div>
        <button onClick={onClose}><X size={20} /></button>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={labelStyle}>amount $</div>
        <input type="number" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" style={{ ...inputStyle, ...headingFont, fontSize: 32 }} autoFocus />
      </div>
      {type === 'income' && amount && (
        <div style={{ background: ACCENT_LIGHT, borderRadius: 12, padding: 14, marginBottom: 16 }}>
          <div style={{ ...monoFont, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: ACCENT, marginBottom: 8 }}>auto split</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14, marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Lock size={12} color={ACCENT} /><span>korea fund</span></div>
            <span style={{ fontWeight: 700, color: ACCENT }}>+${willSplit}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><DollarSign size={12} color={TEXT_MUTED} /><span>spending</span></div>
            <span style={{ fontWeight: 700 }}>+${willSpend}</span>
          </div>
        </div>
      )}
      <div style={{ marginBottom: 16 }}>
        <div style={labelStyle}>label</div>
        <input type="text" value={label} onChange={e => setLabel(e.target.value)} placeholder={type === 'income' ? 'e.g. fri site shift' : 'e.g. fuel up'} style={inputStyle} />
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={labelStyle}>category</div>
        <ChipSelect options={cats} value={category} onChange={setCategory} />
      </div>
      <button onClick={() => amount && label && onAdd(type, { amount: parseFloat(amount), label, category })} disabled={!amount || !label} style={{ ...btnPrimary, width: '100%', padding: 16, opacity: (!amount || !label) ? 0.3 : 1 }}>save</button>
    </ModalOverlay>
  );
}

function BillModal({ bill, onSave, onDelete, onClose, isMobile }) {
  const [name, setName] = useState(bill.name || '');
  const [amount, setAmount] = useState(bill.amount?.toString() || '');
  const [frequency, setFrequency] = useState(bill.frequency || 'monthly');
  const [nextDue, setNextDue] = useState(bill.nextDue ? bill.nextDue.split('T')[0] : '');
  const isEdit = !!bill.id;

  return (
    <ModalOverlay onClose={onClose} isMobile={isMobile}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ ...headingFont, fontSize: 20 }}>{isEdit ? 'EDIT BILL' : 'ADD BILL'}</div>
        <button onClick={onClose}><X size={20} /></button>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={labelStyle}>name</div>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. phone, rego" style={inputStyle} autoFocus />
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={labelStyle}>amount $</div>
        <input type="number" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" style={{ ...inputStyle, ...headingFont, fontSize: 24 }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={labelStyle}>frequency</div>
        <ChipSelect options={['weekly', 'fortnightly', 'monthly', 'yearly']} value={frequency} onChange={setFrequency} />
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={labelStyle}>next due (optional)</div>
        <input type="date" value={nextDue} onChange={e => setNextDue(e.target.value)} style={inputStyle} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {isEdit && (
          <button onClick={() => { onDelete(bill.id); onClose(); }} style={{ ...btnSecondary, color: DANGER, borderColor: DANGER, padding: 16 }}>delete</button>
        )}
        <button onClick={() => name && amount && onSave({ id: bill.id, name, amount: parseFloat(amount), frequency, nextDue: nextDue ? new Date(nextDue).toISOString() : null, paid: bill.paid || [] })} disabled={!name || !amount} style={{ ...btnPrimary, flex: 1, padding: 16, opacity: (!name || !amount) ? 0.3 : 1 }}>save</button>
      </div>
    </ModalOverlay>
  );
}

function SettingsModal({ split, onSave, onClose, isMobile }) {
  const [val, setVal] = useState(split.toString());
  return (
    <ModalOverlay onClose={onClose} isMobile={isMobile}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ ...headingFont, fontSize: 20 }}>AUTO SPLIT</div>
        <button onClick={onClose}><X size={20} /></button>
      </div>
      <div style={{ fontSize: 14, color: TEXT_SECONDARY, marginBottom: 16 }}>When you log income, this amount automatically goes to your Korea fund. The rest goes to spending.</div>
      <div style={{ marginBottom: 16 }}>
        <div style={labelStyle}>$ per pay</div>
        <input type="number" inputMode="decimal" value={val} onChange={e => setVal(e.target.value)} style={{ ...inputStyle, ...headingFont, fontSize: 32 }} autoFocus />
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[50, 100, 150, 200].map(v => (
          <button key={v} onClick={() => setVal(v.toString())} style={{
            flex: 1, padding: '10px 0', borderRadius: 12, ...monoFont, fontSize: 10, textTransform: 'uppercase', fontWeight: 700,
            border: `2px solid ${parseFloat(val) === v ? TEXT_PRIMARY : BORDER_LIGHT}`,
            background: parseFloat(val) === v ? TEXT_PRIMARY : '#FFF', color: parseFloat(val) === v ? '#FFF' : TEXT_SECONDARY,
          }}>${v}</button>
        ))}
      </div>
      <button onClick={() => { onSave(val); onClose(); }} style={{ ...btnPrimary, width: '100%', padding: 16 }}>save</button>
    </ModalOverlay>
  );
}

// ââ Cyber Page ââ
function Cyber({ data, saveData, triggerPulse, pulse, isMobile }) {
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
    <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* THM Counter */}
      <div className={pulse === 'thm' ? 'pulse-anim' : ''} style={cardHeroStyle}>
        <div style={{ ...monoFont, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: TEXT_MUTED, marginBottom: 4 }}>tryhackme</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16 }}>
          <div style={{ ...headingFont, fontSize: isMobile ? 56 : 64, color: ACCENT, lineHeight: 1 }}>{data.cyber.thmRooms}</div>
          <div style={{ color: TEXT_MUTED, fontSize: 16 }}>rooms</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={decrementRoom} style={{ ...btnSecondary, padding: '12px 20px' }}>-1</button>
          <button onClick={incrementRoom} style={{ ...btnPrimary, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Plus size={14} strokeWidth={3} /> room cleared
          </button>
        </div>
      </div>

      {/* Sec+ Progress */}
      <div style={cardHeroStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
          <div style={{ ...monoFont, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: TEXT_MUTED }}>sec+</div>
          <div style={{ ...headingFont, fontSize: 20, color: ACCENT }}>{data.cyber.secPlusProgress}%</div>
        </div>
        <div style={{ height: 10, background: '#F1F5F9', borderRadius: 5, overflow: 'hidden', marginBottom: 16 }}>
          <div className="progress-fill" style={{ height: '100%', borderRadius: 5, background: ACCENT, width: `${data.cyber.secPlusProgress}%` }}></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
          {[0, 25, 50, 75, 100].map(v => (
            <button key={v} onClick={() => updateSecPlus(v)} style={{
              padding: '10px 0', borderRadius: 10, ...monoFont, fontSize: 10, textTransform: 'uppercase', fontWeight: 700,
              border: `2px solid ${data.cyber.secPlusProgress === v ? TEXT_PRIMARY : BORDER_LIGHT}`,
              background: data.cyber.secPlusProgress === v ? TEXT_PRIMARY : 'transparent',
              color: data.cyber.secPlusProgress === v ? '#FFF' : TEXT_SECONDARY,
            }}>{v}%</button>
          ))}
        </div>
        <div style={{ marginTop: 12, ...monoFont, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: TEXT_MUTED, lineHeight: 1.6 }}>
          target: book exam mid-aug Â· ~14 weeks prep Â· prof messer + sybex
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        <StatTile label="total hrs" value={totalHours.toFixed(1)} icon={<Shield size={12} />} />
        <StatTile label="7d" value={lastWeek.length} icon={<TrendingUp size={12} />} />
        <StatTile label="30d" value={last30.length} icon={<Zap size={12} />} />
      </div>

      {/* Log Session */}
      <button onClick={() => setShowLog(true)} style={{ ...btnSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, width: '100%' }}>
        <Plus size={16} strokeWidth={3} /> log session
      </button>

      {showLog && <SessionLogModal onLog={logSession} onClose={() => setShowLog(false)} isMobile={isMobile} />}

      {/* Session History */}
      {data.cyber.sessions.length > 0 && (
        <div>
          <div style={{ ...monoFont, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: TEXT_MUTED, marginBottom: 12 }}>sessions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.cyber.sessions.slice(0, 15).map(s => (
              <div key={s.id} style={{ ...cardStyle, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{s.topic}</div>
                  <div style={{ ...monoFont, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', color: TEXT_MUTED, marginTop: 2 }}>
                    {new Date(s.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
                <div style={{ ...headingFont, fontSize: 18, color: ACCENT }}>{s.minutes}m</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cyber Path Roadmap */}
      <div style={cardHeroStyle}>
        <div style={{ ...monoFont, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: TEXT_MUTED, marginBottom: 4 }}>cyber path</div>
        <div style={{ ...headingFont, fontSize: 18, marginBottom: 16 }}>2-3 YEAR ARC</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[['1', 'THM Pre-Security', 'foundations Â· now'], ['2', 'THM Cyber Sec 101', 'core Â· may'], ['3', 'Sec+ exam', 'industry std Â· aug'],
            ['4', 'THM Jr Pen Tester', 'offensive Â· jun-aug'], ['5', 'HTB Academy', 'serious Â· post sec+'],
            ['6', 'Network+ + CySA+', 'yr 1 in korea'], ['7', 'OSCP', 'real cred Â· yr 2']].map(([num, label, sub]) => (
            <div key={num} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: 14, background: TEXT_PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', ...monoFont, fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{num}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{label}</div>
                <div style={{ ...monoFont, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: TEXT_MUTED, marginTop: 2 }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SessionLogModal({ onLog, onClose, isMobile }) {
  const [topic, setTopic] = useState('');
  const [minutes, setMinutes] = useState('');

  return (
    <ModalOverlay onClose={onClose} isMobile={isMobile}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ ...headingFont, fontSize: 20 }}>LOG SESSION</div>
        <button onClick={onClose}><X size={20} /></button>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={labelStyle}>topic</div>
        <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. THM linux fundamentals" style={inputStyle} autoFocus />
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={labelStyle}>minutes</div>
        <input type="number" inputMode="numeric" value={minutes} onChange={e => setMinutes(e.target.value)} placeholder="60" style={{ ...inputStyle, ...headingFont, fontSize: 32 }} />
      </div>
      <button onClick={() => topic && minutes && onLog({ topic, minutes: parseInt(minutes) })} disabled={!topic || !minutes} style={{ ...btnPrimary, width: '100%', padding: 16, opacity: (!topic || !minutes) ? 0.3 : 1 }}>save</button>
    </ModalOverlay>
  );
}

// ââ Checklist Page ââ
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
      { key: 'tax-return', label: 'File tax return (early jul)', sub: 'refund â Korea fund' },
      { key: 'sec-plus-booked', label: 'Book Sec+ exam for august', sub: '~$500 voucher' },
      { key: 'gf-license', label: 'Gf refresher driving lessons', sub: 'korean-speaking instructor sunnybank' },
    ]},
    { title: 'jul - aug', items: [
      { key: 'h1-visa', label: 'H-1 visa applied', sub: 'korean consulate sydney, mid-jul' },
      { key: 'health-insurance', label: 'Health insurance (KRW 40m+)', sub: 'world nomads / allianz, ~$500-700' },
      { key: 'flight-booked', label: 'Flight bri â incheon', sub: '~$1,200-1,500, early sept' },
      { key: 'gf-flight', label: 'Gf flight 7-10 days behind yours', sub: 'you arrive first to set up' },
      { key: 'goshiwon-booked', label: 'Goshiwon in busan (1 month)', sub: 'seomyeon, ~KRW 400-450k' },
      { key: 'sec-plus-passed', label: 'Sec+ passed', sub: 'industry-standard cert' },
    ]},
    { title: 'aug - sep', items: [
      { key: 'idp-license', label: 'International driver permit', sub: 'racq, $45' },
      { key: 'police-check', label: 'National police check', sub: 'AFP, $42' },
      { key: 'reference-letters', label: 'Employment reference letters', sub: 'english, letterhead, signed' },
      { key: 'wise-account', label: 'Wise multi-currency card', sub: 'lock AUDâKRW when rate is good' },
      { key: 'phone-unlocked', label: 'Phone unlocked', sub: 'ready for korean SIM' },
      { key: 'docs-cloud', label: 'Docs to cloud + USB', sub: 'passport, visa, certs, diploma' },
      { key: 'diploma-done', label: 'EQC Diploma completed', sub: 'before flying ideally' },
      { key: 'cars-sold', label: 'Both cars sold', sub: 'list mid-aug, sell early sept' },
    ]},
  ];

  return (
    <div className={`slide-up ${pulse === 'check' ? 'pulse-anim' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Progress Hero */}
      <div style={cardHeroStyle}>
        <div style={{ ...monoFont, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: TEXT_MUTED, marginBottom: 4 }}>pre-flight</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 14 }}>
          <div style={{ ...headingFont, fontSize: 56, color: ACCENT, lineHeight: 1 }}>{checklistComplete}</div>
          <div style={{ ...monoFont, fontSize: 24, color: TEXT_MUTED }}>/{checklistTotal}</div>
        </div>
        <div style={{ height: 10, background: '#F1F5F9', borderRadius: 5, overflow: 'hidden' }}>
          <div className="progress-fill" style={{ height: '100%', borderRadius: 5, background: ACCENT, width: `${checklistPercent * 100}%` }}></div>
        </div>
      </div>

      {/* Sections */}
      {sections.map(section => (
        <div key={section.title}>
          <div style={{ ...headingFont, fontSize: 13, textTransform: 'uppercase', marginBottom: 10, color: TEXT_PRIMARY }}>{section.title}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {section.items.map(item => {
              const checked = data.checklist[item.key];
              return (
                <button key={item.key} onClick={() => toggle(item.key)} style={{
                  width: '100%', display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px',
                  borderRadius: 14, textAlign: 'left', transition: 'all 0.2s',
                  border: `2px solid ${checked ? TEXT_PRIMARY : BORDER_LIGHT}`,
                  background: checked ? TEXT_PRIMARY : '#FFF', color: checked ? '#FFF' : TEXT_PRIMARY,
                }}>
                  <div style={{ marginTop: 2, flexShrink: 0 }}>
                    {checked ? <CheckCircle2 size={18} color="#FFF" /> : <Circle size={18} color={TEXT_MUTED} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, lineHeight: 1.4, fontWeight: 600, textDecoration: checked ? 'line-through' : 'none', opacity: checked ? 0.7 : 1 }}>{item.label}</div>
                    <div style={{ ...monoFont, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4, opacity: checked ? 0.5 : 0.6 }}>{item.sub}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ââ Journal Page ââ
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
    <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={cardHeroStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <div style={{ ...monoFont, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: TEXT_MUTED }}>today</div>
          {savedAt && <div style={{ ...monoFont, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: SUCCESS }}>saved</div>}
        </div>
        <div style={{ ...headingFont, fontSize: 18, marginBottom: 14 }}>{new Date(today).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}</div>
        <textarea value={entry} onChange={e => setEntry(e.target.value)} onBlur={saveEntry}
          placeholder="3 lines: what went well Â· what was hard Â· one thing for tomorrow"
          style={{ ...inputStyle, resize: 'none', minHeight: 140, lineHeight: 1.6, fontSize: 14 }} rows={6} />
        <button onClick={saveEntry} style={{ ...btnPrimary, width: '100%', padding: 14, marginTop: 12 }}>save</button>
      </div>

      {recentEntries.length > 0 && (
        <div>
          <div style={{ ...monoFont, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: TEXT_MUTED, marginBottom: 12 }}>past entries</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentEntries.map(([date, text]) => (
              <div key={date} style={{ ...cardStyle, padding: 18 }}>
                <div style={{ ...monoFont, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: ACCENT, marginBottom: 8 }}>
                  {new Date(date).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })}
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap', color: TEXT_SECONDARY }}>{text}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ââ Tips Page ââ
function Tips({ isMobile }) {
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
      { h: 'Path: Sec+ â Network+ â CySA+', b: "Don't waste money on CEH or bootcamps. CompTIA stack + hands-on platforms is the real path." },
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
      { h: 'BusanâUlsan = fine', b: "30-40 min by KTX. Weekend trips easy. Don't overthink it." },
    ]},
    { key: 'admin', icon: <CheckCircle2 size={16} strokeWidth={2.5} />, title: 'ADMIN', items: [
      { h: 'Wise multi-currency', b: "Better rates than ANZ/Commbank. Lock AUDâKRW when rate is good (>900 KRW per AUD)." },
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
    <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ ...monoFont, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: TEXT_MUTED, marginBottom: 4 }}>tips & reference</div>
      {sections.map(s => (
        <div key={s.key} style={{ ...cardStyle, padding: 0, overflow: 'hidden', border: `2px solid ${open === s.key ? TEXT_PRIMARY : BORDER_LIGHT}`, transition: 'border-color 0.2s' }}>
          <button onClick={() => setOpen(open === s.key ? null : s.key)} style={{
            width: '100%', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
            background: 'transparent', cursor: 'pointer',
          }}>
            <div style={{ color: ACCENT }}>{s.icon}</div>
            <div style={{ ...headingFont, fontSize: 15, flex: 1 }}>{s.title}</div>
            <ChevronRight size={16} color={TEXT_MUTED} style={{ transition: 'transform 0.2s', transform: open === s.key ? 'rotate(90deg)' : 'rotate(0deg)' }} />
          </button>
          {open === s.key && (
            <div style={{ padding: '0 18px 18px', borderTop: `2px solid ${TEXT_PRIMARY}` }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 14 }}>
                {s.items.map((item, i) => (
                  <div key={i}>
                    <div style={{ ...monoFont, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, color: ACCENT, marginBottom: 4 }}>{item.h}</div>
                    <div style={{ fontSize: 14, lineHeight: 1.6, color: TEXT_SECONDARY }}>{item.b}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
