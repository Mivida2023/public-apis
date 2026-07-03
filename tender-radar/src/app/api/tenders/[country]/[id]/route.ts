import { NextRequest, NextResponse } from "next/server";
import { getTender } from "@/lib/sources";
import { summarizeTender } from "@/lib/ai/summarize";
import { CountryCode } from "@/lib/types";

const VALID_COUNTRIES = new Set(["fr", "es", "pl", "ro", "hu", "ua"]);

export async function GET(
  _request: NextRequest,
  { params }: { params: { country: string; id: string } }
) {
  if (!VALID_COUNTRIES.has(params.country)) {
    return NextResponse.json({ error: "Pays non supporté" }, { status: 400 });
  }

  const tender = await getTender(params.country as CountryCode, params.id);
  if (!tender) {
    return NextResponse.json({ error: "Appel d'offres introuvable" }, { status: 404 });
  }

  const summary = await summarizeTender(tender);
  return NextResponse.json({ tender, summary });
}
