'use client';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import VideoCourseCard from './VideoCourseCard';

/** Keyboard and touch-friendly course carousel. Cards and labels come from the existing course catalog. */
export default function FeaturedCourseCarousel({ courses }) {
  const viewport = useRef(null);
  function move(direction) {
    if (!viewport.current) return;
    const width = viewport.current.querySelector('.ref-carousel-slide')?.clientWidth || 320;
    viewport.current.scrollBy({ left: (width + 20) * direction, behavior: 'smooth' });
  }
  return <div className="ref-carousel-shell" aria-label="Browse Quran courses">
    <div className="ref-carousel-toolbar">
      <span>Swipe or use arrows to explore our courses</span>
      <div>
        <button type="button" aria-label="Previous courses" onClick={() => move(-1)}><ChevronLeft size={19} /></button>
        <button type="button" aria-label="Next courses" onClick={() => move(1)}><ChevronRight size={19} /></button>
      </div>
    </div>
    <div className="ref-carousel-viewport" ref={viewport} tabIndex={0} role="region" aria-roledescription="carousel" aria-label="Featured courses">
      {courses.map((course, index) => <div className="ref-carousel-slide" key={course.id} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${courses.length}`}>
        <VideoCourseCard course={course} index={index} />
      </div>)}
    </div>
  </div>;
}
