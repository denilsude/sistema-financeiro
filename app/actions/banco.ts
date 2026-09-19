"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function gravarTransacaoTeste(formData: FormData) {
  const descricao = formData.get("descricao") as string;
  const valorBrutoStr = formData.get("valor") as string;
  const valorBruto = Math.round(parseFloat(valorBrutoStr) * 100); // Converte para centavos
  const aplicarDizimo = formData.get("dizimo") === "on";

  // 1. Garante que existe uma infraestrutura mínima de teste no banco
  let institution = await prisma.institution.findFirst();
  if (!institution) {
    institution = await prisma.institution.create({ data: { name: "Banco Teste" } });
  }

  let account = await prisma.account.findFirst();
  if (!account) {
    account = await prisma.account.create({
      data: {
        name: "Conta Principal",
        type: "CHECKING",
        balance: 0,
        institutionId: institution.id
      }
    });
  }

  // 2. Lógica de Desconto / Dízimo
  let discountAmount = 0;
  let finalAmount = valorBruto;
  
  if (aplicarDizimo) {
    discountAmount = Math.round(valorBruto * 0.10); // 10% cravado
    finalAmount = valorBruto - discountAmount;
  }

  // 3. Grava a Transação e atualiza o Saldo
  await prisma.$transaction(async (tx) => {
    await tx.transaction.create({
      data: {
        accountId: account.id,
        type: "INCOME",
        amount: finalAmount,           // Valor líquido (90%)
        grossAmount: valorBruto,       // Valor cheio (100%)
        discountType: aplicarDizimo ? "PERCENTAGE" : null,
        discountValue: aplicarDizimo ? 10 : null,
        discountAmount: aplicarDizimo ? discountAmount : null,
        date: new Date(),
        description: descricao,
        beneficiaryType: "FAMILY",
        beneficiaryId: "family-teste"
      }
    });

    await tx.account.update({
      where: { id: account.id },
      data: { balance: { increment: finalAmount } }
    });
  });

  revalidatePath("/");
}

export async function buscarDadosTeste() {
  const transacoes = await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
    include: { account: true }
  });
  
  const account = await prisma.account.findFirst();
  
  return { transacoes, saldoTotal: account?.balance || 0 };
}