
export class XMart {
}

export interface Category {
    id: number;
    category: string;
    
}

export interface User {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phone?: string | null;
    country?: string | null;
    address1?: string | null;
    address2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    password?: string | null;
}
  