import Link from "next/link";

const FEATURES = [
  {
    icon: "🔍",
    title: "Surveillance continue",
    text: "Tender Radar scanne chaque jour les appels d'offres publics : BOAMP pour la France, tenders.guru pour l'Espagne, la Pologne, la Roumanie, la Hongrie et l'Ukraine.",
  },
  {
    icon: "🤖",
    title: "Résumés IA en 3 phrases",
    text: "Fini les cahiers des charges de 40 pages : l'IA extrait l'essentiel — quoi, qui, budget, deadline — et vous dit pour quel profil d'entreprise le marché est pertinent.",
  },
  {
    icon: "🔔",
    title: "Alertes par mots-clés",
    text: "Définissez vos mots-clés et secteurs. Recevez uniquement les marchés qui vous concernent, avant vos concurrents.",
  },
];

const STEPS = [
  { n: "1", title: "Créez vos alertes", text: "Mots-clés + zone géographique, en 30 secondes." },
  { n: "2", title: "Recevez les marchés pertinents", text: "Résumé IA, budget et deadline directement dans votre boîte mail." },
  { n: "3", title: "Répondez avant les autres", text: "Concentrez-vous sur la réponse, pas sur la recherche." },
];

export default function LandingPage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-brand-50 to-slate-50 px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 inline-block rounded-full bg-brand-100 px-4 py-1 text-sm font-medium text-brand-700">
            +1,6 million de marchés publics indexés en France
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Ne ratez plus jamais un <span className="text-brand-600">appel d&apos;offres</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            Chaque année, des milliards d&apos;euros de marchés publics sont attribués.
            Tender Radar les surveille pour vous et vous envoie un résumé IA des
            opportunités qui correspondent à votre activité.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/dashboard"
              className="rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white shadow hover:bg-brand-700"
            >
              Explorer les marchés — gratuit
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-100"
            >
              Voir les tarifs
            </Link>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Sans carte bancaire · 3 alertes gratuites · Données officielles
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-3xl">{feature.icon}</div>
              <h2 className="mt-4 text-lg font-bold">{feature.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center text-3xl font-bold">Comment ça marche</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-xl font-bold text-white">
                  {step.n}
                </div>
                <h3 className="mt-4 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 text-center">
        <h2 className="text-3xl font-bold">
          Un seul marché gagné rembourse des années d&apos;abonnement
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-slate-600">
          Les outils de veille traditionnels coûtent 100 à 300 € par mois. Tender
          Radar démarre gratuitement, puis 49 €/mois.
        </p>
        <Link
          href="/dashboard"
          className="mt-8 inline-block rounded-lg bg-brand-600 px-8 py-3 font-semibold text-white shadow hover:bg-brand-700"
        >
          Commencer maintenant
        </Link>
      </section>
    </div>
  );
}
