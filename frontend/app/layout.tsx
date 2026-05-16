import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FormCraft – Dynamic Form Builder",
  description: "Create and manage custom forms",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
