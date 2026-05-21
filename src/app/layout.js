import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@contentstack/react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ToastProvider from "./components/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Rentivo | Car Rental Platform",
  description: "Explore, book, and manage rental cars with Rentivo.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <header>
          <Navbar></Navbar>
        </header>
        <main>{children}</main>
        <Footer />
        <ToastProvider />
      </body>
    </html>
  );
}
