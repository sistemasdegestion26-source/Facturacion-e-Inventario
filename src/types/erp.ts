export interface Product {
  id: string;
  description: string; // Descripción del producto
  price: number;       // Precio
  stock: number;       // Cantidad disponible en inventario
  createdAt?: string;
}

export interface Client {
  id: string;
  name: string;        // Nombre o Razón Social
  phone?: string;      // Teléfono / Contacto
  document?: string;   // Cédula / RIF / NIT
  address?: string;    // Dirección
}

export interface DocumentItem {
  id: string;
  productId?: string;
  quantity: number;
  description: string;
  unitPrice: number;
  total: number;
}

export type DocumentType = 'PRESUPUESTO' | 'FACTURACION';

export interface DocumentRecord {
  id: string;
  type: DocumentType;
  number: string;      // ej. 001, 002
  date: string;        // ej. 08/10/2026
  clientName: string;
  clientPhone?: string;
  items: DocumentItem[];
  subtotal: number;
  total: number;
  status: 'PENDIENTE' | 'FACTURADO' | 'PAGADO';
  createdAt: string;
}

export type ActiveTab = 'panel' | 'inventario' | 'presupuesto' | 'facturacion' | 'clientes';
