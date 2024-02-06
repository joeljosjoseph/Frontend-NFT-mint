"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { NftProvider } from "@/components/NftContext/NftContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NftProvider>{children}</NftProvider>
      </body>
    </html>
  );
}
