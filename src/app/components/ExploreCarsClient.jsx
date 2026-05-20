"use client";

import { useMemo, useState } from "react";
import { FiFilter, FiSearch } from "react-icons/fi";
import CarCard from "./CarCard";

const ExploreCarsClient = ({ cars, carTypes }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const matchesSearch = car.carName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType = selectedType === "All" || car.carType === selectedType;

      return matchesSearch && matchesType;
    });
  }, [cars, searchTerm, selectedType]);

  return (
    <section className="min-h-[calc(100vh-65px)] bg-base-100 px-4 py-10 text-base-content sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-normal">Explore Cars</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-base-content/70">
            Search and filter available and unavailable rental cars before
            reviewing full details.
          </p>
        </div>

        <div className="mb-8 grid gap-3 rounded-lg border border-base-300 bg-base-200 p-4 md:grid-cols-[1fr_240px]">
          <label className="join w-full">
            <span className="join-item flex items-center border border-base-300 bg-base-100 px-3 text-base-content/60">
              <FiSearch size={18} />
            </span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by car name"
              className="input join-item input-bordered w-full bg-base-100"
            />
          </label>

          <label className="join w-full">
            <span className="join-item flex items-center border border-base-300 bg-base-100 px-3 text-base-content/60">
              <FiFilter size={18} />
            </span>
            <select
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value)}
              className="select join-item select-bordered w-full bg-base-100"
            >
              {carTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} showDescription />
          ))}
        </div>

        {filteredCars.length === 0 ? (
          <div className="mt-8 rounded-lg border border-base-300 bg-base-200 p-8 text-center">
            <h2 className="text-xl font-semibold">No cars found</h2>
            <p className="mt-2 text-sm text-base-content/70">
              Try another search term or choose a different car type.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default ExploreCarsClient;
