'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, BarChart2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '@/lib/api';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

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
        <div className="p-4 md:p-8 selection:bg-emerald-500/30">
            <div className="mx-auto max-w-4xl">
                <Button variant="ghost" className="mb-6 text-zinc-400 hover:text-white" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back to Dashboard
                </Button>

                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Spending Analysis</h1>
                    <p className="text-zinc-400 text-sm">Detailed visual breakdown of your financial activities.</p>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-xl font-bold text-white">Monthly Breakdown by Category</CardTitle>
                            <BarChart2 className="h-5 w-5 text-emerald-500" />
                        </CardHeader>
                        <CardContent className="h-[400px] pt-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                    <XAxis 
                                        dataKey="categoryName" 
                                        stroke="#71717a" 
                                        fontSize={12} 
                                        tickLine={false} 
                                        axisLine={false} 
                                    />
                                    <YAxis 
                                        stroke="#71717a" 
                                        fontSize={12} 
                                        tickLine={false} 
                                        axisLine={false} 
                                        tickFormatter={(val) => `${val}`}
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                                        labelStyle={{ color: '#fff', fontWeight: 'bold', marginBottom: '4px' }}
                                    />
                                    <Bar dataKey="totalAmount" radius={[6, 6, 0, 0]}>
                                        {stats.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="border-zinc-800 bg-zinc-900/50">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-white">Detailed Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto rounded-xl border border-zinc-800">
                                <table className="w-full text-left text-sm text-zinc-400">
                                    <thead className="bg-zinc-800/50 text-xs font-bold uppercase tracking-widest text-zinc-500">
                                        <tr>
                                            <th className="px-6 py-4">Category</th>
                                            <th className="px-6 py-4 text-right">Total Amount</th>
                                            <th className="px-6 py-4 text-right">Item Count</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800">
                                        {stats.map((item: any) => (
                                            <tr key={item._id} className="group transition-colors hover:bg-zinc-800/30">
                                                <td className="px-6 py-5 font-bold text-zinc-100">{item.categoryName}</td>
                                                <td className="px-6 py-5 text-right font-mono font-bold text-emerald-500 text-lg">
                                                    {item.totalAmount.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-5 text-right font-medium text-zinc-500 uppercase text-[10px] tracking-tighter">
                                                    {item.count} Transactions
                                                </td>
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
