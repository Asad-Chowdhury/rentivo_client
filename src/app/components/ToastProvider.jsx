"use client";

import { Bounce, ToastContainer } from "@contentstack/react-toastify";

const ToastProvider = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={2500}
      newestOnTop
      closeOnClick
      pauseOnFocusLoss={false}
      pauseOnHover={false}
      transition={Bounce}
    />
  );
};

export default ToastProvider;
