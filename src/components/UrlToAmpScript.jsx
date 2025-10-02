import React, { useState } from 'react';
import { X, Copy, ExternalLink } from 'lucide-react';

const UrlToAmpScript = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState('');
  const [convertedUrl, setConvertedUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const clearInput = () => {
    setUrl('');
    setConvertedUrl('');
  };

  const convertToAmpScript = (inputUrl) => {
    const trimmedUrl = inputUrl.trim();
    if (!trimmedUrl) {
      setConvertedUrl('');
      return;
    }
    
    try {
      // Asegurarse de que la URL tenga el protocolo http o https
      let processedUrl = trimmedUrl;
      if (!/^https?:\/\//i.test(processedUrl)) {
        processedUrl = 'https://' + processedUrl;
      }
      
      // Crear la URL de AMPscript
      const ampScript = `%%=RedirectTo(concat('${processedUrl}?',@prefix))=%%`;
      setConvertedUrl(ampScript);
    } catch (error) {
      console.error('Error al convertir la URL:', error);
      setConvertedUrl('Error: URL inválida');
    }
  };

  const handleCopy = () => {
    if (convertedUrl) {
      navigator.clipboard.writeText(convertedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl w-full max-w-md shadow-2xl border border-slate-700">
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Convertir URL a AMPscript</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700 transition-colors"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="url-input" className="block text-sm font-medium text-slate-300 mb-2">
                Ingresa la URL
              </label>
              <div className="relative flex rounded-md shadow-sm">
                <div className="relative flex-1">
                  <input
                    type="text"
                    id="url-input"
                    className="block w-full px-4 py-3 rounded-md border-0 bg-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                    placeholder="https://www.ejemplo.com"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      convertToAmpScript(e.target.value);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        convertToAmpScript(url);
                      }
                    }}
                  />
                  {url && (
                    <button
                      onClick={clearInput}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
                      aria-label="Limpiar"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <button
                  onClick={() => convertToAmpScript(url)}
                  className="ml-2 inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-1.5" />
                  Convertir
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-400">Presiona Enter o haz clic en Convertir</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-slate-300">Resultado AMPscript</label>
                <button
                  onClick={handleCopy}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center"
                  disabled={!convertedUrl}
                >
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  {copied ? '¡Copiado!' : 'Copiar'}
                </button>
              </div>
              <div className="relative">
                <pre className="bg-slate-900 text-green-400 p-3 rounded-md text-sm overflow-x-auto font-mono">
                  {convertedUrl || 'La conversión aparecerá aquí...'}
                </pre>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrlToAmpScript;
