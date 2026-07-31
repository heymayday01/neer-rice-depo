import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";

interface GenItem {
  id: string;
  prompt: string;
  out: string;
}

const STYLE =
  "professional editorial food photography, overhead flat-lay on warm cream linen, soft natural daylight, shallow depth of field, ultra detailed, 8k, premium organic branding aesthetic";

const ITEMS: GenItem[] = [
  {
    id: "sona-masoori-unpolished",
    prompt: `A generous mound of unpolished sona masoori rice grains, light tan and beige color with visible bran texture, scattered grains around a small wooden bowl, raw and natural, ${STYLE}`,
    out: "./public/rice/sona-masoori.png",
  },
  {
    id: "indrayani-aromatic",
    prompt: `Aromatic indrayani rice grains, short medium-grain translucent white with golden tips, a sprig of fresh curry leaves beside a brass bowl, steam hint of fragrance, ${STYLE}`,
    out: "./public/rice/indrayani.png",
  },
  {
    id: "1121-steam-basmati",
    prompt: `Extra long royal 1121 steam basmati rice grains, slender ivory-white elongated grains arranged in a elegant cascade over a dark slate surface, a few whole spices star anise and cardamom, luxury feel, ${STYLE}`,
    out: "./public/rice/basmati-1121.png",
  },
  {
    id: "black-rice-karuppu-kavuni",
    prompt: `Karuppu kavuni black rice grains, deep purple-black forbidden rice with a subtle sheen, scattered over a rustic dark wooden board, a few blueberries for color reference, antioxidant superfood, ${STYLE}`,
    out: "./public/rice/black-kavuni.png",
  },
  {
    id: "rajamudi-heritage",
    prompt: `Rajamudi heritage rice grains, distinctive red and white striped heirloom grains with reddish-brown bran, in a handcrafted terracotta bowl, traditional Mysuru royal heritage feel, ${STYLE}`,
    out: "./public/rice/rajamudi.png",
  },
  {
    id: "kerala-matta-red",
    prompt: `Palakkad matta red parboiled rice, bold thick short grains with deep red-brown pericarp, in a coconut shell bowl with a banana leaf, Kerala backwater heritage, earthy robust, ${STYLE}`,
    out: "./public/rice/matta-red.png",
  },
  {
    id: "gobindobhog-aromatic",
    prompt: `Gobindobhog sweet aromatic rice, short plump pearly white grains with a glossy ghee-like sheen, beside a small brass diya lamp and marigold petals, Bengali temple bhog offering, divine warm, ${STYLE}`,
    out: "./public/rice/gobindobhog.png",
  },
  {
    id: "wada-kolam-soft",
    prompt: `Surti wada kolam rice, tiny smooth pearly white grains, soft and fluffy appearance, in a simple white ceramic bowl on a clean light wooden table, everyday household staple, ${STYLE}`,
    out: "./public/rice/wada-kolam.png",
  },
  {
    id: "ambemohar-scented",
    prompt: `Ambemohar mango blossom rice, small white grains with a delicate floral appearance, fresh mango blossoms and a slice of mango beside a copper bowl, intoxicating sweet fragrance, Western Ghats heritage, ${STYLE}`,
    out: "./public/rice/ambemohar.png",
  },
  {
    id: "organic-trio-combo",
    prompt: `Heritage grain trio bundle, three small burlap sacks spilling black rice, red rajamudi rice, and white indrayani rice arranged together, a wooden scoop, farmer cooperative organic branding, ${STYLE}`,
    out: "./public/rice/trio-combo.png",
  },
];

async function genOne(zai: any, item: GenItem): Promise<boolean> {
  try {
    const response = await zai.images.generations.create({
      prompt: item.prompt,
      size: "1024x1024",
    });
    const b64 = response.data[0].base64;
    fs.writeFileSync(item.out, Buffer.from(b64, "base64"));
    console.log(`✓ ${item.id}`);
    return true;
  } catch (e: any) {
    console.error(`✗ ${item.id}: ${e.message}`);
    return false;
  }
}

async function main() {
  const zai = await ZAI.create();
  const batchSize = 3;
  for (let i = 0; i < ITEMS.length; i += batchSize) {
    const batch = ITEMS.slice(i, i + batchSize);
    await Promise.all(batch.map((it) => genOne(zai, it)));
  }
  console.log("DONE");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
