import Link from "next/link";

const PRO_LINK = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_PRO || "#";
const BUSINESS_LINK = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_BUSINESS || "#";

const PLANS = [
  {
    name: "Découverte",
    price: "0 €",
    period: "pour toujours",
    cta: { label: "Commencer", href: "/dashboard", external: false },
    highlight: false,
    features: [
      "Recherche illimitée dans tous les pays",
      "3 alertes par mots-clés",
      "Synthèses automatiques",
      "Accès aux avis officiels",
    ],
  },
  {
    name: "Pro",
    price: "49 €",
    period: "/ mois HT",
    cta: { label: "S'abonner", href: PRO_LINK, external: true },
    highlight: true,
    features: [
      "Tout le plan Découverte",
      "Alertes illimitées",
      "Résumés IA complets (« Pertinent si… »)",
      "Alertes email quotidiennes",
      "Support prioritaire",
    ],
  },
  {
    name: "Business",
    price: "99 €",
    period: "/ mois HT",
    cta: { label: "S'abonner", href: BUSINESS_LINK, external: true },
    highlight: false,
    features: [
      "Tout le plan Pro",
      "5 utilisateurs",
      "Analyse de pertinence sur mesure",
      "Export CSV / intégration CRM",
      "Accompagnement à la réponse",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-center text-4xl font-extrabold">Tarifs simples et sans engagement</h1>
      <p className="mx-auto mt-4 max-w-xl text-center text-slate-600">
        Un seul marché gagné rembourse des années d&apos;abonnement. Les solutions de
        veille traditionnelles facturent 100 à 300 €/mois.
      </p>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col rounded-2xl border bg-white p-6 shadow-sm ${
              plan.highlight ? "border-brand-600 ring-2 ring-brand-600" : "border-slate-200"
            }`}
          >
            {plan.highlight && (
              <span className="mb-3 self-start rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
                Le plus populaire
              </span>
            )}
            <h2 className="text-lg font-bold">{plan.name}</h2>
            <p className="mt-2">
              <span className="text-4xl font-extrabold">{plan.price}</span>{" "}
              <span className="text-sm text-slate-500">{plan.period}</span>
            </p>
            <ul className="mt-6 flex-1 space-y-2 text-sm text-slate-700">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <span className="text-brand-600">✓</span> {feature}
                </li>
              ))}
            </ul>
            {plan.cta.external ? (
              <a
                href={plan.cta.href}
                className={`mt-6 rounded-lg px-4 py-2.5 text-center font-semibold ${
                  plan.highlight
                    ? "bg-brand-600 text-white hover:bg-brand-700"
                    : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {plan.cta.label}
              </a>
            ) : (
              <Link
                href={plan.cta.href}
                className="mt-6 rounded-lg border border-slate-300 px-4 py-2.5 text-center font-semibold text-slate-700 hover:bg-slate-50"
              >
                {plan.cta.label}
              </Link>
            )}
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-slate-500">
        Paiement sécurisé par Stripe. Les boutons « S&apos;abonner » sont activés via
        les variables NEXT_PUBLIC_STRIPE_PAYMENT_LINK_* (voir README).
      </p>
    </div>
  );
}
