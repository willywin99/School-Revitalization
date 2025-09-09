const mysql = require('mysql2');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

// Database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // replace with your MySQL username
  password: '', // replace with your MySQL password
  database: 'school_revitalization'
});

// Province coordinates mapping (using kode_pro to province name mapping)
const provinceCodeToName = {
  '11': 'Aceh',
  '12': 'Sumatera Utara',
  '13': 'Sumatera Barat',
  '14': 'Riau',
  '15': 'Jambi',
  '16': 'Sumatera Selatan',
  '17': 'Bengkulu',
  '18': 'Lampung',
  '19': 'Kepulauan Bangka Belitung',
  '21': 'Kepulauan Riau',
  '31': 'DKI Jakarta',
  '32': 'Jawa Barat',
  '33': 'Jawa Tengah',
  '34': 'DI Yogyakarta',
  '35': 'Jawa Timur',
  '36': 'Banten',
  '51': 'Bali',
  '52': 'Nusa Tenggara Barat',
  '53': 'Nusa Tenggara Timur',
  '61': 'Kalimantan Barat',
  '62': 'Kalimantan Tengah',
  '63': 'Kalimantan Selatan',
  '64': 'Kalimantan Timur',
  '65': 'Kalimantan Utara',
  '71': 'Sulawesi Utara',
  '72': 'Sulawesi Tengah',
  '73': 'Sulawesi Selatan',
  '74': 'Sulawesi Tenggara',
  '75': 'Gorontalo',
  '76': 'Sulawesi Barat',
  '81': 'Maluku',
  '82': 'Maluku Utara',
  '91': 'Papua',
  '92': 'Papua Barat',
  '93': 'Papua Selatan',
  '94': 'Papua Tengah',
  '95': 'Papua Pegunungan',
  '96': 'Papua Barat Daya'
};

