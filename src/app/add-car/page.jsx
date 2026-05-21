"use client";

import { authClient, getAuthHeaders } from "@/lib/auth-client";
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

const AddCar = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log(session);
  const userId = session?.user?.id;

  const carFormSubmitHandler = async (event) => {
    event.preventDefault();

    if (!userId) {
      toast.info("🔐 Please login before adding a car.");
      router.push("/login");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData.entries());
    const carData = {
      ...formValues,
      dailyRentPrice: Number(formValues.dailyRentPrice),
      seatCapacity: Number(formValues.seatCapacity),
      userId,
    };

    try {
      setIsSubmitting(true);
      const authHeaders = await getAuthHeaders();

      const response = await fetch(
        "https://rentivo-server-three.vercel.app/add-new-car",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            ...authHeaders,
          },
          body: JSON.stringify(carData),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to save car listing");
      }

      form.reset();
      toast.success("🎉 Congratulations! Your car is added to the listing.");
      router.push("/my-added-cars");
    } catch (error) {
      console.error("add car error:", error);
      toast.error(`❌ ${error.message || "Failed to save car listing"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-65px)] bg-base-100 px-4 py-10 text-base-content sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-normal">
            Add New Car To Listing
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-base-content/70">
            Enter the vehicle details renters need before booking.
          </p>
        </div>

        <form
          className="rounded-lg border border-base-300 bg-base-200 p-5 shadow-sm sm:p-7"
          onSubmit={carFormSubmitHandler}
        >
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
                  placeholder="Toyota Corolla Cross"
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
                  placeholder="85"
                  className="input join-item input-bordered w-full bg-base-100"
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium">Car Type</span>
              <select
                required
                name="carType"
                defaultValue=""
                className="select select-bordered w-full bg-base-100"
              >
                <option value="" disabled>
                  Select car type
                </option>
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
                  placeholder="https://i.ibb.co/example/car.jpg"
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
                  placeholder="5"
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
                  placeholder="Downtown, San Francisco"
                  className="input join-item input-bordered w-full bg-base-100"
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium">Availability Status</span>
              <select
                required
                name="availabilityStatus"
                defaultValue="Available"
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
                  placeholder="Add mileage, comfort features, luggage space, pickup notes, or rental rules."
                  className="textarea join-item textarea-bordered min-h-32 w-full resize-y bg-base-100"
                />
              </div>
            </label>
          </div>

          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-base-300 pt-5 sm:flex-row sm:justify-end">
            <button type="reset" className="btn btn-outline">
              Reset
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isPending || isSubmitting}
            >
              <FiSave size={18} />
              {isSubmitting ? "Saving..." : "Save Listing"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddCar;
