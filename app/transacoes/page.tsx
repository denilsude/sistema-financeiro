import { criarTransacao, buscarTransacoes } from "../actions/transacoes";

export default async function TransacoesPage() {
  const transacoes = await buscarTransacoes();

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <h1 className="text-lg font-semibold md:text-2xl">Transações</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <h2 className="text-lg font-medium mb-4">Novo Lançamento</h2>
          <form action={criarTransacao} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium">Descrição</label>
              <input 
                type="text" 
                name="descricao" 
                required 
                placeholder="Ex: Pagamento Cliente X"
                className="mt-1 flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Valor Bruto (R$)</label>
              <input 
                type="number" 
                name="valor" 
                step="0.01"
                required 
                placeholder="Ex: 1000.00"
                className="mt-1 flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            
            <div className="border-t border-border pt-4 mt-2">
              <div className="flex items-center gap-2 mb-2">
                <input type="checkbox" name="temDesconto" id="temDesconto" className="h-4 w-4" />
                <label htmlFor="temDesconto" className="text-sm font-medium cursor-pointer">
                  Aplicar Desconto/Dízimo
                </label>
              </div>
              
              <div className="flex gap-2">
                <select name="tipoDesconto" className="flex h-10 w-1/3 rounded-md border bg-background px-3 py-2 text-sm">
                  <option value="PERCENTAGE">Porcentagem (%)</option>
                  <option value="FIXED">Valor Fixo (R$)</option>
                </select>
                <input 
                  type="number" 
                  name="valorDesconto" 
                  step="0.01"
                  placeholder="Ex: 10"
                  className="flex h-10 w-2/3 rounded-md border bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 px-4 py-2 hover:bg-primary/90"
            >
              Salvar Transação
            </button>
          </form>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <h2 className="text-lg font-medium mb-4">Últimos Lançamentos</h2>
          <div className="flex-1 overflow-auto max-h-[400px]">
            {transacoes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma transação registrada.</p>
            ) : (
              <ul className="space-y-3">
                {transacoes.map((t) => (
                  <li key={t.id} className="flex flex-col text-sm border-b border-border pb-2">
                    <span className="font-semibold">{t.description}</span>
                    <span className="text-muted-foreground">
                      Bruto: R$ {((t.grossAmount || 0) / 100).toFixed(2)} | 
                      Desconto: R$ {((t.discountAmount || 0) / 100).toFixed(2)}
                    </span>
                    <span className="text-green-500 font-medium mt-1">
                      Líquido creditado: R$ {(t.amount / 100).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}