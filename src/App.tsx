import React, { useState, useEffect } from 'react';
import { Product, Client, DocumentRecord, ActiveTab } from './types/erp';
import { storageService } from './services/storageService';

import { LoginView } from './components/LoginView';
import { HeaderNav } from './components/HeaderNav';
import { PanelView } from './components/PanelView';
import { InventoryView } from './components/InventoryView';
import { PresupuestoView } from './components/PresupuestoView';
import { FacturacionView } from './components/FacturacionView';
import { ClientesView } from './components/ClientesView';
import { DocumentFormatModal } from './components/DocumentFormatModal';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => storageService.getAuth());
  const [currentTab, setCurrentTab] = useState<ActiveTab>('panel');

  const [products, setProducts] = useState<Product[]>(() => storageService.getProducts());
  const [clients, setClients] = useState<Client[]>(() => storageService.getClients());
  const [documents, setDocuments] = useState<DocumentRecord[]>(() => storageService.getDocuments());

  const [selectedDocumentForView, setSelectedDocumentForView] = useState<DocumentRecord | null>(null);
  const [initialOpenDocType, setInitialOpenDocType] = useState<'PRESUPUESTO' | 'FACTURACION' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync to storage
  useEffect(() => {
    storageService.saveProducts(products);
  }, [products]);

  useEffect(() => {
    storageService.saveClients(clients);
  }, [clients]);

  useEffect(() => {
    storageService.saveDocuments(documents);
  }, [documents]);

  // Auth Handlers
  const handleLoginSuccess = () => {
    storageService.setAuth(true);
    setIsAuthenticated(true);
    showToast('Bienvenido, Hendrick.');
  };

  const handleLogout = () => {
    storageService.setAuth(false);
    setIsAuthenticated(false);
  };

  // Products Handlers (Solo Descripción y Precio)
  const handleSaveProduct = (product: Product) => {
    const exists = products.some(p => p.id === product.id);
    if (exists) {
      setProducts(products.map(p => p.id === product.id ? product : p));
      showToast(`Producto "${product.description}" actualizado.`);
    } else {
      setProducts([product, ...products]);
      showToast(`Producto "${product.description}" agregado al inventario.`);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
    showToast('Producto eliminado del inventario.');
  };

  // Clients Handlers
  const handleSaveClient = (client: Client) => {
    const exists = clients.some(c => c.id === client.id);
    if (exists) {
      setClients(clients.map(c => c.id === client.id ? client : c));
      showToast(`Cliente "${client.name}" actualizado.`);
    } else {
      setClients([client, ...clients]);
      showToast(`Cliente "${client.name}" registrado.`);
    }
  };

  const handleDeleteClient = (clientId: string) => {
    setClients(clients.filter(c => c.id !== clientId));
    showToast('Cliente eliminado.');
  };

  // Documents Handlers (Presupuesto & Facturación)
  const handleSaveDocument = (doc: DocumentRecord) => {
    setDocuments([doc, ...documents]);
    showToast(`${doc.type === 'PRESUPUESTO' ? 'Presupuesto' : 'Factura'} #${doc.number} guardado con éxito.`);
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments(documents.filter(d => d.id !== docId));
    showToast('Documento eliminado.');
  };

  const handleToggleInvoiceStatus = (docId: string) => {
    setDocuments(documents.map(d => {
      if (d.id === docId) {
        const nextStatus = d.status === 'PAGADO' ? 'PENDIENTE' : 'PAGADO';
        return { ...d, status: nextStatus };
      }
      return d;
    }));
    showToast('Estado de factura actualizado.');
  };

  // Convert Presupuesto to Factura with matching CREANDO format
  const handleConvertToInvoice = (presupuesto: DocumentRecord) => {
    const facturasCount = documents.filter(d => d.type === 'FACTURACION').length;
    const newNumber = String(facturasCount + 1).padStart(3, '0');

    const today = new Date();
    const d = String(today.getDate()).padStart(2, '0');
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const y = today.getFullYear();
    const todayStr = `${d}/${m}/${y}`;

    const newInvoice: DocumentRecord = {
      id: `doc-${Date.now()}`,
      type: 'FACTURACION',
      number: newNumber,
      date: todayStr,
      clientName: presupuesto.clientName,
      clientPhone: presupuesto.clientPhone,
      items: [...presupuesto.items],
      subtotal: presupuesto.subtotal,
      total: presupuesto.total,
      status: 'PAGADO',
      createdAt: new Date().toISOString()
    };

    // Actualizamos el presupuesto a FACTURADO y agregamos la Factura
    const updatedDocs = documents.map(doc => 
      doc.id === presupuesto.id ? { ...doc, status: 'FACTURADO' as const } : doc
    );

    setDocuments([newInvoice, ...updatedDocs]);
    showToast(`Presupuesto #${presupuesto.number} convertido a Factura #${newNumber}.`);
    
    // Si estaba abierto el modal, actualizamos la vista
    if (selectedDocumentForView?.id === presupuesto.id) {
      setSelectedDocumentForView(newInvoice);
    } else {
      setCurrentTab('facturacion');
    }
  };

  // Open Quick Document from Panel
  const handleOpenNewDocument = (type: 'PRESUPUESTO' | 'FACTURACION') => {
    setInitialOpenDocType(type);
    if (type === 'PRESUPUESTO') {
      setCurrentTab('presupuesto');
    } else {
      setCurrentTab('facturacion');
    }
  };

  // If not logged in, render single Login screen
  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* Soft Header Navbar */}
      <HeaderNav
        currentTab={currentTab}
        onSelectTab={tab => {
          setInitialOpenDocType(null);
          setCurrentTab(tab);
        }}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentTab === 'panel' && (
          <PanelView
            products={products}
            clients={clients}
            documents={documents}
            onNavigate={setCurrentTab}
            onOpenNewDocument={handleOpenNewDocument}
            onViewDocument={setSelectedDocumentForView}
          />
        )}

        {currentTab === 'inventario' && (
          <InventoryView
            products={products}
            onSaveProduct={handleSaveProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

        {currentTab === 'presupuesto' && (
          <PresupuestoView
            documents={documents}
            products={products}
            clients={clients}
            onSaveDocument={handleSaveDocument}
            onDeleteDocument={handleDeleteDocument}
            onConvertToInvoice={handleConvertToInvoice}
            onViewDocument={setSelectedDocumentForView}
            initialOpenCreate={initialOpenDocType === 'PRESUPUESTO'}
          />
        )}

        {currentTab === 'facturacion' && (
          <FacturacionView
            documents={documents}
            products={products}
            clients={clients}
            onSaveDocument={handleSaveDocument}
            onDeleteDocument={handleDeleteDocument}
            onToggleStatus={handleToggleInvoiceStatus}
            onViewDocument={setSelectedDocumentForView}
            initialOpenCreate={initialOpenDocType === 'FACTURACION'}
          />
        )}

        {currentTab === 'clientes' && (
          <ClientesView
            clients={clients}
            onSaveClient={handleSaveClient}
            onDeleteClient={handleDeleteClient}
          />
        )}
      </main>

      {/* Printable Official CREANDO Document Format Modal */}
      {selectedDocumentForView && (
        <DocumentFormatModal
          document={selectedDocumentForView}
          onClose={() => setSelectedDocumentForView(null)}
          onConvertToInvoice={handleConvertToInvoice}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-lg border border-slate-700 animate-fade-in flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