// Province coordinates (same as before, but we'll use the mapping above)
const provinceCoordinates = {
  'Aceh': {
    'type': 'Polygon',
    'coordinates': [[
      [95.153576, 5.901278], [95.264557, 2.084486], [97.759154, 1.708255],
      [97.772911, 5.214303], [95.153576, 5.901278]
    ]]
  },
  'Sumatera Utara': {
    'type': 'Polygon',
    'coordinates': [[
      [97.514648, 0.659165], [100.722656, 0.659165],
      [100.722656, 4.214943], [97.514648, 4.214943],
      [97.514648, 0.659165]
    ]]
  },
  'Sumatera Barat': {
    'type': 'Polygon',
    'coordinates': [[
      [98.701172, -2.548868], [102.128906, -2.548868],
      [102.128906, 1.054628], [98.701172, 1.054628],
      [98.701172, -2.548868]
    ]]
  },
  'Riau': {
    'type': 'Polygon',
    'coordinates': [[
      [100.722656, -1.054628], [104.853516, -1.054628],
      [104.853516, 2.108899], [100.722656, 2.108899],
      [100.722656, -1.054628]
    ]]
  },
  'Jambi': {
    'type': 'Polygon',
    'coordinates': [[
      [101.293945, -2.834472], [104.853516, -2.834472],
      [104.853516, 0.439448], [101.293945, 0.439448],
      [101.293945, -2.834472]
    ]]
  },
  'Sumatera Selatan': {
    'type': 'Polygon',
    'coordinates': [[
      [102.128906, -5.659719], [106.083984, -5.659719],
      [106.083984, -1.757537], [102.128906, -1.757537],
      [102.128906, -5.659719]
    ]]
  },
  'Bengkulu': {
    'type': 'Polygon',
    'coordinates': [[
      [101.065185, -5.454545], [103.370117, -5.454545],
      [103.370117, -2.827659], [101.065185, -2.827659],
      [101.065185, -5.454545]
    ]]
  },
  'Lampung': {
    'type': 'Polygon',
    'coordinates': [[
      [103.666992, -6.402648], [106.215820, -6.402648],
      [106.215820, -3.688855], [103.666992, -3.688855],
      [103.666992, -6.402648]
    ]]
  },
  'Kepulauan Bangka Belitung': {
    'type': 'Polygon',
    'coordinates': [[
      [105.175867, -3.118754], [108.168090, -3.118754],
      [108.168090, -1.799448], [105.175867, -1.799448],
      [105.175867, -3.118754]
    ]]
  },
  'Kepulauan Riau': {
    'type': 'Polygon',
    'coordinates': [[
      [103.183594, -0.439448], [109.775391, -0.439448],
      [109.775391, 5.266007], [103.183594, 5.266007],
      [103.183594, -0.439448]
    ]]
  },
  'DKI Jakarta': {
    'type': 'Polygon',
    'coordinates': [[
      [106.699219, -6.315299], [106.962891, -6.315299],
      [106.962891, -6.096281], [106.699219, -6.096281],
      [106.699219, -6.315299]
    ]]
  },
  'Jawa Barat': {
    'type': 'Polygon',
    'coordinates': [[
      [105.644531, -7.798079], [108.544922, -7.798079],
      [108.544922, -5.266007], [105.644531, -5.266007],
      [105.644531, -7.798079]
    ]]
  },
  'Jawa Tengah': {
    'type': 'Polygon',
    'coordinates': [[
      [108.764160, -7.798079], [111.159180, -7.798079],
      [111.159180, -5.889466], [108.764160, -5.889466],
      [108.764160, -7.798079]
    ]]
  },
  'DI Yogyakarta': {
    'type': 'Polygon',
    'coordinates': [[
      [110.170898, -8.233237], [110.566406, -8.233237],
      [110.566406, -7.710992], [110.170898, -7.710992],
      [110.170898, -8.233237]
    ]]
  },
  'Jawa Timur': {
    'type': 'Polygon',
    'coordinates': [[
      [110.742188, -9.102097], [116.015625, -9.102097],
      [116.015625, -5.659719], [110.742188, -5.659719],
      [110.742188, -9.102097]
    ]]
  },
  'Banten': {
    'type': 'Polygon',
    'coordinates': [[
      [105.654686, -6.834686], [106.650414, -6.834686],
      [106.650414, -5.966786], [105.654686, -5.966786],
      [105.654686, -6.834686]
    ]]
  },
  'Bali': {
    'type': 'Polygon',
    'coordinates': [[
      [114.431015, -8.901883], [115.711670, -8.901883], 
      [115.711670, -8.095463], [114.431015, -8.095463],
      [114.431015, -8.901883]
    ]]
  },
  'Nusa Tenggara Barat': {
    'type': 'Polygon',
    'coordinates': [[
      [115.839844, -9.449061], [119.355469, -9.449061],
      [119.355469, -7.449624], [115.839844, -7.449624],
      [115.839844, -9.449061]
    ]]
  },
  'Nusa Tenggara Timur': {
    'type': 'Polygon',
    'coordinates': [[
      [118.652344, -10.833305], [125.156250, -10.833305],
      [125.156250, -7.798079], [118.652344, -7.798079],
      [118.652344, -10.833305]
    ]]
  },
  'Kalimantan Barat': {
    'type': 'Polygon',
    'coordinates': [[
      [108.544922, -3.337954], [114.609375, -3.337954],
      [114.609375, 1.406109], [108.544922, 1.406109],
      [108.544922, -3.337954]
    ]]
  },
  'Kalimantan Tengah': {
    'type': 'Polygon',
    'coordinates': [[
      [110.742188, -3.337954], [116.542969, -3.337954],
      [116.542969, 1.054628], [110.742188, 1.054628],
      [110.742188, -3.337954]
    ]]
  },
  'Kalimantan Selatan': {
    'type': 'Polygon',
    'coordinates': [[
      [114.257813, -4.915833], [116.718750, -4.915833],
      [116.718750, -1.318243], [114.257813, -1.318243],
      [114.257813, -4.915833]
    ]]
  },
  'Kalimantan Timur': {
    'type': 'Polygon',
    'coordinates': [[
      [114.257813, -2.108899], [119.179688, -2.108899],
      [119.179688, 4.214943], [114.257813, 4.214943],
      [114.257813, -2.108899]
    ]]
  },
  'Kalimantan Utara': {
    'type': 'Polygon',
    'coordinates': [[
      [114.609375, 1.757537], [119.355469, 1.757537],
      [119.355469, 4.915833], [114.609375, 4.915833],
      [114.609375, 1.757537]
    ]]
  },
  'Sulawesi Utara': {
    'type': 'Polygon',
    'coordinates': [[
      [124.189453, 0.659165], [127.001953, 0.659165],
      [127.001953, 4.915833], [124.189453, 4.915833],
      [124.189453, 0.659165]
    ]]
  },
  'Sulawesi Tengah': {
    'type': 'Polygon',
    'coordinates': [[
      [118.696289, -3.688855], [124.365234, -3.688855],
      [124.365234, 1.406109], [118.696289, 1.406109],
      [118.696289, -3.688855]
    ]]
  },
  'Sulawesi Selatan': {
    'type': 'Polygon',
    'coordinates': [[
      [118.652344, -6.839170], [122.255859, -6.839170],
      [122.255859, -2.548868], [118.652344, -2.548868],
      [118.652344, -6.839170]
    ]]
  },
  'Sulawesi Tenggara': {
    'type': 'Polygon',
    'coordinates': [[
      [120.585938, -6.402648], [124.189453, -6.402648],
      [124.189453, -2.548868], [120.585938, -2.548868],
      [120.585938, -6.402648]
    ]]
  },
  'Gorontalo': {
    'type': 'Polygon',
    'coordinates': [[
      [121.508789, 0.109476], [123.706055, 0.109476],
      [123.706055, 1.054628], [121.508789, 1.054628],
      [121.508789, 0.109476]
    ]]
  },
  'Sulawesi Barat': {
    'type': 'Polygon',
    'coordinates': [[
      [118.652344, -3.337954], [120.146484, -3.337954],
      [120.146484, -1.054628], [118.652344, -1.054628],
      [118.652344, -3.337954]
    ]]
  },
  'Maluku': {
    'type': 'Polygon',
    'coordinates': [[
      [125.947266, -9.102097], [134.560547, -9.102097],
      [134.560547, -2.108899], [125.947266, -2.108899],
      [125.947266, -9.102097]
    ]]
  },
  'Maluku Utara': {
    'type': 'Polygon',
    'coordinates': [[
      [124.189453, -3.337954], [129.902344, -3.337954],
      [129.902344, 2.635789], [124.189453, 2.635789],
      [124.189453, -3.337954]
    ]]
  },
  'Papua': {
    'type': 'Polygon',
    'coordinates': [[
      [130.781250, -9.795678], [141.152344, -9.795678],
      [141.152344, 0.000000], [130.781250, 0.000000],
      [130.781250, -9.795678]
    ]]
  },
  'Papua Barat': {
    'type': 'Polygon',
    'coordinates': [[
      [129.726562, -3.688855], [134.560547, -3.688855],
      [134.560547, 1.054628], [129.726562, 1.054628],
      [129.726562, -3.688855]
    ]]
  },
  'Papua Selatan': {
    'type': 'Polygon',
    'coordinates': [[
      [136.406250, -7.798079], [141.152344, -7.798079],
      [141.152344, -3.337954], [136.406250, -3.337954],
      [136.406250, -7.798079]
    ]]
  },
  'Papua Tengah': {
    'type': 'Polygon',
    'coordinates': [[
      [135.000000, -5.266007], [140.000000, -5.266007],
      [140.000000, -1.757537], [135.000000, -1.757537],
      [135.000000, -5.266007]
    ]]
  },
  'Papua Pegunungan': {
    'type': 'Polygon',
    'coordinates': [[
      [137.000000, -5.266007], [141.000000, -5.266007],
      [141.000000, -2.108899], [137.000000, -2.108899],
      [137.000000, -5.266007]
    ]]
  },
  'Papua Barat Daya': {
    'type': 'Polygon',
    'coordinates': [[
      [130.000000, -3.337954], [134.000000, -3.337954],
      [134.000000, 0.000000], [130.000000, 0.000000],
      [130.000000, -3.337954]
    ]]
  }
};

