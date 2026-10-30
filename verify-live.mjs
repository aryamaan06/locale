import fs from "fs";

const envText = fs.readFileSync(".env.local", "utf-8");
const keyMatch = envText.match(/QLOO_API_KEY\s*=\s*([^\r\n]+)/);
const apiKey = keyMatch ? keyMatch[1].trim().replace(/^["']|["']$/g, "") : "";
const baseUrl = "https://hackathon.api.qloo.com";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function qlooFetchWithRetry(url) {
  for (let i = 0; i < 4; i++) {
    if (i > 0) await sleep(1500 * i);
    const res = await fetch(url, {
      headers: { "X-Api-Key": apiKey, Accept: "application/json" },
    });
    if (res.status === 429) {
      console.log(`Rate limit 429 hit, backing off (${i + 1}/3)...`);
      continue;
    }
    return res;
  }
  throw new Error("Exceeded 429 retries");
}

async function runLiveCheck() {
  console.log("=== LOCALE LIVE QLOO VERIFICATION RUN (PACED) ===");

  // 1. Resolve Brand Seed "A24"
  const searchUrl = `${baseUrl}/search?query=A24&take=3`;
  const t0 = Date.now();
  const sRes = await qlooFetchWithRetry(searchUrl);
  const sData = await sRes.json();
  console.log(
    `[1] GET /search?query=A24 -> HTTP ${sRes.status} (${Date.now() - t0}ms)`
  );
  const firstSeed = (sData?.results || sData?.results?.entities || [])[0];
  console.log("Resolved Seed:", {
    entity_id: firstSeed?.entity_id || firstSeed?.id,
    name: firstSeed?.name,
    types: firstSeed?.types || firstSeed?.type,
  });

  const seedId = firstSeed?.entity_id || firstSeed?.id;
  await sleep(500);

  // 2. Local Artist Query (Williamsburg)
  const localUrl = `${baseUrl}/v2/insights?filter.type=urn:entity:artist&signal.interests.entities=${seedId}&signal.location=POINT(-73.9571%2040.7181)&signal.location.radius=2500&take=10`;
  const t1 = Date.now();
  const locRes = await qlooFetchWithRetry(localUrl);
  const locJson = await locRes.json();
  console.log(
    `[2] GET /v2/insights (Williamsburg WKT) -> HTTP ${locRes.status} (${
      Date.now() - t1
    }ms)`
  );

  await sleep(500);

  // 3. National Baseline Artist Query (No Location)
  const baseQueryUrl = `${baseUrl}/v2/insights?filter.type=urn:entity:artist&signal.interests.entities=${seedId}&take=10`;
  const t2 = Date.now();
  const baseRes = await qlooFetchWithRetry(baseQueryUrl);
  const baseJson = await baseRes.json();
  console.log(
    `[3] GET /v2/insights (National Baseline) -> HTTP ${baseRes.status} (${
      Date.now() - t2
    }ms)`
  );

  const locEntities = locJson?.results?.entities || locJson?.results || [];
  const baseEntities = baseJson?.results?.entities || baseJson?.results || [];

  const locTop10 = locEntities
    .slice(0, 10)
    .map((e) => `${e.name} (${e.entity_id})`);
  const baseTop10 = baseEntities
    .slice(0, 10)
    .map((e) => `${e.name} (${e.entity_id})`);

  const overlap = locTop10.filter((x) => baseTop10.includes(x)).length;

  console.log("\n=== IDENTICAL-OUTPUT CHECK ===");
  console.log("Local Top-10 (Williamsburg):", locTop10);
  console.log("National Baseline Top-10:", baseTop10);
  console.log(`Overlap Count: ${overlap}/10 | Identical? ${overlap === 10}`);

  console.log("\n=== RAW QLOO JSON SAMPLE (FIRST ENTITY) ===");
  console.log(JSON.stringify(locEntities[0] || locJson, null, 2));
}

runLiveCheck().catch((e) => console.error("Live check error:", e));