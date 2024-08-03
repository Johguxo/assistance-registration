

export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  date_birth: string;
  DNI: number;
  institution?: Institution | null;
  key: string;
  age: string;
  have_auth: boolean | null;
  area?: string,
  isLeader: string,
  saturday: boolean;
  sunday: boolean;
}

export interface Institution {
  _id: string;
  name: string;
  type: number;
  address?: string;
  deanery?: Deanery;
  deanery_id?: string;
}
export interface Deanery {
  _id: string;
  name: string;
  address: string;
  vicariate_id: string;
  vicar?: Vicaria;
}

export interface Vicaria {
  _id: string;
  name: string;
  address: string;
  deaneries?: Deanery[];
}
