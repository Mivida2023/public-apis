import Link from "next/link";
import { notFound } from "next/navigation";
import { getTender } from "@/lib/sources";
import { summarizeTender } from "@/lib/ai/summarize";
import { COUNTRY_LABELS, CountryCode } from "@/lib/types";

export const dynamic = "force-dynamic";

const VALID_COUNTRIES = new Set(["fr", "es", "pl", "ro", "hu", "ua"]);

function formatDate(iso?: string): string {
  if (!iso) return "Non précisée";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function TenderDetailPage({
  params,
}: {
  params: { country: string; id: string };
}) {
  if (!VALID_COUNTRIES.has(params.country)) notFound();

  const tender = await getTender(
    params.country as CountryCode,
    decodeURIComponent(params.id)
  );
  if (!tender) notFound();

  const summary = await summarizeTender(tender);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/dashboard" className="text-sm text-brand-600 hover:underline">
        ← Retour à la recherche
      </Link>

      <h1 className="mt-4 text-2xl font-bold">{tender.title}</h1>
      <p className="mt-2 text-slate-600">{tender.buyer}</p>

      <div className="mt-6 rounded-xl border border-brand-100 bg-brand-50 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-brand-900">
            {summary.engine === "ai" ? "🤖 Résumé IA" : "📋 Synthèse"}
          </h2>
          {summary.engine === "extractive" && (
            <span className="text-xs text-slate-500">
              (résumé IA disponible avec une clé API — voir README)
            </span>
          )}
        </div>
        <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-800">
          {summary.text}
        </p>
      </div>

      <dl className="mt-6 grid gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase text-slate-500">Pays</dt>
          <dd className="mt-1">{COUNTRY_LABELS[tender.country]}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase text-slate-500">
            Date limite de réponse
          </dt>
          <dd className="mt-1 font-semibold text-red-600">
            {formatDate(tender.deadline)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase text-slate-500">Publication</dt>
          <dd className="mt-1">{formatDate(tender.publishedAt)}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase text-slate-500">Procédure</dt>
          <dd className="mt-1">{tender.procedureType ?? "Non précisée"}</dd>
        </div>
        {tender.budget && (
          <div>
            <dt className="text-xs font-medium uppercase text-slate-500">
              Budget / tranche
            </dt>
            <dd className="mt-1">{tender.budget}</dd>
          </div>
        )}
        {tender.category && (
          <div>
            <dt className="text-xs font-medium uppercase text-slate-500">Domaine</dt>
            <dd className="mt-1">{tender.category}</dd>
          </div>
        )}
        {tender.departments && tender.departments.length > 0 && (
          <div>
            <dt className="text-xs font-medium uppercase text-slate-500">
              Département(s)
            </dt>
            <dd className="mt-1">{tender.departments.join(", ")}</dd>
          </div>
        )}
      </dl>

      {tender.description && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold">Description</h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">
            {tender.description}
          </p>
        </div>
      )}

      <a
        href={tender.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700"
      >
        Consulter l&apos;avis officiel ↗
      </a>
    </div>
  );
}
