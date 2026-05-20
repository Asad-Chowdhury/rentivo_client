"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <section className="flex min-h-[calc(100vh-65px)] items-center justify-center bg-base-100 px-6 py-16 text-base-content">
      <div className="w-full max-w-lg space-y-6 text-center">
        <motion.div
          className="mx-auto size-12 rounded-full border-4 border-primary/20 border-t-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          aria-label="Loading"
        />

        <div className="space-y-3">
          <motion.div
            className="mx-auto h-8 w-64 max-w-full rounded bg-base-300"
            animate={{ opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="mx-auto h-4 w-80 max-w-full rounded bg-base-300"
            animate={{ opacity: [0.35, 0.85, 0.35] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.12,
            }}
          />
        </div>
      </div>
    </section>
  );
}
