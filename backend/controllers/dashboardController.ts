// backend/controllers/dashboardController.ts
import { Request, Response } from 'express';
import db from '../config/database';

// Get national aggregate data
export const getNationalData = (req: Request, res: Response) => {
  const query = `
    SELECT 
      education_level,
      SUM(school_count) as total_schools,
      SUM(budget) as total_budget
    FROM revitalizations
    GROUP BY education_level
  `;

  console.log('Executing query:', query); // Debug log

  db.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
};

// Get data by province
export const getProvinceData = (req: Request, res: Response) => {
  const provinceCode = req.params.code;
  
  const query = `
    SELECT 
      p.name as province_name,
      d.name as district_name,
      r.education_level,
      r.school_count,
      r.budget
    FROM provinces p
    JOIN districts d ON p.id = d.province_id
    JOIN revitalizations r ON d.id = r.district_id
    WHERE p.code = ?
    ORDER BY d.name, r.education_level
  `;

  db.query(query, [provinceCode], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
};

// Get data by district
export const getDistrictData = (req: Request, res: Response) => {
  const districtId = req.params.id;
  
  const query = `
    SELECT 
      d.name as district_name,
      p.name as province_name,
      r.education_level,
      r.school_count,
      r.budget
    FROM districts d
    JOIN provinces p ON d.province_id = p.id
    JOIN revitalizations r ON d.id = r.district_id
    WHERE d.id = ?
    ORDER BY r.education_level
  `;

  db.query(query, [districtId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
};

// Get all provinces for the map
export const getProvinces = (req: Request, res: Response) => {
  const query = `
    SELECT 
      p.code,
      p.name,
      p.coordinates,
      SUM(r.school_count) as total_schools,
      SUM(r.budget) as total_budget
    FROM provinces p
    LEFT JOIN districts d ON p.id = d.province_id
    LEFT JOIN revitalizations r ON d.id = r.district_id
    GROUP BY p.id, p.code, p.name, p.coordinates
  `;

  db.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
};