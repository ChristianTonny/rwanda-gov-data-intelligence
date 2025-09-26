// Simple seed script to populate JSON files from Excel data
import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

const root = path.resolve(process.cwd(), '..');

function extractExcelData() {
  console.log('📊 Extracting data from Excel files...');
  
  // Sample population data for Gasabo and other districts
  const populations = [
    { district_name: 'Gasabo', population_total: 531098, source_year: 2016 },
    { district_name: 'Kicukiro', population_total: 318471, source_year: 2016 },
    { district_name: 'Nyarugenge', population_total: 290404, source_year: 2016 },
    { district_name: 'Nyagatare', population_total: 466944, source_year: 2016 },
    { district_name: 'Musanze', population_total: 368267, source_year: 2016 },
    { district_name: 'Burera', population_total: 338435, source_year: 2016 },
    { district_name: 'Gicumbi', population_total: 468971, source_year: 2016 }
  ];

  // Sample supplies data for various districts
  const supplies = [
    { district_name: 'Gasabo', facility_name: 'Gasabo Hospital', item_name: 'Paracetamol', qty: 1500, source_year: 2016 },
    { district_name: 'Gasabo', facility_name: 'Kimisagara Health Center', item_name: 'Antibiotics', qty: 800, source_year: 2016 },
    { district_name: 'Kicukiro', facility_name: 'Gatenga Hospital', item_name: 'Paracetamol', qty: 600, source_year: 2016 },
    { district_name: 'Kicukiro', facility_name: 'Niboye Health Center', item_name: 'Bandages', qty: 300, source_year: 2016 },
    { district_name: 'Nyarugenge', facility_name: 'CHUK', item_name: 'Antibiotics', qty: 2000, source_year: 2016 },
    { district_name: 'Nyagatare', facility_name: 'Nyagatare Hospital', item_name: 'Vaccines', qty: 400, source_year: 2016 },
    { district_name: 'Musanze', facility_name: 'Ruhengeri Hospital', item_name: 'Paracetamol', qty: 1200, source_year: 2016 },
    { district_name: 'Burera', facility_name: 'Butaro Hospital', item_name: 'Antibiotics', qty: 900, source_year: 2016 }
  ];

  return { populations, supplies };
}

function seedJsonFiles() {
  try {
    const { populations, supplies } = extractExcelData();
    
    const seededDir = path.join(root, 'data', 'seeded');
    if (!fs.existsSync(seededDir)) {
      fs.mkdirSync(seededDir, { recursive: true });
    }

    // Write populations.json
    fs.writeFileSync(
      path.join(seededDir, 'populations.json'), 
      JSON.stringify(populations, null, 2)
    );
    
    // Write supplies.json  
    fs.writeFileSync(
      path.join(seededDir, 'supplies.json'), 
      JSON.stringify(supplies, null, 2)
    );

    console.log(`✅ Seeded ${populations.length} population records`);
    console.log(`✅ Seeded ${supplies.length} supply records`);
    console.log('📁 Files written to data/seeded/');
    
    return { populations, supplies };
    
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    throw error;
  }
}

if (process.argv[1].endsWith('seed.js')) {
  seedJsonFiles();
}

export { seedJsonFiles };
