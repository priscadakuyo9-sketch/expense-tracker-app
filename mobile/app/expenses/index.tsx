import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, RefreshControl, ActivityIndicator } from 'react-native';
import { ArrowLeft, ArrowDownRight, Filter, Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import api from '../../lib/api';

interface ExpenseItem {
    _id: string;
    amount: number;
    description: string;
    date: string;
    paymentMethod: string;
    categoryId?: {
        name: string;
        icon?: string;
    };
}

export default function ExpensesList() {
    const router = useRouter();
    const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [currency, setCurrency] = useState('CFA');

    const fetchData = async () => {
        try {
            const userData = await SecureStore.getItemAsync('user');
            if (userData) {
                const parsed = JSON.parse(userData);
                setCurrency(parsed.currency || 'CFA');
            }
            const res = await api.get('/expenses');
            setExpenses(res.data);
        } catch (err) {
            console.error('Fetch expenses error:', err);
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
        fetchData();
    }, []);

    if (loading && !refreshing) {
        return (
            <View className="flex-1 items-center justify-center bg-[#09090b]">
                <ActivityIndicator color="#10b981" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#09090b]">
            <View className="flex-row items-center justify-between px-6 py-4">
                <TouchableOpacity onPress={() => router.back()} className="h-10 w-10 items-center justify-center rounded-full bg-zinc-800">
                    <ArrowLeft size={20} color="white" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-white">All Transactions</Text>
                <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-zinc-800">
                    <Filter size={18} color="#a1a1aa" />
                </TouchableOpacity>
            </View>

            <ScrollView
                className="flex-1 px-6"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />
                }
            >
                <View className="py-4">
                    {expenses.length > 0 ? (
                        expenses.map((expense) => (
                            <View key={expense._id} className="mb-4 flex-row items-center justify-between rounded-2xl bg-zinc-900/50 p-4 border border-zinc-800/50">
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
                                        <View className="flex-row items-center mt-1">
                                            <Text className="text-xs text-zinc-500 mr-2">{new Date(expense.date).toLocaleDateString()}</Text>
                                            <Text className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-400 capitalize">{expense.paymentMethod}</Text>
                                        </View>
                                    </View>
                                </View>
                                <Text className="font-bold text-red-500">-{currency} {expense.amount.toLocaleString()}</Text>
                            </View>
                        ))
                    ) : (
                        <View className="items-center py-20">
                            <Text className="text-zinc-500 italic text-center">
                                No transactions found.{"\n"}Click the + button to add one.
                            </Text>
                        </View>
                    )}
                </View>
                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
}
