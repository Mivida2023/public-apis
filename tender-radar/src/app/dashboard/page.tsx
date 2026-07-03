"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { COUNTRY_LABELS, Tender, TenderSearchResult } from "@/lib/types";

const COUNTRIES = Object.entries(COUNTRY_LABELS) as Array<
  [keyof typeof COUNTRY_LABELS, string]
>;

function formatDate(iso?: string): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("fr-FR");
}

function AlertForm({ defaultKeywords, country }: { defaultKeywords: string; country: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    | { kind: "idle" }
    | { kind: "loading" }
    | { kind: "success" }
    | { kind: "limit"; message: string }
    | { kind: "error"; message: string }
  >({ kind: "idle" });

  async function submit(event: FormEvent) {
    event.preventDefault();
    setStatus({ kind: "loading" });
    const response = await fetch("/api/alerts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, keywords: defaultKeywords, country }),
    });
    if (response.status === 201) {
      setStatus({ kind: "success" });
      return;
    }
    const data = await response.json().catch(() => ({ error: "Erreur inconnue" }));
    if (response.status === 402) {
      setStatus({ kind: "limit", message: data.error });
    } else {
      setStatus({ kind: "error", message: data.error ?? "Erreur inconnue" });
    }
  }

  if (status.kind === "success") {
    return (
      <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
        ✅ Alerte créée pour « {defaultKeywords} ». Vous serez notifié des nouveaux
        marchés correspondants.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-center gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="votre@email.fr"
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={status.kind === "loading" || !defaultKeywords}
        className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
      >
        {status.kind === "loading" ? "Création…" : "🔔 M'alerter sur cette recherche"}
      </button>
      {status.kind === "limit" && (
        <span className="text-sm text-amber-700">
          {status.message}{" "}
          <Link href="/pricing" className="font-semibold underline">
            Passer au plan Pro →
          </Link>
        </span>
      )}
      {status.kind === "error" && (
        <span className="text-sm text-red-600">{status.message}</span>
      )}
      {!defaultKeywords && (
        <span className="text-xs text-slate-500">
          Lancez d&apos;abord une recherche par mots-clés.
        </span>
      )}
    </form>
  );
}

export default function DashboardPage() {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState<string>("fr");
  const [searched, setSearched] = useState({ q: "", country: "fr" });
  const [result, setResult] = useState<TenderSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSearch = useCallback(async (q: string, c: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ country: c });
      if (q) params.set("q", q);
      const response = await fetch(`/api/tenders?${params}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data: TenderSearchResult = await response.json();
      setResult(data);
      setSearched({ q, country: c });
    } catch {
      setError("Impossible de charger les appels d'offres. Réessayez.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    runSearch("", "fr");
  }, [runSearch]);

  function submit(event: FormEvent) {
    event.preventDefault();
    runSearch(query.trim(), country);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Rechercher des appels d&apos;offres</h1>
      <p className="mt-2 text-slate-600">
        Données officielles en temps réel — BOAMP (France) et tenders.guru (Europe).
      </p>

      <form onSubmit={submit} className="mt-6 flex flex-wrap gap-3">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ex. : informatique, bâtiment, formation, nettoyage…"
          className="min-w-64 flex-1 rounded-lg border border-slate-300 px-4 py-2.5"
        />
        <select
          value={country}
          onChange={(event) => setCountry(event.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5"
        >
          {COUNTRIES.map(([code, label]) => (
            <option key={code} value={code}>
              {label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-brand-600 px-6 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {loading ? "Recherche…" : "Rechercher"}
        </button>
      </form>

      <div className="mt-4 rounded-xl border border-brand-100 bg-brand-50 p-4">
        <AlertForm defaultKeywords={searched.q} country={searched.country} />
      </div>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">{error}</p>
      )}

      {result && !error && (
        <div className="mt-6">
          <p className="text-sm text-slate-500">
            {result.totalCount.toLocaleString("fr-FR")} marché(s) trouvé(s)
            {result.unavailableSources.length > 0 && (
              <span className="ml-2 text-amber-600">
                (source {result.unavailableSources.join(", ")} momentanément
                indisponible)
              </span>
            )}
          </p>
          <ul className="mt-4 space-y-4">
            {result.tenders.map((tender: Tender) => (
              <li
                key={`${tender.country}-${tender.id}`}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-500"
              >
                <Link href={`/tenders/${tender.country}/${encodeURIComponent(tender.id)}`}>
                  <h2 className="font-semibold text-brand-700 hover:underline">
                    {tender.title}
                  </h2>
                </Link>
                <p className="mt-1 text-sm text-slate-600">{tender.buyer}</p>
                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-500">
                  <span>📅 Publié : {formatDate(tender.publishedAt)}</span>
                  <span className="font-medium text-red-600">
                    ⏳ Limite : {formatDate(tender.deadline)}
                  </span>
                  {tender.budget && <span>💰 {tender.budget}</span>}
                  <span>🌍 {COUNTRY_LABELS[tender.country]}</span>
                </div>
              </li>
            ))}
          </ul>
          {result.tenders.length === 0 && result.unavailableSources.length === 0 && (
            <p className="mt-6 text-slate-500">
              Aucun marché ne correspond à cette recherche.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
