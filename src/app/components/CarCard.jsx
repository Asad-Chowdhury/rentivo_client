import Image from "next/image";
import Link from "next/link";
import { FiMapPin, FiTag, FiUsers } from "react-icons/fi";

const CarCard = ({ car, showDescription = false }) => {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-base-300 bg-base-200 shadow-sm">
      <div className="relative aspect-[16/10] bg-base-300">
        <Image
          src={car.imageUrl}
          alt={car.carName}
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">{car.carName}</h3>
            <p className="mt-1 text-sm text-base-content/60">
              {car.carType}
              {car.transmission ? ` · ${car.transmission}` : ""}
            </p>
          </div>
          <span
            className={`badge ${
              car.availabilityStatus === "Available"
                ? "badge-primary"
                : "badge-outline"
            }`}
          >
            {car.availabilityStatus}
          </span>
        </div>

        {showDescription ? (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-base-content/70">
            {car.description}
          </p>
        ) : null}

        <div className="mt-4 grid gap-2 text-sm text-base-content/75">
          <p className="flex items-center gap-2">
            <FiTag className="text-primary" size={16} />${car.dailyRentPrice} /
            day
          </p>
          <p className="flex items-center gap-2">
            <FiUsers className="text-primary" size={16} />
            {car.seatCapacity} seats
          </p>
          <p className="flex items-center gap-2">
            <FiMapPin className="text-primary" size={16} />
            {car.pickupLocation}
          </p>
        </div>

        <Link href={`/cars/${car.id}`} className="btn btn-primary mt-5">
          View Details
        </Link>
      </div>
    </article>
  );
};

export default CarCard;
