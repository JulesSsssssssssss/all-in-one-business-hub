'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Package, DollarSign, Zap, CheckCircle, Star, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/common/ThemeToggle';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const features = [
    {
      icon: Package,
      title: "Gestion de Stock Intelligente",
      description: "Gérez votre inventaire avec photos, prix, et publication multi-plateformes en un clic"
    },
    {
      icon: DollarSign,
      title: "Suivi Financier en Temps Réel",
      description: "Visualisez vos revenus, coûts, marges et bénéfices instantanément"
    },
    {
      icon: TrendingUp,
      title: "Analytics Avancés",
      description: "Découvrez quels produits se vendent le mieux et optimisez votre stratégie"
    },
    {
      icon: Zap,
      title: "Publication Automatique",
      description: "Publiez sur Vinted, Leboncoin, eBay et plus en même temps"
    }
  ];

  const stats = [
    { value: "2 847€", label: "CA moyen mensuel" },
    { value: "47", label: "Ventes par mois" },
    { value: "57%", label: "Marge moyenne" },
    { value: "4.8⭐", label: "Note clients" }
  ];

  const testimonials = [
    {
      name: "Marie L.",
      role: "Revendeuse Pro",
      content: "ResellerPro a transformé mon activité. Je gagne 3x plus en 2x moins de temps !",
      avatar: "👩"
    },
    {
      name: "Thomas D.",
      role: "E-commerce",
      content: "L'interface est intuitive et les stats me permettent d'optimiser mes prix.",
      avatar: "👨"
    },
    {
      name: "Sophie M.",
      role: "Vintage Shop",
      content: "Plus besoin de jongler entre 5 plateformes. Tout est centralisé !",
      avatar: "👩‍🦰"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navbar */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="text-2xl">🛍️</div>
              <span className="text-xl font-bold bg-gradient-to-r from-kaki-7 to-kaki-6 bg-clip-text text-transparent">
                ResellerPro
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-kaki-7 transition-colors font-medium">
                Fonctionnalités
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-kaki-7 transition-colors font-medium">
                Tarifs
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-kaki-7 transition-colors font-medium">
                Témoignages
              </a>
            </nav>
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              <Link href="/dashboard">
                <Button variant="ghost" className="font-medium text-gray-700 hover:text-kaki-7 hover:bg-kaki-1">Connexion</Button>
              </Link>
              <Link href="/dashboard">
                <Button className="bg-primary hover:bg-kaki-7 text-white font-semibold shadow-md hover:shadow-lg transition-all">
                  Essayer gratuitement
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6 text-foreground" />
                ) : (
                  <Menu className="h-6 w-6 text-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Panel */}
      <div className={`fixed top-0 right-0 h-full w-[280px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6">
          {/* Close button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-6 w-6 text-gray-900" />
          </button>

          {/* Logo */}
          <div className="mb-8 mt-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-kaki-7 to-kaki-6 bg-clip-text text-transparent">
              ResellerPro
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-4 mb-8">
            <a 
              href="#features" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-600 hover:text-kaki-7 transition-colors font-medium py-2"
            >
              Fonctionnalités
            </a>
            <a 
              href="#pricing" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-600 hover:text-kaki-7 transition-colors font-medium py-2"
            >
              Tarifs
            </a>
            <a 
              href="#testimonials" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-600 hover:text-kaki-7 transition-colors font-medium py-2"
            >
              Témoignages
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full font-medium border-kaki-6 text-kaki-7 hover:bg-kaki-1 hover:text-kaki-7">
                Connexion
              </Button>
            </Link>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-primary hover:bg-kaki-7 text-white font-semibold">
                Essayer gratuitement
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-kaki-1 via-kaki-2 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-full text-sm font-medium shadow-sm">
                <span className="text-base">🚀</span>
                Nouveau : Publication automatique multi-plateformes
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                Vendez plus, plus vite,<br />
                <span className="bg-gradient-to-r from-kaki-7 to-kaki-5 bg-clip-text text-transparent">
                  sur toutes les plateformes
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-xl">
                La plateforme tout-en-un pour gérer votre business de revente sur Vinted, Leboncoin, eBay et plus. 
                <span className="text-primary font-semibold"> Gagnez du temps et augmentez vos profits.</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard" className="flex-1 sm:flex-initial">
                  <Button 
                    size="lg" 
                    className="w-full bg-primary hover:bg-kaki-7 text-lg h-14 font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    Commencer gratuitement
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg h-14 font-semibold border-2 border-kaki-6 text-kaki-7 hover:bg-kaki-6 hover:text-white hover:border-kaki-6 transition-all"
                >
                  Voir la démo
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-kaki-6 flex-shrink-0" />
                  <span className="font-medium">Essai gratuit 14 jours</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-kaki-6 flex-shrink-0" />
                  <span className="font-medium">Sans carte bancaire</span>
                </div>
              </div>
            </div>
            <div className="relative lg:block hidden">
              <div className="relative z-10 bg-card rounded-2xl shadow-2xl p-4 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="rounded-lg overflow-hidden border border-border">
                  <img 
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80" 
                    alt="Dashboard preview"
                    className="w-full h-auto"
                    loading="eager"
                  />
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-gradient-to-br from-kaki-6/30 to-kaki-5/30 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-gradient-to-br from-kaki-4/30 to-kaki-6/30 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-kaki-6 via-kaki-5 to-kaki-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center transform hover:scale-105 transition-transform">
                <div className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2 drop-shadow-lg">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-kaki-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900">
              Tout ce dont vous avez besoin pour réussir
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Une suite complète d'outils pour gérer, optimiser et développer votre activité de revente
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="group bg-white border-2 border-gray-200 hover:border-kaki-6 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="h-14 w-14 bg-gradient-to-br from-kaki-3 to-kaki-4 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="h-7 w-7 text-kaki-7" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 leading-snug">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-kaki-2 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900">
              Ils nous font confiance
            </h2>
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400 drop-shadow" />
                ))}
              </div>
              <p className="text-lg text-gray-600 font-medium">
                4.9/5 • Plus de 500 revendeurs satisfaits
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="bg-white border-2 border-gray-200 hover:border-kaki-5 hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                    <div className="text-4xl">{testimonial.avatar}</div>
                    <div>
                      <div className="font-bold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-kaki-7 via-kaki-6 to-kaki-5"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgMS4xLS45IDItMiAycy0yLS45LTItMiAuOS0yIDItMiAyIC45IDIgMm0xMCAxMGMwIDEuMS0uOSAyLTIgMnMtMi0uOS0yLTIgLjktMiAyLTIgMiAuOSAyIDJNMTAgMTZjMCAxLjEtLjkgMi0yIDJzLTItLjktMi0yIC45LTIgMi0yIDIgLjkgMiAyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight drop-shadow-lg">
            Prêt à booster votre business ?
          </h2>
          <p className="text-lg sm:text-xl text-kaki-1 max-w-2xl mx-auto leading-relaxed">
            Rejoignez des centaines de revendeurs qui ont transformé leur activité avec ResellerPro
          </p>
          <div className="pt-4">
            <Link href="/dashboard">
              <Button 
                size="lg" 
                className="bg-white text-kaki-7 hover:bg-kaki-1 text-lg h-16 px-10 font-bold shadow-2xl hover:shadow-xl transition-all transform hover:scale-105"
              >
                Commencer gratuitement
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <p className="text-kaki-1 text-sm sm:text-base font-medium">
            ✓ Essai gratuit 14 jours • ✓ Sans engagement • ✓ Support 7j/7
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-kaki-9 text-kaki-3 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="text-2xl">🛍️</div>
                <span className="text-xl font-bold text-white">ResellerPro</span>
              </Link>
              <p className="text-sm leading-relaxed text-kaki-3">
                La plateforme tout-en-un pour gérer votre business de revente sur toutes les plateformes
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Produit</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#features" className="hover:text-kaki-5 transition-colors">Fonctionnalités</a></li>
                <li><a href="#pricing" className="hover:text-kaki-5 transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-kaki-5 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-kaki-5 transition-colors">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Entreprise</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-kaki-5 transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-kaki-5 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-kaki-5 transition-colors">Carrières</a></li>
                <li><a href="#" className="hover:text-kaki-5 transition-colors">Presse</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Support</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-kaki-5 transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-kaki-5 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-kaki-5 transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-kaki-5 transition-colors">Statut</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-kaki-7/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-kaki-3">
              &copy; 2025 ResellerPro. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="hover:text-kaki-5 transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-kaki-5 transition-colors">CGU</a>
              <a href="#" className="hover:text-kaki-5 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
