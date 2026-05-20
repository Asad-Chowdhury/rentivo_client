"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiAlertTriangle,
  FiMapPin,
  FiPlus,
  FiRefreshCw,
  FiTag,
  FiTrash2,
  FiTruck,
  FiUsers,
} from "react-icons/fi";

const formatPrice = (price) => {
  return `$${Number(price).toLocaleString()}`;
};

const MyAddedCarPage = () => {
  const { data: session, isPending } = authClient.useSession();
  const userId = session?.user?.id;
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedCar, setSelectedCar] = useState(null);

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (!userId) {
      return;
    }

    const controller = new AbortController();

    const loadCars = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await fetch(
          `http://localhost:5001/car-listing/${encodeURIComponent(userId)}`,
          {
            method: "GET",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Failed to load your car listings");
        }

        const carsData = await response.json();
        setCars(carsData);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("my added cars load error:", error);
          setErrorMessage(error.message || "Failed to load your car listings");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadCars();

    return () => controller.abort();
  }, [isPending, userId]);

  const isPageLoading = isPending || isLoading;

  return (
    <section className="min-h-[calc(100vh-65px)] bg-base-100 px-4 py-10 text-base-content sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-normal">
              My Added Cars
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-base-content/70">
              Review the vehicles you have listed for rent.
            </p>
          </div>

          <Link href="/add-car" className="btn btn-primary">
            <FiPlus size={18} />
            Add Car
          </Link>
        </div>

        {!isPending && !userId ? (
          <div className="rounded-lg border border-base-300 bg-base-200 p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold">Login required</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-base-content/70">
              Sign in to view the cars you have added.
            </p>
            <Link href="/login" className="btn btn-primary mt-5">
              Login
            </Link>
          </div>
        ) : isPageLoading ? (
          <div className="flex min-h-72 items-center justify-center rounded-lg border border-base-300 bg-base-200">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : errorMessage ? (
          <div className="rounded-lg border border-error/30 bg-error/10 p-8 text-center">
            <FiRefreshCw className="mx-auto text-error" size={30} />
            <h2 className="mt-4 text-xl font-semibold">Unable to load cars</h2>
            <p className="mt-2 text-sm text-base-content/70">{errorMessage}</p>
          </div>
        ) : cars.length === 0 ? (
          <div className="rounded-lg border border-base-300 bg-base-200 p-8 text-center shadow-sm">
            <FiTruck className="mx-auto text-base-content/50" size={34} />
            <h2 className="mt-4 text-xl font-semibold">No cars added yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-base-content/70">
              Add your first vehicle listing to start managing rentals.
            </p>
            <Link href="/add-car" className="btn btn-primary mt-5">
              <FiPlus size={18} />
              Add Car
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {cars.map((car) => {
              return (
                <article
                  key={car._id}
                  className="grid gap-4 rounded-lg border border-base-300 bg-base-200 p-4 shadow-sm md:grid-cols-[220px_minmax(0,1fr)_auto] md:items-center"
                >
                  <div className="relative aspect-16/10 overflow-hidden rounded-md bg-base-300">
                    <Image
                      src={car.imageUrl}
                      alt={car.carName}
                      fill
                      sizes="(min-width: 768px) 220px, 100vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="badge badge-primary badge-sm">
                        {car.availabilityStatus}
                      </span>
                      <span className="badge badge-outline badge-sm">
                        {car.carType}
                      </span>
                    </div>

                    <div>
                      <h2 className="truncate text-lg font-semibold">
                        {car.carName}
                      </h2>
                      <p className="mt-1 line-clamp-2 text-sm text-base-content/65">
                        {car.description}
                      </p>
                    </div>

                    <div className="grid gap-2 text-sm text-base-content/75 sm:grid-cols-3">
                      <p className="flex items-center gap-2">
                        <FiTag className="shrink-0 text-primary" size={16} />
                        <span>{formatPrice(car.dailyRentPrice)} / day</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <FiUsers className="shrink-0 text-primary" size={16} />
                        <span>{car.seatCapacity} seats</span>
                      </p>
                      <p className="flex min-w-0 items-center gap-2">
                        <FiMapPin
                          className="shrink-0 text-primary"
                          size={16}
                        />
                        <span className="truncate">
                          {car.pickupLocation}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end md:self-end">
                    <button
                      type="button"
                      className="btn btn-outline btn-error btn-sm"
                      onClick={() => setSelectedCar(car)}
                    >
                      <FiTrash2 size={15} />
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {selectedCar ? (
          <div className="modal modal-open">
            <div className="modal-box max-w-md rounded-lg">
              <div className="flex items-start gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-error/10 text-error">
                  <FiAlertTriangle size={22} />
                </span>
                <div>
                  <h2 className="text-xl font-semibold">Delete listing?</h2>
                  <p className="mt-2 text-sm text-base-content/70">
                    This will remove{" "}
                    <span className="font-medium text-base-content">
                      {selectedCar.carName}
                    </span>{" "}
                    from your listings. This action will be connected to the
                    database later.
                  </p>
                </div>
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setSelectedCar(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-error"
                  onClick={() => setSelectedCar(null)}
                >
                  <FiTrash2 size={16} />
                  Delete from listing
                </button>
              </div>
            </div>
            <button
              type="button"
              className="modal-backdrop"
              aria-label="Close delete confirmation"
              onClick={() => setSelectedCar(null)}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default MyAddedCarPage;
