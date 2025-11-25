"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, authClient } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  MessageSquare,
  Settings,
  Menu,
  TrendingUp,
  ShoppingBag,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/common/ThemeToggle";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/commandes", icon: ShoppingBag, label: "Commandes Fournisseurs" },
  { href: "/dashboard/ventes", icon: ShoppingCart, label: "Ventes & Articles" },
  { href: "/dashboard/rentabilite", icon: TrendingUp, label: "Rentabilité" },
  { href: "/dashboard/finances", icon: DollarSign, label: "Finances" },
  { href: "/dashboard/statistiques", icon: BarChart3, label: "Statistiques" },
  { href: "/dashboard/parametres", icon: Settings, label: "Paramètres" },
];

function NavContent() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authClient.signOut();
      router.push('/auth/login');
      router.refresh();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold text-foreground">ResellerPro</h1>
          <div className="hidden lg:block">
            <ThemeToggle />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Gestion multi-plateformes</p>
        {session?.user && (
          <div className="mt-3 p-3 bg-accent rounded-lg">
            <p className="text-sm font-medium text-foreground">{session.user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
          </div>
        )}
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bouton de déconnexion */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">
            {isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}
          </span>
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session) {
      // Si pas de session, rediriger vers login
      router.push('/auth/login');
    }
  }, [session, isPending, router]);

  // Afficher un loader pendant la vérification de la session
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si pas de session après le chargement, ne rien afficher (redirection en cours)
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden border-b border-border bg-card sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-bold text-foreground">ResellerPro</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <NavContent />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 border-r border-border bg-card fixed h-screen">
          <NavContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}
