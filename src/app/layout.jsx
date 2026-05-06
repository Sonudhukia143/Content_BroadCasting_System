import "./globals.css";
import { Providers } from "./providers/Provider.jsx";

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
          {children}
        </Providers>
      </body>
    </html>
  );
}
