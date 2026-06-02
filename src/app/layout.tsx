import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import "./globals.css";

// Police athlétique condensée pour les titres (reco ui-ux-pro-max : sport/fitness)
const fontHeading = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-heading",
});

// Police de texte propre et lisible
const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "DietZone — Nutrition sportive à La Réunion",
    template: "%s | DietZone",
  },
  description:
    "Boutique de nutrition sportive à St-Denis (974). Protéines, créatine, pre-workout. Livraison sur toute l’île et retrait magasin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${fontHeading.variable} ${fontSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white font-sans text-neutral-900">
        {children}
      </body>
    </html>
  );
}
