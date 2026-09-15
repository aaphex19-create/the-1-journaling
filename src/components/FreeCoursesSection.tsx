import React, { useState } from 'react';
import { PlayCircle, Clock, ArrowRight, Sparkles, BookOpen, GraduationCap } from 'lucide-react';
import { FREE_COURSES } from '../data/coursesData';
import { FreeCourse } from '../types';
import { useTheme } from '../context/ThemeContext';
import { ComingSoonCourseModal } from './ComingSoonCourseModal';

interface FreeCoursesSectionProps {
  compact?: boolean;
}

export const FreeCoursesSection: React.FC<FreeCoursesSectionProps> = ({ compact = false }) => {
  const { isDark } = useTheme();
  const [selectedCourse, setSelectedCourse] = useState<FreeCourse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCourseClick = (course: FreeCourse) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  return (
    <section id="free-courses-section" className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border shadow-sm ${
                isDark
                  ? 'bg-[#d4ff00]/10 text-[#d4ff00] border-[#d4ff00]/30 glow-lime-badge'
                  : 'bg-[#e05333]/10 text-[#e05333] border-[#e05333]/30'
              }`}
            >
              100% Complimentary Masterclasses
            </span>
            <span className="text-xs font-mono text-slate-400">THE 1% ACADEMY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            Free Video Courses & Masterclasses
          </h2>
          <p className={`text-xs sm:text-sm mt-1 max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Comprehensive institutional masterclasses on order flow, smart money concepts, risk modeling, and emotional resilience.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono text-slate-500">
            Click any masterclass to preview curriculum & notify
          </span>
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className={`grid grid-cols-1 ${compact ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-4'} gap-6`}>
        {FREE_COURSES.map((course) => {
          return (
            <div
              key={course.id}
              onClick={() => handleCourseClick(course)}
              className={`group relative rounded-3xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between border ${
                isDark
                  ? 'liquid-glass-dark hover:border-[#d4ff00]/50 hover:shadow-[0_0_30px_rgba(212,255,0,0.15)]'
                  : 'liquid-glass-light hover:border-[#e05333]/50 hover:shadow-xl'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                      isDark
                        ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                        : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {course.badge}
                  </span>
                  <span
                    className={`text-[11px] font-mono font-black ${
                      isDark ? 'text-[#d4ff00]' : 'text-[#e05333]'
                    }`}
                  >
                    FREE
                  </span>
                </div>

                {/* Course Banner Box */}
                <div
                  className={`h-24 rounded-2xl mb-4 p-4 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br ${
                    isDark
                      ? 'from-slate-800/90 to-slate-900 border border-slate-700/50'
                      : 'from-slate-100 to-slate-200 border border-slate-300/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <PlayCircle className={`w-5 h-5 ${isDark ? 'text-[#d4ff00]' : 'text-[#e05333]'}`} />
                    <span className="text-[10px] font-mono text-slate-400">{course.duration.split('•')[0]}</span>
                  </div>
                  <div className="font-mono text-[9px] uppercase tracking-wider text-slate-400 truncate">
                    {course.instructor}
                  </div>
                </div>

                <h3 className="text-base font-bold tracking-tight mb-1 group-hover:text-[#d4ff00] transition-colors">
                  {course.title}
                </h3>
                <p className={`text-xs line-clamp-2 leading-relaxed mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {course.subtitle}
                </p>
              </div>

              {/* Bottom CTA button */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">
                  {course.enrolledCount.split(' ')[0]} Enrolled
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCourseClick(course);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                    isDark
                      ? 'bg-[#d4ff00] text-[#070a12] group-hover:scale-105 shadow-sm'
                      : 'bg-[#e05333] text-white group-hover:scale-105 shadow-sm'
                  }`}
                >
                  <span>Start Course</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Liquid Glass Modal */}
      <ComingSoonCourseModal
        course={selectedCourse}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};
