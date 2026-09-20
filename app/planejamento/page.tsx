"use client";

import { useState, useEffect } from "react";
import { getResumoMes, analisarComIA } from "../actions/planejamento";
import { Button } from "@/components/ui/button";
import { BrainCircuit, TrendingDown, TrendingUp, Wallet } from "lucide-react";

export default function PlanejamentoPage() {
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [ano, setAno] = useState(new Date().getFullYear());
  const [dados, setDados] = useState({ receitas: 0, despesas: 0, excedente: 0 });
  const [insightIA, setInsightIA] = useState("");
  const [carregandoIA, setCarregandoIA] = useState(false);

  useEffect(() => {
    carregarDados();
  }, [mes, ano]);

  async function carregarDados() {
    const resumo = await getResumoMes(mes, ano);
    setDados(resumo);
    setInsightIA("");
  }

  async function gerarInsight() {
    setCarregandoIA(true);
    const resposta = await analisarComIA(dados);
    setInsightIA(resposta);
    setCarregandoIA(false);
  }

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Planejamento e IA</h1>
        
        <div className="flex gap-2">
          <select 
            value={mes} 
            onChange={(e) => setMes(Number(e.target.value))}
            className="h-10 rounded-md border bg-background px-3"
          >
            <option value={1}>Janeiro</option>
            <option value={2}>Fevereiro</option>
            <option value={3}>Março</option>
            <option value={4}>Abril</option>
            <option value={5}>Maio</option>
            <option value={6}>Junho</option>
            <option value={7}>Julho</option>
            <option value={8}>Agosto</option>
            <option value={9}>Setembro</option>
            <option value={10}>Outubro</option>
            <option value={11}>Novembro</option>
            <option value={12}>Dezembro</option>
          </select>
          <select 
            value={ano} 
            onChange={(e) => setAno(Number(e.target.value))}
            className="h-10 rounded-md border bg-background px-3"
          >
            <option value={2026}>2026</option>
            <option value={2025}>2025</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col gap-2">
          <div className="flex items-center text-muted-foreground gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" /> Receitas
          </div>
          <span className="text-2xl font-bold">R$ {(dados.receitas / 100).toFixed(2).replace('.', ',')}</span>
        </div>
        
        <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col gap-2">
          <div className="flex items-center text-muted-foreground gap-2">
            <TrendingDown className="h-4 w-4 text-red-500" /> Despesas
          </div>
          <span className="text-2xl font-bold">R$ {(dados.despesas / 100).toFixed(2).replace('.', ',')}</span>
        </div>

        <div className="rounded-xl border bg-primary/10 p-6 shadow-sm flex flex-col gap-2">
          <div className="flex items-center text-primary gap-2 font-medium">
            <Wallet className="h-4 w-4" /> Excedente Real
          </div>
          <span className="text-2xl font-bold text-primary">
            R$ {(dados.excedente / 100).toFixed(2).replace('.', ',')}
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-primary/20 bg-card shadow-sm overflow-hidden">
        <div className="bg-primary/5 p-4 border-b border-primary/10 flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium text-primary">
            <BrainCircuit className="h-5 w-5" />
            Análise Inteligente Gemini
          </div>
          <Button onClick={gerarInsight} disabled={carregandoIA} variant="default" size="sm">
            {carregandoIA ? "Analisando padrões..." : "Gerar Estratégia"}
          </Button>
        </div>
        <div className="p-6 min-h-[150px] flex items-center justify-center text-muted-foreground">
          {insightIA ? (
            <p className="text-foreground leading-relaxed w-full text-left whitespace-pre-wrap">
              {insightIA}
            </p>
          ) : (
            <p className="text-center text-sm">
              Clique em "Gerar Estratégia" para a IA analisar os gastos deste mês, sugerir cortes e montar um plano para o seu excedente.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}