"use client";

import { getAuthHeaders } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { FiFilter, FiSearch } from "react-icons/fi";
import CarCard from "./CarCard";

const carTypes = [
  "All",
  "SUV",
  "Sedan",
  "Hatchback",
  "Luxury",
  "Convertible",
  "Van",
  "Sports",
  "Electric",
  "Luxury SUV",
];

const ExploreCarsClient = () => {
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    const loadCars = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const authHeaders = await getAuthHeaders();
        const params = new URLSearchParams();

        if (searchTerm.trim()) {
          params.set("search", searchTerm.trim());
        }

        if (selectedType !== "All") {
          params.set("type", selectedType);
        }

        const queryString = params.toString();
        const response = await fetch(
          `http://localhost:5001/car-listing${queryString ? `?${queryString}` : ""}`,
          {
            headers: authHeaders,
          },
        );

        if (!response.ok) {
          throw new Error("Failed to load cars");
        }

        const data = await response.json();
        setCars(data);
      } catch (error) {
        console.error("explore cars load error:", error);
        setErrorMessage(error.message || "Failed to load cars");
      } finally {
        setIsLoading(false);
      }
    };

    loadCars();
  }, [searchTerm, selectedType]);

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

        {isLoading ? (
          <div className="flex min-h-72 items-center justify-center rounded-lg border border-base-300 bg-base-200">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : errorMessage ? (
          <div className="rounded-lg border border-error/30 bg-error/10 p-8 text-center">
            <h2 className="text-xl font-semibold">Unable to load cars</h2>
            <p className="mt-2 text-sm text-base-content/70">{errorMessage}</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {cars.map((car) => (
              <CarCard key={car._id || car.id} car={car} showDescription />
            ))}
          </div>
        )}

        {!isLoading && !errorMessage && cars.length === 0 ? (
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
