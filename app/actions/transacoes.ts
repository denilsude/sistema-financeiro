"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function criarTransacao(formData: FormData) {
  const descricao = formData.get("descricao") as string;
  const valorBrutoStr = formData.get("valor") as string;
  const valorBruto = Math.round(parseFloat(valorBrutoStr) * 100);
  
  const temDesconto = formData.get("temDesconto") === "on";
  const tipoDesconto = formData.get("tipoDesconto") as string; // 'PERCENTAGE' ou 'FIXED'
  const valorDescontoStr = formData.get("valorDesconto") as string;
  
  let discountAmount = 0;
  let finalAmount = valorBruto;
  let discountValue = null;

  if (temDesconto && valorDescontoStr) {
    const parsedValue = parseFloat(valorDescontoStr);
    discountValue = parsedValue;

    if (tipoDesconto === "PERCENTAGE") {
      discountAmount = Math.round(valorBruto * (parsedValue / 100));
    } else if (tipoDesconto === "FIXED") {
      discountAmount = Math.round(parsedValue * 100);
    }
    
    finalAmount = valorBruto - discountAmount;
  }

  // Cria estrutura básica para teste se não houver conta
  let account = await prisma.account.findFirst();
  if (!account) {
    const institution = await prisma.institution.create({ data: { name: "Banco Principal" } });
    account = await prisma.account.create({
      data: { name: "Conta Corrente", type: "CHECKING", balance: 0, institutionId: institution.id }
    });
  }

  await prisma.$transaction(async (tx) => {
    await tx.transaction.create({
      data: {
        accountId: account.id,
        type: "INCOME",
        amount: finalAmount,
        grossAmount: valorBruto,
        discountType: temDesconto ? tipoDesconto : null,
        discountValue: temDesconto ? discountValue : null,
        discountAmount: temDesconto ? discountAmount : null,
        date: new Date(),
        description: descricao,
        beneficiaryType: "FAMILY",
        beneficiaryId: "beneficiario-teste"
      }
    });

    await tx.account.update({
      where: { id: account.id },
      data: { balance: { increment: finalAmount } }
    });
  });

  revalidatePath("/transacoes");
  revalidatePath("/");
}

export async function buscarTransacoes() {
  return await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
    include: { account: true }
  });
}