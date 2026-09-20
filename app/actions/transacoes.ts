"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function criarTransacao(formData: FormData) {
  const descricao = formData.get("descricao") as string;
  const payee = formData.get("payee") as string; 
  const valorInput = formData.get("valor") as string;
  const memberId = formData.get("memberId") as string;
  const accountId = formData.get("accountId") as string; // Qual banco/cartão/vale
  const type = formData.get("type") as string; // INCOME ou EXPENSE
  
  const valorLimpo = valorInput.replace(/\./g, "").replace(",", ".");
  const valorBruto = Math.round(parseFloat(valorLimpo) * 100);
  
  const temDesconto = formData.get("temDesconto") === "on";
  const tipoDesconto = formData.get("tipoDesconto") as string;
  const valorDescontoStr = formData.get("valorDesconto") as string;
  
  let discountAmount = 0;
  let finalAmount = valorBruto;

  if (temDesconto && valorDescontoStr) {
    const parsedValue = parseFloat(valorDescontoStr.replace(/\./g, "").replace(",", "."));
    if (tipoDesconto === "PERCENTAGE") {
      discountAmount = Math.round(valorBruto * (parsedValue / 100));
    } else {
      discountAmount = Math.round(parsedValue * 100);
    }
    finalAmount = valorBruto - discountAmount;
  }

  await prisma.$transaction(async (tx) => {
    await tx.transaction.create({
      data: {
        accountId: accountId,
        type: type,
        amount: finalAmount,
        grossAmount: valorBruto,
        discountType: temDesconto ? tipoDesconto : null,
        discountValue: temDesconto ? parseFloat(valorDescontoStr) : null,
        discountAmount: temDesconto ? discountAmount : null,
        date: new Date(),
        description: descricao,
        payee: payee,
        beneficiaryType: "USER",
        beneficiaryId: memberId || "family-default"
      }
    });

    // Se for receita (INCOME) o saldo sobe, se for despesa (EXPENSE) o saldo cai
    await tx.account.update({
      where: { id: accountId },
      data: { balance: type === "INCOME" ? { increment: finalAmount } : { decrement: finalAmount } } 
    });
  });

  revalidatePath("/transacoes");
  revalidatePath("/");
}

export async function buscarTransacoes() {
  return await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
    include: { account: { include: { institution: true } } }
  });
}