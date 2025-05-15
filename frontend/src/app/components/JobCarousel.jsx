import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, MapPin, DollarSign } from "lucide-react";
import Image from "next/image";
import { DEFAULT_IMAGE } from "../utils/constant";

export default function JobCarousel({ jobs = [], router }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  // For mouse dragging
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragEnd, setDragEnd] = useState(0);

  // Set visible cards based on screen width
  const [visibleCards, setVisibleCards] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCards(3);
      } else if (window.innerWidth >= 768) {
        setVisibleCards(2);
      } else {
        setVisibleCards(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = Math.max(0, jobs.length - visibleCards + 1);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(totalSlides - 1, prev + 1));
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
    setTouchEnd(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e) => {
    if (!isSwiping) return;
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    if (touchStart - touchEnd > 75) {
      // Swipe left
      handleNext();
    } else if (touchEnd - touchStart > 75) {
      // Swipe right
      handlePrev();
    }
  };

  // Mouse event handlers for desktop
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart(e.clientX);
    setDragEnd(e.clientX);
    // Prevent default to avoid text selection during dragging
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setDragEnd(e.clientX);
    e.preventDefault();
  };

  const handleMouseUp = () => {
    if (isDragging) {
      if (dragStart - dragEnd > 75) {
        // Dragged left
        handleNext();
      } else if (dragEnd - dragStart > 75) {
        // Dragged right
        handlePrev();
      }
      setIsDragging(false);
    }
  };

  // Handle mouse leaving the carousel while dragging
  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleJobClick = (jobId, e) => {
    // Only navigate if not dragging
    if (!isDragging && !isSwiping) {
      router.push(`/applicant/details/${jobId}`);
    }
  };

  return (
    <div className="relative w-full py-6">
      {/* Main carousel */}
      <div
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={carouselRef}
          className={`flex transition-transform duration-300 ease-out ${
            isSwiping || isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{
            transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
            ...(isDragging && {
              transition: "none",
              transform: `translateX(calc(-${currentIndex * (100 / visibleCards)}% + ${dragEnd - dragStart}px))`,
            }),
          }}
        >
          {jobs.map((job) => (
            <div
              key={job.id}
              onClick={(e) => handleJobClick(job.id, e)}
              className="flex-shrink-0 w-full px-2 md:w-1/2 lg:w-1/3"
              style={{ flex: `0 0 ${100 / visibleCards}%` }}
            >
              <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/30 p-6 hover:shadow-xl transition-all duration-200 cursor-pointer h-full mx-2">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center mr-3 bg-cyan-100">
                    {job.profile_picture_url ? (
                      <img
                        src={job.profile_picture_url}
                        alt="Company Logo"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <Image
                        src={DEFAULT_IMAGE}
                        alt="Company Logo"
                        width={100}
                        height={100}
                        className="w-full h-full rounded-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-cyan-800">{job.title}</h3>
                    <p className="text-cyan-600 text-sm">{job.company}</p>
                  </div>
                </div>
                <div className="space-y-2 mb-3">
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 text-cyan-500 mr-1" />
                    <span className="text-cyan-700">{job.location}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <DollarSign className="h-4 w-4 text-cyan-500 mr-1" />
                    <span className="text-cyan-700">{job.salary}</span>
                  </div>
                </div>
                <p className="text-sm text-cyan-700 line-clamp-3">
                  {job.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={handlePrev}
        disabled={currentIndex === 0}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg z-10 text-cyan-700 hover:text-cyan-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={handleNext}
        disabled={currentIndex >= totalSlides - 1}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg z-10 text-cyan-700 hover:text-cyan-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots navigation */}
      {totalSlides > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentIndex === index ? "bg-cyan-600" : "bg-cyan-200"
              } cursor-pointer`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
