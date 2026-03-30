import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { ArrowLeft, ArrowDownRight, Filter, Calendar, Trash2, Edit2 } from 'lucide-react-native';
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

    const handleDelete = (id: string) => {
        Alert.alert(
            "Delete Expense",
            "Are you sure you want to delete this expense?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await api.delete(`/expenses/${id}`);
                            setExpenses(prev => prev.filter(e => e._id !== id));
                        } catch (err) {
                            console.error('Delete expense error:', err);
                            Alert.alert("Error", "Failed to delete expense");
                        }
                    }
                }
            ]
        );
    };

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
            <View className="flex-row items-center justify-between px-6 py-6 border-b border-zinc-900/50">
                <TouchableOpacity onPress={() => router.back()} className="h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800">
                    <ArrowLeft size={20} color="white" />
                </TouchableOpacity>
                <Text className="text-2xl font-black text-white tracking-tighter">History</Text>
                <TouchableOpacity className="h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800">
                    <Filter size={18} color="#10b981" />
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
                            <View key={expense._id} className="mb-4 flex-row items-center justify-between rounded-[28px] bg-zinc-900/40 p-5 border border-zinc-800/50">
                                <View className="flex-row items-center flex-1">
                                    <View className="mr-4 h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800/50 border border-zinc-800/50">
                                        {expense.categoryId?.icon ? (
                                            <Text className="text-2xl">{expense.categoryId.icon}</Text>
                                        ) : (
                                            <ArrowDownRight size={24} color="#10b981" />
                                        )}
                                    </View>
                                    <View className="flex-1 mr-2">
                                        <Text className="font-black text-white text-lg tracking-tight" numberOfLines={1}>{expense.description || expense.categoryId?.name || 'Expense'}</Text>
                                        <View className="flex-row items-center mt-1.5">
                                            <Text className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mr-3">{new Date(expense.date).toLocaleDateString()}</Text>
                                            <View className="bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/10">
                                                <Text className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter">{expense.paymentMethod}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View className="items-end pl-2">
                                    <Text className="font-black text-red-500 text-lg">-{currency} {expense.amount.toLocaleString()}</Text>
                                    <View className="flex-row items-center mt-3 gap-2">
                                        <TouchableOpacity 
                                            onPress={() => router.push(`/expenses/edit/${expense._id}`)}
                                            className="h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/20"
                                        >
                                            <Edit2 size={14} color="#3b82f6" />
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            onPress={() => handleDelete(expense._id)}
                                            className="h-8 w-8 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20"
                                        >
                                            <Trash2 size={14} color="#ef4444" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
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
