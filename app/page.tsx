export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {/* Placeholder para os Cards Financeiros */}
        <div className="rounded-xl border bg-card text-card-foreground shadow h-32 flex items-center justify-center">
           Saldo Atual
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow h-32 flex items-center justify-center">
           Valores Comprometidos
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow h-32 flex items-center justify-center">
           Reservas e Investimentos
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow h-32 flex items-center justify-center">
           Excedente Disponível
        </div>
      </div>
    </div>
  );
}