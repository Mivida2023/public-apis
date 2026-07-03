import { NextRequest, NextResponse } from "next/server";
import { searchTenders } from "@/lib/sources";
import { CountryCode } from "@/lib/types";

const VALID_COUNTRIES = new Set(["fr", "es", "pl", "ro", "hu", "ua"]);

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q") ?? undefined;
  const countryParam = searchParams.get("country") ?? "fr";
  const page = Number(searchParams.get("page") ?? "1") || 1;

  if (!VALID_COUNTRIES.has(countryParam)) {
    return NextResponse.json({ error: "Pays non supporté" }, { status: 400 });
  }

  const result = await searchTenders({
    q,
    country: countryParam as CountryCode,
    page,
    limit: 20,
  });

  return NextResponse.json(result);
}
