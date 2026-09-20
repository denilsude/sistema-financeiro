"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

export function GraficoGastosPizza({ dados }: { dados: { name: string; value: number }[] }) {
  if (!dados || dados.length === 0) {
    return <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">Sem dados suficientes</div>;
  }

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dados}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {dados.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          {/* A correção do erro do TypeScript está aqui: value: any */}
          <Tooltip formatter={(value: any) => `R$ ${(Number(value) / 100).toFixed(2).replace('.', ',')}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}