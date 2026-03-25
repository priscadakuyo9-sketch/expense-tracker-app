'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Wallet, LogOut, LayoutDashboard, Target, Tag, BarChart3, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Cookies from 'js-cookie';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            router.push('/login');
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        Cookies.remove('token');
        router.push('/login');
    };

    const navLinks = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Budgets', href: '/budgets', icon: Target },
        { name: 'Categories', href: '/categories', icon: Tag },
        { name: 'Reports', href: '/reports', icon: BarChart3 },
    ];

    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-emerald-500/30">
            {/* Header / Nav */}
            <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-[#09090b]/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-8">
                        <Link href="/dashboard" className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/20">
                                <Wallet className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white">Expense<span className="text-emerald-500">Tracker</span></span>
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden lg:flex items-center space-x-1">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                            isActive 
                                                ? 'bg-emerald-500/10 text-emerald-500' 
                                                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                                        }`}
                                    >
                                        <Icon size={18} className="mr-2" />
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="hidden flex-col items-end sm:flex border-r border-zinc-800 pr-6 mr-6">
                            <span className="text-sm font-medium text-white">{user?.name}</span>
                            <span className="text-xs text-zinc-400 font-mono opacity-50 uppercase tracking-tighter">Premium Account</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={handleLogout} 
                                className="h-10 w-10 rounded-xl hover:bg-red-500/10 hover:text-red-500 text-zinc-400 transition-all"
                            >
                                <LogOut className="h-5 w-5" />
                            </Button>
                            
                            {/* Mobile Menu Toggle */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden rounded-xl hover:bg-zinc-800"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="lg:hidden border-t border-zinc-800 bg-[#09090b] px-4 py-6 space-y-4 animate-in slide-in-from-top duration-300">
                        <div className="flex items-center px-4 mb-6">
                            <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center mr-3">
                                <span className="text-emerald-500 font-bold">{user?.name?.charAt(0)}</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">{user?.name}</p>
                                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Premium</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                                            isActive 
                                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' 
                                                : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                                        }`}
                                    >
                                        <Icon size={24} className="mb-2" />
                                        <span className="text-xs font-bold">{link.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-red-500 hover:bg-red-500/10 hover:text-red-500 py-6 rounded-2xl"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Sign Out
                        </Button>
                    </div>
                )}
            </nav>

            <main>
                {children}
            </main>
        </div>
    );
}
