
import { urlBase } from '@/config/config';
import axios from 'axios';

export const fetchInstitutions = async () => {
  try {
      const response = await axios.get(`${process.env.URL_BASE}/institutions`);
      if (!response.status) {
          throw new Error('Network response was not ok');
      }
      return await response.data;
  } catch (error) {
      console.error('Error fetching dataaaa:', error);
      throw error;
  }
};