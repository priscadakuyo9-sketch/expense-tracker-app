'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, BarChart2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '@/lib/api';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function ReportsPage() {
    const router = useRouter();
    const [stats, setStats] = useState<any>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const now = new Date();
            const res = await api.get(`/stats/monthly?year=${now.getFullYear()}&month=${now.getMonth() + 1}`);
            setStats(res.data);
        } catch (err) {
            console.error('Failed to fetch stats', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center">Loading reports...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="mx-auto max-w-4xl">
                <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back
                </Button>

                <h1 className="mb-8 text-3xl font-bold text-slate-900">Spending Analysis</h1>

                <div className="grid grid-cols-1 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Breakdown by Category</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="categoryName" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="totalAmount" radius={[4, 4, 0, 0]}>
                                        {stats.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Summary Data</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-500">
                                    <thead className="bg-slate-50 text-xs uppercase text-slate-700">
                                        <tr>
                                            <th className="px-6 py-3">Category</th>
                                            <th className="px-6 py-3 text-right">Amount</th>
                                            <th className="px-6 py-3 text-right">Transactions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.map((item: any) => (
                                            <tr key={item._id} className="border-b bg-white hover:bg-slate-50">
                                                <td className="px-6 py-4 font-medium text-slate-900">{item.categoryName}</td>
                                                <td className="px-6 py-4 text-right font-semibold text-slate-900">{item.totalAmount.toLocaleString()}</td>
                                                <td className="px-6 py-4 text-right">{item.count}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
