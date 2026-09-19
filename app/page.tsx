import { buscarDadosTeste, gravarTransacaoTeste } from "./actions/banco";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default async function Dashboard() {
  const { transacoes, saldoTotal } = await buscarDadosTeste();

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">Teste da Base de Dados</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Formulário de Teste com Componentes Shadcn */}
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <h2 className="text-lg font-medium mb-4">Nova Receita</h2>
          <form action={gravarTransacaoTeste} className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input 
                id="descricao"
                type="text" 
                name="descricao" 
                required 
                placeholder="Ex: Salário, Projeto, etc."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="valor">Valor Bruto (R$)</Label>
              <Input 
                id="valor"
                type="number" 
                name="valor" 
                step="0.01"
                required 
                placeholder="Ex: 1000.00"
              />
            </div>
            
            <div className="flex items-center gap-2 mt-2">
              <Checkbox id="dizimo" name="dizimo" value="on" />
              <Label htmlFor="dizimo" className="cursor-pointer">
                Aplicar Dízimo automático (10%)
              </Label>
            </div>
            
            <Button type="submit" className="mt-2 w-full">
              Gravar no SQLite
            </Button>
          </form>
        </div>

        {/* Prova de Funcionamento */}
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6 flex flex-col">
          <h2 className="text-lg font-medium mb-2">Saldo em Conta</h2>
          <p className="text-3xl font-bold text-green-500 mb-6">
            R$ {(saldoTotal / 100).toFixed(2).replace('.', ',')}
          </p>

          <h2 className="text-lg font-medium mb-4">Registros no Banco</h2>
          <div className="flex-1 overflow-auto">
            {transacoes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum dado no banco ainda.</p>
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