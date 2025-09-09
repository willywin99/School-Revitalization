// frontend/src/services/api.ts
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Update these interfaces to match what your backend actually returns
export interface RevitalizationData {
  education_level: string;
  total_schools?: number;
  total_budget?: number;
  school_count?: number;
  budget?: number;
  error?: string; // Add error property
}

export interface ProvinceData {
  code: string;
  name: string;
  coordinates: any;
  total_schools: number;
  total_budget: number;
}

export interface DistrictData {
  district_id?: number;
  district_name: string;
  province_name: string;
  education_level: string;
  school_count: number;
  budget: number;
}

// Fetch national data
export const getNationalData = async (): Promise<RevitalizationData[] | { error: string }> => {
  try {
    const response = await api.get('/national');
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    return { error: 'Failed to fetch national data' };
  }
};

// Fetch all provinces data
export const getProvinces = async (): Promise<ProvinceData[] | { error: string }> => {
  try {
    const response = await api.get('/provinces');
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    return { error: 'Failed to fetch provinces data' };
  }
};

// Fetch province data by code
export const getProvinceData = async (code: string): Promise<DistrictData[] | { error: string }> => {
  try {
    const response = await api.get(`/province/${code}`);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    return { error: 'Failed to fetch province data' };
  }
};

// Fetch district data by ID
export const getDistrictData = async (id: string): Promise<DistrictData[] | { error: string }> => {
  try {
    const response = await api.get(`/district/${id}`);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    return { error: 'Failed to fetch district data' };
  }
};

export default api;