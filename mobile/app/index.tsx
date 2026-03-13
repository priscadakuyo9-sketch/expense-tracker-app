import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, RefreshControl } from 'react-native';
import { Plus, Wallet, PieChart, TrendingUp, LogOut, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react-native';
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

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState<StatItem[]>([]);
    const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
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
            const [statsRes, expensesRes] = await Promise.all([
                api.get(`/stats/monthly?year=${now.getFullYear()}&month=${now.getMonth() + 1}`),
                api.get('/expenses'),
            ]);
            setStats(statsRes.data);
            setExpenses(expensesRes.data);
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
            <View className="flex-1 items-center justify-center bg-[#09090b]">
                <Text className="text-emerald-500">Loading...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#09090b]">
            <ScrollView
                className="flex-1 px-4 py-6"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />
                }
            >
                {/* Header */}
                <View className="mb-8 flex-row items-center justify-between">
                    <View>
                        <Text className="text-3xl font-bold text-white">
                            Hello, <Text className="text-emerald-500">{user?.name?.split(' ')[0]}</Text>
                        </Text>
                        <Text className="text-zinc-400">Total spending this month</Text>
                    </View>
                    <TouchableOpacity
                        onPress={handleLogout}
                        className="h-12 w-12 items-center justify-center rounded-full bg-zinc-800"
                    >
                        <LogOut size={20} color="#a1a1aa" />
                    </TouchableOpacity>
                </View>

                {/* Big Wallet Card */}
                <View className="mb-8 rounded-3xl bg-emerald-600 p-6 shadow-xl shadow-emerald-500/20">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-white/20">
                                <Wallet size={20} color="white" />
                            </View>
                            <Text className="text-lg font-medium text-white/80">Main Balance</Text>
                        </View>
                        <TrendingUp size={24} color="white" />
                    </View>
                    <Text className="mt-4 text-4xl font-bold text-white">
                        {user?.currency || 'CFA'} {totalSpent.toLocaleString()}
                    </Text>
                    <View className="mt-4 flex-row items-center">
                        <ArrowUpRight size={16} color="white" />
                        <Text className="ml-1 text-sm font-medium text-white">+12% from last month</Text>
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
                    <Text className="text-xl font-bold text-white">Recent Activity</Text>
                    <TouchableOpacity onPress={() => router.push('/expenses')}>
                        <Text className="text-emerald-500 font-medium">See All</Text>
                    </TouchableOpacity>
                </View>

                <View className="space-y-4">
                    {expenses.length > 0 ? expenses.slice(0, 10).map((expense: ExpenseItem) => (
                        <View key={expense._id} className="mb-3 flex-row items-center justify-between rounded-2xl bg-zinc-900/50 p-4 border border-zinc-800/50">
                            <View className="flex-row items-center">
                                <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-zinc-800">
                                    {expense.categoryId?.icon ? (
                                        <Text className="text-xl">{expense.categoryId.icon}</Text>
                                    ) : (
                                        <ArrowDownRight size={20} color="#10b981" />
                                    )}
                                </View>
                                <View>
                                    <Text className="font-bold text-white">{expense.description || expense.categoryId?.name || 'Expense'}</Text>
                                    <Text className="text-xs text-zinc-500">{new Date(expense.date).toLocaleDateString()}</Text>
                                </View>
                            </View>
                            <Text className="font-bold text-red-500">-{user?.currency || 'CFA'} {expense.amount.toLocaleString()}</Text>
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
