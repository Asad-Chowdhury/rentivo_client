"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiStar } from "react-icons/fi";

const stats = [
  { label: "Cars Listed", value: "180+" },
  { label: "City Pickups", value: "24" },
  { label: "Avg. Rating", value: "4.9" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const HomeHero = () => {
  return (
    <section className="relative min-h-[calc(100vh-65px)] overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <Image
          src="https://images.unsplash.com/photo-1532931899774-fbd4de0008fb?auto=format&fit=crop&w=1800&q=80"
          alt="Cars driving on a scenic road"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-black/65" />

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
            Reliable rentals for every route
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
            className="mt-8 flex flex-col gap-3 sm:flex-row"
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
    </section>
  );
};

export default HomeHero;