// Process and import data
function importData() {
  const results = [];
  const csvPath = path.join(__dirname, 'data.csv');
  
  console.log('Looking for CSV file at:', csvPath);
  
  // Check if file exists
  if (!fs.existsSync(csvPath)) {
    console.error('CSV file not found at:', csvPath);
    console.log('Please make sure your CSV file is named "data.csv" and placed in the same directory as this script');
    return;
  }

  // Read CSV file
  fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', (data) => {
      results.push(data);
    })
    .on('end', () => {
      console.log('CSV file successfully processed. Found', results.length, 'rows');
      // Filter out rows with tingkat_label = 'provinsi' as they are summary rows
      const filteredData = results.filter(row => row.tingkat_label === 'kabupaten');
      console.log('Filtered to', filteredData.length, 'district rows');
      if (filteredData.length > 0) {
        console.log('First district row sample:', filteredData[0]);
      }
      processData(filteredData);
    })
    .on('error', (error) => {
      console.error('Error reading CSV file:', error);
    });
}

function processData(data) {
  if (!data || data.length === 0) {
    console.error('No data to process');
    return;
  }

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      return;
    }
    console.log('Connected to MySQL database');
    
    // First, insert provinces using kode_pro mapping
    const provinceCodes = [...new Set(data.map(item => item.kode_pro))].filter(code => code && code !== '0');
    const provinceMap = {};
    
    console.log('Found province codes:', provinceCodes);
    
    if (provinceCodes.length === 0) {
      console.error('No province codes found in the data');
      connection.end();
      return;
    }
    
    let provinceCount = 0;
    provinceCodes.forEach(provinceCode => {
      const provinceName = provinceCodeToName[provinceCode];
      if (!provinceName) {
        console.error(`No province name found for code: ${provinceCode}`);
        provinceCount++;
        if (provinceCount === provinceCodes.length) {
          insertDistricts(data, provinceMap);
        }
        return;
      }
      
      const provinceCodeShort = provinceName.replace(/\s+/g, '_').toUpperCase().substring(0, 10);
      const coordinates = provinceCoordinates[provinceName] || null;
      
      const query = 'INSERT INTO provinces (code, name, coordinates) VALUES (?, ?, ?)';
      connection.query(query, [provinceCodeShort, provinceName, JSON.stringify(coordinates)], (err, result) => {
        if (err) {
          console.error('Error inserting province:', err);
          provinceCount++;
        } else {
          provinceMap[provinceCode] = result.insertId;
          console.log(`Inserted province: ${provinceName} with ID: ${result.insertId}`);
          provinceCount++;
        }
        
        if (provinceCount === provinceCodes.length) {
          // All provinces processed, now insert districts
          insertDistricts(data, provinceMap);
        }
      });
    });
  });
}

