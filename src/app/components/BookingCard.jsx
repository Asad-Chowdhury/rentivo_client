"use client";

import Image from "next/image";
import { FiCalendar, FiCheckCircle, FiClock, FiTag, FiTruck, FiXCircle } from "react-icons/fi";

const statusStyles = {
  Confirmed: "border border-primary/20 bg-primary/10 text-primary",
  Pending:
    "border border-amber-500/20 bg-amber-500/15 text-amber-600",
  Cancelled: "border border-red-500/20 bg-red-500/15 text-red-600",
};

const formatCurrency = (value) => {
  return `$${Number(value || 0).toLocaleString()}`;
};

const formatDate = (value) => {
  if (!value) return "Not set";

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const BookingCard = ({
  booking,
  isCancelling = false,
  isConfirming = false,
  onCancel,
  onConfirm,
}) => {
  const status = booking.status || "Pending";
  const isConfirmed = status === "Confirmed";
  const carImage = booking.carImage;

  return (
    <article className="grid gap-4 rounded-lg border border-base-300 bg-base-200 p-4 shadow-sm md:grid-cols-[180px_minmax(0,1fr)_auto] md:items-center">
      {carImage ? (
        <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-base-300 bg-base-100">
          <Image
            src={carImage}
            alt={booking.carName}
            fill
            sizes="(min-width: 768px) 180px, 100vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex aspect-[16/10] items-center justify-center rounded-md border border-base-300 bg-base-100">
          <div className="text-center">
            <FiTruck className="mx-auto text-primary" size={34} />
            <p className="mt-2 text-sm font-medium">{booking.carType}</p>
          </div>
        </div>
      )}

      <div className="min-w-0 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`badge badge-sm ${statusStyles[status] || "badge-outline"}`}
          >
            {isConfirmed ? <FiCheckCircle size={12} /> : <FiClock size={12} />}
            {status}
          </span>
          <span className="badge badge-outline badge-sm">
            {booking.duration || 1} day{Number(booking.duration || 1) > 1 ? "s" : ""}
          </span>
        </div>

        <div>
          <h2 className="text-lg font-semibold">{booking.carName}</h2>
          <p className="mt-1 text-sm text-base-content/60">
            {booking.carType} · Driver needed: {booking.driverNeeded || "No"}
          </p>
          <div className="mt-3 grid gap-2 text-sm text-base-content/75 sm:grid-cols-3">
            <p className="flex items-center gap-2">
              <FiCalendar className="text-primary" size={16} />
              Booked {formatDate(booking.bookingDate)}
            </p>
            <p className="flex items-center gap-2">
              <FiCalendar className="text-primary" size={16} />
              {formatDate(booking.pickupDate)} - {formatDate(booking.returnDate)}
            </p>
            <p className="flex items-center gap-2">
              <FiTag className="text-primary" size={16} />
              {formatCurrency(booking.totalPrice)}
            </p>
          </div>
          {booking.specialNote ? (
            <p className="mt-3 line-clamp-2 text-sm text-base-content/65">
              Note: {booking.specialNote}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-2 md:self-end">
        <button
          type="button"
          className="btn btn-outline btn-error btn-sm"
          disabled={isCancelling || isConfirming}
          onClick={onCancel}
        >
          <FiXCircle size={15} />
          {isCancelling ? "Cancelling..." : "Cancel Booking"}
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          disabled={isConfirmed || isConfirming || isCancelling}
          onClick={onConfirm}
        >
          <FiCheckCircle size={15} />
          {isConfirmed
            ? "Booking Confirmed"
            : isConfirming
              ? "Confirming..."
              : "Confirm Booking"}
        </button>
      </div>
    </article>
  );
};

export default BookingCard;
