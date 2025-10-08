"use client";

import { useStacks } from "@/hooks/use-stacks";
// import { useTheme } from "@/hooks/use-theme";
import { abbreviateAddress } from "@/lib/stx-utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Gamepad2, Wallet, LogOut } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { userData, connectWallet, disconnectWallet } = useStacks();
  // const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // const toggleTheme = () => {
  //   setTheme(theme === "dark" ? "light" : "dark");
  // };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/create", label: "Create Game" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 navbar-gradient border-b border-border/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-sidebar-foreground hover:text-accent transition-colors duration-200"
          >
            <Gamepad2 className="h-8 w-8" />
            <span className="text-xl font-bold bg-clip-text text-accent">
              Tic-Tac-Toe
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center space-x-1 text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors duration-200"
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Dark Mode Toggle - Temporarily disabled */}
            {/* <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4 text-sidebar-foreground/60" />
              <Switch
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-accent"
              />
              <Moon className="h-4 w-4 text-sidebar-foreground/60" />
            </div> */}

            {/* Wallet Connection */}
            {userData ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border"
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    {abbreviateAddress(userData.profile.stxAddress.testnet)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={disconnectWallet}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={connectWallet}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-sidebar-border bg-sidebar/95 backdrop-blur-sm slide-in">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Navigation Links */}
              {navLinks.map((link) => {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-2 text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors duration-200 py-2"
                  >
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {/* Mobile Dark Mode Toggle - Temporarily disabled */}
              {/* <div className="flex items-center justify-between py-2">
                <span className="text-sidebar-foreground/80">Dark Mode</span>
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4 text-sidebar-foreground/60" />
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={toggleTheme}
                    className="data-[state=checked]:bg-accent"
                  />
                  <Moon className="h-4 w-4 text-sidebar-foreground/60" />
                </div>
              </div> */}

              {/* Mobile Wallet Connection */}
              {userData ? (
                <div className="space-y-2">
                  <div className="text-sidebar-foreground/80 text-sm">
                    Connected:{" "}
                    {abbreviateAddress(userData.profile.stxAddress.testnet)}
                  </div>
                  <Button
                    onClick={disconnectWallet}
                    variant="outline"
                    size="sm"
                    className="w-full bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Disconnect
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={connectWallet}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
