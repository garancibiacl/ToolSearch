import React, { useState, useCallback, useEffect } from "react";
import { X, Copy } from "lucide-react";

const UrlToAmpScript = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState("");
  const [convertedUrl, setConvertedUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  const clearInput = useCallback(() => {
    setUrl("");
    setConvertedUrl("");
    setCopied(false);
  }, []);

  const convertToAmpScript = useCallback((inputUrl) => {
    const trimmedUrl = inputUrl.trim();
    if (!trimmedUrl) {
      setConvertedUrl("");
      return;
    }

    try {
      setIsConverting(true);
      
      // Asegurarse de que la URL tenga el protocolo http o https
      let processedUrl = trimmedUrl;
      if (!/^https?:\/\//i.test(processedUrl)) {
        processedUrl = "https://" + processedUrl;
      }

      // Validar URL
      try {
        // eslint-disable-next-line no-new
        new URL(processedUrl);
      } catch (e) {
        throw new Error("URL inválida");
      }

      // Crear la URL de AMPscript con el formato exacto solicitado
      // Formato: %%=RedirectTo(concat('https://www.linkedin.com?',@prefix))=%%
      const ampScript = `%%=RedirectTo(concat('${processedUrl}?',@prefix))=%%`;
      setConvertedUrl(ampScript);
    } catch (error) {
      console.error("Error al convertir la URL:", error);
      setConvertedUrl(`Error: ${error.message || 'URL inválida'}`);
    } finally {
      setIsConverting(false);
    }
  }, []);

  const handleCopy = useCallback(() => {
    if (convertedUrl && !convertedUrl.startsWith('Error:')) {
      navigator.clipboard.writeText(convertedUrl);
      setCopied(true);
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [convertedUrl]);

  // Efecto para limpiar el estado cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      clearInput();
    }
  }, [isOpen, clearInput]);

  // Efecto para manejar la conversión automática
  useEffect(() => {
    if (url) {
      const timer = setTimeout(() => {
        convertToAmpScript(url);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setConvertedUrl("");
    }
  }, [url, convertToAmpScript]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-slate-800 rounded-xl w-full max-w-2xl shadow-2xl border border-slate-700 flex flex-col max-h-[90vh] overflow-hidden">
        <div className="p-6 pb-0">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Convertidor de URL a AMPscript</h2>
              <p className="text-sm text-slate-400 mt-1">Convierte cualquier URL a formato AMPscript</p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 -mr-2 rounded-full hover:bg-slate-700 transition-colors"
              aria-label="Cerrar"
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-4 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="url-input" className="block text-sm font-medium text-slate-300">
                URL de origen
              </label>
              {url && (
                <button
                  onClick={clearInput}
                  className="text-xs text-slate-400 hover:text-white flex items-center"
                  type="button"
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  Limpiar
                </button>
              )}
            </div>
            
            <div className="relative">
              <input
                type="text"
                id="url-input"
                className="block w-full px-4 py-3.5 rounded-lg border-0 bg-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                placeholder="https://www.tudominio.com/pagina?parametro=valor"
                value={url}
                onChange={(e) => {
                  const value = e.target.value;
                  setUrl(value);
                }}
                autoComplete="off"
                spellCheck="false"
                autoFocus
              />
              {!url && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-xs text-slate-500 bg-slate-700/50 px-2 py-0.5 rounded">
                    Escribe una URL
                  </span>
                </div>
              )}
              
              {isConverting && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-400"></div>
                </div>
              )}
            </div>
            
            <div className="flex items-center text-xs text-slate-400">
              <span className="inline-flex items-center">
                <svg className="h-3.5 w-3.5 mr-1 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Conversión en tiempo real
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">
                Código AMPscript
              </label>
              <button
                onClick={handleCopy}
                className={`text-xs flex items-center px-2.5 py-1 rounded-md transition-colors ${
                  convertedUrl && !convertedUrl.startsWith('Error:') 
                    ? 'text-indigo-400 hover:bg-indigo-900/30 hover:text-indigo-300' 
                    : 'text-slate-500 cursor-not-allowed'
                }`}
                disabled={!convertedUrl || convertedUrl.startsWith('Error:')}
                type="button"
              >
                <Copy className="h-3.5 w-3.5 mr-1.5" />
                {copied ? '¡Copiado!' : 'Copiar'}
              </button>
            </div>
            
            <div className="relative group">
              <pre className={`p-4 rounded-lg text-sm font-mono overflow-x-auto transition-all duration-200 ${
                convertedUrl.startsWith('Error:') 
                  ? 'bg-red-900/30 text-red-400' 
                  : convertedUrl 
                    ? 'bg-slate-900/80 text-green-400 border border-slate-700' 
                    : 'bg-slate-800/50 text-slate-500 border border-slate-700/50'
              }`}>
                <code className="break-all">
                  {convertedUrl || '// La conversión aparecerá aquí cuando ingreses una URL'}
                </code>
              </pre>
              
              {convertedUrl && !convertedUrl.startsWith('Error:') && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-colors"
                    title="Copiar al portapapeles"
                    type="button"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            
            {convertedUrl && !convertedUrl.startsWith('Error:') && (
              <div className="text-xs text-slate-400 flex items-center">
                <svg className="h-3.5 w-3.5 mr-1.5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Listo para usar en tus campañas de Marketing Cloud
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 bg-slate-800/50 border-t border-slate-700/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
            type="button"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
export default UrlToAmpScript;
