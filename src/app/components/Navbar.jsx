"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiMenu, FiUser } from "react-icons/fi";
import logo from "../../../public/assets/rentivo-logo.png";
import ThemeSwitcher from "./ThemeSwitcher";
import { authClient } from "@/lib/auth-client";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Cars", href: "/explore-cars" },
  { label: "Add Car", href: "/add-car", authRequired: true },
  { label: "My Bookings", href: "/my-bookings", authRequired: true },
  { label: "My Added Cars", href: "/my-added-cars", authRequired: true },
];

const profileLinks = [
  { label: "Profile", href: "/profile" },
  { label: "Add Car", href: "/add-car" },
  { label: "My Added Cars", href: "/my-added-cars" },
  { label: "My Bookings", href: "/my-bookings" },
];

const Logo = ({ className = "" }) => {
  return (
    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
      <Link href="/" className={`block ${className}`} aria-label="Rentivo home">
        <Image src={logo} alt="Rentivo" height={25} width={150} />
      </Link>
    </motion.div>
  );
};

const ProfileDropdown = ({ session }) => {
  const logOutHandler = async () => {
    await authClient.signOut();
  };

  return (
    <div className="dropdown dropdown-end">
      <motion.button
        tabIndex={0}
        type="button"
        className="btn btn-ghost btn-circle"
        aria-label="Open user menu"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
      >
        <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-content overflow-hidden cursor-pointer">
          {session?.user?.image ? (
            <Image
              width={40}
              height={40}
              src={session.user.image}
              alt={session.user.name || "User"}
              className="size-10 rounded-full object-cover"
            />
          ) : (
            <FiUser size={20} />
          )}
        </span>
      </motion.button>

      <ul
        tabIndex={0}
        className="menu dropdown-content z-50 mt-3 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow"
      >
        {profileLinks.map((link) => (
          <motion.li
            key={link.href}
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            <Link href={link.href}>{link.label}</Link>
          </motion.li>
        ))}
        <motion.li
          whileHover={{ x: 4 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
        >
          <button type="button" onClick={logOutHandler}>
            Logout
          </button>
        </motion.li>
      </ul>
    </div>
  );
};

const Navbar = () => {
  const { data: session, isPending } = authClient.useSession();
  const isLoggedIn = Boolean(session?.user);
  const visibleNavLinks = isLoggedIn
    ? navLinks
    : navLinks.filter((link) => !link.authRequired);

  return (
    <motion.nav
      className="navbar sticky top-0 z-50 border-b border-base-300 bg-base-100/95 px-4 shadow-sm backdrop-blur lg:px-8"
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      <div className="navbar-start">
        <div className="dropdown lg:hidden">
          <motion.button
            tabIndex={0}
            type="button"
            className="btn btn-ghost btn-circle"
            aria-label="Open navigation menu"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
          >
            <FiMenu size={22} />
          </motion.button>
          <ul
            tabIndex={0}
            className="menu dropdown-content menu-sm z-50 mt-3 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow"
          >
            {visibleNavLinks.map((link) => (
              <motion.li
                key={link.href}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              >
                <Link href={link.href}>{link.label}</Link>
              </motion.li>
            ))}
          </ul>
        </div>

        <Logo className="hidden lg:block" />
      </div>

      <div className="navbar-center">
        <Logo className="lg:hidden" />

        <div className="hidden lg:flex">
          <ul className="menu menu-horizontal gap-1 px-1">
            {visibleNavLinks.map((link) => (
              <motion.li
                key={link.href}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link href={link.href}>{link.label}</Link>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      <div className="navbar-end gap-2">
        <ThemeSwitcher />

        {isPending ? null : isLoggedIn ? (
          <ProfileDropdown session={session} />
        ) : (
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <div className="flex gap-5">
              <Link href="/login" className="btn btn-primary btn-sm sm:btn-md">
                Login
              </Link>
              <Link
                href="/register"
                className="btn btn-primary btn-sm sm:btn-md"
              >
                Register
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
