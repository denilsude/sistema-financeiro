"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function criarTransacao(formData: FormData) {
  const descricao = formData.get("descricao") as string;
  const payee = formData.get("payee") as string; // Local/Destino (iFood, Mercado)
  const valorInput = formData.get("valor") as string;
  
  // Limpa a formatação brasileira (1.000,50 -> 1000.50) e converte para centavos
  const valorLimpo = valorInput.replace(/\./g, "").replace(",", ".");
  const valorBruto = Math.round(parseFloat(valorLimpo) * 100);
  
  const temDesconto = formData.get("temDesconto") === "on";
  const tipoDesconto = formData.get("tipoDesconto") as string;
  const valorDescontoStr = formData.get("valorDesconto") as string;
  
  let discountAmount = 0;
  let finalAmount = valorBruto;
  let discountValue = null;

  if (temDesconto && valorDescontoStr) {
    const parsedValue = parseFloat(valorDescontoStr.replace(/\./g, "").replace(",", "."));
    discountValue = parsedValue;

    if (tipoDesconto === "PERCENTAGE") {
      discountAmount = Math.round(valorBruto * (parsedValue / 100));
    } else if (tipoDesconto === "FIXED") {
      discountAmount = Math.round(parsedValue * 100);
    }
    finalAmount = valorBruto - discountAmount;
  }

  let account = await prisma.account.findFirst();
  if (!account) {
    const institution = await prisma.institution.create({ data: { name: "Banco Principal", color: "#820ad1" } });
    account = await prisma.account.create({
      data: { name: "Conta Corrente", type: "CHECKING", balance: 0, institutionId: institution.id }
    });
  }

  await prisma.$transaction(async (tx) => {
    await tx.transaction.create({
      data: {
        accountId: account.id,
        type: "EXPENSE", // Estamos assumindo saída por padrão no teste
        amount: finalAmount,
        grossAmount: valorBruto,
        discountType: temDesconto ? tipoDesconto : null,
        discountValue: temDesconto ? discountValue : null,
        discountAmount: temDesconto ? discountAmount : null,
        date: new Date(),
        description: descricao,
        payee: payee,
        beneficiaryType: "FAMILY",
        beneficiaryId: "beneficiario-teste"
      }
    });

    await tx.account.update({
      where: { id: account.id },
      data: { balance: { decrement: finalAmount } } // Decrementa pois é gasto
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