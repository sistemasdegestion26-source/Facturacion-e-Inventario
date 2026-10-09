import { Product, Client, DocumentRecord } from '../types/erp';
import { INITIAL_PRODUCTS, INITIAL_CLIENTS, INITIAL_DOCUMENTS } from '../data/initialData';

const KEYS = {
  PRODUCTS: 'creando_products_v2',
  CLIENTS: 'creando_clients_v2',
  DOCUMENTS: 'creando_documents_v2',
  AUTH: 'creando_auth_session_v2',
  PASSWORD: 'creando_auth_password_v2'
};

export const storageService = {
  getProducts(): Product[] {
    try {
      const data = localStorage.getItem(KEYS.PRODUCTS);
      return data ? JSON.parse(data) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  saveProducts(products: Product[]): void {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  },

  getClients(): Client[] {
    try {
      const data = localStorage.getItem(KEYS.CLIENTS);
      return data ? JSON.parse(data) : INITIAL_CLIENTS;
    } catch {
      return INITIAL_CLIENTS;
    }
  },

  saveClients(clients: Client[]): void {
    localStorage.setItem(KEYS.CLIENTS, JSON.stringify(clients));
  },

  getDocuments(): DocumentRecord[] {
    try {
      const data = localStorage.getItem(KEYS.DOCUMENTS);
      return data ? JSON.parse(data) : INITIAL_DOCUMENTS;
    } catch {
      return INITIAL_DOCUMENTS;
    }
  },

  saveDocuments(docs: DocumentRecord[]): void {
    localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(docs));
  },

  getAuth(): boolean {
    return localStorage.getItem(KEYS.AUTH) === 'true';
  },

  setAuth(isLoggedIn: boolean): void {
    if (isLoggedIn) {
      localStorage.setItem(KEYS.AUTH, 'true');
    } else {
      localStorage.removeItem(KEYS.AUTH);
    }
  },

  getPassword(): string {
    return localStorage.getItem(KEYS.PASSWORD) || 'Ceo2026';
  },

  setPassword(newPass: string): void {
    localStorage.setItem(KEYS.PASSWORD, newPass);
  },

  async syncFromServer(): Promise<{ success: boolean; data?: any; updatedAt?: number }> {
    try {
      const res = await fetch('/api/sync');
      if (!res.ok) return { success: false };
      const json = await res.json();
      return json;
    } catch {
      return { success: false };
    }
  },

  async syncToServer(payload: {
    products: Product[];
    clients: Client[];
    documents: DocumentRecord[];
    password?: string;
  }): Promise<{ success: boolean; updatedAt?: number }> {
    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) return { success: false };
      return await res.json();
    } catch {
      return { success: false };
    }
  },

  resetAll(): void {
    localStorage.removeItem(KEYS.PRODUCTS);
    localStorage.removeItem(KEYS.CLIENTS);
    localStorage.removeItem(KEYS.DOCUMENTS);
  }
};
