import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Big Ticket — Product Discovery",
  description: "An AI buyer, merchandiser, and curator that finds products worth owning.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
