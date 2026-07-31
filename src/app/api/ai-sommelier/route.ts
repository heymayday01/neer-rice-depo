import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import { RICE_PRODUCTS } from "@/lib/rice-products";
import { RiceProduct } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface SommelierRequest {
  prompt: string;
}

const SYSTEM_PROMPT = `You are the AI Grain Sommelier for Neer Rice Depo, a premium purveyor of organic, heirloom, and naturally aged Indian rice. You are deeply knowledgeable about Indian rice varieties, their glycemic index, aroma, grain length, aging, regional origins, cooking water ratios, and ideal culinary pairings.

Your job: given a user's request (a dish, dietary need, health goal, or preference), recommend 1 to 3 rice varieties from the provided catalog. Respond ONLY with compact JSON matching this exact schema — no markdown, no prose outside JSON:

{
  "recommendedProductIds": string[],
  "summary": string,
  "cookingTips": string,
  "suggestedDishes": string[],
  "healthNote": string
}

Tone: refined, confident, warm, lightly poetic — like a master sommelier. Keep each text field concise. Never invent product ids outside the catalog.`;

export async function POST(req: NextRequest) {
  try {
    const { prompt } = (await req.json()) as SommelierRequest;
    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const catalog = RICE_PRODUCTS.map((p: RiceProduct) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      grainType: p.grainType,
      processing: p.processing,
      aromaLevel: p.aromaLevel,
      giIndex: p.giIndex,
      agingMonths: p.agingMonths,
      originRegion: p.originRegion,
      waterRatio: p.waterRatio,
      bestFor: p.bestFor,
      badges: p.badges,
      tagline: p.tagline,
    }));

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `CATALOG:\n${JSON.stringify(catalog)}\n\nUSER REQUEST: ${prompt}`,
        },
      ],
      temperature: 0.6,
      max_tokens: 700,
    });

    const raw = completion.choices?.[0]?.message?.content ?? "";
    const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Could not parse sommelier response");
      parsed = JSON.parse(match[0]);
    }

    const validIds = new Set(RICE_PRODUCTS.map((p) => p.id));
    parsed.recommendedProductIds = (parsed.recommendedProductIds || []).filter(
      (id: string) => validIds.has(id)
    );

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("AI Sommelier error:", err);
    return NextResponse.json(
      {
        recommendedProductIds: ["1121-steam-basmati"],
        summary:
          "Our master-curated pick is the Royal 1121 Basmati — aged 24 months for unmatched aroma and grain elongation.",
        cookingTips:
          "Soak aged basmati for 20–30 minutes, then cook with a 1:2 water ratio for fluffy, separate grains.",
        suggestedDishes: ["Dum Biryani", "Shahi Pulao", "Jeera Rice"],
        healthNote:
          "Aged basmati has a moderate glycemic index and is easier to digest than freshly harvested paddy.",
      },
      { status: 200 }
    );
  }
}
