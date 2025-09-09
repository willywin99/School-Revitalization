// backend/routes/dashboardRoutes.ts
import express from 'express';
import {
  getNationalData,
  getProvinceData,
  getDistrictData,
  getProvinces
} from '../controllers/dashboardController';

const router = express.Router();

router.get('/national', getNationalData);
router.get('/provinces', getProvinces);
router.get('/province/:code', getProvinceData);
router.get('/district/:id', getDistrictData);

export default router;