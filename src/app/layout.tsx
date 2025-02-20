import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { Toaster } from "react-hot-toast";
// import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Phantom.js",
  description: "The best Starter kit for Next.js",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <Toaster position="top-center" />
        {/* <Navbar /> */}
        {children}
      </body>
    </html>
  );
}
