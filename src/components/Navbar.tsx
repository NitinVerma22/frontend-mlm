"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers, SendHorizontal, LayoutDashboard, LogOut } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  // Hide navbar on auth routes
  if (pathname === '/login' || pathname === '/signup') return null;

  const links = [
    { name: 'Home', href: '/', icon: Layers },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Transfer', href: '/transfer', icon: SendHorizontal },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 flex items-center px-6 lg:px-12">
      <div className="flex items-center gap-8 w-full max-w-6xl mx-auto justify-between">
        <div className="flex items-center gap-8">
          <div className="font-bold text-xl tracking-tight text-gray-900 flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">W</div> 
           MLM Wallet
          </div>
          
          <div className="hidden md:flex items-center gap-1 bg-gray-50/80 p-1 rounded-xl border border-gray-100">
            {links.map((link) => {
              const active = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    active ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        <Link href="/login" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
          <LogOut className="w-4 h-4" />
          Logout
        </Link>
      </div>
    </nav>
  );
}
