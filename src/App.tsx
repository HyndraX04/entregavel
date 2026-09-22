import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ModulesSection } from './components/ModulesSection';
import { OffersSection } from './components/OffersSection';
import { LessonModal } from './components/LessonModal';
import { CheckoutModal } from './components/CheckoutModal';
import { Footer } from './components/Footer';
import { modulesData, offersData } from './data/courseData';
import { Lesson, Offer } from './types';

export function App() {
  // Completed lessons stored in localStorage
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kaue4gamer_completed_lessons');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal states
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeOffer, setActiveOffer] = useState<Offer | null>(null);

  // Flattened list of all lessons for easy navigation
  const allLessons = modulesData.flatMap((m) => m.lessons);
  const totalLessonsCount = allLessons.length;
  const completedCount = completedLessonIds.length;

  // "Última aula" reference (default to first lesson or first uncompleted lesson)
  const lastLesson = allLessons[0];

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem(
        'kaue4gamer_completed_lessons',
        JSON.stringify(completedLessonIds)
      );
    } catch (e) {
      console.error('Failed to save progress to localStorage', e);
    }
  }, [completedLessonIds]);

  const toggleLessonComplete = (lessonId: string) => {
    setCompletedLessonIds((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  // Find module corresponding to active lesson
  const activeModule = activeLesson
    ? modulesData.find((m) => m.id === activeLesson.moduleId)
    : undefined;

  // Navigation handlers inside lesson modal
  const currentLessonIndex = activeLesson
    ? allLessons.findIndex((l) => l.id === activeLesson.id)
    : -1;

  const handleNextLesson = () => {
    if (currentLessonIndex >= 0 && currentLessonIndex < allLessons.length - 1) {
      setActiveLesson(allLessons[currentLessonIndex + 1]);
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setActiveLesson(allLessons[currentLessonIndex - 1]);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080c] text-gray-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top sticky navbar */}
      <Navbar
        completedCount={completedCount}
        totalLessons={totalLessonsCount}
      />

      {/* Main content container */}
      <main className="flex-1 space-y-4">
        <HeroSection
          lastLesson={lastLesson}
          onOpenLesson={(lesson) => setActiveLesson(lesson)}
          completedLessonsCount={completedCount}
          totalLessonsCount={totalLessonsCount}
        />

        <ModulesSection
          modules={modulesData}
          completedLessonIds={completedLessonIds}
          onOpenLesson={(lesson) => setActiveLesson(lesson)}
          onToggleLessonComplete={toggleLessonComplete}
        />

        <OffersSection
          offers={offersData}
          onSelectOffer={(offer) => setActiveOffer(offer)}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Lesson Modal */}
      {activeLesson && (
        <LessonModal
          lesson={activeLesson}
          module={activeModule}
          isCompleted={completedLessonIds.includes(activeLesson.id)}
          onClose={() => setActiveLesson(null)}
          onToggleComplete={toggleLessonComplete}
          onNextLesson={handleNextLesson}
          onPrevLesson={handlePrevLesson}
          hasNext={currentLessonIndex < allLessons.length - 1}
          hasPrev={currentLessonIndex > 0}
        />
      )}

      {/* Checkout / Offer Modal */}
      {activeOffer && (
        <CheckoutModal
          offer={activeOffer}
          onClose={() => setActiveOffer(null)}
        />
      )}
    </div>
  );
}

export default App;
