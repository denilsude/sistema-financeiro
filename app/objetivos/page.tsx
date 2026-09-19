import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { Target, Trophy } from "lucide-react";

const prisma = new PrismaClient();

async function criarMeta(formData: FormData) {
  "use server";
  const nome = formData.get("nome") as string;
  const valorAlvoStr = formData.get("valorAlvo") as string;
  const valorAlvo = Math.round(parseFloat(valorAlvoStr) * 100);

  await prisma.goal.create({
    data: {
      name: nome,
      targetAmount: valorAlvo,
      currentAmount: 0,
    }
  });

  revalidatePath("/objetivos");
}

export default async function ObjetivosPage() {
  const objetivos = await prisma.goal.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight">Objetivos e Metas</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Formulário de Metas */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-medium mb-4">Nova Meta de Longo Prazo</h2>
          <form action={criarMeta} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium">Nome do Objetivo</label>
              <input 
                type="text" 
                name="nome" 
                required 
                placeholder="Ex: Comprar Carro, Viagem, Apartamento"
                className="mt-1 flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Valor Alvo (R$)</label>
              <input 
                type="number" 
                name="valorAlvo" 
                step="0.01"
                required 
                placeholder="Ex: 50000.00"
                className="mt-1 flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <button type="submit" className="mt-2 inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 px-4 py-2 hover:bg-primary/90">
              Criar Objetivo
            </button>
          </form>
        </div>

        {/* Listagem de Metas e Barras de Progresso */}
        <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col">
          <h2 className="text-lg font-medium mb-4">Progresso das Conquistas</h2>
          <div className="space-y-4 overflow-auto max-h-[400px]">
            {objetivos.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum objetivo cadastrado. Defina suas metas para alocar o excedente!</p>
            ) : (
              objetivos.map((g) => {
                const progresso = g.targetAmount > 0 ? Math.min(100, (g.currentAmount / g.targetAmount) * 100) : 0;
                return (
                  <div key={g.id} className="p-4 rounded-xl border bg-muted/20 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        <span className="font-semibold">{g.name}</span>
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        R$ {(g.currentAmount / 100).toFixed(2)} / R$ {(g.targetAmount / 100).toFixed(2)}
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progresso}%` }}></div>
                    </div>
                    <span className="text-xs text-right text-muted-foreground">{progresso.toFixed(1)}% concluído</span>
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