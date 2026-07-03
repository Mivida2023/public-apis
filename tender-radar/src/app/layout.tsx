import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tender Radar — Veille d'appels d'offres publics avec résumés IA",
  description:
    "Ne ratez plus aucun marché public. Tender Radar surveille les appels d'offres (France, Espagne, Pologne…) et vous alerte avec un résumé IA en 3 phrases.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <header className="border-b border-slate-200 bg-white">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-xl font-bold text-brand-700">
              📡 Tender Radar
            </Link>
            <div className="flex items-center gap-6 text-sm font-medium">
              <Link href="/dashboard" className="text-slate-600 hover:text-brand-600">
                Rechercher
              </Link>
              <Link href="/pricing" className="text-slate-600 hover:text-brand-600">
                Tarifs
              </Link>
              <Link
                href="/dashboard"
                className="rounded-lg bg-brand-600 px-4 py-2 text-white hover:bg-brand-700"
              >
                Essayer gratuitement
              </Link>
            </div>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="mt-16 border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
          <p>
            Tender Radar — données publiques BOAMP (data.gouv.fr) &amp; tenders.guru ·
            Résumés générés par IA
          </p>
        </footer>
      </body>
    </html>
  );
}
