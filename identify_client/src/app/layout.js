import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "./components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NextJS Demo App",
  description: "A demo application with Next.js, Tailwind, and more",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gray-900 text-gray-100 min-h-screen`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
