"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/lib/SettingsContext";
import { Settings } from "lucide-react";

const Navigation = () => {
  const pathname = usePathname();
  const { openSettings } = useSettings();

  const navItems = [
    { href: "/", label: "Apps", icon: "📱" },
    { href: "/repos", label: "Repositories", icon: "🗂️" },
  ];

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Repo Viewer</h1>
            <div className="flex space-x-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={pathname === item.href ? "default" : "ghost"}
                    className="flex items-center space-x-2"
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={openSettings}
              className="h-9 w-9"
            >
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 