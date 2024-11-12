import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "./components/navbar";
import { AuthProvider } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "IDentify",
  description: "Join our community and get your mystery objects identified",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gray-900 text-gray-100 min-h-screen`}
      >
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="bg-gray-800 py-4">
              <div className="container mx-auto px-4 text-center text-gray-400">
                © 2024 IDentify.
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
