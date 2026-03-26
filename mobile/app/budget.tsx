import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Save, Bell, Wallet, DollarSign } from 'lucide-react-native';
import api from '../lib/api';
import * as SecureStore from 'expo-secure-store';

export default function BudgetScreen() {
    const router = useRouter();
    const [amount, setAmount] = useState('');
    const [threshold, setThreshold] = useState('80');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const userData = await SecureStore.getItemAsync('user');
                if (userData) setUser(JSON.parse(userData));

                // Fetch current month's budget
                // Fetch current month's budget using UTC consistently
                const now = new Date();
                const period = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
                const response = await api.get(`/budgets?period=${period}`);
                
                if (response.data) {
                    const budgetVal = response.data.limitAmount ?? response.data.amount;
                    setAmount(budgetVal !== undefined && budgetVal !== null ? String(budgetVal) : '');
                    setThreshold(String(response.data.alertThreshold ?? '80'));
                }
            } catch (error) {
                console.error('Error loading budget:', error);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    const handleSave = async () => {
        // SANITIZATION: Remove any spaces, commas, or unexpected characters before parsing
        const cleanAmount = String(amount).replace(/\s/g, '').replace(/,/g, '.');
        const numericValue = Number(cleanAmount);

        if (isNaN(numericValue) || numericValue <= 0) {
            Alert.alert('Error', 'Please enter a valid numeric amount without special characters');
            return;
        }

        if (!threshold || isNaN(Number(threshold)) || Number(threshold) < 1 || Number(threshold) > 100) {
            Alert.alert('Error', 'Alert threshold must be between 1 and 100');
            return;
        }

        setSaving(true);
        try {
            const now = new Date();
            const period = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
            
            await api.post('/budgets', {
                amount: numericValue,
                period,
                alertThreshold: Number(threshold)
            });

            setSaving(false);
            Alert.alert('Success', 'Your budget has been updated!', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error) {
            console.error('Error saving budget:', error);
            Alert.alert('Error', 'Failed to save budget. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 bg-zinc-950 items-center justify-center">
                <ActivityIndicator color="#10b981" size="large" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#09090b]">
            <ScrollView 
                className="flex-1 px-6"
                contentContainerStyle={{ paddingBottom: 60 }}
            >
                {/* Header */}
                <View className="flex-row items-center justify-between py-6">
                    <TouchableOpacity 
                        onPress={() => router.back()}
                        className="h-10 w-10 items-center justify-center rounded-full bg-zinc-900"
                    >
                        <ArrowLeft size={20} color="#fff" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-white">Manage Budget</Text>
                    <View className="w-10" />
                </View>

                {/* Summary Card */}
                <View className="mb-10 rounded-[32px] bg-emerald-500/10 border border-emerald-500/20 p-8 shadow-2xl relative overflow-hidden">
                    <View className="absolute top-0 right-0 p-4 opacity-5">
                        <Wallet size={80} color="white" />
                    </View>
                    <View className="flex-row items-center mb-4 relative z-10">
                        <View className="h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
                            <Wallet size={20} color="#10b981" />
                        </View>
                        <Text className="ml-3 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Efficiency Goal</Text>
                    </View>
                    <Text className="text-white text-lg font-black tracking-tight mb-2 relative z-10">Define your monthly limits</Text>
                    <Text className="text-zinc-500 text-xs font-medium leading-5 relative z-10">
                        We'll track your expenses in real-time and alert you once you reach your custom threshold.
                    </Text>
                </View>

                {/* Form */}
                <View className="space-y-8">
                    {/* Amount Input */}
                    <View>
                        <Text className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-3">Target Amount ({user?.currency || 'CFA'})</Text>
                        <View className="flex-row items-center rounded-[28px] bg-zinc-900/50 border border-zinc-800 px-6 py-6 shadow-sm">
                            <Text className="text-2xl font-black text-emerald-500 mr-4">CFA</Text>
                            <TextInput
                                className="flex-1 text-white text-3xl font-black tracking-tighter"
                                placeholder="0"
                                placeholderTextColor="#18181b"
                                keyboardType="numeric"
                                value={amount}
                                onChangeText={setAmount}
                            />
                        </View>
                    </View>

                    {/* Alert Threshold Input */}
                    <View>
                        <View className="flex-row items-center justify-between mb-3 ml-1">
                            <Text className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Alert Threshold</Text>
                            <View className="bg-emerald-500/10 px-3 py-1 rounded-full">
                                <Text className="text-emerald-500 text-[10px] font-black">{threshold}%</Text>
                            </View>
                        </View>
                        <View className="flex-row items-center rounded-[28px] bg-zinc-900/50 border border-zinc-800 px-6 py-5">
                            <Bell size={20} color="#059669" />
                            <TextInput
                                className="flex-1 ml-4 text-white text-xl font-bold"
                                placeholder="80"
                                placeholderTextColor="#18181b"
                                keyboardType="numeric"
                                value={threshold}
                                onChangeText={setThreshold}
                                maxLength={3}
                            />
                        </View>
                        <View className="mt-4 flex-row items-start px-1">
                            <Bell size={12} color="#71717a" className="mt-1" />
                            <Text className="ml-2 text-zinc-500 text-[10px] font-medium leading-4 flex-1">
                                Receive a priority notification on your dashboard when usage exceeds {threshold}% of your total portfolio.
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Save Button */}
                {/* Save Button */}
                <TouchableOpacity
                    onPress={handleSave}
                    disabled={saving}
                    className={`mt-12 h-20 w-full flex-row items-center justify-center rounded-[30px] bg-emerald-600 shadow-2xl shadow-emerald-500/40 active:scale-[0.98] transition-all ${saving ? 'opacity-70' : ''}`}
                >
                    {saving ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <View className="flex-row items-center">
                            <Save size={24} color="#fff" className="mr-3" />
                            <Text className="text-xl font-black text-white tracking-tight">Sync New Limits</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Demo Setup Button */}
                <TouchableOpacity
                    onPress={async () => {
                        setSaving(true);
                        try {
                            const now = new Date();
                            const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
                            
                            // 1. Set budget
                            await api.post('/budgets', {
                                amount: 200000,
                                period,
                                alertThreshold: 70
                            });

                            // 2. Add some test expenses (get a category first)
                            const categoriesRes = await api.get('/categories');
                            const catId = categoriesRes.data[0]?._id;

                            if (catId) {
                                await api.post('/expenses', {
                                    amount: 155000,
                                    description: 'Large Test Expense 🛍️',
                                    date: new Date().toISOString(),
                                    categoryId: catId,
                                    paymentMethod: 'Mobile Money'
                                });
                            }

                            Alert.alert('Success', 'Demo mode active: Budget set to 200k and alert triggered!', [
                                { text: 'Great!', onPress: () => router.push('/') }
                            ]);
                        } catch (e) {
                            Alert.alert('Error', 'Demo setup failed');
                        } finally {
                            setSaving(false);
                        }
                    }}
                    className="mt-4 h-12 w-full items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/40"
                >
                    <Text className="text-zinc-500 font-medium">Configuration Démo (Auto)</Text>
                </TouchableOpacity>

                <View className="h-20" />

            </ScrollView>
        </SafeAreaView>
    );
}
