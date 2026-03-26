'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Wallet, PieChart, TrendingUp, LogOut, ArrowUpRight, ArrowDownRight, Calendar, BarChart3, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import Cookies from 'js-cookie';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart as RechartsPieChart,
    Pie,
    Cell,
} from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState<any>([]);
    const [expenses, setExpenses] = useState<any>([]);
    const [trendData, setTrendData] = useState<any>([]);
    const [budgetStatus, setBudgetStatus] = useState<any>({ hasBudget: false });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            router.push('/login');
            return;
        }
        setUser(JSON.parse(storedUser));
        fetchData();
    }, [router]);

    const fetchData = async () => {
        try {
            const now = new Date();
            const year = now.getUTCFullYear();
            const month = now.getUTCMonth() + 1; // 1-indexed for the API

            const [statsRes, expensesRes, trendRes, budgetRes] = await Promise.all([
                api.get(`/stats/monthly?year=${year}&month=${month}`),
                api.get('/expenses'),
                api.get(`/stats/yearly-trend?year=${year}`),
                api.get('/budgets/status'),
            ]);

            const budgetData = budgetRes.data;
            console.log('[DEBUG-DASHBOARD] Stats:', statsRes.data);
            console.log('[DEBUG-DASHBOARD] Budget Data:', budgetData);

            setStats(statsRes.data);
            setExpenses(expensesRes.data);

            const calculatedSpent = statsRes.data.reduce((acc: number, item: any) => acc + (Number(item.totalAmount) || 0), 0);
            const finalLimit = Number(budgetData.limitAmount) || Number(budgetData.amount) || 0;
            const finalPercentage = finalLimit > 0 ? Math.round((calculatedSpent / finalLimit) * 100) : 0;

            setBudgetStatus({
                ...budgetData,
                totalSpent: calculatedSpent,
                limitAmount: finalLimit,
                percentage: finalPercentage,
                alertTriggered: finalPercentage >= (budgetData.alertThreshold || 80)
            });

            // Format trend data for chart
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const formattedTrend = months.map((m, i) => {
                const found = trendRes.data.find((d: any) => d._id.month === i + 1);
                return {
                    name: m,
                    amount: found ? found.totalAmount : 0,
                };
            });
            setTrendData(formattedTrend);
        } catch (err) {
            console.error('Failed to fetch dashboard data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        Cookies.remove('token');
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#09090b]">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
            </div>
        );
    }

    const totalSpent = stats.reduce((acc: number, item: any) => acc + (item.totalAmount || 0), 0);

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Budget Alert Banner */}
                {budgetStatus.hasBudget && budgetStatus.alertTriggered && (
                    <div 
                        onClick={() => router.push('/budgets')}
                        className="mb-8 cursor-pointer rounded-2xl bg-red-500/10 border border-red-500/40 p-4 flex items-center transition-all hover:bg-red-500/20"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20 text-red-500 mr-4">
                            <AlertTriangle size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-red-500 text-lg">Budget Alert ⚠️</h3>
                            <p className="text-red-400/80 text-sm">You have reached {budgetStatus.percentage}% of your monthly limit ({budgetStatus.totalSpent?.toLocaleString()} / {budgetStatus.limitAmount?.toLocaleString()} {user?.currency}).</p>
                        </div>
                        <ArrowUpRight className="text-red-500 h-5 w-5" />
                    </div>
                )}

                {/* Hero Section */}
                <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-white lg:text-5xl">
                            Welcome, <span className="text-emerald-500">{user?.name.split(' ')[0]}</span>
                        </h1>
                        <p className="mt-2 text-zinc-400">Track and visualize your spending trends with precision.</p>
                    </div>
                    <Button
                        onClick={() => router.push('/expenses/new')}
                        className="bg-emerald-600 font-semibold text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 rounded-xl px-6 py-6"
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        Add New Expense
                    </Button>
                </div>

                {/* Budget Progress Card */}
                {budgetStatus.hasBudget ? (
                    <Card 
                        onClick={() => router.push('/budgets')}
                        className="mb-10 cursor-pointer border-emerald-500/20 bg-[#09090b]/40 backdrop-blur-xl overflow-hidden relative group shadow-2xl shadow-emerald-500/5 hover:border-emerald-500/40 transition-all active:scale-[0.99]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-emerald-500/5 opacity-50 group-hover:opacity-100 transition-all duration-700" />
                        <CardHeader className="flex flex-row items-center justify-between relative z-10">
                            <div>
                                <CardTitle className="text-2xl font-black text-white tracking-tight">Monthly Budget Status</CardTitle>
                                <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest mt-1">Control for {budgetStatus.period}</p>
                            </div>
                            <div className="text-right">
                                <span className={`text-3xl font-black ${budgetStatus.alertTriggered ? 'text-red-500' : 'text-emerald-500'}`}>{budgetStatus.percentage}%</span>
                                <p className="text-[10px] uppercase text-zinc-500 font-bold tracking-tighter">Utilized</p>
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="mb-6 h-4 w-full overflow-hidden rounded-full bg-zinc-900 border border-zinc-800 shadow-inner">
                                <div
                                    className={`h-full transition-all duration-1000 ease-out ${budgetStatus.alertTriggered ? 'bg-gradient-to-r from-red-600 to-rose-400 shadow-[0_0_20px_rgba(239,44,44,0.4)]' : 'bg-gradient-to-r from-emerald-600 to-teal-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]'}`}
                                    style={{ width: `${Math.min(budgetStatus.percentage, 100)}%` }}
                                />
                            </div>
                            <div className="flex justify-between items-end">
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Spent</p>
                                    <p className="text-2xl font-black text-white">{user?.currency || 'CFA'} {budgetStatus.totalSpent?.toLocaleString()}</p>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Limit</p>
                                    <p className="text-2xl font-black text-zinc-400">{user?.currency || 'CFA'} {budgetStatus.limitAmount?.toLocaleString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div 
                        onClick={() => router.push('/budgets')}
                        className="mb-10 cursor-pointer border-2 border-dashed border-zinc-800 bg-zinc-900/20 rounded-3xl p-8 flex flex-col items-center justify-center group hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all"
                    >
                        <div className="h-12 w-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 mb-4 transition-all">
                            <Plus size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-400 group-hover:text-white transition-colors">Step 1: Set your monthly budget</h3>
                        <p className="text-sm text-zinc-500 text-center mt-2 max-w-xs">Take control of your spending by defining a monthly target right now.</p>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
                    <Card className="border-zinc-800/50 bg-zinc-900/40 backdrop-blur-md px-2 border-l-4 border-l-emerald-500 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Monthly Spending</CardTitle>
                            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                <TrendingUp className="h-4 w-4 text-emerald-500" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-white mb-2 tracking-tighter">
                                {user?.currency || 'CFA'} {totalSpent.toLocaleString()}
                            </div>
                            <div className="flex items-center text-[10px] font-bold text-emerald-500 bg-emerald-500/10 w-fit px-3 py-1 rounded-full uppercase tracking-widest">
                                <ArrowUpRight className="mr-1 h-3 w-3" />
                                <span>Organic Growth</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-zinc-800/50 bg-zinc-900/40 backdrop-blur-md px-2 border-l-4 border-l-blue-500 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Categories</CardTitle>
                            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <PieChart className="h-4 w-4 text-blue-500" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-white mb-2 tracking-tighter">{stats.length}</div>
                            <p className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Active sectors</p>
                        </CardContent>
                    </Card>

                    <Card className="border-zinc-800/50 bg-zinc-900/40 backdrop-blur-md px-2 border-l-4 border-l-amber-500 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Transactions</CardTitle>
                            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                <Calendar className="h-4 w-4 text-amber-500" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-white mb-2 tracking-tighter">{expenses.length}</div>
                            <p className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Records found</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    {/* Trend Chart */}
                    <Card className="lg:col-span-2 border-zinc-800 bg-zinc-900/50 p-2">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-bold text-white">Spending Trend</CardTitle>
                                <p className="text-xs text-zinc-500">Monthly breakdown for {new Date().getFullYear()}</p>
                            </div>
                            <BarChart3 className="h-5 w-5 text-zinc-600" />
                        </CardHeader>
                        <CardContent className="h-[300px] min-h-[300px] w-full pt-4 relative" style={{ minHeight: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%" debounce={100} key={trendData.length > 0 ? 'chart-loaded' : 'chart-loading'}>
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                    <XAxis
                                        dataKey="name"
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
                                        itemStyle={{ color: '#10b981' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="amount"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorAmount)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Category Distribution Chart */}
                    <Card className="border-zinc-800 bg-zinc-900/50 p-2">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-white">By Category</CardTitle>
                            <p className="text-xs text-zinc-500">Distribution of expenses</p>
                        </CardHeader>
                        <CardContent className="h-[300px] min-h-[300px] w-full relative" style={{ minHeight: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%" debounce={100} key={stats.length > 0 ? 'pie-loaded' : 'pie-loading'}>
                                <RechartsPieChart>
                                    <Pie
                                        data={stats}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="totalAmount"
                                        nameKey="categoryName"
                                    >
                                        {stats.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                                    />
                                </RechartsPieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Details List */}
                    <Card className="lg:col-span-1 border-zinc-800 bg-zinc-900/50">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-white">Top Sectors</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {stats.length > 0 ? stats.map((item: any, index: number) => (
                                    <div key={item._id} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                                <span className="text-sm font-medium text-zinc-300">{item.categoryName}</span>
                                            </div>
                                            <span className="text-sm font-semibold text-white">
                                                {user?.currency} {item.totalAmount.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                                            <div
                                                className="h-full transition-all duration-500"
                                                style={{
                                                    width: `${Math.min((item.totalAmount / totalSpent) * 100, 100)}%`,
                                                    backgroundColor: COLORS[index % COLORS.length]
                                                }}
                                            />
                                        </div>
                                    </div>
                                )) : <p className="text-zinc-500 italic py-10 text-center">No category data yet.</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Transactions Card */}
                    <Card className="lg:col-span-2 border-zinc-800 bg-zinc-900/50">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-xl font-bold text-white">Activity Feed</CardTitle>
                            <Button variant="ghost" className="text-sm text-emerald-500 hover:bg-emerald-500/10">History</Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {expenses.length > 0 ? expenses.slice(0, 5).map((expense: any) => (
                                    <div key={expense._id} className="group flex items-center justify-between rounded-xl p-3 transition-colors hover:bg-zinc-800/50 border border-transparent hover:border-zinc-800">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800 text-emerald-500 transition-colors group-hover:bg-emerald-500/20">
                                                <div className="text-xl">
                                                    {expense.categoryId?.icon ? <span>{expense.categoryId.icon}</span> : <ArrowDownRight size={20} />}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white">{expense.description || expense.categoryId?.name || 'Uncategorized'}</p>
                                                <div className="flex items-center space-x-2">
                                                    <p className="text-xs text-zinc-500">{new Date(expense.date).toLocaleDateString()}</p>
                                                    <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-mono tracking-tighter uppercase">{expense.paymentMethod}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-white">
                                                -{user?.currency || 'CFA'} {expense.amount.toLocaleString()}
                                            </p>
                                            <p className="text-[10px] text-emerald-500 font-semibold uppercase tracking-widest">Recorded</p>
                                        </div>
                                    </div>
                                )) : <p className="text-zinc-500 italic py-10 text-center">Your transactions will appear here.</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>
        </div>
    );
}

