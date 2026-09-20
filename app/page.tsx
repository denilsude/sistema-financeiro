import { PrismaClient } from "@prisma/client";
import { buscarTransacoes } from "./actions/transacoes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, TrendingDown, ArrowRight, DollarSign } from "lucide-react";
import Link from "next/link";
import { GraficoGastosPizza } from "@/components/graficos-dashboard";
import { GraficoTendenciaBarras } from "@/components/grafico-barras";

const prisma = new PrismaClient();

export default async function HomeDashboard() {
  const transacoes = await buscarTransacoes();
  const membros = await prisma.user.findMany();

  let totalReceitas = 0;
  let totalDespesas = 0;
  const gastosPorMembro: Record<string, number> = {};
  
  // Agrupa gastos por mês para o gráfico de barras
  const gastosPorMes: Record<string, number> = {};

  const mesAtual = new Date().getMonth();
  const anoAtual = new Date().getFullYear();

  transacoes.forEach((t) => {
    const dataTransacao = new Date(t.date);
    const mesStr = dataTransacao.toLocaleString('pt-BR', { month: 'short' }).toUpperCase();
    
    if (t.type === "INCOME" && dataTransacao.getMonth() === mesAtual) totalReceitas += t.amount;
    
    if (t.type === "EXPENSE") {
      // Soma para o mês atual
      if (dataTransacao.getMonth() === mesAtual && dataTransacao.getFullYear() === anoAtual) {
        totalDespesas += t.amount;
        if (t.beneficiaryType === "USER" && t.beneficiaryId) {
          gastosPorMembro[t.beneficiaryId] = (gastosPorMembro[t.beneficiaryId] || 0) + t.amount;
        }
      }
      // Soma para o gráfico de barras histórico
      gastosPorMes[mesStr] = (gastosPorMes[mesStr] || 0) + t.amount;
    }
  });

  const excedente = totalReceitas - totalDespesas;
  
  const dadosPizza = membros.map(m => ({ name: m.name, value: gastosPorMembro[m.id] || 0 })).filter(d => d.value > 0);
  
  // Converte o objeto de meses para o formato do Recharts
  const dadosBarras = Object.keys(gastosPorMes).map(mes => ({ name: mes, total: gastosPorMes[mes] })).reverse();

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Financeiro</h1>
          <p className="text-muted-foreground mt-1">Acompanhe seu fluxo de caixa e alocações mensais.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/transacoes" className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors">
            + Nova Transação
          </Link>
          <Link href="/planejamento" className="border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Consultar IA
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas Totais</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {(totalReceitas / 100).toFixed(2).replace('.', ',')}</div>
            <p className="text-xs text-muted-foreground mt-1">+20.1% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        <Card className="bg-card shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos Totais</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {(totalDespesas / 100).toFixed(2).replace('.', ',')}</div>
            <p className="text-xs text-muted-foreground mt-1">-4% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        <Card className="bg-card shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Excedente Livre</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">R$ {(excedente / 100).toFixed(2).replace('.', ',')}</div>
            <p className="text-xs text-muted-foreground mt-1">Disponível para alocação</p>
          </CardContent>
        </Card>
        <Card className="bg-card shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patrimônio (Caixinha)</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 0,00</div>
            <p className="text-xs text-muted-foreground mt-1">Rendendo 100% CDI</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Gráfico de Barras: Tendência Histórica */}
        <Card className="col-span-4 shadow-sm border-border">
          <CardHeader>
            <CardTitle>Tendência de Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <GraficoTendenciaBarras dados={dadosBarras} />
          </CardContent>
        </Card>

        {/* Gráfico de Pizza: Divisão por Membro */}
        <Card className="col-span-3 shadow-sm border-border">
          <CardHeader>
            <CardTitle>Alocação Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <GraficoGastosPizza dados={dadosPizza} />
          </CardContent>
        </Card>

      </div>

      {/* Lista de Transações com visual largo */}
      <Card className="shadow-sm border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Atividade Recente</CardTitle>
          <Link href="/transacoes" className="text-sm text-primary hover:underline flex items-center">
            Ver todas <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transacoes.slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${t.type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    {t.type === 'INCOME' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">{t.description}</span>
                    <span className="text-sm text-muted-foreground">{t.payee || "N/A"} • {new Date(t.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className={`font-bold ${t.type === 'INCOME' ? 'text-emerald-500' : ''}`}>
                  {t.type === 'INCOME' ? '+' : '-'} R$ {(t.amount / 100).toFixed(2).replace('.', ',')}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}