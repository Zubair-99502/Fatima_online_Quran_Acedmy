import Link from 'next/link';
import SiteLayout from '../../components/SiteLayout';
import VideoPageHeading from '../../components/VideoPageHeading';
export default function Blog(){return <SiteLayout><main className="ref-site"><VideoPageHeading eyebrow="QURAN LEARNING" title={<>Quran Academy <em>Blog</em></>} description="Learning resources and useful information about our Quran courses."/><section className="ref-section ref-pattern"><div className="container ref-center-heading"><h2>Start Your Quran <span>Journey Today</span></h2><p>Explore Quran learning options with Fatima Online Quran Academy.</p><div className="ref-center-action"><Link className="ref-goldbtn" href="/free-trial">Book Free Trial</Link></div></div></section></main></SiteLayout>}
