"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getResumoMes(mes: number, ano: number) {
  // Define o primeiro e o último dia do mês selecionado
  const dataInicial = new Date(ano, mes - 1, 1);
  const dataFinal = new Date(ano, mes, 0, 23, 59, 59);

  const transacoes = await prisma.transaction.findMany({
    where: {
      date: {
        gte: dataInicial,
        lte: dataFinal,
      },
      isRealized: true,
    },
  });

  let receitas = 0;
  let despesas = 0;

  transacoes.forEach((t) => {
    if (t.type === "INCOME") receitas += t.amount;
    if (t.type === "EXPENSE") despesas += t.amount;
  });

  const excedente = receitas - despesas;

  return {
    receitas,
    despesas,
    excedente,
    transacoes,
  };
}

// Esta função fará a ponte com o seu n8n ou direto com a API do Gemini futuramente
export async function analisarComIA(dados: any) {
  // Simulação de chamada para o Webhook do n8n
  /*
  const response = await fetch("SEU_WEBHOOK_N8N", {
    method: "POST",
    body: JSON.stringify(dados),
  });
  return await response.json();
  */
  
  return "Análise da IA: Com base no seu excedente deste mês, sugiro alocar 20% para a Reserva de Emergência, 30% para investimentos do núcleo familiar e reduzir os gastos com 'Delivery', que representaram 15% das saídas. O pró-labore empresarial está saudável e permite a projeção de troca do carro em 12 meses.";
}