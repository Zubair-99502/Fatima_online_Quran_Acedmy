"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen, Users, GraduationCap, Inbox, LogOut, RefreshCw, Plus,
  Search, LayoutDashboard, MessageCircle, CalendarDays, X, ExternalLink, CreditCard, TrendingUp, ArrowUpRight, Menu
} from 'lucide-react';

const tabs = [
  { name: 'Overview', icon: LayoutDashboard },
  { name: 'Inquiries', icon: Inbox },
  { name: 'Teachers', icon: Users },
  { name: 'Students', icon: GraduationCap },
  { name: 'Payments', icon: CreditCard },
];

export default function Dashboard() {
  const [tab, setTab] = useState('Overview');
  const [items, setItems] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const router = useRouter();

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const responses = await Promise.all([
        fetch('/api/admin/inquiries', { cache: 'no-store' }),
        fetch('/api/admin/teachers', { cache: 'no-store' }),
        fetch('/api/admin/students', { cache: 'no-store' }),
        fetch('/api/admin/payments', { cache: 'no-store' }),
      ]);
      if (responses.some(response => response.status === 401)) {
        router.replace('/admin/login');
        return;
      }
      if (responses.some(response => !response.ok)) {
        throw new Error('Could not load records. Check your MongoDB connection and try again.');
      }
      const [inquiryData, teacherData, studentData, paymentData] = await Promise.all(responses.map(response => response.json()));
      setItems(inquiryData.items || []);
      setTeachers(teacherData.items || []);
      setStudents(studentData.items || []);
      setPayments(paymentData.items || []);
    } catch (err) {
      setError(err.message || 'Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { load(); }, [load]);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  }

  async function updateInquiry(id, status) {
    try {
      const response = await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!response.ok) throw new Error('Could not update inquiry status.');
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteTeacher(id) {
    if (!window.confirm('Remove this teacher record?')) return;
    try {
      const response = await fetch('/api/admin/teachers', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not remove teacher.');
      await load();
    } catch (err) { setError(err.message); }
  }

  async function updateStudent(id, status) {
    try {
      const response = await fetch('/api/admin/students', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!response.ok) throw new Error('Could not update student status.');
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function addRecord(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSaving(true);
    setError('');
    const form = new FormData(event.currentTarget);
    const isTeacher = tab === 'Teachers';
    const payload = isTeacher
      ? { name: form.get('name'), title: form.get('title'), qualifications: form.get('qualifications') }
      : { name: form.get('name'), parentName: form.get('parentName'), country: form.get('country'), course: form.get('course') };

    try {
      const response = await fetch(isTeacher ? '/api/admin/teachers' : '/api/admin/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not save this record.');
      setShowAdd(false);
      formElement.reset();
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const current = tab === 'Inquiries' ? items : tab === 'Teachers' ? teachers : tab === 'Payments' ? payments : students;
  const filtered = useMemo(
    () => current.filter(item => JSON.stringify(item).toLowerCase().includes(search.toLowerCase())),
    [current, search]
  );
  const newInquiries = items.filter(item => item.status === 'New').length;
  const paid = payments.filter(item => item.status === 'paid');
  const recent = [...items].sort((a,b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  const months = Array.from({length: 9}, (_, i) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - (8 - i));
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      name: date.toLocaleDateString('en-US', {month: 'short'}),
      inquiries: items.filter(x => { const d = new Date(x.createdAt); return !isNaN(d) && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear(); }).length,
      enrollments: items.filter(x => { const d = new Date(x.createdAt); return !isNaN(d) && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear() && x.status === 'Enrolled'; }).length,
    };
  });
  const maxMonth = Math.max(1, ...months.flatMap(x => [x.inquiries, x.enrollments]));
  const statusBuckets = [
    {label: 'New', count: items.filter(x=>x.status === 'New').length, color: '#3d97fa'},
    {label: 'Contacted', count: items.filter(x=>x.status === 'Contacted').length, color: '#ff7a1a'},
    {label: 'Trial Scheduled', count: items.filter(x=>x.status === 'Trial Scheduled').length, color: '#f02d84'},
    {label: 'Enrolled', count: items.filter(x=>x.status === 'Enrolled').length, color: '#34d16d'},
    {label: 'Closed', count: items.filter(x=>x.status === 'Closed').length, color: '#ae79ef'},
  ];
  let cumulative = 0;
  const donut = items.length ? `conic-gradient(${statusBuckets.map(bucket => {const from=cumulative; cumulative += bucket.count / items.length * 100; return `${bucket.color} ${from}% ${cumulative}%`;}).join(',')})` : 'conic-gradient(#383e44 0% 100%)';
  const enrolled = items.filter(x => x.status === 'Enrolled').length;
  const conversion = items.length ? Math.round(enrolled / items.length * 100) : 0;
  const metrics = [
    {label:'Total Inquiries', count:items.length, icon:Inbox, tone:'blue', note:'All-time enquiries'},
    {label:'New Inquiries', count:newInquiries, icon:MessageCircle, tone:'green', note:'Awaiting response'},
    {label:'Active Students', count:students.filter(x => x.status === 'Active').length, icon:GraduationCap, tone:'cyan', note:'Currently enrolled'},
    {label:'Total Teachers', count:teachers.length, icon:Users, tone:'gold', note:'Teacher records'},
  ];

  return (
    <main className="fatima-admin maxton-admin">
      <aside className={`fatima-sidebar ${mobileOpen ? 'is-open' : ''}`}>
        <a href="/" className="fatima-admin-logo"><span className="maxton-logo-symbol"><BookOpen size={23}/></span><span><b>Fatima</b><small>ONLINE QURAN ACADEMY</small></span></a>
        <p className="fatima-sidebar-label">MAIN MENU</p>
        <nav className="fatima-nav" aria-label="Dashboard navigation">
          {tabs.map(({name, icon:Icon}) => <button key={name} className={tab===name?'active':''} onClick={()=>{setTab(name);setMobileOpen(false);setSearch('');setShowAdd(false)}}><Icon size={18}/><span>{name}</span>{name==='Inquiries'&&newInquiries>0&&<small>{newInquiries}</small>}</button>)}
        </nav>
        <p className="fatima-sidebar-label maxton-section-label">ACADEMY</p>
        <div className="maxton-side-note"><BookOpen size={18}/><span>Quran learning management</span></div>
        <div className="fatima-sidebar-footer"><div className="fatima-sidebar-support"><MessageCircle size={18}/><b>Need assistance?</b><p>Manage learners and follow up with families.</p><a href="https://wa.me/923030535615" target="_blank" rel="noopener noreferrer">Contact support <ArrowUpRight size={13}/></a></div><button onClick={logout} className="fatima-signout"><LogOut size={17}/> Sign out</button></div>
      </aside>
      {mobileOpen && <button className="fatima-sidebar-overlay" aria-label="Close menu" onClick={()=>setMobileOpen(false)}/>}
      <div className="fatima-content">
        <header className="fatima-admin-header">
          <div className="maxton-header-left"><button className="fatima-mobile-menu maxton-menu" onClick={()=>setMobileOpen(true)} aria-label="Open navigation"><Menu size={23}/></button><div className="maxton-header-search"><Search size={20}/><input aria-label="Search academy records" placeholder="Search records" value={search} onChange={e=>setSearch(e.target.value)} onFocus={()=>{if(tab==='Overview')setTab('Inquiries')}}/></div></div>
          <div className="fatima-header-right"><span className="fatima-admin-badge">Academy Admin</span><span className="fatima-avatar">FA</span></div>
        </header>
        <div className="fatima-main">
          <div className="fatima-title-row maxton-title-row"><div><h1>{tab==='Overview'?'Dashboard':tab}</h1><span className="maxton-breadcrumb">⌂ &nbsp; Fatima Academy &nbsp; / &nbsp; {tab}</span></div><button onClick={load} className="fatima-refresh"><RefreshCw size={16}/> Refresh</button></div>
          {error&&<div role="alert" className="login-error mt-5">{error}</div>}
          {tab==='Overview' ? <>
            <div className="maxton-metrics">
              <section className="maxton-welcome maxton-card"><p>Welcome, Administrator <span aria-hidden="true">✨</span></p><small>Fatima Online Quran Academy</small><div className="maxton-welcome-total"><strong>{loading?'—':items.length.toLocaleString()}</strong><span>Total inquiries</span></div><button onClick={()=>setTab('Inquiries')} className="maxton-gradient-button">View Inquiries</button><BookOpen className="maxton-welcome-art" size={75}/></section>
              {metrics.map(({label,count,icon:Icon,tone,note})=><section className="maxton-card maxton-stat" key={label}><div className="maxton-stat-top"><span className={`maxton-metric-icon ${tone}`}><Icon size={21}/></span><span className="maxton-live-dot">● Records</span></div><strong>{loading?'—':count.toLocaleString()}</strong><p>{label}</p><small>{note}</small><svg className="maxton-spark" viewBox="0 0 140 34" aria-hidden="true"><path d="M0 27 Q 12 24 18 15 T 42 22 T 66 12 T 92 19 T 120 7 T 140 12" fill="none" stroke={tone==='green'?'#8de22b':tone==='cyan'?'#19b7e9':tone==='gold'?'#ffbf0d':'#2489ff'} strokeWidth="2" strokeLinecap="round"/></svg></section>)}
            </div>
            <div className="maxton-charts">
              <section className="maxton-card maxton-donut-section"><h2>Inquiry Status</h2><p className="maxton-panel-caption">Current status of received enquiries</p><div className="maxton-donut" style={{background:donut}}><div><strong>{loading?'—':items.length}</strong><span>Total Inquiries</span></div></div><div className="maxton-legend">{statusBuckets.map(bucket=><div key={bucket.label}><span style={{color:bucket.color}}>●</span><b>{bucket.label}</b><strong>{bucket.count}</strong></div>)}</div></section>
              <section className="maxton-card maxton-bars-section"><h2>Inquiries & Enrollments</h2><p className="maxton-panel-caption">Monthly activity from your academy data</p><div className="maxton-bar-chart" role="img" aria-label="Monthly inquiries and enrollments for the last nine months">{months.map(month=><div className="maxton-bar-month" key={month.key}><div className="maxton-bar-pair"><div className="maxton-bar-one" style={{height:`${Math.max(3,(month.inquiries/maxMonth)*175)}px`}} title={`${month.inquiries} inquiries`}/><div className="maxton-bar-two" style={{height:`${Math.max(3,(month.enrollments/maxMonth)*175)}px`}} title={`${month.enrollments} enrollments`}/></div><small>{month.name}</small></div>)}</div><div className="maxton-bar-legend"><span><i className="maxton-orange"/>Inquiries</span><span><i className="maxton-blue"/>Enrollments</span></div><div className="maxton-bottom-metrics"><div><span className="maxton-ring cyan"/><p>Successful Payments<strong>{loading?'—':paid.length}</strong><small>Verified Stripe records</small></p></div><div><span className="maxton-ring yellow"/><p>Inquiry Conversion<strong>{loading?'—':`${conversion}%`}</strong><small>{enrolled} enrolled inquiry records</small></p></div></div></section>
            </div>
            <section className="fatima-panel fatima-table-panel"><div className="fatima-panel-header"><div><h2>Recent Inquiries</h2><p>Latest enquiries from families</p></div><button className="fatima-text-button" onClick={()=>setTab('Inquiries')}>View all <ArrowUpRight size={15}/></button></div><InquiryTable items={recent.slice(0,6)} loading={loading} onUpdate={updateInquiry}/></section>
          </> : <section className="fatima-panel fatima-table-panel"><div className="fatima-panel-header fatima-manage-heading"><div><h2>{tab} Records</h2><p>{filtered.length} result{filtered.length===1?'':'s'} found</p></div><div className="fatima-actions"><div className="fatima-search"><Search size={16}/><input aria-label="Filter records" placeholder="Search records" value={search} onChange={e=>setSearch(e.target.value)}/></div>{(tab==='Teachers'||tab==='Students')&&<button className="fatima-add-button" onClick={()=>setShowAdd(!showAdd)}><Plus size={16}/> Add {tab==='Teachers'?'teacher':'student'}</button>}</div></div>
            {showAdd&&(tab==='Teachers'||tab==='Students')&&<form onSubmit={addRecord} className="admin-add-form mb-5"><div className="flex justify-between items-center sm:col-span-2 lg:col-span-4"><b className="text-sm">New {tab==='Teachers'?'teacher':'student'}</b><button type="button" onClick={()=>setShowAdd(false)} aria-label="Close form"><X size={17}/></button></div><input className="input" name="name" required placeholder="Full name"/>{tab==='Teachers'?<><input className="input" name="title" placeholder="Role"/><input className="input" name="qualifications" placeholder="Qualifications"/></>:<><input className="input" name="parentName" placeholder="Parent name"/><input className="input" name="country" placeholder="Country"/><input className="input" name="course" placeholder="Course"/></>}<button disabled={saving} className="fatima-add-button">{saving?'Saving…':'Save record'}</button></form>}
            {loading?<p className="fatima-empty">Loading records…</p>:tab==='Inquiries'?<InquiryTable items={filtered} loading={false} onUpdate={updateInquiry}/>:tab==='Teachers'?<SimpleTable items={filtered} columns={['name','title','qualifications','createdAt']} onDelete={deleteTeacher}/>:tab==='Students'?<StudentTable items={filtered} onUpdate={updateStudent}/>:<PaymentTable items={filtered}/>}
            {!loading&&filtered.length===0&&<p className="fatima-empty">No records found.</p>}
          </section>}
          <p className="fatima-security">Private academy administrator workspace · Payment records verified through Stripe webhooks</p>
        </div>
      </div>
    </main>
  );

}

function InquiryTable({ items, loading, onUpdate }) {
  if (loading) return <div className="py-12 text-center text-sm text-[#829087]">Loading inquiries…</div>;
  if (!items.length) return <div className="py-12 text-center text-sm text-[#829087]">No inquiries received yet.</div>;
  return (
    <div className="table-wrap">
      <table><thead><tr><th>Parent / contact</th><th>Course</th><th>Country</th><th>Received</th><th>Status</th></tr></thead>
        <tbody>{items.map(item => <tr key={item._id}>
          <td><b>{item.parentName}</b><div className="text-xs text-[#829087] mt-1">{item.phone}</div><a className="admin-wa" href={`https://wa.me/${String(item.phone || '').replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">WhatsApp <ExternalLink size={11}/></a></td>
          <td>{item.course}<div className="text-xs text-[#829087] mt-1">{item.type}</div></td><td>{item.country}</td>
          <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}</td>
          <td><select className="input !w-40 !py-2" value={item.status || 'New'} onChange={event => onUpdate(item._id,event.target.value)}>{['New','Contacted','Trial Scheduled','Enrolled','Closed'].map(status => <option key={status}>{status}</option>)}</select></td>
        </tr>)}</tbody>
      </table>
    </div>
  );
}

function SimpleTable({ items, columns, onDelete }) {
  return <div className="table-wrap"><table><thead><tr>{columns.map(column => <th key={column}>{column === 'createdAt' ? 'Added' : column}</th>)}{onDelete && <th>Action</th>}</tr></thead><tbody>{items.map(item => <tr key={item._id}>{columns.map(column => <td key={column}>{column === 'createdAt' ? (item[column] ? new Date(item[column]).toLocaleDateString() : '—') : (item[column] || '—')}</td>)}{onDelete && <td><button type="button" onClick={() => onDelete(item._id)} className="text-xs font-bold text-red-600 hover:text-red-800">Remove</button></td>}</tr>)}</tbody></table></div>;
}

function StudentTable({ items, onUpdate }) {
  return <div className="table-wrap"><table><thead><tr><th>Student</th><th>Parent</th><th>Country</th><th>Course</th><th>Status</th></tr></thead><tbody>{items.map(item => <tr key={item._id}><td><b>{item.name}</b></td><td>{item.parentName || '—'}</td><td>{item.country || '—'}</td><td>{item.course || '—'}</td><td><select className="input !w-36 !py-2" value={item.status || 'Active'} onChange={event => onUpdate(item._id,event.target.value)}>{['Active','Paused','Completed'].map(status => <option key={status}>{status}</option>)}</select></td></tr>)}</tbody></table></div>;
}

function ShieldCheckIcon() {
  return <span className="inline-grid place-items-center w-5 h-5 rounded-full bg-[#e6eee5] text-forest text-[11px]">✓</span>;
}

function PaymentTable({items}) {return <div className="table-wrap"><table><thead><tr><th>Customer</th><th>Plan</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead><tbody>{items.map(x=><tr key={x._id}><td><b>{x.customerEmail||'—'}</b></td><td>{x.planName||'Academy fee'}</td><td>{x.currency?.toUpperCase()} {((x.amountTotal||0)/100).toFixed(2)}</td><td><span className={`fatima-payment-status ${x.status==='paid'?'is-paid':''}`}>{x.status}</span></td><td>{x.createdAt?new Date(x.createdAt).toLocaleDateString():'—'}</td></tr>)}</tbody></table></div>}
