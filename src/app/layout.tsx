import type { Metadata } from "next";
import "./globals.css";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import PasswordGate from "../components/PasswordGate";

export const metadata: Metadata = {
  title: "The Chai Stand",
  description: "HGR updates - formally documented",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <PasswordGate>
          <NavBar />
          <main>{children}</main>
          <Footer />
        </PasswordGate>
      </body>
    </html>
  );
}