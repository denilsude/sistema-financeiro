import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { Users, Trash2 } from "lucide-react";

const prisma = new PrismaClient();

// Server Action para cadastrar membro
async function adicionarMembro(formData: FormData) {
  "use server";
  const nome = formData.get("nome") as string;
  const email = formData.get("email") as string;

  // Garante que existe uma família base
  let familia = await prisma.family.findFirst();
  if (!familia) {
    familia = await prisma.family.create({ data: { name: "Nossa Família" } });
  }

  await prisma.user.create({
    data: {
      name: nome,
      email: email,
      passwordHash: "senha-padrao-123", // Num cenário real, usaríamos bcrypt/NextAuth
      familyId: familia.id
    }
  });

  revalidatePath("/configuracoes");
}

export default async function ConfiguracoesPage() {
  const membros = await prisma.user.findMany({
    orderBy: { createdAt: "asc" }
  });

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight">Configurações do Sistema</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Adicionar Membro */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-medium mb-2">Cadastrar Membro da Família</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Adicione você e sua esposa para rastrear despesas e orçamentos individualmente.
          </p>
          <form action={adicionarMembro} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium">Nome do Membro</label>
              <input type="text" name="nome" required placeholder="Ex: Denilson" className="mt-1 flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium">E-mail</label>
              <input type="email" name="email" required placeholder="Ex: email@manditecnologia.com.br" className="mt-1 flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" />
            </div>
            <button type="submit" className="mt-2 inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 px-4 py-2 hover:bg-primary/90">
              Adicionar Membro
            </button>
          </form>
        </div>

        {/* Lista de Membros */}
        <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col">
          <h2 className="text-lg font-medium mb-4">Membros Cadastrados</h2>
          <div className="space-y-4 overflow-auto max-h-[300px]">
            {membros.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum membro cadastrado.</p>
            ) : (
              membros.map((m) => (
                <div key={m.id} className="p-3 rounded-xl border bg-muted/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">{m.name}</span>
                      <span className="text-xs text-muted-foreground">{m.email}</span>
                    </div>
                  </div>
                  {/* Botão de Excluir (simulado para a interface) */}
                  <button className="text-muted-foreground hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}