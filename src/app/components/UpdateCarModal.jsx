"use client";

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

const UpdateCarModal = ({ car, onClose }) => {
  const updateCarSubmitHandler = (event) => {
    event.preventDefault();
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
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <FiSave size={18} />
              Update Car Listing
            </button>
          </div>
        </form>
      </div>

      <button
        type="button"
        className="modal-backdrop"
        aria-label="Close update car modal"
        onClick={onClose}
      />
    </div>
  );
};

export default UpdateCarModal;
