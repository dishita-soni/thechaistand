import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Chai Stand",
  description: "HGR updates - formally documented"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body>
    <header style={{ padding: 20 }}>
        <h1>The Chai Stand</h1>
    </header>

    <main>{children}</main>

    <footer style={{ padding: 20 }}>
        © 2026 The Chai Stand
    </footer>
    </body>
  );
}
