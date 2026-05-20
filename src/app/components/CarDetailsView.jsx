"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiCalendar,
  FiCheckCircle,
  FiMapPin,
  FiTag,
  FiTruck,
  FiUsers,
} from "react-icons/fi";

const getCarId = (car) => {
  if (car.id) return car.id;
  if (!car._id) return "";
  if (typeof car._id === "string") return car._id;
  if (car._id.$oid) return car._id.$oid;

  return String(car._id);
};

const CarDetailsView = ({ carId }) => {
  const [car, setCar] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(carId));
  const [errorMessage, setErrorMessage] = useState("");
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    if (!carId) return;

    const loadCar = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await fetch("http://localhost:5001/car-listing");

        if (!response.ok) {
          throw new Error("Failed to load car details");
        }

        const data = await response.json();
        const foundCar = data.find((item) => getCarId(item) === carId);
        setCar(foundCar || null);
      } catch (error) {
        console.error("car details load error:", error);
        setErrorMessage(error.message || "Failed to load car details");
      } finally {
        setIsLoading(false);
      }
    };

    loadCar();
  }, [carId]);

  if (isLoading) {
    return (
      <section className="flex min-h-[calc(100vh-65px)] items-center justify-center bg-base-100 px-4 py-16 text-base-content">
        <span className="loading loading-spinner loading-lg text-primary" />
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="flex min-h-[calc(100vh-65px)] items-center justify-center bg-base-100 px-4 py-16 text-base-content">
        <div className="max-w-md text-center">
          <FiTruck className="mx-auto text-error" size={42} />
          <h1 className="mt-5 text-2xl font-bold">Unable to load car</h1>
          <p className="mt-2 text-sm text-base-content/70">{errorMessage}</p>
          <Link href="/explore-cars" className="btn btn-primary mt-6">
            Back to Explore Cars
          </Link>
        </div>
      </section>
    );
  }

  if (!car) {
    return (
      <section className="flex min-h-[calc(100vh-65px)] items-center justify-center bg-base-100 px-4 py-16 text-base-content">
        <div className="max-w-md text-center">
          <FiTruck className="mx-auto text-base-content/40" size={42} />
          <h1 className="mt-5 text-2xl font-bold">Car not found</h1>
          <p className="mt-2 text-sm text-base-content/70">
            The listing may have been removed or the link is incorrect.
          </p>
          <Link href="/explore-cars" className="btn btn-primary mt-6">
            Back to Explore Cars
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-65px)] bg-base-100 px-4 py-10 text-base-content sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-base-300">
            <Image
              src={car.imageUrl}
              alt={car.carName}
              fill
              priority
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
          </div>

          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="badge badge-primary">
                {car.availabilityStatus}
              </span>
              <span className="badge badge-outline">{car.carType}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-normal sm:text-4xl">
              {car.carName}
            </h1>
            <p className="mt-4 leading-7 text-base-content/70">
              {car.description}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-base-300 bg-base-200 p-4">
                <FiTag className="text-primary" size={20} />
                <p className="mt-2 text-sm text-base-content/60">Daily Rent</p>
                <p className="text-xl font-semibold">${car.dailyRentPrice}</p>
              </div>
              <div className="rounded-lg border border-base-300 bg-base-200 p-4">
                <FiUsers className="text-primary" size={20} />
                <p className="mt-2 text-sm text-base-content/60">Seats</p>
                <p className="text-xl font-semibold">{car.seatCapacity}</p>
              </div>
              <div className="rounded-lg border border-base-300 bg-base-200 p-4">
                <FiTruck className="text-primary" size={20} />
                <p className="mt-2 text-sm text-base-content/60">Car Type</p>
                <p className="text-xl font-semibold">{car.carType}</p>
              </div>
              <div className="rounded-lg border border-base-300 bg-base-200 p-4">
                <FiMapPin className="text-primary" size={20} />
                <p className="mt-2 text-sm text-base-content/60">Pickup</p>
                <p className="text-xl font-semibold">{car.pickupLocation}</p>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary mt-7 w-full sm:w-auto"
              onClick={() => setIsBookingOpen(true)}
            >
              <FiCalendar size={18} />
              Book Now
            </button>
          </div>
        </div>
      </div>

      {isBookingOpen ? (
        <div className="modal modal-open">
          <div className="modal-box rounded-lg">
            <h2 className="text-xl font-semibold">Book {car.carName}</h2>
            <p className="mt-2 text-sm text-base-content/70">
              Complete these booking details when backend booking functionality
              is connected.
            </p>
            <form className="mt-5 space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-medium">Driver Needed</span>
                <select className="select select-bordered w-full bg-base-100">
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium">Special Note</span>
                <textarea
                  rows={4}
                  className="textarea textarea-bordered w-full bg-base-100"
                  placeholder="Pickup timing, child seat, luggage, or any other note"
                />
              </label>
              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsBookingOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setIsBookingOpen(false)}
                >
                  <FiCheckCircle size={18} />
                  Book Now
                </button>
              </div>
            </form>
          </div>
          <button
            type="button"
            className="modal-backdrop"
            aria-label="Close booking modal"
            onClick={() => setIsBookingOpen(false)}
          />
        </div>
      ) : null}
    </section>
  );
};

export default CarDetailsView;
