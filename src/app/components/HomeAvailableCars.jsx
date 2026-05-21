"use client";

import { getAuthHeaders } from "@/lib/auth-client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import CarCard from "./CarCard";
import SectionHeading from "./SectionHeading";

const getCarId = (car) => {
  if (car.id) return car.id;
  if (!car._id) return "";
  if (typeof car._id === "string") return car._id;
  if (car._id.$oid) return car._id.$oid;

  return String(car._id);
};

const HomeAvailableCars = () => {
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    const loadCars = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const authHeaders = await getAuthHeaders();

        const response = await fetch("http://localhost:5001/car-listing", {
          headers: authHeaders,
        });

        if (!response.ok) {
          throw new Error("Failed to load available cars");
        }

        const data = await response.json();
        setCars(data);
      } catch (error) {
        console.error("home available cars load error:", error);
        setErrorMessage(error.message || "Failed to load available cars");
      } finally {
        setIsLoading(false);
      }
    };

    loadCars();
  }, []);

  const carTypes = useMemo(() => {
    const uniqueTypes = cars.map((car) => car.carType).filter(Boolean);
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

        {isLoading ? (
          <div className="flex min-h-72 items-center justify-center rounded-lg border border-base-300 bg-base-200">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : errorMessage ? (
          <div className="rounded-lg border border-error/30 bg-error/10 p-8 text-center">
            <h3 className="text-xl font-semibold">Unable to load cars</h3>
            <p className="mt-2 text-sm text-base-content/70">{errorMessage}</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
          >
            {filteredCars.map((car) => (
              <motion.div
                key={getCarId(car)}
                layout
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <CarCard car={car} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default HomeAvailableCars;
