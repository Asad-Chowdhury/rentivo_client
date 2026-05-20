"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiAlertTriangle} from "react-icons/fi";

export default function Error() {

  return (
    <motion.section
      className="flex min-h-[calc(100vh-65px)] items-center justify-center bg-base-100 px-6 py-16 text-base-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <motion.div
        className="w-full max-w-lg text-center"
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
      >
        <motion.div
          className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-error/10 text-error"
          initial={{ scale: 0.85 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 18 }}
        >
          <FiAlertTriangle size={28} />
        </motion.div>

        <h1 className="text-3xl font-bold tracking-tight">
          404 : Page Not Found
        </h1>
        <p className="mt-3 text-base text-base-content/70">
          We could not load this page. Try again, or return home.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link href="/" className="btn btn-outline">
              Go home
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
}
