import BookingCard from "@/app/components/BookingCard";

const bookings = [
  {
    id: "bk-1001",
    carName: "Toyota Corolla Cross",
    imageUrl:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80",
    pickupLocation: "Downtown, San Francisco",
    bookingDate: new Date("2026-06-12T10:00:00"),
    totalPrice: 255,
    status: "Confirmed",
  },
  {
    id: "bk-1002",
    carName: "Mercedes-Benz E-Class",
    imageUrl:
      "https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?auto=format&fit=crop&w=900&q=80",
    pickupLocation: "Nob Hill, San Francisco",
    bookingDate: new Date("2026-06-18T14:00:00"),
    totalPrice: 444,
    status: "Pending",
  },
  {
    id: "bk-1003",
    carName: "Chrysler Pacifica",
    imageUrl:
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80",
    pickupLocation: "SFO Airport",
    bookingDate: new Date("2026-07-02T09:30:00"),
    totalPrice: 384,
    status: "Confirmed",
  },
];

const MyBookingPage = () => {
  return (
    <section className="min-h-[calc(100vh-65px)] bg-base-100 px-4 py-10 text-base-content sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-normal">My Bookings</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-base-content/70">
            Manage upcoming rental plans and review the key details for each
            booking.
          </p>
        </div>

        <div className="space-y-4">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MyBookingPage;
