'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { BookOpen, ChevronDown, Check, Menu, X } from 'lucide-react';

const courseLinks = [
  ['All Courses', '/courses'],
  ['Noorani Qaida', '/courses#noorani-qaida'],
  ['Quran Reading & Tajweed', '/courses#quran-reading-nazra'],
  ['Quran Memorization (Hifz)', '/courses#hifz-ul-quran'],
  ['Arabic Language', '/courses#arabic-language'],
  ['Islamic Studies', '/courses#basic-islamic-studies'],
];
const teacherLinks = [
  ['Meet Our Teachers', '/teachers'],
  ['Find a Suitable Teacher', '/teachers#teacher-filters'],
  ['Request a Teacher', '/free-trial'],
];
const currencies = [
  { country: 'PK', currency: 'PKR', flag: '🇵🇰', label: 'Pakistan' },
  { country: 'US', currency: 'USD', flag: '🇺🇸', label: 'United States' },
  { country: 'GB', currency: 'GBP', flag: '🇬🇧', label: 'United Kingdom' },
  { country: 'CA', currency: 'CAD', flag: '🇨🇦', label: 'Canada' },
  { country: 'AE', currency: 'AED', flag: '🇦🇪', label: 'United Arab Emirates' },
  { country: 'SA', currency: 'SAR', flag: '🇸🇦', label: 'Saudi Arabia' },
  { country: 'AU', currency: 'AUD', flag: '🇦🇺', label: 'Australia' },
  { country: 'EU', currency: 'EUR', flag: '🇪🇺', label: 'Europe' },
];

function Dropdown({ label, links, open, onToggle, onClose, active }) {
  return (
    <div className={`ref-dropdown ${open ? 'is-open' : ''}`} onMouseEnter={() => onToggle(label)} onMouseLeave={onClose}>
      <button type="button" className={`ref-nav-trigger ${active ? 'active' : ''}`}
        aria-haspopup="true" aria-expanded={open} onClick={() => onToggle(open ? null : label)}>
        {label} <ChevronDown size={14} aria-hidden="true" />
      </button>
      {open && <div className="ref-dropdown-menu" role="menu" aria-label={`${label} menu`}>
        {links.map(([name, href]) => <Link role="menuitem" key={name} href={href} onClick={onClose}>{name}</Link>)}
      </div>}
    </div>
  );
}

