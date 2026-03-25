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
            const year = now.getFullYear();
            const month = now.getMonth() + 1;

            const [statsRes, expensesRes, trendRes, budgetRes] = await Promise.all([
                api.get(`/stats/monthly?year=${year}&month=${month}`),
                api.get('/expenses'),
                api.get(`/stats/yearly-trend?year=${year}`),
                api.get('/budgets/status'),
            ]);

            setStats(statsRes.data);
            setExpenses(expensesRes.data);
            setBudgetStatus(budgetRes.data);

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

    const totalSpent = stats.reduce((acc: number, item: any) => acc + item.totalAmount, 0);

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

                {/* Budget Progress Card (Visible if budget set) */}
                {budgetStatus.hasBudget && (
                    <Card className="mb-10 border-zinc-800 bg-zinc-900/40 overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-bold text-white">Monthly Budget Status</CardTitle>
                                <p className="text-xs text-zinc-500">Target spending control for {budgetStatus.period}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-bold text-white">{budgetStatus.percentage}%</span>
                                <p className="text-[10px] uppercase text-zinc-500 font-mono">Utilized</p>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4 h-3 w-full overflow-hidden rounded-full bg-zinc-800 border border-zinc-700/50">
                                <div
                                    className={`h-full transition-all duration-1000 ease-out ${budgetStatus.alertTriggered ? 'bg-red-500 shadow-[0_0_10px_rgba(239,44,44,0.3)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]'}`}
                                    style={{ width: `${Math.min(budgetStatus.percentage, 100)}%` }}
                                />
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs text-zinc-500 mb-1">Total Spent</p>
                                    <p className="text-xl font-bold text-white">{user?.currency} {budgetStatus.totalSpent?.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-zinc-500 mb-1">Budget Limit</p>
                                    <p className="text-xl font-bold text-zinc-300">{user?.currency} {budgetStatus.limitAmount?.toLocaleString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
                    <Card className="border-zinc-800 bg-zinc-900 px-2">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Monthly Spending</CardTitle>
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white mb-2">
                                {user?.currency} {totalSpent.toLocaleString()}
                            </div>
                            <div className="flex items-center text-xs text-emerald-500 bg-emerald-500/10 w-fit px-2 py-1 rounded-full">
                                <ArrowUpRight className="mr-1 h-3 w-3" />
                                <span>+12.5% vs last month</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-zinc-800 bg-zinc-900 px-2">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Categories</CardTitle>
                            <PieChart className="h-4 w-4 text-zinc-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white mb-2">{stats.length}</div>
                            <p className="text-xs text-zinc-500">Active spending sectors</p>
                        </CardContent>
                    </Card>

                    <Card className="border-zinc-800 bg-zinc-900 px-2">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Transactions</CardTitle>
                            <Calendar className="h-4 w-4 text-zinc-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white mb-2">{expenses.length}</div>
                            <p className="text-xs text-zinc-500">Lifetime records</p>
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
                        <CardContent className="h-[300px] w-full pt-4">
                            <ResponsiveContainer width="100%" height="100%">
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
                        <CardContent className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
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
                                                -{user?.currency} {expense.amount.toLocaleString()}
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

