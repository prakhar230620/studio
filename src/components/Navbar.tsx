"use client";

import Link from "next/link";
import { Utensils, Heart, Menu, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from 'next-intl';
import { LanguageSelector } from "./LanguageSelector";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { href: "/", label: t('nav.home'), icon: <Utensils className="h-5 w-5" /> },
    { href: "/favorites", label: t('nav.favorites'), icon: <Heart className="h-5 w-5" /> },
  ];

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
          <Utensils className="h-7 w-7" />
          <span className="text-xl font-bold tracking-tight">Recipe Ready</span>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          <nav className="flex items-center gap-2">
            {navItems.map((item) => (
              <Button key={item.label} variant="ghost" asChild>
                <Link href={item.href} className="flex items-center gap-2 text-foreground/80 hover:text-primary">
                  {item.icon}
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>
          <LanguageSelector />
          {mounted && (
            <Button variant="ghost\" size="icon\" onClick={toggleTheme} aria-label={t('nav.toggleTheme')}>
              {resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          <LanguageSelector />
          {mounted && (
            <Button variant="ghost\" size="icon\" onClick={toggleTheme} aria-label={t('nav.toggleTheme')}>
              {resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          )}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-0">
              <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="p-6 border-b">
                  <Link href="/" className="flex items-center gap-2 text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                    <Utensils className="h-7 w-7" />
                    <span className="text-xl font-bold tracking-tight">Recipe Ready</span>
                  </Link>
                </div>
                <nav className="flex-1 p-6 space-y-2">
                  {navItems.map((item) => (
                    <Button
                      key={item.label}
                      variant="ghost"
                      className="w-full justify-start text-lg"
                      asChild
                    >
                      <Link href={item.href} className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                        {item.icon}
                        {item.label}
                      </Link>
                    </Button>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}