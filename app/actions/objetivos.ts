"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function criarMeta(formData: FormData) {
  const nome = formData.get("nome") as string;
  const valorAlvoStr = formData.get("valorAlvo") as string;
  const prazo = formData.get("prazo") as string;
  
  const valorLimpo = valorAlvoStr.replace(/\./g, "").replace(",", ".");
  const valorAlvo = Math.round(parseFloat(valorLimpo) * 100);

  await prisma.goal.create({
    data: {
      name: nome,
      targetAmount: valorAlvo,
      currentAmount: 0,
      term: prazo,
      status: "ACTIVE"
    }
  });

  revalidatePath("/objetivos");
}

export async function alterarStatusMeta(formData: FormData) {
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;
  
  if (status === "DELETED") {
    await prisma.goal.delete({ where: { id } });
  } else {
    await prisma.goal.update({ where: { id }, data: { status } });
  }
  
  revalidatePath("/objetivos");
}