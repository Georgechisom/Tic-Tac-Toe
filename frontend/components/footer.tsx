"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Gamepad2,
  Home,
  Info,
  Github,
  Twitter,
  ExternalLink,
  // Heart,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/about", label: "About", icon: Info },
  ];

  const socialLinks = [
    {
      href: "https://github.com/Georgechisom",
      label: "GitHub",
      icon: Github,
    },
    {
      href: "https://twitter.com/chisom_georgee",
      label: "Twitter",
      icon: Twitter,
    },
  ];

  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="navbar-gradient">
        <div className="container mx-auto px-4 lg:px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo and Description */}
            <div className="space-y-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-sidebar-foreground hover:text-accent transition-colors duration-200"
              >
                <Gamepad2 className="h-6 w-6" />
                <span className="text-lg font-bold text-accent">
                  Tic-Tac-Toe
                </span>
              </Link>
              <p className="text-sidebar-foreground/80 text-sm max-w-xs">
                Experience the classic game of Tic-Tac-Toe on the Stacks
                blockchain. Play, bet, and win with complete transparency and
                security.
              </p>
            </div>

            {/* Navigation Links */}
            <div className="space-y-4">
              <h3 className="text-sidebar-foreground font-semibold">
                Navigation
              </h3>
              <div className="space-y-2">
                {footerLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center space-x-2 text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors duration-200 text-sm"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
                <Link
                  href="https://docs.stacks.co/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors duration-200 text-sm"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Stacks Docs</span>
                </Link>
              </div>
            </div>

            {/* Social Links and Community */}
            <div className="space-y-4">
              <h3 className="text-sidebar-foreground font-semibold">
                Community
              </h3>
              <div className="flex space-x-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <Button
                      key={social.href}
                      variant="outline"
                      size="sm"
                      asChild
                      className="bg-sidebar-accent/50 text-sidebar-accent-foreground border-sidebar-border hover:bg-sidebar-accent hover:scale-105 transition-all duration-200"
                    >
                      <Link
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                      >
                        <Icon className="h-4 w-4" />
                      </Link>
                    </Button>
                  );
                })}
              </div>
              <p className="text-sidebar-foreground/60 text-xs">
                Join our community and stay updated with the latest
                developments.
              </p>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-8 pt-6 border-t border-sidebar-border">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-1 text-sidebar-foreground/60 text-sm">
                <span>© {currentYear} Tic-Tac-Toe on Stacks. Made with</span>
                {/* <Heart className="h-4 w-4 text-destructive fill-current" /> */}
                <span>for the Stacks community.</span>
              </div>

              <div className="flex items-center space-x-4 text-xs text-sidebar-foreground/60">
                <Link
                  href="/privacy"
                  className="hover:text-sidebar-foreground transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="hover:text-sidebar-foreground transition-colors duration-200"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
