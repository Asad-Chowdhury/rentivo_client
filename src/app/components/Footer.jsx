import Link from "next/link";
import {
  FiFacebook,
  FiInstagram,
  FiMail,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";

const usefulLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Cars", href: "/explore-cars" },
  { label: "Add Car", href: "/add-car" },
  { label: "My Bookings", href: "/my-bookings" },
];

const Footer = () => {
  return (
    <footer className="border-t border-base-300 bg-base-200 text-base-content">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-xl font-bold">Rentivo</h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-base-content/70">
            A modern car rental platform for browsing cars, managing listings,
            and keeping every trip organized from one account.
          </p>
          <div className="mt-5 flex gap-2">
            <Link
              href="https://facebook.com"
              className="btn btn-ghost btn-circle btn-sm"
              aria-label="Facebook"
            >
              <FiFacebook size={18} />
            </Link>
            <Link
              href="https://x.com"
              className="btn btn-ghost btn-circle btn-sm"
              aria-label="X"
            >
              <FaXTwitter size={17} />
            </Link>
            <Link
              href="https://instagram.com"
              className="btn btn-ghost btn-circle btn-sm"
              aria-label="Instagram"
            >
              <FiInstagram size={18} />
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold">Useful Links</h3>
          <ul className="mt-3 space-y-2 text-sm text-base-content/70">
            {usefulLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-base-content">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold">Contact Information</h3>
          <ul className="mt-3 space-y-3 text-sm text-base-content/70">
            <li className="flex items-start gap-2">
              <FiMapPin className="mt-0.5 shrink-0 text-primary" size={16} />
              600 Market Street, San Francisco, CA
            </li>
            <li className="flex items-center gap-2">
              <FiPhone className="shrink-0 text-primary" size={16} />
              +1 (415) 555-0198
            </li>
            <li className="flex items-center gap-2">
              <FiMail className="shrink-0 text-primary" size={16} />
              support@rentivo.example
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-base-300 px-4 py-4 text-center text-xs text-base-content/60">
        © 2026 Rentivo. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
