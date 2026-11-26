"use client";
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function CourseCard({ course }) {
  return (
    <article className="card course-card group">
      <div className="course-card-image">
        <img
          src={course.image || '/images/noorani-qaida.svg'}
          alt={course.title}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = '/images/noorani-qaida.svg';
          }}
          className="image-cover transition duration-700 group-hover:scale-105"
        />
        <span className="course-image-shade" />
      </div>
      <div className="p-6">
        <span className="tag">{course.level}</span>
        <h3 className="display text-2xl text-deep mt-4">{course.title}</h3>
        <p className="text-sm text-[#66756f] leading-6 mt-3 min-h-[72px]">{course.description}</p>
        <Link href="/free-trial" className="course-link inline-flex items-center gap-2 text-sm font-bold text-forest mt-5">
          Explore course <ArrowUpRight size={16}/>
        </Link>
      </div>
    </article>
  );
}
