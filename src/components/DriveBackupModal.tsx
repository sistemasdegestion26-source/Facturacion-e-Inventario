import React, { useState, useRef } from 'react';
import { 
  CloudUpload, 
  Download, 
  FolderUp, 
  CheckCircle2, 
  Upload, 
  X, 
  Share2, 
  ExternalLink,
  ShieldCheck,
  FileSpreadsheet,
  FileJson,
  Smartphone,
  Laptop,
  Sparkles,
  Info
} from 'lucide-react';
import { Product, Client, DocumentRecord } from '../types/erp';
import { CreandoLogo } from './CreandoLogo';

interface DriveBackupModalProps {
  products: Product[];
  clients: Client[];
  documents: DocumentRecord[];
  onClose: () => void;
  onRestoreBackup: (backupData: any) => void;
  onSuccess: (msg: string) => void;
}

export const DriveBackupModal: React.FC<DriveBackupModalProps> = ({
  products,
  clients,
  documents,
  onClose,
  onRestoreBackup,
  onSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [isSharing, setIsSharing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalItems = products.length + clients.length + documents.length;
  const today = new Date().toISOString().split('T')[0];
  const filename = `CREANDO_Respaldo_Drive_${today}.json`;
  const csvFilename = `CREANDO_Inventario_y_Ventas_${today}.csv`;

  const generateBackupPayload = () => {
    return {
      sistema: 'CREANDO - Sistema Administrativo',
      version: '2.6',
      fechaRespaldo: new Date().toISOString(),
      dispositivo: typeof navigator !== 'undefined' ? navigator.userAgent : 'Desconocido',
      resumen: {
        totalProductos: products.length,
        totalClientes: clients.length,
        totalDocumentos: documents.length,
        totalRegistros: totalItems
      },
      datos: {
        products,
        clients,
        documents
      }
    };
  };

  // Descarga del archivo JSON oficial para Drive
  const handleDownload = () => {
    const payload = generateBackupPayload();
    const dataStr = JSON.stringify(payload, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onSuccess('Archivo de respaldo descargado. Listo para Google Drive.');
  };

  // Exportar a CSV compatible con Google Sheets en Drive
  const handleExportCSV = () => {
    // Generar archivo CSV para hojas de cálculo en Drive
    let csvContent = 'tipo,identificador,descripcion_o_nombre,valor_o_total,cantidad_o_telefono,estado_o_fecha\n';
    
    // Productos
    products.forEach(p => {
      csvContent += `"PRODUCTO","${p.id}","${p.description.replace(/"/g, '""')}","${p.price}","${p.stock}",""\n`;
    });

    // Clientes
    clients.forEach(c => {
      csvContent += `"CLIENTE","${c.id}","${c.name.replace(/"/g, '""')}","","${c.phone || ''}","${c.address || ''}"\n`;
    });

    // Documentos
    documents.forEach(d => {
      csvContent += `"${d.type}","#${d.number}","${d.clientName.replace(/"/g, '""')}","${d.total}","${d.items.length} items","${d.status || d.date}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = csvFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onSuccess('Copia en formato Excel/Sheets descargada para Google Drive.');
  };

  // Compartir directamente a la app de Google Drive en Android / iPhone
  const handleShareToDrive = async () => {
    setIsSharing(true);
    const payload = generateBackupPayload();
    const dataStr = JSON.stringify(payload, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const file = new File([blob], filename, { type: 'application/json' });

    // En teléfonos Android y iPhone, navigator.canShare permite seleccionar la app de Google Drive
    if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: 'Respaldo CREANDO para Google Drive',
          text: `Copia de seguridad oficial de datos CREANDO (${totalItems} registros) - ${today}`,
          files: [file]
        });
        onSuccess('Respaldo enviado a Google Drive.');
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          handleDownload();
        }
      } finally {
        setIsSharing(false);
      }
    } else {
      // Fallback para PC o navegadores sin Web Share Files: descarga directa
      handleDownload();
      setIsSharing(false);
    }
  };

  const handleOpenGoogleDrive = () => {
    window.open('https://drive.google.com/drive/my-drive', '_blank');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.datos && Array.isArray(parsed.datos.products)) {
          onRestoreBackup(parsed.datos);
          onSuccess('¡Datos restaurados con éxito desde el respaldo!');
          onClose();
        } else if (Array.isArray(parsed.products)) {
          onRestoreBackup(parsed);
          onSuccess('¡Datos restaurados con éxito!');
          onClose();
        } else {
          alert('El archivo no tiene el formato válido de respaldo CREANDO.');
        }
      } catch {
        alert('Error al leer el archivo de respaldo. Asegúrese de que sea un archivo JSON válido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-up max-h-[92vh] flex flex-col">
        
        {/* Header con colores internos del logo degradado y metalizado */}
        <div className="bg-metallic-logo-inner text-white px-6 py-4 flex items-center justify-between border-b border-cyan-800/40 sheen-metallic">
          <div className="flex items-center gap-2.5">
            <CreandoLogo size="xs" variant="icon" />
            <div>
              <h3 className="font-extrabold text-white text-sm sm:text-base flex items-center gap-1.5">
                <span>Respaldo en Google Drive</span>
                <span className="text-[10px] bg-metallic-gold text-slate-950 font-black px-2 py-0.5 rounded-full shadow-xs">
                  Nube
                </span>
              </h3>
              <p className="text-[11px] text-cyan-200">
                Guarda tus datos en la nube y accede desde tu teléfono o PC
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white rounded-lg p-1.5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-7 space-y-5 overflow-y-auto flex-1">

        {/* Tab switch: Exportar vs Restaurar */}
        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'export'
                ? 'bg-white text-[#0052cc] shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Enviar a Google Drive
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'import'
                ? 'bg-white text-[#0052cc] shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Restaurar Copia
          </button>
        </div>

        {activeTab === 'export' ? (
          <div className="space-y-4 text-xs">
            {/* Summary Box */}
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-800 text-xs sm:text-sm">
                <span className="flex items-center gap-1.5 text-[#0052cc]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Datos listos para enviar a Drive
                </span>
                <span className="bg-white px-2.5 py-0.5 rounded-full border border-blue-200 text-xs font-mono font-bold text-[#0052cc]">
                  {totalItems} registros
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] text-slate-600">
                <div className="bg-white p-2.5 rounded-xl border border-blue-100/60 text-center">
                  <span className="font-extrabold text-slate-900 text-sm block">{products.length}</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-tight">Productos</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-blue-100/60 text-center">
                  <span className="font-extrabold text-slate-900 text-sm block">{documents.length}</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-tight">Presup / Fact</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-blue-100/60 text-center">
                  <span className="font-extrabold text-slate-900 text-sm block">{clients.length}</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-tight">Clientes</span>
                </div>
              </div>
            </div>

            {/* Device-Specific Instructions (Android, iPhone, PC) */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-2.5">
              <div className="flex items-start gap-2">
                <Smartphone className="w-4 h-4 text-[#0052cc] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">En Teléfono (Android / iPhone):</span>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Al pulsar <strong>"Enviar a Google Drive"</strong> se abrirá el selector del sistema. Selecciona la aplicación <strong>Google Drive</strong> y elige la carpeta donde deseas guardar tu copia.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1 border-t border-slate-200/60">
                <Laptop className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">En Computadora o PC:</span>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Usa <strong>"Descargar Respaldo JSON"</strong> o <strong>"Exportar a Google Sheets"</strong> y arrastra el archivo a tu ventana de Drive.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleShareToDrive}
                disabled={isSharing}
                className="w-full py-3 px-4 bg-gradient-commercial-btn text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Share2 className="w-4 h-4 stroke-[2.5]" />
                <span>{isSharing ? 'Preparando archivo...' : 'Enviar a Google Drive'}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleDownload}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Descargar JSON</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-emerald-200 cursor-pointer"
                  title="Descargar tabla compatible con Google Sheets"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Google Sheets (CSV)</span>
                </button>
              </div>

              <button
                onClick={handleOpenGoogleDrive}
                className="w-full py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#0052cc]" />
                <span>Abrir mi Google Drive en la Web</span>
              </button>
            </div>
          </div>
        ) : (
          /* Import / Restore Tab */
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-amber-900 space-y-1.5">
              <span className="font-bold block text-xs">Restaurar copia de seguridad:</span>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Selecciona un archivo JSON respaldado previamente desde tu Google Drive para recuperar tus productos, presupuestos, facturas y clientes en cualquier dispositivo.
              </p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 rounded-2xl p-8 text-center cursor-pointer transition-all space-y-2"
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0052cc] mx-auto flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div className="font-bold text-slate-800 text-xs sm:text-sm">
                Seleccionar archivo de respaldo (.json)
              </div>
              <p className="text-[11px] text-slate-400">
                Haz clic aquí para seleccionar el archivo descargado de Drive
              </p>
            </div>
          </div>
        )}

        </div>
      </div>
    </div>
  );
};
