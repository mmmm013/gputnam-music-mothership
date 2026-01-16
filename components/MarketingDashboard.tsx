'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Users, Bird, Stethoscope, CheckSquare, Activity, Save, DollarSign } from 'lucide-react';

export default function MarketingDashboard() {
  const [metrics, setMetrics] = useState({ activeCubs: 0, stampsSold: 0, braveCatches: 0, hospitals: 0 });
  const [audit, setAudit] = useState({ braveFly: false, kleighClips: false, mipPass: false, stripeCheck: false });
  const [hospitalName, setHospitalName] = useState('');
  const [outreachLog, setOutreachLog] = useState<string[]>([]);

  useEffect(() => {
    // Simulated Data
    setMetrics({ activeCubs: 12, stampsSold: 45, braveCatches: 128, hospitals: 0 });
  }, []);

  const toggleAudit = (key: keyof typeof audit) => setAudit(prev => ({ ...prev, [key]: !prev[key] }));
  const addHospital = () => {
    if (!hospitalName) return;
    setOutreachLog(prev => [...prev, `${hospitalName} - ${new Date().toLocaleDateString()}`]);
    setMetrics(prev => ({ ...prev, hospitals: prev.hospitals + 1 }));
    setHospitalName('');
  };
  const allSystemsGo = Object.values(audit).every(Boolean);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-[#FDF6E3] min-h-screen text-[#2C241B] font-serif">
      <div className="flex justify-between items-center mb-8 border-b border-[#2C241B]/10 pb-6">
        <div><h1 className="text-3xl font-black text-[#C04000] uppercase tracking-wide">GPM Command Center</h1></div>
        <div className={`px-4 py-2 rounded-full font-bold text-xs uppercase ${allSystemsGo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <Activity size={16} className="inline mr-2" />{allSystemsGo ? 'SYSTEMS HEALTHY' : 'ATTENTION REQUIRED'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <MetricCard icon={<Users size={24} />} color="amber" label="Recurring" value={metrics.activeCubs} sub="Active Sponsors" />
        <MetricCard icon={<DollarSign size={24} />} color="green" label="Micro-Trans" value={metrics.stampsSold} sub="Packs Sold" />
        <MetricCard icon={<Bird size={24} />} color="blue" label="Engagement" value={metrics.braveCatches} sub="Snippets Caught" />
        <MetricCard icon={<Stethoscope size={24} />} color="red" label="B2B Leads" value={metrics.hospitals} sub="Hospitals Contacted" />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-[#FFFDF5] p-8 rounded-3xl shadow-sm border border-[#2C241B]/5">
          <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2 text-[#D4A017]"><CheckSquare /> Weekly Pulse Check</h2>
          <div className="space-y-4">
            <AuditItem label="Test Brave Eagle" sub="Does the modal open?" active={audit.braveFly} onClick={() => toggleAudit('braveFly')} />
            <AuditItem label="Check Kleigh Clips" sub="Are videos loading?" active={audit.kleighClips} onClick={() => toggleAudit('kleighClips')} />
            <AuditItem label="Verify MIP Access" sub="Does gpmpro26 work?" active={audit.mipPass} onClick={() => toggleAudit('mipPass')} />
            <AuditItem label="Review Stripe Ledger" sub="Check for failed payments" active={audit.stripeCheck} onClick={() => toggleAudit('stripeCheck')} />
          </div>
        </div>

        <div className="bg-[#FFFDF5] p-8 rounded-3xl shadow-sm border border-[#2C241B]/5">
          <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2 text-[#D4A017]"><TrendingUp /> The Hustle Log</h2>
          <div className="flex gap-2 mb-6">
            <input type="text" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} placeholder="Hospital Name..." className="flex-1 bg-white border border-[#2C241B]/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C04000]" />
            <button onClick={addHospital} className="bg-[#C04000] text-white p-3 rounded-lg hover:bg-[#A03000]"><Save size={18} /></button>
          </div>
          <div className="bg-[#FDF6E3] rounded-xl p-4 h-48 overflow-y-auto border border-[#2C241B]/5">
            {outreachLog.map((log, i) => <div key={i} className="flex gap-2 text-sm border-b border-[#2C241B]/5 pb-2 mb-2"><CheckSquare size={12} className="text-green-600" /> {log}</div>)}
            {outreachLog.length === 0 && <div className="text-center opacity-30 text-xs py-10">No outreach logged.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, color, label, value, sub }: any) {
  const colors: any = { amber: 'text-amber-600 bg-amber-100', green: 'text-green-600 bg-green-100', blue: 'text-blue-600 bg-blue-100', red: 'text-red-600 bg-red-100' };
  return (
    <div className="bg-[#FFFDF5] p-6 rounded-2xl shadow-sm border border-[#2C241B]/5">
      <div className="flex justify-between items-start mb-4"><div className={`p-3 rounded-xl ${colors[color]}`}>{icon}</div><span className="text-xs font-bold opacity-30 uppercase text-[#2C241B]">{label}</span></div>
      <div className="text-4xl font-black text-[#2C241B]">{value}</div>
      <div className="text-xs opacity-50 font-bold uppercase mt-1 text-[#2C241B]">{sub}</div>
    </div>
  );
}

function AuditItem({ label, sub, active, onClick }: any) {
  return (
    <div onClick={onClick} className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition ${active ? 'bg-green-50 border border-green-200' : 'bg-white hover:bg-gray-50 border border-transparent'}`}>
      <div className={`w-6 h-6 rounded border flex items-center justify-center ${active ? 'bg-green-500 border-green-500 text-white' : 'border-gray-200'}`}>{active && <CheckSquare size={14} />}</div>
      <div><div className="font-bold text-sm text-[#2C241B]">{label}</div><div className="text-[10px] opacity-50 text-[#2C241B]">{sub}</div></div>
    </div>
  );
}
