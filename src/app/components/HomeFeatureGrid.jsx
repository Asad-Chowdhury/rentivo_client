import { FiCalendar, FiShield, FiTruck } from "react-icons/fi";

const benefits = [
  {
    icon: FiShield,
    title: "Verified Listings",
    text: "Clear listing details help renters compare condition, location, price, and availability before booking.",
  },
  {
    icon: FiCalendar,
    title: "Booking Ready",
    text: "A focused flow for car details, booking notes, driver needs, and upcoming rental management.",
  },
  {
    icon: FiTruck,
    title: "Owner Tools",
    text: "Owners can keep listings organized with add, update, delete, and availability management screens.",
  },
];

const HomeFeatureGrid = () => {
  return (
    <section className="border-y border-base-300 bg-base-200 px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;

          return (
            <div key={benefit.title} className="rounded-lg bg-base-100 p-6">
              <span className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-content">
                <Icon size={21} />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-6 text-base-content/70">
                {benefit.text}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HomeFeatureGrid;
