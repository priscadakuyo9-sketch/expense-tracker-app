'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';

export default function NewExpensePage() {
    const router = useRouter();
    const [categories, setCategories] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        categoryId: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Mobile Money',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
            if (res.data.length > 0) {
                setFormData((prev) => ({ ...prev, categoryId: res.data[0]._id }));
            }
        } catch (err) {
            console.error('Failed to fetch categories', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Final validation before sending
        if (!formData.amount) {
            alert('Amount is required');
            return;
        }
        if (!formData.categoryId) {
            alert('Category is required');
            return;
        }
        if (!formData.paymentMethod) {
            alert('Payment Method is required');
            return;
        }

        const payload = {
            amount: parseFloat(formData.amount),
            description: formData.description || 'Expense',
            categoryId: formData.categoryId,
            date: formData.date,
            paymentMethod: formData.paymentMethod,
        };

        console.log('Sending payload to backend:', payload);

        setLoading(true);
        try {
            const response = await api.post('/expenses', payload);
            console.log('Expense saved successfully:', response.data);
            alert('Expense saved successfully!');
            router.push('/dashboard');
        } catch (err: any) {
            console.error('Save expense failed:', err);
            const errorMessage = err.response?.data?.message;
            if (Array.isArray(errorMessage)) {
                alert(errorMessage.join('\n'));
            } else {
                alert(errorMessage || 'Failed to save expense. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="mx-auto max-w-2xl">
                <Button
                    variant="ghost"
                    className="mb-6 text-zinc-400 hover:text-white"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back to Dashboard
                </Button>

                <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-xl space-y-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Add New Expense</h1>
                        <p className="text-zinc-400">Record your spending details below</p>
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
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                    Saving...
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <Save className="mr-2 h-5 w-5" />
                                    Save Expense
                                </div>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
