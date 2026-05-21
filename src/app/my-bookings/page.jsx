"use client";

import BookingCard from "@/app/components/BookingCard";
import { authClient, getAuthHeaders } from "@/lib/auth-client";
import { toast } from "@contentstack/react-toastify";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiCalendar, FiRefreshCw } from "react-icons/fi";

const getBookingId = (booking) => {
  if (!booking?._id) return "";
  if (typeof booking._id === "string") return booking._id;
  if (booking._id.$oid) return booking._id.$oid;

  return String(booking._id);
};

const MyBookingPage = () => {
  const { data: session, isPending } = authClient.useSession();
  const userId = session?.user?.id;
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionId, setActionId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isPending) return;

    if (!userId) return;

    const loadBookings = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const authHeaders = await getAuthHeaders();

        const response = await fetch(`http://localhost:5001/booking/${userId}`, {
          headers: authHeaders,
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load bookings");
        }

        setBookings(data);
      } catch (error) {
        console.error("my bookings load error:", error);
        setErrorMessage(error.message || "Failed to load bookings");
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, [isPending, userId]);

  const cancelBookingHandler = async (booking) => {
    const bookingId = getBookingId(booking);
    if (!bookingId || !userId) return;

    try {
      setActionId(`cancel-${bookingId}`);
      const authHeaders = await getAuthHeaders();

      const response = await fetch(`http://localhost:5001/booking/${userId}`, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({ _id: bookingId }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel booking");
      }

      if (data.deletedCount > 0 || data.acknowledged) {
        setBookings((currentBookings) =>
          currentBookings.filter((item) => getBookingId(item) !== bookingId),
        );
        toast.success("🗑️ Booking cancelled successfully.");
        return;
      }

      throw new Error("Booking was not cancelled");
    } catch (error) {
      console.error("cancel booking error:", error);
      toast.error(`❌ ${error.message || "Failed to cancel booking"}`);
    } finally {
      setActionId("");
    }
  };

  const confirmBookingHandler = async (booking) => {
    const bookingId = getBookingId(booking);
    if (!bookingId || !userId) return;

    try {
      setActionId(`confirm-${bookingId}`);
      const authHeaders = await getAuthHeaders();

      const response = await fetch(`http://localhost:5001/booking/${userId}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({ _id: bookingId, status: "Confirmed" }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to confirm booking");
      }

      if (data.modifiedCount > 0 || data.matchedCount > 0 || data.acknowledged) {
        setBookings((currentBookings) =>
          currentBookings.map((item) =>
            getBookingId(item) === bookingId
              ? { ...item, status: "Confirmed" }
              : item,
          ),
        );
        toast.success("✅ Booking confirmed!");
        return;
      }

      throw new Error("Booking was not confirmed");
    } catch (error) {
      console.error("confirm booking error:", error);
      toast.error(`❌ ${error.message || "Failed to confirm booking"}`);
    } finally {
      setActionId("");
    }
  };

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

        {!isPending && !userId ? (
          <div className="rounded-lg border border-base-300 bg-base-200 p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold">Login required</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-base-content/70">
              Sign in to view and manage your bookings.
            </p>
            <Link href="/login" className="btn btn-primary mt-5">
              Login
            </Link>
          </div>
        ) : isPending || isLoading ? (
          <div className="flex min-h-72 items-center justify-center rounded-lg border border-base-300 bg-base-200">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : errorMessage ? (
          <div className="rounded-lg border border-error/30 bg-error/10 p-8 text-center">
            <FiRefreshCw className="mx-auto text-error" size={30} />
            <h2 className="mt-4 text-xl font-semibold">
              Unable to load bookings
            </h2>
            <p className="mt-2 text-sm text-base-content/70">{errorMessage}</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-lg border border-base-300 bg-base-200 p-8 text-center shadow-sm">
            <FiCalendar className="mx-auto text-base-content/50" size={34} />
            <h2 className="mt-4 text-xl font-semibold">No bookings yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-base-content/70">
              Book your first car from the explore page.
            </p>
            <Link href="/explore-cars" className="btn btn-primary mt-5">
              Explore Cars
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const bookingId = getBookingId(booking);

              return (
                <BookingCard
                  key={bookingId}
                  booking={booking}
                  isCancelling={actionId === `cancel-${bookingId}`}
                  isConfirming={actionId === `confirm-${bookingId}`}
                  onCancel={() => cancelBookingHandler(booking)}
                  onConfirm={() => confirmBookingHandler(booking)}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyBookingPage;
