"use client";

import { authClient } from "@/lib/auth-client";
import { toast } from "@contentstack/react-toastify";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiShare2,
  FiShield,
  FiSlash,
  FiStar,
  FiTag,
  FiTruck,
  FiUsers,
} from "react-icons/fi";

const formatPrice = (price) => {
  return `$${Number(price || 0).toLocaleString()}`;
};

const formatDateInput = (date) => {
  return date.toISOString().split("T")[0];
};

const getInitialReturnDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 3);

  return formatDateInput(date);
};

const CarDetailsView = ({ carId }) => {
  const router = useRouter();
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const user = session?.user;
  const [car, setCar] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(carId));
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [pickupDate, setPickupDate] = useState(formatDateInput(new Date()));
  const [returnDate, setReturnDate] = useState(getInitialReturnDate);

  useEffect(() => {
    if (!carId) return;

    const loadCar = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await fetch(
          `http://localhost:5001/car-listing/details/${carId}`,
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load car details");
        }

        setCar(data);
      } catch (error) {
        console.error("car details load error:", error);
        setErrorMessage(error.message || "Failed to load car details");
      } finally {
        setIsLoading(false);
      }
    };

    loadCar();
  }, [carId]);

  const pricing = useMemo(() => {
    const dailyPrice = Number(car?.dailyRentPrice || 0);
    const pickupTime = new Date(`${pickupDate}T00:00:00`).getTime();
    const returnTime = new Date(`${returnDate}T00:00:00`).getTime();
    const dayLength = 1000 * 60 * 60 * 24;
    const duration = Math.max(1, Math.ceil((returnTime - pickupTime) / dayLength));
    const subtotal = dailyPrice * duration;
    const serviceFee = Math.round(subtotal * 0.08);
    const protection = Math.max(9, Math.round(dailyPrice * 0.12 * duration));

    return {
      dailyPrice,
      duration,
      subtotal,
      serviceFee,
      protection,
      total: subtotal + serviceFee + protection,
    };
  }, [car, pickupDate, returnDate]);

  const bookingSubmitHandler = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!user?.id) {
      toast.info("🔐 Please login before booking this car.");
      router.push("/login");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const formValues = Object.fromEntries(formData.entries());
    const bookingDetails = {
      bookingDate: new Date().toISOString(),
      perDayPrice: pricing.dailyPrice,
      pickupDate,
      returnDate,
      duration: pricing.duration,
      subtotal: pricing.subtotal,
      platformFee: pricing.serviceFee,
      protectionFee: pricing.protection,
      totalPrice: pricing.total,
      driverNeeded: formValues.driverNeeded,
      specialNote: formValues.specialNote,
      userId: user.id,
      username: user.name || "",
      email: user.email || "",
      carId,
      carName: car.carName,
      carType: car.carType,
      carImage: car.imageUrl,
    };

    try {
      setIsBookingSubmitting(true);

      const response = await fetch(`http://localhost:5001/booking/${user.id}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(bookingDetails),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save booking");
      }

      toast.success("🚗 Booking saved successfully!");
      setIsBookingOpen(false);
      form.reset();
    } catch (error) {
      console.error("booking error:", error);
      toast.error(`❌ ${error.message || "Failed to save booking"}`);
    } finally {
      setIsBookingSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <section className="flex min-h-[calc(100vh-65px)] items-center justify-center bg-base-100 px-4 py-16 text-base-content">
        <span className="loading loading-spinner loading-lg text-primary" />
      </section>
    );
  }

  if (errorMessage || !car) {
    return (
      <section className="flex min-h-[calc(100vh-65px)] items-center justify-center bg-base-100 px-4 py-16 text-base-content">
        <div className="max-w-md text-center">
          <FiTruck className="mx-auto text-base-content/40" size={42} />
          <h1 className="mt-5 text-2xl font-bold">
            {errorMessage ? "Unable to load car" : "Car not found"}
          </h1>
          <p className="mt-2 text-sm text-base-content/70">
            {errorMessage ||
              "The listing may have been removed or the link is incorrect."}
          </p>
          <Link href="/explore-cars" className="btn btn-primary mt-6">
            Back to Explore Cars
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-65px)] bg-base-100 px-4 py-8 text-base-content sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="breadcrumbs mb-4 text-sm text-base-content/60">
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/explore-cars">Explore cars</Link>
            </li>
            <li>{car.carName}</li>
          </ul>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <div className="overflow-hidden rounded-lg border border-base-300 bg-base-200 shadow-sm">
              <div className="relative aspect-[16/11] bg-base-300">
                <Image
                  src={car.imageUrl}
                  alt={car.carName}
                  fill
                  priority
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover"
                />

                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  <span className="badge badge-primary gap-1">
                    <FiCheckCircle size={13} />
                    {car.availabilityStatus}
                  </span>
                  <span className="badge bg-base-100/90 text-base-content">
                    {car.carType}
                  </span>
                </div>

                <div className="absolute right-4 top-4 flex gap-2">
                  <button
                    type="button"
                    className="btn btn-circle btn-sm border-base-100/20 bg-base-100/90"
                    aria-label="Share car"
                  >
                    <FiShare2 size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 p-3">
                {[0, 1, 2].map((item) => (
                  <div
                    key={item}
                    className="relative aspect-[4/3] overflow-hidden rounded-md border border-base-300 bg-base-100"
                  >
                    <Image
                      src={car.imageUrl}
                      alt={`${car.carName} preview ${item + 1}`}
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                  </div>
                ))}
                <div className="flex aspect-[4/3] items-center justify-center rounded-md border border-dashed border-base-300 bg-base-100 text-sm text-base-content/60">
                  Details
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-base-300 bg-base-200 p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-normal">
                    {car.carName}
                  </h1>
                  <p className="mt-1 text-sm text-base-content/60">
                    {car.carType} rental · {car.pickupLocation}
                  </p>
                </div>
                <span className="badge border border-primary/20 bg-primary/10 px-3 py-3 text-primary">
                  <FiStar size={14} />
                  4.8 rating
                </span>
              </div>

              <p className="mt-5 leading-7 text-base-content/75">
                {car.description}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-lg bg-base-100 p-4">
                  <FiUsers className="text-primary" size={20} />
                  <p className="mt-3 text-sm text-base-content/60">Seats</p>
                  <p className="font-semibold">{car.seatCapacity} people</p>
                </div>
                <div className="rounded-lg bg-base-100 p-4">
                  <FiTruck className="text-primary" size={20} />
                  <p className="mt-3 text-sm text-base-content/60">Type</p>
                  <p className="font-semibold">{car.carType}</p>
                </div>
                <div className="rounded-lg bg-base-100 p-4">
                  <FiTag className="text-primary" size={20} />
                  <p className="mt-3 text-sm text-base-content/60">
                    Daily rent
                  </p>
                  <p className="font-semibold">
                    {formatPrice(car.dailyRentPrice)}
                  </p>
                </div>
                <div className="rounded-lg bg-base-100 p-4">
                  <FiMapPin className="text-primary" size={20} />
                  <p className="mt-3 text-sm text-base-content/60">Pickup</p>
                  <p className="font-semibold">{car.pickupLocation}</p>
                </div>
              </div>

              <div className="mt-6 border-t border-base-300 pt-5">
                <h2 className="font-semibold">Features & amenities</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    "Air conditioning",
                    "Comfort seating",
                    "Flexible pickup",
                    "Verified listing",
                  ].map((feature) => (
                    <span key={feature} className="badge badge-outline gap-1">
                      <FiCheckCircle size={13} />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-base-300 bg-base-200 p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-3xl font-bold">
                    {formatPrice(pricing.dailyPrice)}
                    <span className="text-sm font-medium text-base-content/60">
                      {" "}
                      / day
                    </span>
                  </p>
                </div>
                <span className="text-sm text-base-content/60">
                  Free cancellation
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="rounded-lg border border-base-300 bg-base-100 p-3">
                  <span className="text-xs text-base-content/60">
                    Pick-up date
                  </span>
                  <span className="mt-1 flex items-center gap-2 font-semibold">
                    <FiCalendar className="text-primary" size={15} />
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(event) => {
                        const nextPickupDate = event.target.value;
                        setPickupDate(nextPickupDate);

                        if (returnDate <= nextPickupDate) {
                          const nextReturnDate = new Date(
                            `${nextPickupDate}T00:00:00`,
                          );
                          nextReturnDate.setDate(nextReturnDate.getDate() + 1);
                          setReturnDate(formatDateInput(nextReturnDate));
                        }
                      }}
                      className="w-full bg-transparent text-sm outline-none"
                    />
                  </span>
                </label>
                <label className="rounded-lg border border-base-300 bg-base-100 p-3">
                  <span className="text-xs text-base-content/60">
                    Return date
                  </span>
                  <span className="mt-1 flex items-center gap-2 font-semibold">
                    <FiCalendar className="text-primary" size={15} />
                    <input
                      type="date"
                      value={returnDate}
                      min={pickupDate}
                      onChange={(event) => setReturnDate(event.target.value)}
                      className="w-full bg-transparent text-sm outline-none"
                    />
                  </span>
                </label>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between rounded-lg bg-base-100 px-3 py-2 font-semibold">
                  <span>Duration</span>
                  <span>{pricing.duration} days</span>
                </div>
                <div className="flex justify-between">
                  <span>
                    {formatPrice(pricing.dailyPrice)} x {pricing.duration} days
                  </span>
                  <span>{formatPrice(pricing.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform fee</span>
                  <span>{formatPrice(pricing.serviceFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Protection</span>
                  <span>{formatPrice(pricing.protection)}</span>
                </div>
                <div className="flex justify-between border-t border-base-300 pt-3 text-base font-bold">
                  <span>Total</span>
                  <span>{formatPrice(pricing.total)}</span>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary mt-5 w-full"
                onClick={() => setIsBookingOpen(true)}
              >
                <FiCalendar size={18} />
                Book now
              </button>
            </div>

            <div className="rounded-lg border border-base-300 bg-base-200 p-5 shadow-sm">
              <h2 className="font-semibold">Rental policies</h2>
              <div className="mt-4 space-y-3 text-sm text-base-content/75">
                <p className="flex gap-3">
                  <FiClock className="mt-0.5 shrink-0 text-primary" />
                  Free cancellation up to 24 hours before pickup
                </p>
                <p className="flex gap-3">
                  <FiShield className="mt-0.5 shrink-0 text-primary" />
                  Valid driver&apos;s license required at pickup
                </p>
                <p className="flex gap-3">
                  <FiSlash className="mt-0.5 shrink-0 text-error" />
                  No smoking inside the vehicle
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-primary/20 bg-primary/10 p-6 text-center">
              <FiMapPin className="mx-auto text-primary" size={28} />
              <p className="mt-3 font-semibold">{car.pickupLocation}</p>
              <p className="mt-1 text-sm text-base-content/65">
                Exact pickup details are confirmed after booking.
              </p>
            </div>
          </aside>
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
            <form className="mt-5 space-y-4" onSubmit={bookingSubmitHandler}>
              <div className="rounded-lg border border-base-300 bg-base-200 p-4 text-sm">
                <div className="flex justify-between">
                  <span>Pick-up</span>
                  <span className="font-medium">{pickupDate}</span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span>Return</span>
                  <span className="font-medium">{returnDate}</span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span>Total</span>
                  <span className="font-semibold">
                    {formatPrice(pricing.total)}
                  </span>
                </div>
              </div>
              <label className="block space-y-2">
                <span className="text-sm font-medium">Driver Needed</span>
                <select
                  name="driverNeeded"
                  className="select select-bordered w-full bg-base-100"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium">Special Note</span>
                <textarea
                  name="specialNote"
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
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSessionPending || isBookingSubmitting}
                >
                  <FiCheckCircle size={18} />
                  {isBookingSubmitting ? "Saving..." : "Book Now"}
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
