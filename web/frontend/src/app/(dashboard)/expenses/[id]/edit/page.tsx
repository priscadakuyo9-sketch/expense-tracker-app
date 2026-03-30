'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';

export default function EditExpensePage() {
    const router = useRouter();
    const params = useParams();
    const expenseId = params.id as string;
    
    const [categories, setCategories] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        categoryId: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Mobile Money',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        return () => {};
    }, []);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [catsRes, expenseRes] = await Promise.all([
                    api.get('/categories'),
                    api.get(`/expenses/${expenseId}`)
                ]);
                
                setCategories(catsRes.data);
                
                const exp = expenseRes.data;
                setFormData({
                    amount: exp.amount.toString(),
                    description: exp.description || '',
                    categoryId: exp.categoryId?._id || exp.categoryId || '',
                    date: exp.date ? new Date(exp.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                    paymentMethod: exp.paymentMethod || 'Mobile Money',
                });
            } catch (err) {
                console.error('Failed to load expense data', err);
                alert('Could not load expense data');
            } finally {
                setLoading(false);
            }
        };

        if (expenseId) {
            loadInitialData();
        }
    }, [expenseId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.amount) {
            alert('Amount is required');
            return;
        }
        if (!formData.categoryId) {
            alert('Category is required');
            return;
        }

        const payload = {
            amount: parseFloat(formData.amount),
            description: formData.description || 'Expense',
            categoryId: formData.categoryId,
            date: formData.date,
            paymentMethod: formData.paymentMethod,
        };

        setSaving(true);
        try {
            await api.patch(`/expenses/${expenseId}`, payload);
            alert('Expense updated successfully!');
            router.push('/dashboard');
        } catch (err: any) {
            console.error('Update expense failed:', err);
            const errorMessage = err.response?.data?.message;
            if (Array.isArray(errorMessage)) {
                alert(errorMessage.join('\n'));
            } else {
                alert(errorMessage || 'Failed to update expense.');
            }
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
                    className="mb-6 text-zinc-400 hover:text-white"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back
                </Button>

                <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-xl space-y-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Edit Expense</h1>
                        <p className="text-zinc-400">Update your transaction details below</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Amount"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                            required
                        />
                        <Input
                            label="Description"
                            placeholder="e.g. Lunch at restaurant"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        />

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-zinc-300 ml-1">Category</label>
                            <select
                                className="flex h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-100 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all cursor-pointer"
                                value={formData.categoryId}
                                onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                                required
                            >
                                <option value="" disabled>Select a category</option>
                                {categories.map((cat: any) => (
                                    <option key={cat._id} value={cat._id} className="bg-zinc-900">
                                        {cat.icon} {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <Input
                            label="Date"
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                            required
                        />

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-zinc-300 ml-1">Payment Method</label>
                            <select
                                className="flex h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-100 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all cursor-pointer"
                                value={formData.paymentMethod}
                                onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                                required
                            >
                                <option value="Mobile Money">Mobile Money</option>
                                <option value="Orange Money">Orange Money</option>
                                <option value="MTN MoMo">MTN MoMo</option>
                                <option value="Cash">Cash</option>
                                <option value="Bank Card">Bank Card</option>
                            </select>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-500 py-6 rounded-xl text-lg font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
                            disabled={saving}
                        >
                            {saving ? (
                                <div className="flex items-center">
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                    Updating...
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <Edit2 className="mr-2 h-5 w-5" />
                                    Update Expense
                                </div>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
