import {Suspense} from 'react';
import SiteLayout from '../../components/SiteLayout';
import VideoPageHeading from '../../components/VideoPageHeading';
import TrialFormWithPreferences from '../../components/TrialFormWithPreferences';
export const metadata={title:'Free Trial | Fatima Online Quran Academy'};
export default function FreeTrial(){return <SiteLayout><main className="ref-site"><VideoPageHeading eyebrow="START YOUR FREE TRIAL" title={<>Begin Your <em>Quran Journey</em></>} description="Share your preferred course and class times. Our team will contact you to arrange the next steps."/><section className="ref-section ref-pattern"><div className="container ref-trial-layout"><div><h2>Start with a Free Trial</h2><p>Tell us about the student and the lessons you need.</p><div className="ref-next-steps">{['Choose a course','Tell us your timing preferences','We contact you to arrange the trial'].map((x,i)=><div key={x}><span>{i+1}</span>{x}</div>)}</div></div><div className="ref-form-box"><Suspense fallback={<p>Loading form...</p>}><TrialFormWithPreferences/></Suspense></div></div></section></main></SiteLayout>}
