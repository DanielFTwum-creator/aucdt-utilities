/// <reference types="vite/client" />
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import AIAssistant from "./AIAssistant";

import { ThemeToggle } from "./ThemeToggle";

// Public assets are served at BASE_URL (e.g., /dfs/ in production)
const rdsLogo = `${import.meta.env.BASE_URL}rds-logo.png`;

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Programs", path: "/programs" },
  { name: "Seminars", path: "/seminars" },
  { name: "🐘 Book Companion", path: "/book" },
  { name: "Blog", path: "/blog" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 min-w-0">
            <img src={rdsLogo} alt="Root Drumming Systems" className="h-10 sm:h-14 w-auto shrink-0" />
            <span className="hidden sm:inline font-serif text-xl font-bold tracking-tight truncate">
              Drumming for <span className="text-primary">SEL Success</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === item.path ? "text-primary" : "text-foreground/60"
                )}
              >
                {item.name}
              </Link>
            ))}
            <ThemeToggle />
            <Button render={<Link to="/contact" />} className="rounded-full px-6" nativeButton={false}>
              Schedule a Training
            </Button>
          </nav>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Open menu" />}>
                <Menu className="h-6 w-6" />
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-6 mt-10">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-primary",
                        location.pathname === item.path ? "text-primary" : "text-foreground/60"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Button render={<Link to="/contact" />} className="rounded-full w-full" onClick={() => setIsOpen(false)} nativeButton={false}>
                    Schedule a Training
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src={rdsLogo} alt="Root Drumming Systems" className="h-10 w-auto" />
                <span className="font-serif text-lg font-bold">Drumming for SEL Success</span>
              </div>
              <p className="text-sm text-secondary-foreground/70 leading-relaxed">
                A Vermont-grown, CASEL-aligned professional development system — built over 45 years of school community work across the Green Mountain State.
              </p>
            </div>
            <div>
              <h4 className="font-serif font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-secondary-foreground/70">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className="hover:text-white transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-serif font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-secondary-foreground/70">
                <li className="font-semibold text-secondary-foreground">Root Drumming Systems, LLC</li>
                <li>Steve Ferraris, Founder</li>
                <li>🍁 Norwich, Vermont</li>
                <li>Vermont-based since 1980</li>
                <li className="pt-1">
                  <a href="mailto:info@sel-success.com" className="hover:text-white transition-colors">
                    info@sel-success.com
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif font-bold mb-4">Newsletter</h4>
              <p className="text-sm text-secondary-foreground/70 mb-4">
                Stay updated on upcoming seminars and resources.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email address"
                  className="bg-white/10 border-white/20 rounded-md px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button 
                  size="sm" 
                  onClick={() => toast.success("Thank you for joining our newsletter!")}
                >
                  Join
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-xs text-secondary-foreground/50">
            © {new Date().getFullYear()} Root Drumming Systems, LLC. All rights reserved.
          </div>
        </div>
      </footer>
      <AIAssistant />
    </div>
  );
}
