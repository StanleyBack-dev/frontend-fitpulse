import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PULSE",
  description: "A rede ao vivo de networking para eventos e conexões reais.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="page">{children}</body>
    </html>
  );
}