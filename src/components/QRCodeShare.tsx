import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2, X } from 'lucide-react';

interface QRCodeShareProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QRCodeShare({ isOpen, onClose }: QRCodeShareProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const appUrl = window.location.origin;

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector('svg') as SVGSVGElement;
    if (svg) {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const link = document.createElement('a');
      link.download = 'qr-code-autoevaluacion.svg';
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Autoevaluación de Cálculo Integral',
          text: 'Participa en la autoevaluación de cálculo integral',
          url: appUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error al compartir:', err);
        }
      }
    } else {
      // Fallback: copiar URL al portapapeles
      navigator.clipboard.writeText(appUrl);
      alert('URL copiada al portapapeles');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Compartir Aplicación</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex justify-center mb-8">
          <div
            ref={qrRef}
            className="p-4 bg-white border-2 border-gray-200 rounded-lg"
          >
            <QRCodeSVG
              value={appUrl}
              size={256}
              level="H"
              includeMargin={true}
              fgColor="#1e40af"
              bgColor="#ffffff"
            />
          </div>
        </div>

        <p className="text-center text-gray-600 mb-6 text-sm">
          Escanea este código QR para acceder a la autoevaluación
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Descargar
          </button>
          <button
            onClick={handleShare}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            Compartir
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 text-gray-600 hover:text-gray-900 font-medium transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