function insertDistricts(data, provinceMap) {
  const districtMap = {};
  const districts = [];
  
  // Collect unique districts
  data.forEach(item => {
    if (item.kode_pro && item.kode_kab && item.nama_wilayah) {
      const key = `${item.kode_pro}-${item.kode_kab}`;
      if (!districts.includes(key)) {
        districts.push(key);
      }
    }
  });
  
  console.log('Found district keys:', districts.length);
  
  if (districts.length === 0) {
    console.error('No districts found in the data');
    insertRevitalizationData(data, districtMap, provinceMap);
    return;
  }
  
  let districtCount = 0;
  districts.forEach(districtKey => {
    const [provinceCode, districtCode] = districtKey.split('-');
    const provinceId = provinceMap[provinceCode];
    const districtName = data.find(item => item.kode_pro === provinceCode && item.kode_kab === districtCode)?.nama_wilayah;
    
    if (!provinceId || !districtName) {
      districtCount++;
      if (districtCount === districts.length) {
        insertRevitalizationData(data, districtMap, provinceMap);
      }
      return;
    }
    
    // Removed the 'code' column from the INSERT statement
    const query = 'INSERT INTO districts (province_id, name) VALUES (?, ?)';
    connection.query(query, [provinceId, districtName], (err, result) => {
      if (err) {
        console.error('Error inserting district:', err);
        districtCount++;
      } else {
        districtMap[districtKey] = result.insertId;
        console.log(`Inserted district: ${districtName} with ID: ${result.insertId}`);
        districtCount++;
      }
      
      if (districtCount === districts.length) {
        // All districts processed, now insert revitalization data
        insertRevitalizationData(data, districtMap, provinceMap);
      }
    });
  });
}

