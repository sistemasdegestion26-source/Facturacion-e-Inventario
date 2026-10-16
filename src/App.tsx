import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Product, Client, DocumentRecord, ActiveTab } from './types/erp.ts';
import { storageService } from './services/storageService';

import { LoginView } from './components/LoginView';
import { HeaderNav } from './components/HeaderNav';
import { PanelView } from './components/PanelView';
import { InventoryView } from './components/InventoryView';
import { PresupuestoView } from './components/PresupuestoView';
import { FacturacionView } from './components/FacturacionView';
import { ClientesView } from './components/ClientesView';
import { DocumentFormatModal } from './components/DocumentFormatModal';
import { UserProfileModal } from './components/UserProfileModal';
import { DriveBackupModal } from './components/DriveBackupModal';
import { DataManagementModal } from './components/DataManagementModal';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => storageService.getAuth());
  const [currentTab, setCurrentTab] = useState<ActiveTab>('panel');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState<boolean>(false);
  const [isDataManagementOpen, setIsDataManagementOpen] = useState<boolean>(false);
  
  // Estados para sincronización en tiempo real
  const [isSynced, setIsSynced] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('En vivo');

  const [products, setProducts] = useState<Product[]>(() => storageService.getProducts());
  const [clients, setClients] = useState<Client[]>(() => storageService.getClients());
  const [documents, setDocuments] = useState<DocumentRecord[]>(() => storageService.getDocuments());

  const [selectedDocumentForView, setSelectedDocumentForView] = useState<DocumentRecord | null>(null);
  const [initialOpenDocType, setInitialOpenDocType] = useState<'PRESUPUESTO' | 'FACTURACION' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Referencias para control de sincronización y evitar sobreescritura accidental al iniciar
  const lastSyncedTimestampRef = useRef<number>(0);
  const isBootstrappedRef = useRef<boolean>(false);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  // Función para guardar cambios locales y transmitirlos inmediatamente al servidor
  const commitData = useCallback((
    newProducts: Product[],
    newClients: Client[],
    newDocs: DocumentRecord[],
    pass?: string
  ) => {
    setProducts(newProducts);
    setClients(newClients);
    setDocuments(newDocs);

    storageService.saveProducts(newProducts);
    storageService.saveClients(newClients);
    storageService.saveDocuments(newDocs);

    const payload = {
      products: newProducts,
      clients: newClients,
      documents: newDocs,
      password: pass || storageService.getPassword()
    };

    setIsSyncing(true);
    storageService.syncToServer(payload).then(res => {
      setIsSyncing(false);
      if (res.success && res.updatedAt) {
        lastSyncedTimestampRef.current = res.updatedAt;
        setIsSynced(true);
        const timeStr = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        setLastSyncTime(timeStr);
      }
    });
  }, []);

  // Sincronización en tiempo real multidispositivo (Teléfono y PC)
  const syncWithServer = useCallback(async (isManual = false) => {
    if (isManual) setIsSyncing(true);
    try {
      const res = await storageService.syncFromServer();
      if (res.success && res.data) {
        const serverTimestamp = res.updatedAt || 0;

        // Si es el primer arranque en este dispositivo, cargamos la base de datos centralizada
        if (!isBootstrappedRef.current) {
          isBootstrappedRef.current = true;
          lastSyncedTimestampRef.current = serverTimestamp;

          if (res.data.products) {
            setProducts(res.data.products);
            storageService.saveProducts(res.data.products);
          }
          if (res.data.clients) {
            setClients(res.data.clients);
            storageService.saveClients(res.data.clients);
          }
          if (res.data.documents) {
            setDocuments(res.data.documents);
            storageService.saveDocuments(res.data.documents);
          }
          if (res.data.password) {
            storageService.setPassword(res.data.password);
          }
          setIsSynced(true);
          const timeStr = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
          setLastSyncTime(timeStr);
          if (isManual) showToast('Datos sincronizados con éxito.');
          return;
        }

        // Si el servidor tiene datos más recientes (cargados desde otro teléfono o PC)
        if (serverTimestamp > lastSyncedTimestampRef.current) {
          lastSyncedTimestampRef.current = serverTimestamp;

          if (res.data.products) {
            setProducts(res.data.products);
            storageService.saveProducts(res.data.products);
          }
          if (res.data.clients) {
            setClients(res.data.clients);
            storageService.saveClients(res.data.clients);
          }
          if (res.data.documents) {
            setDocuments(res.data.documents);
            storageService.saveDocuments(res.data.documents);
          }
          if (res.data.password) {
            storageService.setPassword(res.data.password);
          }

          setIsSynced(true);
          const timeStr = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
          setLastSyncTime(timeStr);
          showToast('Actualizado en tiempo real desde otro dispositivo.');
        } else if (isManual) {
          showToast('El sistema está al día con la nube.');
        }
      }
    } catch (err) {
      console.error('Error durante la sincronización:', err);
    } finally {
      if (isManual) setIsSyncing(false);
    }
  }, [showToast]);

  // Polling automático en tiempo real cada 3 segundos + al reactivar la pestaña en teléfono o PC
  useEffect(() => {
    syncWithServer(false);

    const interval = setInterval(() => {
      syncWithServer(false);
    }, 3000);

    const onFocus = () => syncWithServer(false);
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncWithServer(false);
      }
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [syncWithServer]);

  // Auth Handlers
  const handleLoginSuccess = () => {
    storageService.setAuth(true);
    setIsAuthenticated(true);
    syncWithServer(false);
    showToast('Bienvenido, Hendrick.');
  };

  const handleLogout = () => {
    storageService.setAuth(false);
    setIsAuthenticated(false);
  };

  // Products Handlers (Guardar y Editar Datos Cargados)
  const handleSaveProduct = (product: Product) => {
    const exists = products.some(p => p.id === product.id);
    let nextProds: Product[];
    if (exists) {
      nextProds = products.map(p => p.id === product.id ? product : p);
      showToast(`Producto "${product.description}" actualizado.`);
    } else {
      nextProds = [product, ...products];
      showToast(`Producto "${product.description}" agregado al inventario.`);
    }
    commitData(nextProds, clients, documents);
  };

  const handleQuickAdjustStock = (productId: string, delta: number) => {
    const nextProds = products.map(p => {
      if (p.id === productId) {
        const nextStock = Math.max(0, p.stock + delta);
        return { ...p, stock: nextStock };
      }
      return p;
    });
    commitData(nextProds, clients, documents);
  };

  const handleDeleteProduct = (productId: string) => {
    const nextProds = products.filter(p => p.id !== productId);
    showToast('Producto eliminado del inventario.');
    commitData(nextProds, clients, documents);
  };

  // Clients Handlers (Guardar y Editar Datos Cargados)
  const handleSaveClient = (client: Client) => {
    const exists = clients.some(c => c.id === client.id);
    let nextClients: Client[];
    if (exists) {
      nextClients = clients.map(c => c.id === client.id ? client : c);
      showToast(`Cliente "${client.name}" actualizado.`);
    } else {
      nextClients = [client, ...clients];
      showToast(`Cliente "${client.name}" registrado.`);
    }
    commitData(products, nextClients, documents);
  };

  const handleDeleteClient = (clientId: string) => {
    const nextClients = clients.filter(c => c.id !== clientId);
    showToast('Cliente eliminado.');
    commitData(products, nextClients, documents);
  };

  // Documents Handlers (Guardar y Editar Presupuestos & Facturas Cargados)
  const handleSaveDocument = (doc: DocumentRecord) => {
    const exists = documents.some(d => d.id === doc.id);
    let nextDocs: DocumentRecord[];
    if (exists) {
      nextDocs = documents.map(d => d.id === doc.id ? doc : d);
      showToast(`${doc.type === 'PRESUPUESTO' ? 'Presupuesto' : 'Factura'} #${doc.number} actualizado.`);
    } else {
      nextDocs = [doc, ...documents];
      showToast(`${doc.type === 'PRESUPUESTO' ? 'Presupuesto' : 'Factura'} #${doc.number} guardado con éxito.`);
    }
    commitData(products, clients, nextDocs);
  };

  const handleDeleteDocument = (docId: string) => {
    const nextDocs = documents.filter(d => d.id !== docId);
    showToast('Documento eliminado.');
    commitData(products, clients, nextDocs);
  };

  const handleToggleInvoiceStatus = (docId: string) => {
    const nextDocs: DocumentRecord[] = documents.map(d => {
      if (d.id === docId) {
        const nextStatus: DocumentRecord['status'] = d.status === 'PAGADO' ? 'PENDIENTE' : 'PAGADO';
        return { ...d, status: nextStatus };
      }
      return d;
    });
    showToast('Estado de factura actualizado.');
    commitData(products, clients, nextDocs);
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

    const nextDocs = [newInvoice, ...updatedDocs];
    showToast(`Presupuesto #${presupuesto.number} convertido a Factura #${newNumber}.`);
    commitData(products, clients, nextDocs);
    
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

  const handleRestoreBackup = (data: { products?: Product[]; clients?: Client[]; documents?: DocumentRecord[] }) => {
    const nextProds = data.products || products;
    const nextClients = data.clients || clients;
    const nextDocs = data.documents || documents;
    commitData(nextProds, nextClients, nextDocs);
  };

  const handleCommitClean = (
    newProducts: Product[],
    newClients: Client[],
    newDocs: DocumentRecord[],
    msg: string
  ) => {
    commitData(newProducts, newClients, newDocs);
    showToast(msg);
  };

  // If not logged in, render single Login screen
  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gradient-commercial-subtle text-slate-800 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-slate-900">
      
      {/* Header Navbar con Logo CREANDO y colores metalizados */}
      <HeaderNav
        currentTab={currentTab}
        onSelectTab={tab => {
          setInitialOpenDocType(null);
          setCurrentTab(tab);
        }}
        onLogout={handleLogout}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenDriveBackup={() => setIsDriveModalOpen(true)}
        onOpenDataManagement={() => setIsDataManagementOpen(true)}
        isSynced={isSynced}
        isSyncing={isSyncing}
        onManualSync={() => syncWithServer(true)}
        lastSyncTime={lastSyncTime}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-6 lg:p-8 pb-24 md:pb-8">
        {currentTab === 'panel' && (
          <PanelView
            products={products}
            clients={clients}
            documents={documents}
            onNavigate={setCurrentTab}
            onOpenNewDocument={handleOpenNewDocument}
            onViewDocument={setSelectedDocumentForView}
            onOpenDataManagement={() => setIsDataManagementOpen(true)}
          />
        )}

        {currentTab === 'inventario' && (
          <InventoryView
            products={products}
            onSaveProduct={handleSaveProduct}
            onDeleteProduct={handleDeleteProduct}
            onQuickAdjustStock={handleQuickAdjustStock}
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

      {/* User Profile & Password Edit Modal */}
      {isProfileModalOpen && (
        <UserProfileModal
          onClose={() => setIsProfileModalOpen(false)}
          onSuccess={msg => showToast(msg)}
        />
      )}

      {/* Google Drive Backup & Restore Modal */}
      {isDriveModalOpen && (
        <DriveBackupModal
          products={products}
          clients={clients}
          documents={documents}
          onClose={() => setIsDriveModalOpen(false)}
          onRestoreBackup={handleRestoreBackup}
          onSuccess={msg => showToast(msg)}
        />
      )}

      {/* Limpieza y Gestión de Datos Modal */}
      {isDataManagementOpen && (
        <DataManagementModal
          products={products}
          clients={clients}
          documents={documents}
          onClose={() => setIsDataManagementOpen(false)}
          onCommitClean={handleCommitClean}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-16 md:bottom-5 right-5 z-50 px-4 py-2.5 rounded-2xl bg-metallic-logo-inner text-white text-xs font-bold shadow-2xl border border-cyan-400/40 animate-fade-in flex items-center gap-2 sheen-metallic">
          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
