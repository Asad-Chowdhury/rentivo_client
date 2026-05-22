"use client";

import { authClient, getAuthHeaders } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  FiCalendar,
  FiCheck,
  FiCheckCircle,
  FiCreditCard,
  FiEdit3,
  FiLogOut,
  FiMail,
  FiPhone,
  FiPlus,
  FiShield,
  FiStar,
  FiTruck,
  FiUser,
} from "react-icons/fi";

const quickActions = [
  {
    title: "Add a car",
    description: "List a new vehicle for rent",
    href: "/add-car",
    icon: FiPlus,
    tone: "bg-primary/15 text-primary",
  },
  {
    title: "My added cars",
    description: "Manage your listings",
    href: "/my-added-cars",
    icon: FiTruck,
    tone: "bg-emerald-500/15 text-emerald-500",
  },
  {
    title: "My bookings",
    description: "Review rental history",
    href: "/my-bookings",
    icon: FiCalendar,
    tone: "bg-teal-500/15 text-teal-500",
  },
];

const formatDate = (dateValue) => {
  if (!dateValue) return "Not available";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const getInitials = (name = "") => {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return initials || "RU";
};

const getItemId = (item) => {
  if (!item?._id) return "";
  if (typeof item._id === "string") return item._id;
  if (item._id.$oid) return item._id.$oid;

  return String(item._id);
};

const getTotalPrice = (booking) => {
  const price = Number(booking?.totalPrice || booking?.total || 0);
  return Number.isFinite(price) ? price : 0;
};

const ProfilePage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!user?.id) return;

    const loadProfileStats = async () => {
      const authHeaders = await getAuthHeaders();
      const [carsResult, bookingsResult] = await Promise.allSettled([
        fetch(
          `https://rentivo-server-three.vercel.app/car-listing/${user.id}`,
          {
            headers: authHeaders,
          },
        ),
        fetch(`https://rentivo-server-three.vercel.app/booking/${user.id}`, {
          headers: authHeaders,
        }),
      ]);

      if (carsResult.status === "fulfilled" && carsResult.value.ok) {
        const data = await carsResult.value.json();
        setCars(Array.isArray(data) ? data : []);
      }

      if (bookingsResult.status === "fulfilled" && bookingsResult.value.ok) {
        const data = await bookingsResult.value.json();
        setBookings(Array.isArray(data) ? data : []);
      }
    };

    loadProfileStats();
  }, [user?.id]);

  const confirmedBookings = useMemo(
    () =>
      bookings.filter((booking) =>
        ["confirmed", "completed"].includes(
          String(booking.status || "").toLowerCase(),
        ),
      ),
    [bookings],
  );

  const totalEarned = useMemo(
    () =>
      confirmedBookings.reduce(
        (total, booking) => total + getTotalPrice(booking),
        0,
      ),
    [confirmedBookings],
  );

  const completenessItems = [
    { label: "Name and email", complete: Boolean(user?.name && user?.email) },
    { label: "Email verified", complete: Boolean(user?.emailVerified) },
    { label: "Profile photo", complete: Boolean(user?.image) },
    { label: "Phone number", complete: false, badge: "Pending" },
    { label: "ID verification", complete: false, badge: "Pending" },
  ];

  const completeness = Math.round(
    (completenessItems.filter((item) => item.complete).length /
      completenessItems.length) *
      100,
  );

  const notifications = [
    bookings[0]
      ? {
          icon: FiCalendar,
          title: `Booking request for ${bookings[0].carName || "your car"}`,
          detail: "Review the latest booking from your dashboard",
          badge: "New",
        }
      : null,
    cars[0]
      ? {
          icon: FiTruck,
          title: `${cars[0].carName || "Your car"} is listed`,
          detail: cars[0].availabilityStatus || "Available",
          badge: "Live",
        }
      : null,
    {
      icon: FiCheckCircle,
      title: "Profile dashboard is ready",
      detail: "Your account shortcuts are active",
      badge: "Done",
    },
  ].filter(Boolean);

  const recentActivity = [
    bookings[0]
      ? {
          icon: FiCalendar,
          title: `${bookings[0].carName || "Car"} booking created`,
          detail: bookings[0].bookingDate
            ? formatDate(bookings[0].bookingDate)
            : "Recently",
          badge: bookings[0].status || "Pending",
        }
      : null,
    confirmedBookings[0]
      ? {
          icon: FiCheck,
          title: `${confirmedBookings[0].carName || "Booking"} confirmed`,
          detail: confirmedBookings[0].returnDate
            ? `Return date ${formatDate(confirmedBookings[0].returnDate)}`
            : "Confirmed booking",
          badge: "Completed",
        }
      : null,
    cars[0]
      ? {
          icon: FiTruck,
          title: `${cars[0].carName || "Car"} listed`,
          detail: cars[0].pickupLocation || "Pickup location added",
          badge: cars[0].availabilityStatus || "Listed",
        }
      : null,
    {
      icon: FiStar,
      title: "Profile created",
      detail: formatDate(user?.createdAt),
      badge: "Active",
    },
  ].filter(Boolean);

  const signOutHandler = async () => {
    await authClient.signOut();
    router.push("/");
  };

  if (isPending) {
    return (
      <section className="min-h-[calc(100vh-65px)] bg-base-100 px-4 py-10 text-base-content sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-72 max-w-5xl items-center justify-center rounded-lg border border-base-300 bg-base-200">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="min-h-[calc(100vh-65px)] bg-base-100 px-4 py-10 text-base-content sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-lg border border-base-300 bg-base-200 p-8 text-center shadow-sm">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <FiShield size={26} />
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-normal">
            Login required
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-base-content/70">
            Sign in to view your Rentivo profile and account dashboard.
          </p>
          <Link href="/login" className="btn btn-primary mt-6">
            Login
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-65px)] overflow-x-hidden bg-base-100 text-base-content">
      <div className="relative overflow-hidden border-b border-base-300 bg-primary/10">
        <div className="absolute -top-8 left-8 size-28 rounded-full bg-primary/15" />
        <div className="absolute left-[20%] top-14 size-36 rounded-full bg-primary/15" />
        <div className="absolute -top-9 right-[32%] size-44 rounded-full bg-primary/15" />
        <div className="absolute right-10 top-4 size-48 rounded-full bg-primary/15" />
        <div className="relative mx-auto h-32 max-w-7xl sm:h-40" />
      </div>

      <div className="mx-auto max-w-7xl px-3 pb-10 sm:px-6 sm:pb-12 lg:px-8">
        <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex min-w-0 flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:text-left">
            <div className="relative flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-base-100 bg-base-200 text-3xl font-bold text-primary shadow-sm ring-1 ring-base-300 sm:size-32">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User profile"}
                  width={128}
                  height={128}
                  className="size-full object-cover"
                  priority
                />
              ) : (
                getInitials(user.name)
              )}
              <span className="absolute bottom-2 right-2 flex size-7 items-center justify-center rounded-full border-2 border-base-100 bg-primary text-primary-content">
                <FiCheck size={15} />
              </span>
            </div>

            <div className="min-w-0 pb-1">
              <h1 className="break-words text-2xl font-bold tracking-normal sm:text-3xl">
                {user.name || "Rentivo User"}
              </h1>
              <p className="mt-1 flex min-w-0 items-center justify-center gap-2 break-all text-sm text-base-content/70 sm:justify-start">
                <FiMail className="shrink-0" size={15} />
                {user.email || "No email added"}
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                <span className="badge border-primary/20 bg-primary/10 text-primary">
                  <FiShield size={13} />
                  {user.emailVerified ? "Verified member" : "Member"}
                </span>
                <span className="badge border-base-300 bg-base-200 text-base-content/70">
                  Joined {formatDate(user.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <button type="button" className="btn btn-outline w-full sm:w-auto">
              <FiEdit3 size={17} />
              Edit profile
            </button>
            <button
              type="button"
              className="btn btn-outline w-full sm:w-auto"
              onClick={signOutHandler}
            >
              <FiLogOut size={17} />
              Logout
            </button>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <div className="rounded-lg border border-base-300 bg-base-200 p-4 shadow-sm sm:p-5">
            <FiTruck className="text-primary" size={22} />
            <p className="mt-4 break-words text-2xl font-bold sm:mt-5 sm:text-3xl">{cars.length}</p>
            <p className="text-sm text-base-content/70">Cars listed</p>
          </div>
          <div className="rounded-lg border border-base-300 bg-base-200 p-4 shadow-sm sm:p-5">
            <FiCalendar className="text-emerald-500" size={22} />
            <p className="mt-4 break-words text-2xl font-bold sm:mt-5 sm:text-3xl">{bookings.length}</p>
            <p className="text-sm text-base-content/70">Total bookings</p>
          </div>
          <div className="rounded-lg border border-base-300 bg-base-200 p-4 shadow-sm sm:p-5">
            <FiStar className="text-teal-500" size={22} />
            <p className="mt-4 break-words text-2xl font-bold sm:mt-5 sm:text-3xl">4.9</p>
            <p className="text-sm text-base-content/70">Avg. rating</p>
          </div>
          <div className="rounded-lg border border-base-300 bg-base-200 p-4 shadow-sm sm:p-5">
            <FiCreditCard className="text-primary" size={22} />
            <p className="mt-4 break-words text-2xl font-bold sm:mt-5 sm:text-3xl">${totalEarned}</p>
            <p className="text-sm text-base-content/70">Total earned</p>
          </div>
        </div>

        <div className="mt-5 grid min-w-0 gap-5 lg:grid-cols-[1.25fr_0.8fr]">
          <div className="space-y-5">
            <div className="rounded-lg border border-base-300 bg-base-200 p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-bold">Account information</h2>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm text-primary"
                >
                  <FiEdit3 size={15} />
                  Edit
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="min-w-0 rounded-lg bg-base-100 p-4">
                  <p className="text-xs text-base-content/60">Full name</p>
                  <p className="mt-2 flex min-w-0 items-center gap-2 break-words font-semibold">
                    <FiUser
                      className="shrink-0 text-base-content/50"
                      size={15}
                    />
                    {user.name || "Rentivo User"}
                  </p>
                </div>
                <div className="min-w-0 rounded-lg bg-base-100 p-4">
                  <p className="text-xs text-base-content/60">Email address</p>
                  <p className="mt-2 flex min-w-0 items-center gap-2 break-all font-semibold">
                    <FiMail
                      className="shrink-0 text-base-content/50"
                      size={15}
                    />
                    {user.email || "No email added"}
                  </p>
                </div>
                <div className="min-w-0 rounded-lg bg-base-100 p-4">
                  <p className="text-xs text-base-content/60">
                    Account created
                  </p>
                  <p className="mt-2 flex min-w-0 items-center gap-2 break-words font-semibold">
                    <FiCalendar
                      className="shrink-0 text-base-content/50"
                      size={15}
                    />
                    {formatDate(user.createdAt)}
                  </p>
                </div>
                <div className="min-w-0 rounded-lg bg-base-100 p-4">
                  <p className="text-xs text-base-content/60">Email status</p>
                  <span className="badge mt-2 border-primary/20 bg-primary/10 text-primary">
                    <FiCheckCircle size={13} />
                    {user.emailVerified ? "Verified" : "Not verified"}
                  </span>
                </div>
                <div className="min-w-0 rounded-lg bg-base-100 p-4 sm:col-span-2">
                  <p className="text-xs text-base-content/60">User ID</p>
                  <p className="mt-2 break-all font-mono text-sm font-semibold">
                    {user.id || "Not available"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-base-300 bg-base-200 p-4 shadow-sm sm:p-5">
              <h2 className="font-bold">Quick actions</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;

                  return (
                    <Link
                      key={action.href}
                      href={action.href}
                      className="group min-w-0 rounded-lg bg-base-100 p-4 transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <span
                        className={`flex size-10 items-center justify-center rounded-lg ${action.tone}`}
                      >
                        <Icon size={20} />
                      </span>
                      <h3 className="mt-6 break-words font-bold leading-tight sm:mt-8">
                        {action.title}
                      </h3>
                      <p className="mt-1 text-sm leading-5 text-base-content/70">
                        {action.description}
                      </p>
                      <span className="mt-4 block text-lg text-base-content/60 transition group-hover:text-primary">
                        →
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg border border-base-300 bg-base-200 p-4 shadow-sm sm:p-5">
              <h2 className="font-bold">Recent activity</h2>
              <div className="mt-4 divide-y divide-base-300">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon;
                  const key = `${activity.title}-${activity.badge}`;

                  return (
                    <div
                      key={key}
                      className="flex flex-col items-start justify-between gap-3 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:gap-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon size={18} />
                        </span>
                        <div className="min-w-0">
                          <p className="break-words font-semibold sm:truncate">
                            {activity.title}
                          </p>
                          <p className="break-words text-sm text-base-content/60 sm:truncate">
                            {activity.detail}
                          </p>
                        </div>
                      </div>
                      <span className="badge max-w-full shrink-0 whitespace-normal border-primary/20 bg-primary/10 text-primary">
                        {activity.badge}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="min-w-0 space-y-5">
            <div className="rounded-lg border border-base-300 bg-base-200 p-4 shadow-sm sm:p-5">
              <h2 className="font-bold">Profile completeness</h2>
              <p className="mt-1 text-sm text-base-content/70">
                Add more info to increase trust with renters.
              </p>
              <progress
                className="progress progress-primary mt-5 w-full"
                value={completeness}
                max="100"
              />
              <div className="mt-1 flex justify-between text-xs text-base-content/60">
                <span>{completeness}% complete</span>
                <span>100%</span>
              </div>
              <div className="mt-4 space-y-3 text-sm">
                {completenessItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start justify-between gap-3"
                  >
                    <span className="flex min-w-0 items-start gap-2 text-base-content/75">
                      <FiCheckCircle
                        className={`shrink-0 ${item.complete ? "text-primary" : ""}`}
                        size={15}
                      />
                      {item.label}
                    </span>
                    {item.complete ? (
                      <FiCheckCircle
                        className="shrink-0 text-primary"
                        size={16}
                      />
                    ) : (
                      <span className="badge badge-sm shrink-0 border-primary/20 bg-primary/10 text-primary">
                        {item.badge || "Add"}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-base-300 bg-base-200 p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-bold">Notifications</h2>
                <span className="badge border-primary/20 bg-primary/10 text-primary">
                  {notifications.length} new
                </span>
              </div>
              <div className="divide-y divide-base-300">
                {notifications.map((notification) => {
                  const Icon = notification.icon;

                  return (
                    <div
                      key={`${notification.title}-${notification.badge}`}
                      className="flex min-w-0 gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon size={18} />
                      </span>
                      <div className="min-w-0">
                        <p className="break-words font-semibold leading-5">
                          {notification.title}
                        </p>
                        <p className="mt-1 break-words text-sm text-base-content/60">
                          {notification.detail}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg border border-base-300 bg-base-200 p-4 shadow-sm sm:p-5">
              <h2 className="font-bold">Contact status</h2>
              <div className="mt-4 space-y-3 text-sm text-base-content/75">
                <p className="flex items-center gap-2 break-words">
                  <FiMail className="shrink-0 text-primary" size={16} />
                  Email connected
                </p>
                <p className="flex items-center gap-2 break-words">
                  <FiPhone
                    className="shrink-0 text-base-content/40"
                    size={16}
                  />
                  Phone number not added
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-base-300 bg-base-200 p-4 shadow-sm sm:p-5">
              <h2 className="font-bold">Danger zone</h2>
              <button
                type="button"
                className="btn btn-outline mt-4 h-auto min-h-12 w-full whitespace-normal"
                onClick={signOutHandler}
              >
                <FiLogOut size={17} />
                Sign out of account
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
