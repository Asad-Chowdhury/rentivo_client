const steps = [
  "Search by car name or type",
  "Review full car details",
  "Book and manage trips",
];

const HomeWorkflow = () => {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-normal">
            A simple rental workflow
          </h2>
          <p className="mt-3 text-sm leading-6 text-base-content/70">
            Rentivo keeps the core journey direct: find the right vehicle,
            inspect the details, and keep bookings organized after checkout.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step}
              className="rounded-lg border border-base-300 bg-base-200 p-5"
            >
              <span className="text-2xl font-bold text-primary">
                0{index + 1}
              </span>
              <p className="mt-3 font-medium">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeWorkflow;
