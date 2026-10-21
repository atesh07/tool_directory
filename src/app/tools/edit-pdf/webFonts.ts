// Finds the complete version of a font used in a PDF (PDFs only embed the glyphs they used, so
// typing any new letter would otherwise fall back to a different face). Files come from the
// fontsource CDN; nothing from the user's PDF is sent anywhere.

export type WebFace = { cssName: string; bytes: Uint8Array };

const CDN = "https://cdn.jsdelivr.net/fontsource/fonts";

// Common PDF fonts with no web release, mapped to metric-compatible open fonts
const SUBSTITUTES: [RegExp, string][] = [
    [/^(arial|helvetica|texgyreheros|nimbussans|liberationsans)/, "arimo"],
    [/^(timesnewroman|times|texgyretermes|nimbusroman|liberationserif)/, "tinos"],
    [/^(couriernew|courier|texgyrecursor|nimbusmono|liberationmono)/, "cousine"],
    [/^calibri/, "carlito"],
    [/^cambria/, "caladea"],
    // Commercial fonts mapped to the closest open design
    [/^(gotham|proximanova|montserrat)/, "montserrat"],
    [/^(futura|century ?gothic|avantgarde)/, "jost"],
    [/^(avenir|nunito)/, "nunito-sans"],
    [/^(myriad|sourcesans)/, "source-sans-3"],
    [/^(segoe|frutiger|opensans|verdana|tahoma|lucida)/, "open-sans"],
    [/^(georgia)/, "gelasio"],
    [/^(garamond|minion|palatino|bookantiqua|bookman)/, "eb-garamond"],
    [/^(menlo|consolas|monaco|sfmono|andalemono)/, "fira-mono"],
];

const GENERIC_ID = { sans: "arimo", serif: "tinos", mono: "cousine" } as const;

// Fonts that are not text fonts
const SKIP = /^(cm[a-z]{1,3}\d|fontawesome|symbol|zapfdingbats|wingdings|msam|msbm)/;

const cache = new Map<string, Promise<WebFace | null>>();

const WEIGHTS: [RegExp, number][] = [
    [/thin|hairline/, 100],
    [/extralight|ultralight/, 200],
    [/light/, 300],
    [/semibold|demibold|demi/, 600],
    [/extrabold|ultrabold|heavy/, 800],
    [/black/, 900],
    [/bold/, 700],
    [/medium/, 500],
];

export function parseFontName(raw: string) {
    const name = raw.replace(/^[A-Z]{6}\+/, "");
    const [familyPart, ...rest] = name.split(/[-,]/);
    const stylePart = (rest.join("") || "").toLowerCase();
    // Some PDFs put the style in the family name ("Arial Bold", "ArialMT")
    const whole = name.toLowerCase().replace(/[\s_]/g, "");
    let weight = 400;
    for (const [re, w] of WEIGHTS) if (re.test(stylePart) || re.test(whole)) { weight = w; break; }
    const italic = /italic|oblique/.test(whole);
    const key = familyPart.toLowerCase().replace(/(mt|ps|roman|regular)$/g, "").replace(/[^a-z0-9]/g, "");
    // "FiraMono" -> "fira-mono"
    const slug = familyPart.replace(/(MT|PS)$/, "").replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/[\s_]+/g, "-").toLowerCase();
    return { key, slug, weight, italic };
}

async function fetchFace(id: string, weight: number, italic: boolean): Promise<Uint8Array | null> {
    const style = italic ? "italic" : "normal";
    // Try the exact weight first, then the nearest regular/bold
    const tries = Array.from(new Set([weight, weight >= 600 ? 700 : 400]));
    for (const w of tries) {
        try {
            const res = await fetch(`${CDN}/${id}@latest/latin-${w}-${style}.woff`);
            if (res.ok) return new Uint8Array(await res.arrayBuffer());
        } catch { /* offline or blocked: caller falls back to standard fonts */ }
    }
    return null;
}

export function loadWebFace(
    rawName: string,
    override: { bold?: boolean; italic?: boolean } = {},
    generic: "sans" | "serif" | "mono" = "sans"
): Promise<WebFace | null> {
    const parsed = parseFontName(rawName);
    const { key, slug } = parsed;
    if (!key || SKIP.test(key)) return Promise.resolve(null);
    const weight = override.bold === undefined ? parsed.weight : override.bold ? 700 : 400;
    const italic = override.italic === undefined ? parsed.italic : override.italic;
    const id = SUBSTITUTES.find(([re]) => re.test(key))?.[1] || slug;
    const cacheKey = `${id}|${weight}|${italic}|${generic}`;
    if (!cache.has(cacheKey)) {
        cache.set(cacheKey, (async () => {
            let usedId: string = id;
            let bytes = await fetchFace(id, weight, italic);
            if (!bytes) {
                // No release of this font: use the closest generic design so every line still matches
                usedId = GENERIC_ID[generic];
                bytes = await fetchFace(usedId, weight, italic);
            }
            if (!bytes) return null;
            const cssName = `pdfedit-web-${usedId}-${weight}${italic ? "i" : ""}`;
            try {
                const face = new FontFace(cssName, bytes.slice().buffer);
                await face.load();
                document.fonts.add(face);
            } catch { return null; }
            return { cssName, bytes };
        })());
    }
    return cache.get(cacheKey)!;
}
