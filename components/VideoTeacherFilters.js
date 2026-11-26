'use client';
import {useMemo, useState} from 'react';
import Link from 'next/link';
import {siteImages} from '../lib/siteImages';

/** Display-only sample visuals. Actual available tutors are discussed in the inquiry process. */
const cards = [
  {label:'Male Quran Teacher',gender:'Male',audience:'All ages',course:'Quran Reading & Tajweed',language:'Urdu / English',image:siteImages.teachers[0].image},
  {label:'Female Quran Teacher',gender:'Female',audience:'Children',course:'Noorani Qaida',language:'Urdu / English',image:siteImages.teachers[1].image},
  {label:'Family Quran Lessons',gender:'Male',audience:'Children',course:'Quran Reading & Tajweed',language:'Urdu / English',image:siteImages.teachers[2].image},
  {label:'Children Quran Classes',gender:'Female',audience:'Children',course:'Noorani Qaida',language:'Urdu / English',image:siteImages.teachers[3].image},
];
export default function VideoTeacherFilters(){
 const [gender,setGender]=useState('All');
 const [audience,setAudience]=useState('All');
 const [course,setCourse]=useState('All');
 const results=useMemo(()=>cards.filter(item=>(gender==='All'||item.gender===gender)&&(audience==='All'||item.audience===audience)&&(course==='All'||item.course===course)),[gender,audience,course]);
 return <>
  <div className="ref-filter-row" id="teacher-filters" aria-label="Teacher preferences">
   <label><span className="sr-only">Gender preference</span><select value={gender} onChange={e=>setGender(e.target.value)}><option value="All">Looking for anyone</option><option value="Male">Male teacher</option><option value="Female">Female teacher</option></select></label>
   <label><span className="sr-only">Age group</span><select value={audience} onChange={e=>setAudience(e.target.value)}><option value="All">All age groups</option><option value="Children">Children</option></select></label>
   <label><span className="sr-only">Course</span><select value={course} onChange={e=>setCourse(e.target.value)}><option value="All">Any course</option><option value="Noorani Qaida">Noorani Qaida</option><option value="Quran Reading & Tajweed">Quran Reading & Tajweed</option></select></label>
   <span className="ref-filter-language">Urdu / English</span>
  </div>
  <div className="ref-teacher-grid">{results.map((item)=><article className="ref-teacher" key={item.label}><img src={item.image} alt={`Illustrative ${item.label.toLowerCase()} photo`} loading="lazy"/><div><h3>{item.label}</h3><p>{item.course} · {item.language}</p><Link className="ref-outline" href={`/free-trial?teacherPreference=${encodeURIComponent(item.gender+' teacher')}&course=${encodeURIComponent(item.course === 'Quran Reading & Tajweed' ? 'Quran with Tajweed' : item.course)}`}>Request a Teacher</Link></div></article>)}</div>
  {results.length===0&&<p className="ref-disclaimer">This exact combination is not shown in the examples. Contact our team about teacher availability.</p>}
  <p className="ref-disclaimer">Photos are illustrative, not verified staff portraits. Actual teacher credentials and availability are confirmed by the academy.</p>
 </>;
}
