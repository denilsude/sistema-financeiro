"use client";

import { UploadCloud, FileText, CheckCircle2 } from "lucide-react";
import { useState, useCallback } from "react";

export default function ImportacaoPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  // Previne o navegador de abrir o arquivo acidentalmente
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      // Aceita apenas CSV ou OFX
      if (droppedFile.name.endsWith('.csv') || droppedFile.name.endsWith('.ofx')) {
        setFile(droppedFile);
      } else {
        alert("Por favor, envie apenas arquivos .CSV ou .OFX");
      }
    }
  }, []);

  return (
    <div 
      className="flex flex-col gap-6 p-4 lg:p-8 max-w-5xl mx-auto h-full"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
    >
      <h1 className="text-2xl font-bold tracking-tight">Importar Extratos</h1>
      <p className="text-sm text-muted-foreground">
        Faça o upload dos arquivos OFX ou CSV do Nubank, Banco do Brasil, Itaú ou VR/VA para alimentar o histórico de meses anteriores.
      </p>

      <label 
        className={`mt-6 flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-xl transition-colors cursor-pointer ${
          isDragging ? "border-primary bg-primary/10 scale-[1.02]" : "border-muted-foreground/30 bg-card hover:bg-muted/50"
        }`}
      >
        {file ? (
          <div className="flex flex-col items-center gap-3 text-green-500">
            <CheckCircle2 className="h-12 w-12" />
            <span className="font-medium text-foreground">{file.name}</span>
            <button 
              type="button"
              onClick={(e) => { e.preventDefault(); setFile(null); }} 
              className="text-xs text-red-500 hover:underline mt-2 z-10 relative"
            >
              Remover arquivo
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-muted-foreground pointer-events-none">
            <UploadCloud className={`h-12 w-12 ${isDragging ? "text-primary animate-bounce" : "opacity-50"}`} />
            <span className="font-medium text-foreground">
              {isDragging ? "Solte o arquivo agora!" : "Arraste seu arquivo .OFX ou .CSV aqui"}
            </span>
            <span className="text-xs">ou clique para selecionar do computador</span>
          </div>
        )}
        <input 
          type="file" 
          accept=".ofx,.csv" 
          className="hidden" 
          onChange={(e) => {
            if (e.target.files?.[0]) setFile(e.target.files[0]);
          }} 
        />
      </label>

      <div className="flex justify-end mt-4">
        <button 
          disabled={!file}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 px-8 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
        >
          Processar Extrato Bancário
        </button>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm mt-4">
        <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
          Histórico de Importações
        </h2>
        <p className="text-sm text-muted-foreground">Os arquivos processados e classificados pela IA aparecerão aqui.</p>
      </div>
    </div>
  );
}