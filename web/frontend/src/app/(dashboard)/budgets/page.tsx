'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Bell, Wallet, DollarSign, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import api from '@/lib/api';

export default function BudgetsPage() {
    const router = useRouter();
    const [amount, setAmount] = useState('');
    const [threshold, setThreshold] = useState('80');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchCurrentBudget();
    }, []);

    const fetchCurrentBudget = async () => {
        try {
            const now = new Date();
            const period = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
            const response = await api.get(`/budgets?period=${period}`);
            
            if (response.data) {
                setAmount(String(response.data.limitAmount || response.data.amount || ''));
                setThreshold(String(response.data.alertThreshold || '80'));
            }
        } catch (error) {
            console.error('Error loading budget:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            alert('Please enter a valid budget amount');
            return;
        }

        setSaving(true);
        try {
            const now = new Date();
            const period = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
            
            await api.post('/budgets', {
                amount: Number(amount),
                period,
                alertThreshold: Number(threshold)
            });

            alert('Your budget has been updated!');
            router.push('/dashboard');
        } catch (error) {
            console.error('Error saving budget:', error);
            alert('Failed to save budget. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#09090b]">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            <div className="mx-auto max-w-2xl">
                <Button
                    variant="ghost"
                    className="mb-8 text-zinc-400 hover:text-white transition-colors"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back to Dashboard
                </Button>

                <div className="mb-10 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                        <Target size={32} />
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Manage Your Budget</h1>
                    <p className="text-zinc-400">Set your monthly limit and get notified when you reach it.</p>
                </div>

                <div className="grid gap-8">
                    {/* Info Card */}
                    <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-2 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Wallet size={80} />
                        </div>
                        <CardHeader>
                            <CardTitle className="flex items-center text-emerald-500 text-lg">
                                <TrendingUp className="mr-2 h-5 w-5" />
                                Smart Tracking
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                Define how much you want to spend this month. We will automatically adjust your dashboard to show your progress and warn you before you exceed your limit.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Management Form */}
                    <Card className="border-zinc-800 bg-zinc-900 p-4 shadow-2xl rounded-3xl">
                        <CardContent className="pt-6">
                            <form onSubmit={handleSave} className="space-y-8">
                                <div className="space-y-4">
                                    <label className="text-sm font-semibold text-zinc-300 ml-1">
                                        Budget Limit ({user?.currency || 'CFA'})
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-emerald-500">
                                            <DollarSign size={20} />
                                        </div>
                                        <input
                                            type="number"
                                            className="h-14 w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 pl-12 pr-4 text-xl font-bold text-white focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                                            placeholder="0.00"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between ml-1">
                                        <label className="text-sm font-semibold text-zinc-300">
                                            Alert Threshold
                                        </label>
                                        <span className="text-emerald-500 font-mono font-bold text-lg">{threshold}%</span>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-emerald-500">
                                            <Bell size={20} />
                                        </div>
                                        <input
                                            type="number"
                                            className="h-14 w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 pl-12 pr-4 text-xl font-bold text-white focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                                            placeholder="80"
                                            value={threshold}
                                            min="1"
                                            max="100"
                                            onChange={(e) => setThreshold(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-zinc-500 ml-1 italic">
                                        A warning banner will appear on your dashboard when spending reaches this percentage.
                                    </p>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 py-8 rounded-2xl text-xl font-bold shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98]"
                                >
                                    {saving ? (
                                        <div className="flex items-center">
                                            <div className="mr-3 h-5 w-5 animate-spin rounded-full border-3 border-white border-t-transparent"></div>
                                            Saving Budget...
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <Save className="mr-2 h-6 w-6" />
                                            Update Budget Configuration
                                        </div>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
