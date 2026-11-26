import SiteLayout from '../../components/SiteLayout';
import VideoPageHeading from '../../components/VideoPageHeading';
import VideoCourseCard from '../../components/VideoCourseCard';
import {courses} from '../../lib/videoContent';
import Link from 'next/link';
export default function Courses(){return <SiteLayout><main className="ref-site"><VideoPageHeading eyebrow="ALL COURSES" title={<>Your Path to <em>Quran Mastery</em></>} description="Learn Quran online through structured courses for beginners and advanced learners. Choose a suitable course and book a trial."/><section className="ref-section ref-pattern"><div className="container"><div className="ref-course-grid">{courses.map((course,i)=><VideoCourseCard key={course.id} course={course} index={i}/>)}</div><div className="ref-center-action"><Link href="/free-trial" className="ref-goldbtn">Start Free Trial</Link></div></div></section></main></SiteLayout>}
