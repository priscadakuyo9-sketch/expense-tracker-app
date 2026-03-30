'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, ArrowDownRight, ArrowUpRight, Filter, Search, Trash2, Edit2, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';

export default function ExpensesPage() {
    const router = useRouter();
    const [expenses, setExpenses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            router.push('/login');
            return;
        }
        setUser(JSON.parse(storedUser));
        fetchExpenses();
    }, [router]);

    const fetchExpenses = async () => {
        try {
            const res = await api.get('/expenses');
            setExpenses(res.data);
        } catch (err) {
            console.error('Failed to fetch expenses', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteExpense = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this expense?")) return;
        try {
            await api.delete(`/expenses/${id}`);
            setExpenses(prev => prev.filter(e => e._id !== id));
        } catch (err) {
            console.error('Failed to delete expense', err);
            alert("Failed to delete expense");
        }
    };

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-100px)] items-center justify-center bg-[#09090b]">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-white lg:text-5xl">
                        All <span className="text-emerald-500">Expenses</span>
                    </h1>
                    <p className="mt-2 text-zinc-400">View and manage your entire transaction history.</p>
                </div>
                <div className="flex flex-row gap-4">
                    <Button
                        onClick={() => router.push('/expenses/new')}
                        className="bg-emerald-600 font-semibold text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 rounded-xl px-6 py-6"
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        Add New Expense
                    </Button>
                </div>
            </div>

            <Card className="border-zinc-800 bg-zinc-900/50 shadow-2xl">
                <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-800/50 pb-6">
                    <CardTitle className="text-xl font-bold text-white">Transaction History</CardTitle>
                    <div className="flex gap-2">
                        <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800">
                            <Filter className="h-4 w-4 mr-2" /> Filter
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        {expenses.length > 0 ? expenses.map((expense: any) => (
                            <div key={expense._id} className="group flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl p-4 transition-all hover:bg-zinc-800/40 border border-zinc-800/40 hover:border-emerald-500/20 shadow-md">
                                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800/80 text-emerald-500 transition-colors group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 shadow-inner">
                                        <div className="text-2xl">
                                            {expense.categoryId?.icon ? <span>{expense.categoryId.icon}</span> : <ArrowDownRight size={24} />}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg text-white tracking-tight">{expense.description || expense.categoryId?.name || 'Uncategorized'}</p>
                                        <div className="flex items-center space-x-3 mt-1">
                                            <div className="flex items-center text-zinc-400">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                <span className="text-xs font-medium">{new Date(expense.date).toLocaleDateString()}</span>
                                            </div>
                                            <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-black tracking-widest uppercase">{expense.paymentMethod}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-6">
                                    <div className="text-left sm:text-right">
                                        <p className="text-xl font-black text-white tracking-tighter">
                                            -{user?.currency || 'CFA'} {expense.amount.toLocaleString()}
                                        </p>
                                        <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-[0.2em] mt-0.5">Completed</p>
                                    </div>
                                    <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); router.push(`/expenses/${expense._id}/edit`); }}
                                            className="p-3 text-zinc-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all"
                                            title="Edit Expense"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleDeleteExpense(expense._id); }}
                                            className="p-3 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                            title="Delete Expense"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="h-16 w-16 mb-4 rounded-full bg-zinc-900 flex items-center justify-center">
                                    <ArrowDownRight className="h-8 w-8 text-zinc-700" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">No transactions yet</h3>
                                <p className="text-zinc-500 max-w-sm">When you add your first expense, it will show up here.</p>
                                <Button
                                    onClick={() => router.push('/expenses/new')}
                                    className="mt-6 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 rounded-xl font-semibold"
                                >
                                    Add your first expense
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
