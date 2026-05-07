import Link from "next/link";
import "./globals.css";
import { Providers } from "./providers/Provider.jsx";
import { Navbar } from "@/components/Navbar";

export const metadata = {
  title: "Content Broadcasting System",
  description: "Educational content broadcasting platform",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <Providers>

          <div className="flex py-4">
            <Link href="/" className="flex items-center space-x-2 mx-auto mt-5">
              <span className="font-bold text-xl">Home</span>
            </Link>
            <Link href="/live/teacher2" className="flex items-center space-x-2 mx-auto mt-5">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="font-bold text-blue-600">LB</span>
              </div>
              <span className="font-bold text-xl">Teacher2</span>
            </Link>
            <Link href="/live/teacher1" className="flex items-center space-x-2 mx-auto mt-5">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="font-bold text-blue-600">LB</span>
              </div>
              <span className="font-bold text-xl">Teacher1</span>
            </Link>
          </div>

          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
