"use client";

import { UploadCloud, FileText, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function ImportacaoPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight">Importar Extratos</h1>
      <p className="text-sm text-muted-foreground">
        Faça o upload dos arquivos OFX ou CSV do Nubank, Banco do Brasil, Itaú ou VR/VA para alimentar o histórico de meses anteriores.
      </p>

      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`mt-6 flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-xl transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/30 bg-card"
        }`}
      >
        {file ? (
          <div className="flex flex-col items-center gap-3 text-green-500">
            <CheckCircle2 className="h-12 w-12" />
            <span className="font-medium text-foreground">{file.name}</span>
            <button onClick={() => setFile(null)} className="text-xs text-red-500 hover:underline mt-2">Remover arquivo</button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <UploadCloud className="h-12 w-12 opacity-50" />
            <span className="font-medium">Arraste seu arquivo .OFX ou .CSV aqui</span>
            <span className="text-xs">ou clique para selecionar do computador</span>
            <input type="file" accept=".ofx,.csv" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
        )}
      </div>

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