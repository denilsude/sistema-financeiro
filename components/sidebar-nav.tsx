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
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Dashboard", icon: Home, href: "/" },
  { name: "Transações", icon: ArrowRightLeft, href: "/transacoes" },
  { name: "Contas e Cartões", icon: CreditCard, href: "/contas" },
  { name: "Planejamento", icon: Wallet, href: "/planejamento" },
  { name: "Objetivos", icon: Target, href: "/objetivos" },
  { name: "Empresa", icon: Building2, href: "/empresa" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-muted/20">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Wallet className="h-6 w-6" />
          <span className="">Finanças</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                  isActive
                    ? "bg-muted text-primary"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
        <Link
            href="/configuracoes"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-primary"
        >
            <Settings className="h-4 w-4" />
            Configurações
        </Link>
      </div>
    </div>
  );
}