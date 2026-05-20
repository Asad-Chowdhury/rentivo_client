import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Project Initialized",
  description: "Next.js starter cleaned and theme system prepared.",
};

const themeInitScript = `
  (() => {
    try {
      const storedTheme = localStorage.getItem("theme");
      const theme = storedTheme === "light" || storedTheme === "dark" ? storedTheme : "dark";
      document.documentElement.setAttribute("data-theme", theme);
    } catch {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  })();
`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <header>
          <Navbar></Navbar>
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
