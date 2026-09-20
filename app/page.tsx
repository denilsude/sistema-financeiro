import { PrismaClient } from "@prisma/client";
import { buscarTransacoes } from "./actions/transacoes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, TrendingDown, ShieldAlert, Users } from "lucide-react";
import Link from "next/link";
import { GraficoGastosPizza } from "@/components/graficos-dashboard";

const prisma = new PrismaClient();

export default async function HomeDashboard() {
  const transacoes = await buscarTransacoes();
  const membros = await prisma.user.findMany();

  let totalReceitas = 0;
  let totalDespesas = 0;
  const gastosPorMembro: Record<string, number> = {};

  const mesAtual = new Date().getMonth();
  const anoAtual = new Date().getFullYear();

  transacoes.forEach((t) => {
    const dataTransacao = new Date(t.date);
    if (dataTransacao.getMonth() === mesAtual && dataTransacao.getFullYear() === anoAtual) {
      if (t.type === "INCOME") totalReceitas += t.amount;
      if (t.type === "EXPENSE") {
        totalDespesas += t.amount;
        if (t.beneficiaryType === "USER" && t.beneficiaryId) {
          gastosPorMembro[t.beneficiaryId] = (gastosPorMembro[t.beneficiaryId] || 0) + t.amount;
        }
      }
    }
  });

  const excedente = totalReceitas - totalDespesas;
  
  // Prepara dados para o Gráfico de Pizza
  const dadosGrafico = membros
    .map(m => ({ name: m.name, value: gastosPorMembro[m.id] || 0 }))
    .filter(d => d.value > 0);

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Visão Geral do Mês</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/transacoes" className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 px-4 py-2 hover:bg-primary/90">
            + Nova Transação
          </Link>
          <Link href="/planejamento" className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background h-10 px-4 py-2 hover:bg-accent hover:text-accent-foreground">
            Consultar IA
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Entradas</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-green-500">R$ {(totalReceitas / 100).toFixed(2).replace('.', ',')}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Saídas</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-red-500">R$ {(totalDespesas / 100).toFixed(2).replace('.', ',')}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Excedente</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-primary">R$ {(excedente / 100).toFixed(2).replace('.', ',')}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Investimentos</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">R$ 0,00</div></CardContent></Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Gastos Atuais por Membro</CardTitle>
          </CardHeader>
          <CardContent>
            <GraficoGastosPizza dados={dadosGrafico} />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transacoes.slice(0, 5).map((t) => (
                <div key={t.id} className="flex items-center justify-between border-b pb-2">
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{t.description}</span>
                    <span className="text-xs text-muted-foreground">{t.payee || "N/A"}</span>
                  </div>
                  <span className="font-semibold text-sm text-red-500">R$ {(t.amount / 100).toFixed(2).replace('.', ',')}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}