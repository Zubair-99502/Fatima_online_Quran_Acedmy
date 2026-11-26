'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';

/** Subtle, accessible reveal for reference-style cards; respects reduced-motion preferences. */
export default function ScrollAnimations(){
 const path=usePathname();
 useEffect(()=>{
  if(typeof IntersectionObserver==='undefined'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const selectors='.ref-benefit,.ref-step,.ref-course-card,.ref-teacher,.ref-center-heading';
  const elements=Array.from(document.querySelectorAll(selectors));
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(entry.isIntersecting){entry.target.classList.add('fatima-in-view');observer.unobserve(entry.target)}
  }),{threshold:0.08,rootMargin:'0px 0px 20px 0px'});
  elements.forEach(el=>{el.classList.add('fatima-reveal-ready');observer.observe(el)});
  return ()=>{observer.disconnect();elements.forEach(el=>{el.classList.remove('fatima-reveal-ready','fatima-in-view')})};
 },[path]);
 return null;
}
