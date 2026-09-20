import { PrismaClient } from "@prisma/client";
import { criarTransacao, buscarTransacoes } from "../actions/transacoes";

const prisma = new PrismaClient();

export default async function TransacoesPage() {
  const transacoes = await buscarTransacoes();
  const membros = await prisma.user.findMany();
  const contas = await prisma.account.findMany({ include: { institution: true }}); // Busca Nubank, BB, VA, VR

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight">Registrar Lançamento</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <form action={criarTransacao} className="flex flex-col gap-4">
            
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="text-sm font-medium">Tipo</label>
                <select name="type" required className="mt-1 flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm font-semibold">
                  <option value="EXPENSE" className="text-red-500">Saída / Gasto</option>
                  <option value="INCOME" className="text-green-500">Entrada / Receita</option>
                </select>
              </div>
              <div className="w-1/2">
                <label className="text-sm font-medium">Método de Pagamento</label>
                <select name="accountId" required className="mt-1 flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm">
                  {contas.map(c => (
                    <option key={c.id} value={c.id}>{c.institution.name} - {c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="text-sm font-medium">Quem gastou/recebeu?</label>
                <select name="memberId" required className="mt-1 flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm">
                  {membros.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div className="w-1/2">
                <label className="text-sm font-medium">Valor (R$)</label>
                <input type="text" name="valor" required placeholder="Ex: 150,00" className="mt-1 flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Descrição (O que é?)</label>
              <input type="text" name="descricao" required placeholder="Ex: Feira, Salário, Conta de Luz" className="mt-1 flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" />
            </div>

            <div>
              <label className="text-sm font-medium">Destino / Origem</label>
              <input type="text" name="payee" required placeholder="Ex: iFood, Mercado Extra, Mandi TI" className="mt-1 flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" />
            </div>
            
            <div className="border-t border-border pt-4 mt-2">
              <div className="flex items-center gap-2 mb-2">
                <input type="checkbox" name="temDesconto" id="temDesconto" className="h-4 w-4" />
                <label htmlFor="temDesconto" className="text-sm font-medium cursor-pointer">Aplicar Dízimo/Desconto</label>
              </div>
              <div className="flex gap-2">
                <select name="tipoDesconto" className="flex h-10 w-1/3 rounded-md border bg-background px-3 py-2 text-sm">
                  <option value="PERCENTAGE">Porcentagem (%)</option>
                  <option value="FIXED">Valor Fixo (R$)</option>
                </select>
                <input type="text" name="valorDesconto" placeholder="Ex: 10" className="flex h-10 w-2/3 rounded-md border bg-background px-3 py-2 text-sm" />
              </div>
            </div>

            <button type="submit" className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 px-4 py-2 hover:bg-primary/90">
              Registrar Movimentação
            </button>
          </form>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <h2 className="text-lg font-medium mb-4">Últimas Movimentações</h2>
          <div className="flex-1 overflow-auto max-h-[500px]">
            {transacoes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma transação registrada.</p>
            ) : (
              <ul className="space-y-3">
                {transacoes.map((t) => {
                  const membroResp = membros.find(m => m.id === t.beneficiaryId);
                  const isIncome = t.type === "INCOME";
                  return (
                    <li key={t.id} className="flex items-center justify-between border-b border-border pb-2">
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{t.description}</span>
                        <span className="text-xs text-muted-foreground">
                          {t.payee} • Via {t.account.institution.name} ({membroResp ? membroResp.name : "Família"})
                        </span>
                      </div>
                      <span className={`font-semibold text-sm ${isIncome ? "text-green-500" : "text-red-500"}`}>
                        {isIncome ? "+" : "-"} R$ {(t.amount / 100).toFixed(2).replace('.', ',')}
                      </span>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}