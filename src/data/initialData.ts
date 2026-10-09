import { Product, Client, DocumentRecord } from '../types/erp';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    description: 'CARNETS SUBLIMADOS CON ACCESORIOS',
    price: 5.00,
    stock: 2500,
  },
  {
    id: 'prod-2',
    description: 'CARNETS SUBLIMADOS CON LANYARD PERSONALIZADOS',
    price: 6.50,
    stock: 1800,
  },
  {
    id: 'prod-3',
    description: 'TAZAS PERSONALIZADAS 11OZ SUBLIMADAS',
    price: 4.00,
    stock: 450,
  },
  {
    id: 'prod-4',
    description: 'GORRAS BORDADAS / ESTAMPADAS',
    price: 7.00,
    stock: 320,
  },
  {
    id: 'prod-5',
    description: 'CHEMISES BORDADAS TELA PIQUÉ',
    price: 12.00,
    stock: 150,
  },
  {
    id: 'prod-6',
    description: 'LLAVEROS ACRÍLICOS PERSONALIZADOS',
    price: 1.50,
    stock: 800,
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-1',
    name: 'Corporación Industrial Tinaquillo',
    phone: '0412-5551234',
    document: 'J-30491827-0',
    address: 'Av. Miranda, Centro Empresarial'
  },
  {
    id: 'cli-2',
    name: 'Colegio Universitario San Juan',
    phone: '0414-7778901',
    document: 'G-20098412-3',
    address: 'Sector Buenos Aires'
  },
  {
    id: 'cli-3',
    name: 'Eventos & Producciones Horizonte',
    phone: '0424-3334567',
    document: 'V-18492019-1',
    address: 'Calle Bolívar'
  }
];

export const INITIAL_DOCUMENTS: DocumentRecord[] = [
  {
    id: 'doc-1',
    type: 'PRESUPUESTO',
    number: '001',
    date: '08/10/2026',
    clientName: 'Corporación Industrial Tinaquillo',
    clientPhone: '0412-5551234',
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        quantity: 1000,
        description: 'CARNETS SUBLIMADOS CON ACCESORIOS',
        unitPrice: 5.00,
        total: 5000.00
      },
      {
        id: 'item-2',
        productId: 'prod-2',
        quantity: 1000,
        description: 'CARNETS SUBLIMADOS CON LANYARD PERSONALIZADOS',
        unitPrice: 6.50,
        total: 6500.00
      }
    ],
    subtotal: 11500.00,
    total: 11500.00,
    status: 'PENDIENTE',
    createdAt: '2026-10-08 10:30'
  },
  {
    id: 'doc-2',
    type: 'FACTURACION',
    number: '001',
    date: '05/10/2026',
    clientName: 'Colegio Universitario San Juan',
    clientPhone: '0414-7778901',
    items: [
      {
        id: 'item-3',
        productId: 'prod-3',
        quantity: 50,
        description: 'TAZAS PERSONALIZADAS 11OZ SUBLIMADAS',
        unitPrice: 4.00,
        total: 200.00
      }
    ],
    subtotal: 200.00,
    total: 200.00,
    status: 'PAGADO',
    createdAt: '2026-10-05 14:15'
  }
];
