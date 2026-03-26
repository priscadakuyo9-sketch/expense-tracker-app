import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, RefreshControl, ActivityIndicator } from 'react-native';
import { Plus, Wallet, PieChart, TrendingUp, LogOut, ArrowUpRight, ArrowDownRight, Calendar, AlertTriangle, Settings } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import api from '../lib/api';

interface StatItem {
    _id: string;
    categoryName: string;
    categoryIcon?: string;
    totalAmount: number;
}

interface ExpenseItem {
    _id: string;
    amount: number;
    description: string;
    date: string;
    categoryId?: {
        name: string;
        icon?: string;
    };
}

interface BudgetStatus {
    hasBudget: boolean;
    period?: string;
    limitAmount?: number;
    totalSpent?: number;
    percentage?: number;
    alertThreshold?: number;
    alertTriggered?: boolean;
}

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState<StatItem[]>([]);
    const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
    const [budgetStatus, setBudgetStatus] = useState<BudgetStatus>({ hasBudget: false });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const checkAuth = async () => {
        const token = await SecureStore.getItemAsync('token');
        const userData = await SecureStore.getItemAsync('user');
        if (!token || !userData) {
            router.replace('/login');
            return null;
        }
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        return parsedUser;
    };

    const fetchData = async () => {
        try {
            const now = new Date();
            // Use UTC for consistent monthly statistics across all platforms
            const year = now.getUTCFullYear();
            const month = now.getUTCMonth() + 1;
            
            const [statsRes, expensesRes, budgetRes] = await Promise.all([
                api.get(`/stats/monthly?year=${year}&month=${month}`),
                api.get('/expenses'),
                api.get('/budgets/status'),
            ]);
            
            const statsData = statsRes.data || [];
            setStats(statsData);
            setExpenses(expensesRes.data || []);
            
            // Defensive handling of budget data
            const bData = budgetRes.data || { hasBudget: false };
            const calculatedSpent = statsData.reduce((acc: number, item: StatItem) => acc + (Number(item.totalAmount) || 0), 0);
            const finalLimit = Number(bData.limitAmount) || Number(bData.amount) || 0;
            const finalPercentage = finalLimit > 0 ? Math.round((calculatedSpent / finalLimit) * 100) : 0;

            setBudgetStatus({
                ...bData,
                totalSpent: calculatedSpent,
                limitAmount: finalLimit,
                percentage: finalPercentage,
                alertTriggered: finalPercentage >= (bData.alertThreshold || 80)
            });
        } catch (err) {
            console.error('Mobile fetch error:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
    }, []);

    useEffect(() => {
        checkAuth().then((authenticated) => {
            if (authenticated) fetchData();
        });
    }, []);

    const handleLogout = async () => {
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('user');
        router.replace('/login');
    };

    const totalSpent = stats.reduce((acc: number, item: StatItem) => acc + (item.totalAmount || 0), 0);

    if (loading && !refreshing) {
        return (
            <View
                className="flex-1 items-center justify-center bg-[#09090b]"
            >
                <ActivityIndicator color="#10b981" />
                <Text className="text-emerald-500 font-bold mt-4 tracking-widest uppercase text-[10px]">Syncing Portfolio...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView
            className="flex-1 bg-[#09090b]"
        >
            <ScrollView
                className="flex-1 px-4 py-6"
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />
                }
            >
                {/* Header */}
                <View className="mb-8 flex-row items-center justify-between">
                    <View>
                        <Text className="text-4xl font-black text-white tracking-tighter">
                            Hello, <Text className="text-emerald-500 font-black">{user?.name?.split(' ')[0]}</Text>
                        </Text>
                        <Text className="text-zinc-500 font-medium uppercase tracking-[0.2em] text-[10px] mt-1">Global Portfolio</Text>
                    </View>
                    <View className="flex-row items-center gap-3">
                        <TouchableOpacity
                            onPress={() => router.push('/budget')}
                            className="h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800"
                        >
                            <Settings size={20} color="#a1a1aa" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleLogout}
                            className="h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10"
                        >
                            <LogOut size={20} color="#10b981" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Budget Progress Card (Premium Overhaul) */}
                {budgetStatus.hasBudget ? (
                    <TouchableOpacity 
                        onPress={() => router.push('/budget')}
                        className={`mb-8 rounded-[32px] border ${budgetStatus.alertTriggered ? 'border-red-500/30' : 'border-emerald-500/20'} bg-zinc-900/50 p-6 shadow-2xl overflow-hidden relative`}
                    >
                        <View className="absolute top-0 right-0 p-4 opacity-5">
                            <TrendingUp size={60} color="white" />
                        </View>
                        <View className="flex-row justify-between items-center mb-4 relative z-10">
                            <View>
                                <Text className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Monthly Budget</Text>
                                <Text className="text-2xl font-black text-white mt-1">Limit Review</Text>
                            </View>
                            <View className="items-end">
                                <Text className={`text-3xl font-black ${budgetStatus.alertTriggered ? 'text-red-500' : 'text-emerald-500'}`}>{budgetStatus.percentage}%</Text>
                                <Text className="text-zinc-500 font-bold uppercase tracking-tighter text-[8px]">Utilized</Text>
                            </View>
                        </View>
                        
                        <View className="h-4 w-full rounded-full bg-zinc-900 border border-zinc-800/50 overflow-hidden mb-6">
                            <View
                                style={{ width: `${Math.min(budgetStatus.percentage ?? 0, 100)}%` }}
                                className={`h-full rounded-full ${budgetStatus.alertTriggered ? 'bg-red-500 shadow-lg' : 'bg-emerald-500 shadow-lg'}`}
                            />
                        </View>

                        <View className="flex-row justify-between items-end">
                           <View>
                               <Text className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Spent</Text>
                               <Text className="text-lg font-black text-white">{user?.currency || 'CFA'} {budgetStatus.totalSpent?.toLocaleString()}</Text>
                           </View>
                           <View className="items-end">
                               <Text className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Remaining</Text>
                               <Text className="text-lg font-black text-zinc-400">{user?.currency || 'CFA'} {((budgetStatus.limitAmount || 0) - (budgetStatus.totalSpent || 0)).toLocaleString()}</Text>
                           </View>
                        </View>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity 
                        onPress={() => router.push('/budget')}
                        className="mb-8 rounded-[32px] border-2 border-dashed border-zinc-800 bg-zinc-900/20 p-8 items-center justify-center"
                    >
                        <View className="h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 mb-3">
                            <Plus size={20} color="#71717a" />
                        </View>
                        <Text className="text-zinc-400 text-sm font-bold uppercase tracking-widest">Set monthly budget limit</Text>
                    </TouchableOpacity>
                )}

                {/* Big Wallet Card */}
                <View className="mb-8 rounded-[40px] bg-emerald-600 p-8 shadow-2xl shadow-emerald-500/40 relative overflow-hidden">
                    <View className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white/10 -mr-20 -mt-20" />
                    <View className="flex-row items-center justify-between relative z-10">
                        <View className="flex-row items-center">
                            <View className="mr-3 h-10 w-10 items-center justify-center rounded-2xl bg-white/20">
                                <Wallet size={20} color="white" />
                            </View>
                            <Text className="text-[10px] font-bold text-white/70 uppercase tracking-[0.2em]">Total Spending</Text>
                        </View>
                        <TrendingUp size={24} color="white" />
                    </View>
                    <Text className="mt-6 text-5xl font-black text-white tracking-tighter relative z-10">
                        {user?.currency || 'CFA'} {totalSpent.toLocaleString()}
                    </Text>
                    <View className="mt-6 flex-row items-center relative z-10">
                        <View className="bg-emerald-500/20 px-3 py-1 rounded-full flex-row items-center">
                            <ArrowUpRight size={14} color="white" />
                            <Text className="ml-1 text-[10px] font-bold text-white uppercase tracking-widest">Active Tracker</Text>
                        </View>
                    </View>
                </View>

                {/* Stats Row */}
                <View className="mb-8 flex-row gap-4">
                    <View className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
                        <PieChart size={20} color="#10b981" />
                        <Text className="mt-2 text-2xl font-bold text-white">{stats.length}</Text>
                        <Text className="text-xs text-zinc-500">Categories</Text>
                    </View>
                    <View className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
                        <Calendar size={20} color="#10b981" />
                        <Text className="mt-2 text-2xl font-bold text-white">{expenses.length}</Text>
                        <Text className="text-xs text-zinc-500">Transactions</Text>
                    </View>
                </View>

                {/* Recent Transactions */}
                <View className="mb-6 flex-row items-center justify-between">
                    <Text className="text-2xl font-black text-white tracking-tighter">Recent Activity</Text>
                    <TouchableOpacity onPress={() => router.push('/expenses')}>
                        <Text className="text-emerald-500 font-bold uppercase tracking-widest text-[10px]">See All</Text>
                    </TouchableOpacity>
                </View>

                <View className="space-y-4">
                    {expenses.length > 0 ? expenses.slice(0, 10).map((expense: ExpenseItem) => (
                        <View key={expense._id} className="mb-3 flex-row items-center justify-between rounded-3xl bg-zinc-900/40 p-5 border border-zinc-800/50">
                            <View className="flex-row items-center">
                                <View className="mr-4 h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800/50">
                                    {expense.categoryId?.icon ? (
                                        <Text className="text-2xl">{expense.categoryId.icon}</Text>
                                    ) : (
                                        <ArrowDownRight size={24} color="#10b981" />
                                    )}
                                </View>
                                <View>
                                    <Text className="font-black text-white text-lg tracking-tight">{expense.description || expense.categoryId?.name || 'Expense'}</Text>
                                    <Text className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">{new Date(expense.date).toLocaleDateString()}</Text>
                                </View>
                            </View>
                            <Text className="font-black text-red-500 text-lg">-{user?.currency || 'CFA'} {expense.amount.toLocaleString()}</Text>
                        </View>
                    )) : (
                        <View className="items-center py-10">
                            <Text className="text-zinc-500 italic">No transactions found</Text>
                        </View>
                    )}
                </View>
                <View className="h-20" />
            </ScrollView>

            {/* Floating Action Button */}
            <TouchableOpacity
                className="absolute bottom-10 right-6 h-16 w-16 items-center justify-center rounded-full bg-emerald-500 shadow-2xl shadow-emerald-500/50"
                onPress={() => router.push('/expenses/new')}
            >
                <Plus size={32} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

