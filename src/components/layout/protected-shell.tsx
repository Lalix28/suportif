import type { UserRole } from "@prisma/client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { logoutAction } from "@/server/actions/auth";

const roleLabels: Record<UserRole, string> = {
  ADMIN: "Admin",
  TEACHER: "Tutor",
  STUDENT: "Aluno"
};

const navByRole: Record<UserRole, Array<{ href: string; label: string }>> = {
  STUDENT: [
    { href: "/app", label: "Início" },
    { href: "/app/trilhas", label: "Trilhas" },
    { href: "/app/simulados", label: "Simulados" },
    { href: "/app/revisoes", label: "Revisões" }
  ],
  TEACHER: [
    { href: "/tutor", label: "Tutor" },
    { href: "/tutor/turmas", label: "Turmas" }
  ],
  ADMIN: [
    { href: "/admin", label: "Admin" },
    { href: "/admin/trilhas", label: "Trilhas" },
    { href: "/admin/modulos", label: "Módulos" },
    { href: "/admin/missoes", label: "Missões" },
    { href: "/admin/exercicios", label: "Exercícios" },
    { href: "/admin/simulados", label: "Simulados" },
    { href: "/admin/badges", label: "Badges" }
  ]
};

type ProtectedShellProps = {
  user: {
    name: string;
    email: string;
    role: UserRole;
  };
  children: React.ReactNode;
};

export function ProtectedShell({ user, children }: ProtectedShellProps) {
  const accountContext = user.role === "STUDENT" ? "Área do aluno" : `${roleLabels[user.role]} · ${user.email}`;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 lg:min-h-16 lg:flex-row lg:items-center lg:justify-between lg:py-0">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/" className="shrink-0 text-xl font-black tracking-normal text-emerald-800">
              SuportIF
            </Link>
            <nav
              className="-mx-1 flex max-w-full gap-1 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0"
              aria-label="Navegação da área protegida"
            >
              {navByRole[user.role].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="shrink-0 rounded-md px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div
            className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0"
            title={user.role === "STUDENT" ? user.email : undefined}
          >
            <div className="min-w-0 text-sm">
              <p className="truncate font-semibold text-slate-900">{user.name}</p>
              <p className="truncate text-slate-500">{accountContext}</p>
            </div>
            <form action={logoutAction}>
              <Button type="submit" variant="outline">
                Sair
              </Button>
            </form>
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-4 py-6 sm:py-8">{children}</section>
    </main>
  );
}
