import SiteLayout from '../../components/SiteLayout';
import VideoPageHeading from '../../components/VideoPageHeading';
import Link from 'next/link';
import VideoTeacherFilters from '../../components/VideoTeacherFilters';
export default function Teachers(){return <SiteLayout><main className="ref-site"><VideoPageHeading eyebrow="OUR TEACHERS" title={<>Meet the <em>Teachers</em></>} description="Find an online Quran teacher who fits your course, age group and language preferences."/><section className="ref-section ref-pattern"><div className="container"><VideoTeacherFilters/></div></section><section className="ref-final"><div className="container"><h2>Find the Right Quran Teacher</h2><p>Tell us your learning preferences and we will help with the next steps.</p><Link className="ref-goldbtn" href="/free-trial">Start Free Trial</Link></div></section></main></SiteLayout>}
