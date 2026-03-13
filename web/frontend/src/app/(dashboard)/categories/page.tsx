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
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="mx-auto max-w-2xl">
                <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back
                </Button>

                <h1 className="mb-8 text-3xl font-bold text-slate-900">Manage Categories</h1>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Add New Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddCategory} className="flex gap-4">
                            <Input
                                placeholder="Category Name (e.g. Health, Gift)"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                required
                            />
                            <Button type="submit" disabled={loading}>
                                <Plus className="mr-2 h-5 w-5" />
                                Add
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Your Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {categories.map((cat: any) => (
                                <div
                                    key={cat._id}
                                    className="flex items-center space-x-3 rounded-lg border p-4 bg-white"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                        <Tag className="h-5 w-5" />
                                    </div>
                                    <span className="font-medium text-slate-900">{cat.name}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
