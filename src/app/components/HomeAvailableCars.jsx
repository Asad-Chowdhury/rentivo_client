"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import CarCard from "./CarCard";
import SectionHeading from "./SectionHeading";

const HomeAvailableCars = ({ cars }) => {
  const [selectedType, setSelectedType] = useState("All");

  const carTypes = useMemo(() => {
    const uniqueTypes = cars.map((car) => car.carType);
    return ["All", ...new Set(uniqueTypes)];
  }, [cars]);

  const filteredCars = useMemo(() => {
    if (selectedType === "All") {
      return cars.slice(0, 6);
    }

    return cars.filter((car) => car.carType === selectedType);
  }, [cars, selectedType]);

  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="Available Cars"
          description="Browse a sample of rental-ready vehicles by category with consistent details, pricing, and pickup information."
          actionHref="/explore-cars"
          actionLabel="View All Cars"
        />

        <div className="mb-7 flex flex-wrap gap-2">
          {carTypes.map((type) => {
            const isSelected = selectedType === type;

            return (
              <button
                key={type}
                type="button"
                className={`badge cursor-pointer border px-4 py-3 text-sm transition ${
                  isSelected
                    ? "badge-primary"
                    : "badge-outline hover:border-primary hover:text-primary"
                }`}
                onClick={() => setSelectedType(type)}
                aria-pressed={isSelected}
              >
                {type}
              </button>
            );
          })}
        </div>

        <motion.div layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredCars.map((car) => (
            <motion.div
              key={car.id}
              layout
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <CarCard car={car} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HomeAvailableCars;
