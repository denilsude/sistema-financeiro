"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  ArrowRightLeft, 
  Wallet, 
  Target, 
  Building2, 
  Settings,
  Upload,
  BrainCircuit
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: Home, href: "/" },
  { name: "Transações", icon: ArrowRightLeft, href: "/transacoes" },
  { name: "Contas e Cartões", icon: Wallet, href: "/contas" },
  { name: "Planejamento (IA)", icon: BrainCircuit, href: "/planejamento" },
  { name: "Objetivos", icon: Target, href: "/objetivos" },
  { name: "Importar Extratos", icon: Upload, href: "/importacao" },
  { name: "Empresa", icon: Building2, href: "/empresa" },
  { name: "Configurações", icon: Settings, href: "/configuracoes" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-muted/20">
      <div className="p-6">
        <h2 className="text-lg font-bold tracking-tight">Mandi Finance</h2>
      </div>
      <nav className="flex-1 space-y-1 px-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}