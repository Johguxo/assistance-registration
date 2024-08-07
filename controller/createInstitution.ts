

import { urlBase } from '@/config/config';
import axios from 'axios';
import { Institution } from '@/models/interfaces';

export const createInstitution = async (institution: Omit<Institution, '_id'>): Promise<Institution> => {
  try {
    const response = await axios.post(`${urlBase}/institutions`, institution);
    if (response.status !== 201) { 
      throw new Error('Error creating institution');
    }
    return response.data;
  } catch (error) {
    console.error('Error creating institution:', error);
    throw error;
  }
};
