// frontend/src/services/mockApi.ts
export const getMockNationalData = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    { education_level: 'paud', total_schools: 866, total_budget: 330409135700 },
    { education_level: 'sd', total_schools: 3901, total_budget: 2565969815110 },
    { education_level: 'smp', total_schools: 2295, total_budget: 3208266905543 },
    { education_level: 'sma', total_schools: 1918, total_budget: 2211475238903 }
  ];
};

export const getMockProvinces = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    { code: '11', name: 'Aceh', total_schools: 150, total_budget: 500000000000 },
    { code: '12', name: 'Sumatera Utara', total_schools: 200, total_budget: 750000000000 },
    { code: '13', name: 'Sumatera Barat', total_schools: 120, total_budget: 400000000000 },
    // Add more provinces as needed
  ];
};