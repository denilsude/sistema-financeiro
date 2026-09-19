import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { CreditCard, Wallet } from "lucide-react";

const prisma = new PrismaClient();

async function criarBancoOuConta(formData: FormData) {
  "use server";
  const nomeBanco = formData.get("nomeBanco") as string;
  const corBanco = formData.get("corBanco") as string;
  const nomeConta = formData.get("nomeConta") as string;
  const saldoStr = formData.get("saldo") as string;
  const saldo = Math.round(parseFloat(saldoStr || "0") * 100);

  let institution = await prisma.institution.findFirst({ where: { name: nomeBanco } });
  if (!institution) {
    institution = await prisma.institution.create({
      data: { name: nomeBanco, color: corBanco || "#3b82f6" }
    });
  }

  await prisma.account.create({
    data: {
      name: nomeConta,
      type: "CHECKING",
      balance: saldo,
      institutionId: institution.id
    }
  });

  revalidatePath("/contas");
}

export default async function ContasPage() {
  const contas = await prisma.account.findMany({
    include: { institution: true }
  });

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight">Contas e Instituições</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Formulário de Cadastro */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-medium mb-4">Adicionar Conta ou Banco</h2>
          <form action={criarBancoOuConta} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium">Nome do Banco / Instituição</label>
              <input 
                type="text" 
                name="nomeBanco" 
                required 
                placeholder="Ex: Nubank, Banco do Brasil"
                className="mt-1 flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Cor Identificadora (Hex)</label>
              <div className="flex gap-2 mt-1">
                <input type="color" name="corBanco" defaultValue="#820ad1" className="h-10 w-14 rounded border bg-background cursor-pointer" />
                <span className="text-xs text-muted-foreground self-center">Escolha a cor da marca (ex: Roxo para Nubank, Amarelo para BB)</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Nome da Conta</label>
              <input 
                type="text" 
                name="nomeConta" 
                required 
                placeholder="Ex: Conta Principal, PJ"
                className="mt-1 flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Saldo Inicial (R$)</label>
              <input 
                type="number" 
                name="saldo" 
                step="0.01"
                required 
                placeholder="0.00"
                className="mt-1 flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <button type="submit" className="mt-2 inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 px-4 py-2 hover:bg-primary/90">
              Salvar Instituição
            </button>
          </form>
        </div>

        {/* Listagem de Cartões/Contas Estilizados */}
        <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col">
          <h2 className="text-lg font-medium mb-4">Suas Contas Vinculadas</h2>
          <div className="space-y-4 overflow-auto max-h-[400px]">
            {contas.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma conta cadastrada ainda.</p>
            ) : (
              contas.map((c) => (
                <div 
                  key={c.id} 
                  className="p-4 rounded-xl text-white flex items-center justify-between shadow-md transition-transform hover:scale-[1.01]"
                  style={{ backgroundColor: c.institution.color || "#1e293b" }}
                >
                  <div className="flex items-center gap-3">
                    <Wallet className="h-6 w-6 opacity-80" />
                    <div>
                      <h3 className="font-bold text-base">{c.institution.name}</h3>
                      <p className="text-xs opacity-90">{c.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs opacity-80 block">Saldo Disponível</span>
                    <span className="font-bold text-lg">R$ {(c.balance / 100).toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}