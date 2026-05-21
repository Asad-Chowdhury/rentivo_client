"use client";

import { toast } from "@contentstack/react-toastify";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FiFileText,
  FiImage,
  FiMapPin,
  FiSave,
  FiTag,
  FiTruck,
  FiUsers,
} from "react-icons/fi";

const carTypes = ["SUV", "Sedan", "Hatchback", "Luxury", "Convertible", "Van"];
const availabilityStatuses = [
  "Available",
  "Unavailable",
  "Booked",
  "Coming Soon",
];

const UpdateCarModal = ({ car, onClose, onUpdated }) => {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateCarSubmitHandler = async (event) => {
    event.preventDefault();

    const carId = car?._id;

    if (!carId) {
      toast.error("❌ Car id is missing. Cannot update this listing.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const formValues = Object.fromEntries(formData.entries());
    const updatedCarData = {
      ...formValues,
      dailyRentPrice: Number(formValues.dailyRentPrice),
      seatCapacity: Number(formValues.seatCapacity),
    };

    try {
      setIsUpdating(true);

      const response = await fetch(
        `http://localhost:5001/car-listing/${carId}`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(updatedCarData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update car listing");
      }

      if (data.matchedCount > 0) {
        onUpdated(carId, updatedCarData);
        toast.success("✅ Your listing is updated!");
        onClose();
        router.refresh();
        return;
      }

      throw new Error(
        `No matching car was found on the server for _id: ${carId}`,
      );
    } catch (error) {
      console.error("update car error:", error);
      toast.error(`❌ ${error.message || "Failed to update car listing"}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-5xl rounded-lg">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-normal">
            Update Car Listing
          </h2>
          <p className="mt-2 text-sm text-base-content/70">
            Edit the vehicle details to update your listing.
          </p>
        </div>

        <form onSubmit={updateCarSubmitHandler}>
          <div className="grid gap-5 lg:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium">Car Name</span>
              <div className="join w-full">
                <span className="join-item flex items-center border border-base-300 bg-base-100 px-3 text-base-content/60">
                  <FiTruck size={18} />
                </span>
                <input
                  required
                  name="carName"
                  type="text"
                  defaultValue={car.carName}
                  className="input join-item input-bordered w-full bg-base-100"
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium">Daily Rent Price</span>
              <div className="join w-full">
                <span className="join-item flex items-center border border-base-300 bg-base-100 px-3 text-base-content/60">
                  <FiTag size={18} />
                </span>
                <input
                  required
                  min={0}
                  name="dailyRentPrice"
                  type="number"
                  defaultValue={car.dailyRentPrice}
                  className="input join-item input-bordered w-full bg-base-100"
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium">Car Type</span>
              <select
                required
                name="carType"
                defaultValue={car.carType}
                className="select select-bordered w-full bg-base-100"
              >
                {carTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium">Image URL</span>
              <div className="join w-full">
                <span className="join-item flex items-center border border-base-300 bg-base-100 px-3 text-base-content/60">
                  <FiImage size={18} />
                </span>
                <input
                  required
                  name="imageUrl"
                  type="url"
                  defaultValue={car.imageUrl}
                  className="input join-item input-bordered w-full bg-base-100"
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium">Seat Capacity</span>
              <div className="join w-full">
                <span className="join-item flex items-center border border-base-300 bg-base-100 px-3 text-base-content/60">
                  <FiUsers size={18} />
                </span>
                <input
                  required
                  min={1}
                  name="seatCapacity"
                  type="number"
                  defaultValue={car.seatCapacity}
                  className="input join-item input-bordered w-full bg-base-100"
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium">Pickup Location</span>
              <div className="join w-full">
                <span className="join-item flex items-center border border-base-300 bg-base-100 px-3 text-base-content/60">
                  <FiMapPin size={18} />
                </span>
                <input
                  required
                  name="pickupLocation"
                  type="text"
                  defaultValue={car.pickupLocation}
                  className="input join-item input-bordered w-full bg-base-100"
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium">Availability Status</span>
              <select
                required
                name="availabilityStatus"
                defaultValue={car.availabilityStatus}
                className="select select-bordered w-full bg-base-100"
              >
                {availabilityStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2 lg:col-span-2">
              <span className="text-sm font-medium">Description</span>
              <div className="join w-full items-stretch">
                <span className="join-item flex items-start border border-base-300 bg-base-100 px-3 py-3 text-base-content/60">
                  <FiFileText size={18} />
                </span>
                <textarea
                  required
                  name="description"
                  rows={5}
                  defaultValue={car.description}
                  className="textarea join-item textarea-bordered min-h-32 w-full resize-y bg-base-100"
                />
              </div>
            </label>
          </div>

          <div className="modal-action mt-7 border-t border-base-300 pt-5">
            <button
              type="button"
              className="btn btn-outline"
              disabled={isUpdating}
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isUpdating}>
              <FiSave size={18} />
              {isUpdating ? "Updating..." : "Update Car Listing"}
            </button>
          </div>
        </form>
      </div>

      <button
        type="button"
        className="modal-backdrop"
        aria-label="Close update car modal"
        onClick={isUpdating ? undefined : onClose}
      />
    </div>
  );
};

export default UpdateCarModal;