function insertRevitalizationData(data, districtMap, provinceMap) {
  let insertedCount = 0;
  const totalCount = data.length;
  
  if (totalCount === 0) {
    console.log('No data to import');
    connection.end();
    return;
  }
  
  // Process each education level separately
  data.forEach(item => {
    if (!item.kode_pro || !item.kode_kab) {
      insertedCount++;
      if (insertedCount === totalCount) {
        console.log('All data processed!');
        connection.end();
      }
      return;
    }
    
    const districtKey = `${item.kode_pro}-${item.kode_kab}`;
    const districtId = districtMap[districtKey];
    
    if (!districtId) {
      insertedCount++;
      if (insertedCount === totalCount) {
        console.log('All data processed!');
        connection.end();
      }
      return;
    }
    
    // Process PAUD data
    if (item.Jml_rev_paud && item.Jml_rev_paud !== '0') {
      const budgetPaud = parseInt(item.anggaran_rev_paud.replace(/\s+/g, '').replace(/,/g, '')) || 0;
      const query = 'INSERT INTO revitalizations (district_id, education_level, school_count, budget) VALUES (?, ?, ?, ?)';
      connection.query(query, [
        districtId, 
        'paud', 
        parseInt(item.Jml_rev_paud) || 0, 
        budgetPaud
      ], (err) => {
        if (err) {
          console.error('Error inserting PAUD data:', err);
        }
      });
    }
    
    // Process SD data
    if (item.Jml_revi_sd && item.Jml_revi_sd !== '0') {
      const budgetSd = parseInt(item.anggaran_rev_sd.replace(/\s+/g, '').replace(/,/g, '')) || 0;
      const query = 'INSERT INTO revitalizations (district_id, education_level, school_count, budget) VALUES (?, ?, ?, ?)';
      connection.query(query, [
        districtId, 
        'sd', 
        parseInt(item.Jml_revi_sd) || 0, 
        budgetSd
      ], (err) => {
        if (err) {
          console.error('Error inserting SD data:', err);
        }
      });
    }
    
    // Process SMP data
    if (item.Jml_rev_smp && item.Jml_rev_smp !== '0') {
      const budgetSmp = parseInt(item.anggaran_rev_smp.replace(/\s+/g, '').replace(/,/g, '')) || 0;
      const query = 'INSERT INTO revitalizations (district_id, education_level, school_count, budget) VALUES (?, ?, ?, ?)';
      connection.query(query, [
        districtId, 
        'smp', 
        parseInt(item.Jml_rev_smp) || 0, 
        budgetSmp
      ], (err) => {
        if (err) {
          console.error('Error inserting SMP data:', err);
        }
      });
    }
    
    // Process SMA data
    if (item.Jml_rev_sma && item.Jml_rev_sma !== '0') {
      const budgetSma = parseInt(item.anggaran_rev_sma.replace(/\s+/g, '').replace(/,/g, '')) || 0;
      const query = 'INSERT INTO revitalizations (district_id, education_level, school_count, budget) VALUES (?, ?, ?, ?)';
      connection.query(query, [
        districtId, 
        'sma', 
        parseInt(item.Jml_rev_sma) || 0, 
        budgetSma
      ], (err) => {
        if (err) {
          console.error('Error inserting SMA data:', err);
        }
      });
    }
    
    insertedCount++;
    if (insertedCount === totalCount) {
      console.log('All data imported successfully!');
      connection.end();
    }
  });
}

// Run the import
importData();