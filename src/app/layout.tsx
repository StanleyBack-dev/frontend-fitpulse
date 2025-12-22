import "./globals.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "PULSE | Conecte. Explore. Cresça.",
  description:
    "PULSE é a rede ao vivo de networking para eventos e conexões reais. Descubra pessoas, ideias e oportunidades em tempo real.",
  keywords: ["networking", "eventos", "conexões", "PULSE", "profissional", "social"],
  authors: [{ name: "PULSE Team", url: "https://iopulse.vercel.app" }],
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "PULSE — Conecte. Explore. Cresça.",
    description:
      "Transforme cada evento em uma experiência de conexões reais. Junte-se ao PULSE, a rede ao vivo de networking para o futuro.",
    url: "https://iopulse.vercel.app",
    siteName: "PULSE",
    images: [
      {
        url: "/banner-pulse.png",
        width: 1200,
        height: 630,
        alt: "Banner PULSE — A rede ao vivo de networking",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PULSE — A rede ao vivo de networking",
    description:
      "Conecte-se em tempo real com profissionais e oportunidades. O futuro do networking começa com um pulso.",
    images: ["/banner-pulse.png"],
  },
  metadataBase: new URL("https://iopulse.vercel.app"),
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0a0015",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="page">{children}</body>
    </html>
  );
}