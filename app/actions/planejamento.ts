"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getResumoMes(mes: number, ano: number) {
  const dataInicial = new Date(ano, mes - 1, 1);
  const dataFinal = new Date(ano, mes, 0, 23, 59, 59);

  const transacoes = await prisma.transaction.findMany({
    where: {
      date: { gte: dataInicial, lte: dataFinal },
      isRealized: true,
    },
  });

  let receitas = 0;
  let despesas = 0;

  transacoes.forEach((t) => {
    if (t.type === "INCOME") receitas += t.amount;
    if (t.type === "EXPENSE") despesas += t.amount;
  });

  return {
    receitas,
    despesas,
    excedente: receitas - despesas,
    transacoes,
  };
}

export async function analisarComIA(dados: any) {
  // URL do Webhook do seu n8n (Você pode colocar essa URL no seu .env depois)
  // Exemplo: http://10.210.10.X:5678/webhook/analise-financeira
  const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || "COLOQUE_AQUI_A_URL_DO_SEU_WEBHOOK_N8N";

  try {
    const payload = {
      tipo: "ANALISE_MENSAL",
      dadosFinanceiros: {
        receitasBrutas: dados.receitas / 100,
        despesasGerais: dados.despesas / 100,
        excedenteLivre: dados.excedente / 100,
      },
      contextoMercado: {
        interesses: ["Fundos Imobiliários", "Ações", "Caixinha Nubank"],
        perfil: "Conservador/Moderado"
      }
    };

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return "Erro ao contatar o Conselheiro Financeiro (n8n). Verifique se o workflow está ativo.";
    }

    const data = await response.json();
    
    // O n8n deve retornar um JSON com um campo "mensagem"
    return data.mensagem || "Análise concluída, mas nenhum texto foi retornado pela IA.";

  } catch (error) {
    console.error("Erro no Webhook:", error);
    return "O servidor n8n está inacessível no momento. Tente novamente mais tarde.";
  }
}