function CurrencyPicker({ value, onChange, open, onToggle, onClose, mobile = false }) {
  const current = currencies.find(item => item.currency === value) || currencies[0];
  return (
    <div className={`ref-currency-wrap ${mobile ? 'is-mobile' : ''}`}>
      <button type="button" className="ref-currency" aria-label={`Currency preference ${current.currency}. Choose currency`}
        aria-haspopup="listbox" aria-expanded={open} onClick={onToggle}>
        <span className="ref-flag">{current.flag}</span><span>{current.country} · {current.currency}</span><ChevronDown size={15} aria-hidden="true" />
      </button>
      {open && <div className="ref-currency-menu" role="listbox" aria-label="Currency preference">
        <div className="ref-currency-menu-heading">Select your country & currency</div>
        {currencies.map(item => <button type="button" role="option" aria-selected={item.currency === value}
          key={item.currency} onClick={() => { onChange(item.currency); onClose(); }}>
          <span className="ref-flag">{item.flag}</span><span>{item.label}<small>{item.currency}</small></span>
          {item.currency === value && <Check size={16} aria-hidden="true" />}
        </button>)}
        <p className="ref-currency-note">Currency selection is saved for your fee inquiry. Fees are confirmed by the academy.</p>
      </div>}
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState(null);
  const [desktopMenu, setDesktopMenu] = useState(null);
  const [desktopCurrencyOpen, setDesktopCurrencyOpen] = useState(false);
  const [mobileCurrencyOpen, setMobileCurrencyOpen] = useState(false);
  const [currency, setCurrency] = useState('PKR');
  const root = useRef(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('fatima-currency');
      if (currencies.some(item => item.currency === saved)) setCurrency(saved);
    } catch (_) { /* localStorage may be disabled; default to PKR */ }
  }, []);
  useEffect(() => {
    setMobileOpen(false);
    setMobileSubmenu(null);
    setDesktopMenu(null);
    setDesktopCurrencyOpen(false);
    setMobileCurrencyOpen(false);
  }, [pathname]);
  useEffect(() => {
    function onEscape(event) {
      if (event.key === 'Escape') {
        setMobileOpen(false); setDesktopMenu(null); setDesktopCurrencyOpen(false); setMobileCurrencyOpen(false);
      }
    }
    function onOutside(event) {
      if (root.current && !root.current.contains(event.target)) {
        setDesktopMenu(null); setDesktopCurrencyOpen(false); setMobileCurrencyOpen(false); setMobileOpen(false);
      }
    }
    document.addEventListener('keydown', onEscape);
    document.addEventListener('pointerdown', onOutside);
    return () => { document.removeEventListener('keydown', onEscape); document.removeEventListener('pointerdown', onOutside); };
  }, []);
  function chooseCurrency(value) {
    setCurrency(value);
    try {
      window.localStorage.setItem('fatima-currency', value);
      window.dispatchEvent(new CustomEvent('fatima:currency-change', { detail: value }));
    } catch (_) { /* temporary selection still works */ }
  }
  function toggleDesktopMenu(name) { setDesktopMenu(name); setDesktopCurrencyOpen(false); }
  function toggleDesktopCurrency() { setDesktopCurrencyOpen(value => !value); setDesktopMenu(null); }
  function closeMobile() { setMobileOpen(false); setMobileSubmenu(null); setMobileCurrencyOpen(false); }

  return <header className="ref-header" ref={root}>
    <div className="container ref-nav">
      <Link href="/" className="ref-brand" aria-label="Fatima Online Quran Academy home" onClick={closeMobile}>
        <span className="ref-brand-symbol"><BookOpen size={26} strokeWidth={1.75} aria-hidden="true" /></span>
        <span><strong>Fatima Academy</strong><small>ONLINE QURAN ACADEMY</small></span>
      </Link>
      <nav className="ref-navlinks" aria-label="Main navigation">
        <Link className={pathname === '/' ? 'active' : ''} href="/">Home</Link>
        <Dropdown label="Courses" links={courseLinks} open={desktopMenu === 'Courses'} active={pathname === '/courses'}
          onToggle={toggleDesktopMenu} onClose={() => setDesktopMenu(null)} />
        <Dropdown label="Teachers" links={teacherLinks} open={desktopMenu === 'Teachers'} active={pathname === '/teachers'}
          onToggle={toggleDesktopMenu} onClose={() => setDesktopMenu(null)} />
        {[
          ['Testimonials', '/testimonials'], ['Pricing', '/pricing'], ['About', '/about'], ['Blog', '/blog'],
        ].map(([name, href]) => <Link href={href} key={name} className={pathname === href ? 'active' : ''}>{name}</Link>)}
      </nav>
      <div className="ref-actions">
        <CurrencyPicker value={currency} onChange={chooseCurrency} open={desktopCurrencyOpen}
          onToggle={toggleDesktopCurrency} onClose={() => setDesktopCurrencyOpen(false)} />
        <Link href="/contact" className="ref-outline">Contact</Link>
        <Link href="/free-trial" className="ref-goldbtn">Start Free Trial</Link>
      </div>
      <button className="ref-menu-toggle" type="button" aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen} aria-controls="fatima-mobile-navigation"
        onClick={() => { setMobileOpen(!mobileOpen); setDesktopMenu(null); setDesktopCurrencyOpen(false); }}>
        {mobileOpen ? <X size={23} /> : <Menu size={23} />}
      </button>
    </div>
    {mobileOpen && <nav className="ref-mobile-nav" id="fatima-mobile-navigation" aria-label="Mobile navigation">
      <Link href="/" onClick={closeMobile}>Home</Link>
      {[['Courses', courseLinks], ['Teachers', teacherLinks]].map(([label, links]) => <div className="ref-mobile-group" key={label}>
        <button type="button" aria-expanded={mobileSubmenu === label} onClick={() => setMobileSubmenu(mobileSubmenu === label ? null : label)}>
          {label}<ChevronDown size={16} aria-hidden="true" />
        </button>
        {mobileSubmenu === label && <div className="ref-mobile-submenu">{links.map(([name, href]) => <Link href={href} key={name} onClick={closeMobile}>{name}</Link>)}</div>}
      </div>)}
      {[
        ['Testimonials', '/testimonials'], ['Pricing', '/pricing'], ['About', '/about'], ['Blog', '/blog'],
      ].map(([name, href]) => <Link href={href} key={name} onClick={closeMobile}>{name}</Link>)}
      <CurrencyPicker mobile value={currency} onChange={chooseCurrency} open={mobileCurrencyOpen}
        onToggle={() => setMobileCurrencyOpen(v => !v)} onClose={() => setMobileCurrencyOpen(false)} />
      <div className="ref-mobile-actions"><Link href="/contact" className="ref-outline" onClick={closeMobile}>Contact</Link><Link href="/free-trial" className="ref-goldbtn" onClick={closeMobile}>Start Free Trial</Link></div>
    </nav>}
  </header>;
}
