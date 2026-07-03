import { NextRequest, NextResponse } from "next/server";
import { createAlert, listAlerts } from "@/lib/alerts/store";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_COUNTRIES = new Set(["all", "fr", "es", "pl", "ro", "hu", "ua"]);

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");
  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }
  return NextResponse.json({ alerts: await listAlerts(email) });
}

export async function POST(request: NextRequest) {
  let body: { email?: string; keywords?: string; country?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide" }, { status: 400 });
  }

  const email = body.email?.trim() ?? "";
  const keywords = body.keywords?.trim() ?? "";
  const country = body.country ?? "all";

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }
  if (keywords.length < 2) {
    return NextResponse.json(
      { error: "Indiquez au moins un mot-clé (2 caractères minimum)" },
      { status: 400 }
    );
  }
  if (!VALID_COUNTRIES.has(country)) {
    return NextResponse.json({ error: "Pays non supporté" }, { status: 400 });
  }

  const result = await createAlert({
    email,
    keywords,
    country: country as Parameters<typeof createAlert>[0]["country"],
  });

  if (!result.ok) {
    return NextResponse.json(
      {
        error: `Plan gratuit limité à ${result.limit} alertes. Passez au plan Pro pour des alertes illimitées.`,
        code: "free_plan_limit",
        upgradeUrl: "/pricing",
      },
      { status: 402 }
    );
  }

  return NextResponse.json({ alert: result.alert }, { status: 201 });
}
