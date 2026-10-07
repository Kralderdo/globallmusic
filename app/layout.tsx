import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GlobalMusic — Dünya'nın Müziği Burada",
  description: "Müzik ve video keşif platformu"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
