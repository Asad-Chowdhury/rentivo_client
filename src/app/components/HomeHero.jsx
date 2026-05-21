"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
} from "react-icons/fi";

const stats = [
  { label: "Cars Listed", value: "180+" },
  { label: "City Pickups", value: "24" },
  { label: "Avg. Rating", value: "4.9" },
];

const heroSlides = [
  {
    image:
      "https://images.unsplash.com/photo-1532931899774-fbd4de0008fb?auto=format&fit=crop&w=1800&q=80",
    alt: "Rental car driving on a scenic mountain road",
    label: "Scenic weekend trips",
  },
  {
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=80",
    alt: "Premium sports car parked on an open road",
    label: "Premium driving experiences",
  },
  {
    image:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1800&q=80",
    alt: "Driver traveling through a city road",
    label: "Easy city pickups",
  },
  {
    image:
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1800&q=80",
    alt: "Luxury car ready for rental",
    label: "Luxury rentals on demand",
  },
  {
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1800&q=80",
    alt: "Classic performance car photographed from the front",
    label: "Choose cars that match your route",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const HomeHero = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % heroSlides.length);
    }, 5200);

    return () => clearInterval(intervalId);
  }, []);

  const goToPreviousSlide = () => {
    setActiveSlide((currentSlide) =>
      currentSlide === 0 ? heroSlides.length - 1 : currentSlide - 1,
    );
  };

  const goToNextSlide = () => {
    setActiveSlide((currentSlide) => (currentSlide + 1) % heroSlides.length);
  };

  return (
    <section className="relative min-h-[calc(100vh-65px)] overflow-hidden">
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={heroSlides[activeSlide].image}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.85, ease: "easeOut" }}
          >
            <Image
              src={heroSlides[activeSlide].image}
              alt={heroSlides[activeSlide].alt}
              fill
              priority={activeSlide === 0}
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-black/20" />

      <div className="relative mx-auto flex min-h-[calc(100vh-65px)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-3xl text-white"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.12, delayChildren: 0.12 }}
        >
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm backdrop-blur"
          >
            <FiStar className="text-primary" />
            {heroSlides[activeSlide].label}
          </motion.p>
          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
          >
            Rent the right car without the usual friction.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg"
          >
            Explore available vehicles, compare prices and locations, and
            manage your own rental listings from a clean, secure dashboard.
          </motion.p>
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link href="/explore-cars" className="btn btn-primary">
              Explore Cars
              <FiArrowRight size={18} />
            </Link>
            <Link
              href="/add-car"
              className="btn border-white/25 bg-white/10 text-white hover:bg-white/20"
            >
              List Your Car
            </Link>

            <div className="flex items-center gap-2 sm:ml-3">
              <button
                type="button"
                className="btn btn-circle btn-sm border-white/20 bg-white/10 text-white hover:bg-white/20"
                onClick={goToPreviousSlide}
                aria-label="Show previous banner image"
              >
                <FiChevronLeft size={18} />
              </button>
              <button
                type="button"
                className="btn btn-circle btn-sm border-white/20 bg-white/10 text-white hover:bg-white/20"
                onClick={goToNextSlide}
                aria-label="Show next banner image"
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-white/20 pt-6"
          >
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-primary">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wide text-white/65">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
        {heroSlides.map((slide, index) => {
          const isActive = activeSlide === index;

          return (
            <button
              key={slide.image}
              type="button"
              className={`h-2.5 rounded-full transition-all ${
                isActive
                  ? "w-9 bg-primary"
                  : "w-2.5 bg-white/45 hover:bg-white/75"
              }`}
              onClick={() => setActiveSlide(index)}
              aria-label={`Show banner image ${index + 1}`}
              aria-current={isActive ? "true" : "false"}
            />
          );
        })}
      </div>

      <div className="absolute bottom-6 right-6 hidden items-center gap-2 rounded-full border border-white/15 bg-black/25 px-3 py-2 text-xs font-medium text-white/80 backdrop-blur md:flex">
        <FiArrowLeft size={14} />
        {activeSlide + 1} / {heroSlides.length}
        <FiArrowRight size={14} />
      </div>
    </section>
  );
};

export default HomeHero;
