import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "FIT PULSE | Transforme seus Dados em Resultados",
  description:
    "FIT PULSE é a sua plataforma inteligente de análise de saúde. Calcule seu IMC, acompanhe previsões de evolução e monitore sua performance física com tecnologia de ponta.",
  keywords: [
    "fitness",
    "IMC",
    "saúde",
    "performance",
    "FIT PULSE",
    "calculadora fitness",
    "previsão corporal",
  ],
  authors: [{ name: "Fit Pulse Team", url: "https://fitpulse.vercel.app" }],
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "FIT PULSE — Análises de saúde inteligentes",
    description:
      "Acompanhe sua evolução física com precisão. Calcule seu IMC e visualize o futuro da sua saúde com o FIT PULSE.",
    url: "https://fitpulse.vercel.app",
    siteName: "Fit Pulse",
    images: [
      {
        url: "/banner-fit-pulse.png",
        width: 1200,
        height: 630,
        alt: "Banner FIT PULSE — Monitoramento de Saúde Inteligente",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FIT PULSE — Evolução Constante",
    description:
      "Tecnologia e dados a serviço do seu corpo. Calcule seu IMC e receba previsões reais no FIT PULSE.",
    images: ["/banner-fit-pulse.png"],
  },
  metadataBase: new URL("https://fitpulse.vercel.app"),
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
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
      <body className="page">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}