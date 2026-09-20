import { PrismaClient } from "@prisma/client";
import { criarMeta, alterarStatusMeta } from "../actions/objetivos";
import { Trophy, PauseCircle, PlayCircle, Trash2 } from "lucide-react";

const prisma = new PrismaClient();

export default async function ObjetivosPage() {
  const objetivos = await prisma.goal.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight">Objetivos e Metas</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-medium mb-4">Nova Meta</h2>
          <form action={criarMeta} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium">Nome do Objetivo</label>
              <input type="text" name="nome" required placeholder="Ex: Sapato, Viagem, Caução" className="mt-1 flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium">Prazo</label>
              <select name="prazo" className="mt-1 flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm">
                <option value="SHORT">Curto Prazo (Até 6 meses)</option>
                <option value="MEDIUM">Médio Prazo (Até 2 anos)</option>
                <option value="LONG">Longo Prazo (Mais de 2 anos)</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Valor Alvo (R$)</label>
              <input type="text" name="valorAlvo" required placeholder="Ex: 172,00 ou 5.000,00" className="mt-1 flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" />
            </div>
            <button type="submit" className="mt-2 inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 px-4 py-2 hover:bg-primary/90">
              Criar Objetivo
            </button>
          </form>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col">
          <h2 className="text-lg font-medium mb-4">Acompanhamento</h2>
          <div className="space-y-4 overflow-auto max-h-[500px]">
            {objetivos.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma meta cadastrada.</p>
            ) : (
              objetivos.map((g) => {
                const progresso = g.targetAmount > 0 ? Math.min(100, (g.currentAmount / g.targetAmount) * 100) : 0;
                const isPaused = g.status === "PAUSED";
                
                return (
                  <div key={g.id} className={`p-4 rounded-xl border flex flex-col gap-2 ${isPaused ? "bg-muted/50 opacity-70" : "bg-muted/20"}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        <span className="font-semibold">{g.name}</span>
                        <span className="text-[10px] uppercase bg-secondary px-2 py-0.5 rounded-full">{g.term}</span>
                      </div>
                      <span className="text-sm font-medium">
                        R$ {(g.currentAmount / 100).toFixed(2).replace('.', ',')} / R$ {(g.targetAmount / 100).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progresso}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-muted-foreground">{progresso.toFixed(1)}% concluído {isPaused && "(Pausado)"}</span>
                      <form action={alterarStatusMeta} className="flex gap-2">
                        <input type="hidden" name="id" value={g.id} />
                        {isPaused ? (
                          <button type="submit" name="status" value="ACTIVE" className="text-green-500 hover:text-green-400" title="Continuar"><PlayCircle className="h-5 w-5" /></button>
                        ) : (
                          <button type="submit" name="status" value="PAUSED" className="text-yellow-500 hover:text-yellow-400" title="Pausar"><PauseCircle className="h-5 w-5" /></button>
                        )}
                        <button type="submit" name="status" value="DELETED" className="text-red-500 hover:text-red-400" title="Excluir"><Trash2 className="h-5 w-5" /></button>
                      </form>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}