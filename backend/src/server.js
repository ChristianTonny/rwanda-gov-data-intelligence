import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { addDocs, clearIndex } from "./search/indexer.js";
import fs from "fs";
import path from "path";

const PORT = process.env.PORT || 4000;

async function seedIndexFromSeeds() {
  try {
    await clearIndex();
    const root = path.resolve(process.cwd(), "..");
    const seededDir = path.join(root, "data", "seeded");
    console.log(`🔍 Looking for seed files in: ${seededDir}`);
    
    let populations = [];
    let supplies = [];
    
    try { 
      const popPath = path.join(seededDir, "populations.json");
      console.log(`📊 Reading populations from: ${popPath}`);
      populations = JSON.parse(fs.readFileSync(popPath, "utf8") || "[]"); 
      console.log(`✅ Loaded ${populations.length} population records`);
    } catch (e) { 
      console.log(`❌ Failed to load populations: ${e.message}`);
    }
    
    try { 
      const supPath = path.join(seededDir, "supplies.json");
      console.log(`📦 Reading supplies from: ${supPath}`);
      supplies = JSON.parse(fs.readFileSync(supPath, "utf8") || "[]"); 
      console.log(`✅ Loaded ${supplies.length} supply records`);
    } catch (e) { 
      console.log(`❌ Failed to load supplies: ${e.message}`);
    }

    const popDocs = populations.map((p, i) => ({
      _docId: `pop-${i}`,
      name: `${p.district_name} population ${p.population_total}`,
      population: p.population_total,
      dataset: "nirs_population",
      timestamp: String(p.source_year || ""),
      __raw: JSON.stringify(p)
    }));
    const supDocs = supplies.map((s, i) => ({
      _docId: `sup-${i}`,
      name: `${s.district_name} ${s.facility_name} ${s.item_name} qty:${s.qty}`,
      quantity: s.qty,
      dataset: "ministry_supplies",
      timestamp: String(s.source_year || s.last_updated || ""),
      __raw: JSON.stringify(s)
    }));
    await addDocs([...popDocs, ...supDocs]);
    console.log(`🔎 Seeded search index with ${popDocs.length + supDocs.length} docs`);
  } catch (err) {
    console.error("Failed to seed index:", err.message);
  }
}

app.listen(PORT, async () => {
  await seedIndexFromSeeds();
  console.log(`✅ Server running at http://localhost:${PORT} (pid ${process.pid})`);
});
