import Image from "next/image";
import Link from "next/link";
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiTag,
  FiXCircle,
} from "react-icons/fi";

const statusStyles = {
  Confirmed:
    "border border-blue-500/20 bg-blue-500/15 text-blue-600",
  Pending:
    "border border-amber-500/20 bg-amber-500/15 text-amber-600",
  Cancelled:
    "border border-red-500/20 bg-red-500/15 text-red-600",
};

const BookingCard = ({ booking }) => {
  return (
    <article className="grid gap-4 rounded-lg border border-base-300 bg-base-200 p-4 shadow-sm md:grid-cols-[220px_minmax(0,1fr)_auto] md:items-center">
      <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-base-300">
        <Image
          src={booking.imageUrl}
          alt={booking.carName}
          fill
          sizes="(min-width: 768px) 220px, 100vw"
          className="object-cover"
        />
      </div>

      <div className="min-w-0 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`badge badge-sm ${
              statusStyles[booking.status] || "badge-outline"
            }`}
          >
            {booking.status === "Confirmed" ? (
              <FiCheckCircle size={12} />
            ) : (
              <FiClock size={12} />
            )}
            {booking.status}
          </span>
        </div>

        <div>
          <h2 className="text-lg font-semibold">{booking.carName}</h2>
          <div className="mt-3 grid gap-2 text-sm text-base-content/75 sm:grid-cols-3">
            <p className="flex items-center gap-2">
              <FiCalendar className="text-primary" size={16} />
              {booking.bookingDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p className="flex items-center gap-2">
              <FiMapPin className="text-primary" size={16} />
              {booking.pickupLocation}
            </p>
            <p className="flex items-center gap-2">
              <FiTag className="text-primary" size={16} />${booking.totalPrice}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-2 md:self-end">
        <button type="button" className="btn btn-outline btn-error btn-sm">
          <FiXCircle size={15} />
          Cancel
        </button>
        <Link href="/explore-cars" className="btn btn-primary btn-sm">
          View Cars
        </Link>
      </div>
    </article>
  );
};

export default BookingCard;
