import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PCC Network",
  description: "Proof of Counterfactual Contribution"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}