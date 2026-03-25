'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';

export default function CategoriesPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<any>([]);
    const [newName, setNewName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (err) {
            console.error('Failed to fetch categories', err);
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName) return;
        setLoading(true);
        try {
            await api.post('/categories', { name: newName, type: 'EXPENSE', icon: 'Tag' });
            setNewName('');
            fetchCategories();
        } catch (err) {
            console.error('Failed to add category', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 selection:bg-emerald-500/30">
            <div className="mx-auto max-w-2xl">
                <Button variant="ghost" className="mb-6 text-zinc-400 hover:text-white" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back to Dashboard
                </Button>

                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Manage Categories</h1>
                    <p className="text-zinc-400 text-sm">Organize your expenses with custom labels and icons.</p>
                </div>

                <Card className="mb-8 border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-white">Add New Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-4">
                            <Input
                                placeholder="Category Name (e.g. Health, Gift)"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="bg-zinc-950 border-zinc-800 text-white placeholder-zinc-600 focus:border-emerald-500/50"
                                required
                            />
                            <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8">
                                {loading ? (
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ) : (
                                    <>
                                        <Plus className="mr-2 h-5 w-5" />
                                        Add
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                        <Tag className="mr-2 h-5 w-5 text-emerald-500" />
                        Existing Categories
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {categories.map((cat: any) => (
                            <div
                                key={cat._id}
                                className="group flex items-center space-x-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 transition-all hover:bg-zinc-800/60 hover:border-zinc-700"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800 text-emerald-500 transition-colors group-hover:bg-emerald-500/20 shadow-lg">
                                    {cat.icon && cat.icon !== 'Tag' ? (
                                        <span className="text-xl">{cat.icon}</span>
                                    ) : (
                                        <Tag className="h-6 w-6" />
                                    )}
                                </div>
                                <span className="text-lg font-bold text-zinc-100">{cat.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
