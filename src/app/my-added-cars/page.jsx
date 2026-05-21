"use client";

import { authClient, getAuthHeaders } from "@/lib/auth-client";
import UpdateCarModal from "../components/UpdateCarModal";
import { toast } from "@contentstack/react-toastify";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiAlertTriangle,
  FiEdit3,
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

const getCarId = (car) => {
  if (!car?._id) return "";

  if (typeof car._id === "string") {
    return car._id;
  }

  if (car._id.$oid) {
    return car._id.$oid;
  }

  return String(car._id);
};

const MyAddedCarPage = () => {
  const { data: session, isPending } = authClient.useSession();
  const userId = session?.user?.id;

  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedCar, setSelectedCar] = useState(null);
  const [editingCar, setEditingCar] = useState(null);

  useEffect(() => {
    if (isPending) return;

    if (!userId) {
      return;
    }

    const loadCars = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const authHeaders = await getAuthHeaders();

        const response = await fetch(
          `http://localhost:5001/car-listing/${userId}`,
          {
            headers: authHeaders,
          },
        );

        if (!response.ok) {
          throw new Error("Failed to load your car listings");
        }

        const data = await response.json();
        setCars(data);
      } catch (error) {
        console.error("my added cars load error:", error);
        setErrorMessage(error.message || "Failed to load your car listings");
      } finally {
        setIsLoading(false);
      }
    };

    loadCars();
  }, [isPending, userId]);

  const handleDelete = async (carId) => {
    if (!carId) return;

    try {
      setIsDeleting(true);
      const authHeaders = await getAuthHeaders();

      const response = await fetch(
        `http://localhost:5001/car-listing/${carId}`,
        {
          method: "DELETE",
          headers: authHeaders,
        },
      );

      const responseText = await response.text();
      let result = {};

      if (responseText) {
        try {
          result = JSON.parse(responseText);
        } catch {
          result = { message: responseText };
        }
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
            `Failed to delete car listing. Status: ${response.status}`,
        );
      }

      if (result.deletedCount > 0 || result.acknowledged) {
        setCars((currentCars) =>
          currentCars.filter((car) => getCarId(car) !== carId),
        );
        setSelectedCar(null);
        toast.success("🗑️ Listing deleted successfully.");
        return;
      }

      throw new Error("Car listing was not deleted");
    } catch (error) {
      console.error("delete car error:", error);
      toast.error(`❌ ${error.message || "Failed to delete car listing"}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateSuccess = (carId, updatedCarData) => {
    setCars((currentCars) =>
      currentCars.map((car) =>
        getCarId(car) === carId ? { ...car, ...updatedCarData } : car,
      ),
    );
  };

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
        ) : isPending || isLoading ? (
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
            {cars.map((car) => (
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
                      <FiMapPin className="shrink-0 text-primary" size={16} />
                      <span className="truncate">{car.pickupLocation}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-2 md:self-end">
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setEditingCar(car)}
                  >
                    <FiEdit3 size={15} />
                    Update
                  </button>
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
            ))}
          </div>
        )}

        {editingCar && (
          <UpdateCarModal
            car={editingCar}
            onClose={() => setEditingCar(null)}
            onUpdated={handleUpdateSuccess}
          />
        )}

        {selectedCar && (
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
                    from your listings.
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
                  disabled={isDeleting}
                  onClick={() => handleDelete(getCarId(selectedCar))}
                >
                  <FiTrash2 size={16} />
                  {isDeleting ? "Deleting..." : "Delete from listing"}
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
        )}
      </div>
    </section>
  );
};

export default MyAddedCarPage;
