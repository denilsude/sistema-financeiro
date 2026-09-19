import { buscarTransacoes } from "./actions/transacoes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default async function HomeDashboard() {
  const transacoes = await buscarTransacoes();

  // Cálculos consolidados do mês
  let totalReceitas = 0;
  let totalDespesas = 0;

  transacoes.forEach((t) => {
    if (t.type === "INCOME") totalReceitas += t.amount;
    if (t.type === "EXPENSE") totalDespesas += t.amount;
  });

  const excedente = totalReceitas - totalDespesas;
  const percentualEconomia = totalReceitas > 0 ? Math.max(0, (excedente / totalReceitas) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Topo do Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Visão Geral Financeira</h1>
          <p className="text-sm text-muted-foreground">Controle, diagnóstico e inteligência patrimonial da família.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/transacoes" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 px-4 py-2 hover:bg-primary/90"
          >
            + Nova Transação
          </Link>
          <Link 
            href="/planejamento" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background h-10 px-4 py-2 hover:bg-accent hover:text-accent-foreground"
          >
            Ver Análise de IA
          </Link>
        </div>
      </div>

      {/* Cards Principais (Métricas do Mês) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entradas Totais</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {(totalReceitas / 100).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Receitas e rendimentos realocados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saídas e Compromissos</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {(totalDespesas / 100).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Despesas e dízimos aplicados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Excedente Livre</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">R$ {(excedente / 100).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">{percentualEconomia.toFixed(1)}% da renda guardada</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reserva & Investimentos</CardTitle>
            <ShieldAlert className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 0,00</div>
            <p className="text-xs text-muted-foreground mt-1">Caixinha Nubank / FIIs</p>
          </CardContent>
        </Card>
      </div>

      {/* Seção Inferior: Gráficos de Barras / Espectro e Transações Recentes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Simulação de Espectro / Barras de Distribuição */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Espectro de Saúde Financeira</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[240px] flex flex-col justify-center gap-4 px-4">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Gastos Essenciais (Meta: 50%)</span>
                  <span className="font-medium">40%</span>
                </div>
                <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "40%" }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Estilo de Vida e Lazer (Meta: 30%)</span>
                  <span className="font-medium">25%</span>
                </div>
                <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "25%" }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Futuro, Dízimo e Investimentos (Meta: 20%+)</span>
                  <span className="font-medium">35%</span>
                </div>
                <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "35%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Últimas Transações */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transacoes.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma movimentação registrada.</p>
              ) : (
                transacoes.slice(0, 5).map((t) => (
                  <div key={t.id} className="flex items-center justify-between border-b pb-2">
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{t.description}</span>
                      <span className="text-xs text-muted-foreground">{new Date(t.date).toLocaleDateString()}</span>
                    </div>
                    <span className="font-semibold text-sm text-green-500">
                      + R$ {(t.amount / 100).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}