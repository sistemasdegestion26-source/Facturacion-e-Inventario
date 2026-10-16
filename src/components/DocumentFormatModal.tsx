import React from 'react';
import type { DocumentRecord } from '../types/erp.ts';
import { CreandoLogo } from './CreandoLogo';
import { Printer, X, CheckCircle2, ArrowRight } from 'lucide-react';

interface DocumentFormatModalProps {
  document: DocumentRecord | null;
  onClose: () => void;
  onConvertToInvoice?: (doc: DocumentRecord) => void;
}

export const DocumentFormatModal: React.FC<DocumentFormatModalProps> = ({
  document,
  onClose,
  onConvertToInvoice
}) => {
  if (!document) return null;

  const isPresupuesto = document.type === 'PRESUPUESTO';
  const title = isPresupuesto ? 'COTIZACIÓN' : 'FACTURA';

  const handlePrint = () => {
    window.print();
  };

  // Preparamos 12 filas mínimas para que tenga el aspecto idéntico a la plantilla factura.jfif
  const minRows = 10;
  const emptyRowsCount = Math.max(0, minRows - document.items.length);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/60 backdrop-blur-xs print:p-0 print:bg-white animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh] print:max-h-none print:border-none print:shadow-none animate-scale-up">
        
        {/* Modal Toolbar con degradado metalizado comercial (oculto al imprimir) */}
        <div className="bg-metallic-logo-inner text-white px-5 py-3.5 border-b border-cyan-800/40 flex items-center justify-between print:hidden sheen-metallic">
          <div className="flex items-center gap-2">
            <CreandoLogo size="xs" variant="icon" />
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Formato Oficial CREANDO
            </span>
            <span className="text-xs font-mono font-bold text-amber-300 bg-slate-900/70 px-2 py-0.5 rounded-md border border-amber-400/30">
              {title} #{document.number}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isPresupuesto && onConvertToInvoice && (
              <button
                onClick={() => onConvertToInvoice(document)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98"
                title="Convertir a Factura"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Facturar</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-metallic-gold text-slate-950 text-xs font-black transition-all shadow-md cursor-pointer active:scale-98 border border-amber-300/40"
            >
              <Printer className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Imprimir / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Paper Document matching factura.jfif EXACTLY */}
        <div className="p-6 sm:p-10 overflow-y-auto bg-white text-slate-900 print:p-6 space-y-4 text-xs font-sans">
          
          {/* Header Layout */}
          <div className="flex items-start justify-between gap-4">
            {/* Title Left */}
            <div className="w-1/3 pt-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                {title}
              </h1>
              {document.clientName && (
                <div className="mt-2 text-[11px] text-slate-600">
                  <span className="font-semibold block">Cliente:</span>
                  <p className="font-bold text-slate-800">{document.clientName}</p>
                  {document.clientPhone && <p className="text-slate-500">{document.clientPhone}</p>}
                </div>
              )}
            </div>

            {/* Logo Center */}
            <div className="w-1/3 flex justify-center">
              <CreandoLogo size="md" showTagline={true} />
            </div>

            {/* Blue Header Box Right */}
            <div className="w-1/3 flex justify-end">
              <div className="w-36 text-center overflow-hidden rounded-xs border-2 border-[#0052cc]">
                <div className="bg-[#0052cc] text-white font-bold text-[11px] py-0.5 uppercase tracking-wider">
                  FECHA
                </div>
                <div className="bg-white text-slate-900 font-bold py-1 text-xs font-mono">
                  {document.date}
                </div>
                <div className="bg-[#0052cc] text-white font-bold text-[10px] py-0.5 uppercase tracking-wider">
                  {isPresupuesto ? 'N• COTIZACIÓN' : 'N• FACTURA'}
                </div>
                <div className="bg-white text-slate-900 font-black py-1 text-sm font-mono">
                  {document.number}
                </div>
              </div>
            </div>
          </div>

          {/* Top Royal Blue Divider Bar */}
          <div className="w-full h-4 sm:h-5 bg-[#0052cc] rounded-xs mt-3"></div>

          {/* Items Table with exact borders and headers */}
          <div className="mt-2 border-2 border-[#0052cc] overflow-hidden">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-[#0052cc] text-white font-black text-[11px] sm:text-xs tracking-wider uppercase">
                  <th className="py-2.5 px-2 border-r border-white/40 text-center w-20">CANTIDAD</th>
                  <th className="py-2.5 px-3 border-r border-white/40 text-center">DESCRIPCIÓN</th>
                  <th className="py-2.5 px-2 border-r border-white/40 text-center w-28">PRECIO UNITARIO</th>
                  <th className="py-2.5 px-3 border-r border-white/40 text-center w-28">TOTAL</th>
                  <th className="py-2.5 px-3 text-center w-24">SUBTOTAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black text-slate-900">
                {document.items.map((it) => (
                  <tr key={it.id} className="min-h-[36px]">
                    <td className="py-2 px-2 text-center font-bold text-sm sm:text-base border-r border-black font-sans">
                      {it.quantity}
                    </td>
                    <td className="py-2 px-3 font-bold text-[11px] sm:text-xs border-r border-black uppercase font-sans">
                      {it.description}
                    </td>
                    <td className="py-2 px-2 text-center font-bold text-sm sm:text-base border-r border-black font-sans">
                      {it.unitPrice % 1 === 0 ? `${it.unitPrice}$` : `${it.unitPrice.toFixed(2)}$`}
                    </td>
                    <td className="py-2 px-3 text-center font-bold text-sm sm:text-base border-r border-black font-sans">
                      {it.total % 1 === 0 ? `${it.total}$` : `${it.total.toFixed(2)}$`}
                    </td>
                    <td className="py-2 px-3 text-center font-bold text-sm font-sans">
                      {/* Subtotal opcional por renglón */}
                    </td>
                  </tr>
                ))}

                {/* Filas vacías adicionales para replicar el formato en blanco del papel */}
                {Array.from({ length: emptyRowsCount }).map((_, idx) => (
                  <tr key={`empty-${idx}`} className="h-8">
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td></td>
                  </tr>
                ))}

                {/* Total a pagar row */}
                <tr className="border-t-2 border-black">
                  <td colSpan={3} className="border-r border-black"></td>
                  <td className="py-2.5 px-3 text-right font-black text-sm sm:text-base border-r border-black whitespace-nowrap">
                    Total a pagar
                  </td>
                  <td className="py-2.5 px-3 text-center font-black text-sm sm:text-base whitespace-nowrap bg-slate-50">
                    {document.total % 1 === 0 ? `${document.total}$` : `${document.total.toFixed(2)}$`}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Bottom Royal Blue Footer Bar matching factura.jfif */}
          <div className="w-full h-10 sm:h-12 bg-[#0052cc] rounded-xs mt-6"></div>

        </div>

      </div>
    </div>
  );
};
