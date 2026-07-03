# 📡 Tender Radar

**Veille d'appels d'offres publics avec résumés IA** — micro-SaaS B2B construit
uniquement sur des APIs gratuites de la liste [public-apis](../README.md).

Une PME choisit ses mots-clés → Tender Radar scanne les marchés publics
(France + Europe) → l'IA résume chaque opportunité (quoi, qui, budget,
deadline, « pertinent si… ») → alerte email.

## Pourquoi cette app est la plus monétisable

- **B2B avec vraie douleur** : rater un marché public = perte directe de chiffre
  d'affaires. Les concurrents (Vecteur Plus, France Marchés…) facturent
  100–300 €/mois — un positionnement à 49–99 €/mois est très compétitif.
- **Donnée 100 % gratuite** : BOAMP/data.gouv.fr (France, ~1,7 M d'avis) et
  tenders.guru (ES/PL/RO/HU/UA), sans clé d'API. Marge quasi totale.
- **Tendance 2026** : les micro-SaaS verticaux dopés à l'IA sont la catégorie
  qui monétise le plus vite (abonnement Stripe, freemium).

## Lancement local

```bash
cd tender-radar
npm install
npm run dev        # http://localhost:3000
```

Aucune clé nécessaire pour démarrer : la recherche interroge les APIs
publiques en direct et les fiches détail utilisent une synthèse extractive.

## Variables d'environnement (`.env.local`)

Copiez `.env.example` :

| Variable | Rôle |
|---|---|
| `ANTHROPIC_API_KEY` | Active les vrais résumés IA (sinon fallback extractif) |
| `ANTHROPIC_MODEL` | Modèle utilisé (défaut : `claude-haiku-4-5-20251001`) |
| `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_PRO` | URL du Payment Link Stripe du plan Pro (49 €/mois) |
| `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_BUSINESS` | URL du Payment Link Stripe du plan Business (99 €/mois) |

## Architecture

```
src/
  app/
    page.tsx                     # Landing page de vente (FR)
    dashboard/page.tsx           # Recherche + création d'alertes
    tenders/[country]/[id]/      # Fiche détail + résumé IA
    pricing/page.tsx             # Pricing 0/49/99 € (Stripe Payment Links)
    api/
      tenders/                   # GET recherche (q, country, page)
      tenders/[country]/[id]/    # GET détail + résumé
      alerts/                    # POST création (gating freemium : 3 max)
  lib/
    sources/boamp.ts             # France — BOAMP via opendatasoft (gratuit)
    sources/tendersguru.ts       # ES/PL/RO/HU/UA — tenders.guru (gratuit)
    sources/index.ts             # Agrégateur avec dégradation gracieuse
    ai/summarize.ts              # Résumé Claude + fallback extractif
    alerts/store.ts              # Stockage JSON (MVP) → Supabase en prod
```

## Monétisation (freemium, prête à brancher)

1. **Gratuit** : recherche illimitée, 3 alertes max (gating appliqué par
   `POST /api/alerts` → HTTP 402 + lien vers `/pricing`).
2. **Pro 49 €/mois** / **Business 99 €/mois** : créez deux
   [Payment Links Stripe](https://dashboard.stripe.com/payment-links) et collez
   les URLs dans les variables d'env — les boutons de `/pricing` pointent dessus.

## Roadmap de mise en production

1. **Persistance** : remplacer `lib/alerts/store.ts` par Supabase (le FS de
   Vercel est éphémère) — table `alerts(id, email, keywords, country, created_at)`.
2. **Envoi d'emails** : cron quotidien (Vercel Cron) qui rejoue chaque alerte
   contre `searchTenders` et envoie les nouveautés (Resend/Mailjet).
3. **Auth** : magic link (Supabase Auth) + statut d'abonnement via webhook Stripe.
4. **Couverture** : ajouter TED (appels d'offres UE) et AWS PLACE.

## Notes

- tenders.guru peut être injoignable depuis certains réseaux : l'app le signale
  (« source momentanément indisponible ») sans casser la recherche France.
- Sources de données : [BOAMP sur data.gouv.fr](https://www.data.gouv.fr/fr/datasets/boamp/),
  [tenders.guru](https://tenders.guru).
