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
                const now = new Date();
                const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
                const response = await api.get(`/budgets?period=${period}`);
                
                if (response.data) {
                    setAmount(String(response.data.limitAmount || response.data.amount || ''));
                    setThreshold(String(response.data.alertThreshold || '80'));
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
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            Alert.alert('Error', 'Please enter a valid budget amount');
            return;
        }

        if (!threshold || isNaN(Number(threshold)) || Number(threshold) < 1 || Number(threshold) > 100) {
            Alert.alert('Error', 'Alert threshold must be between 1 and 100');
            return;
        }

        setSaving(true);
        try {
            const now = new Date();
            const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            
            await api.post('/budgets', {
                amount: Number(amount),
                period,
                alertThreshold: Number(threshold)
            });

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
        <SafeAreaView className="flex-1 bg-zinc-950">
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
                <View className="mb-8 rounded-3xl bg-emerald-600/10 border border-emerald-500/20 p-6">
                    <View className="flex-row items-center mb-2">
                        <Wallet size={20} color="#10b981" />
                        <Text className="ml-2 text-emerald-500 font-medium">Monthly Target</Text>
                    </View>
                    <Text className="text-zinc-400 text-sm leading-5">
                        Define how much you want to spend this month. We'll track your expenses and notify you when you reach your limit.
                    </Text>
                </View>

                {/* Form */}
                <View className="space-y-6">
                    {/* Amount Input */}
                    <View>
                        <Text className="text-zinc-400 text-sm font-medium mb-3 ml-1">Budget Amount ({user?.currency || 'CFA'})</Text>
                        <View className="flex-row items-center rounded-2xl bg-zinc-900 border border-zinc-800 p-4 focus:border-emerald-500">
                            <DollarSign size={20} color="#71717a" />
                            <TextInput
                                className="flex-1 ml-3 text-white text-lg font-bold"
                                placeholder="0.00"
                                placeholderTextColor="#3f3f46"
                                keyboardType="numeric"
                                value={amount}
                                onChangeText={setAmount}
                            />
                        </View>
                    </View>

                    {/* Alert Threshold Input */}
                    <View>
                        <View className="flex-row items-center justify-between mb-3 ml-1">
                            <Text className="text-zinc-400 text-sm font-medium">Alert Threshold (%)</Text>
                            <Text className="text-emerald-500 text-sm font-bold">{threshold}%</Text>
                        </View>
                        <View className="flex-row items-center rounded-2xl bg-zinc-900 border border-zinc-800 p-4">
                            <Bell size={20} color="#71717a" />
                            <TextInput
                                className="flex-1 ml-3 text-white text-lg font-bold"
                                placeholder="80"
                                placeholderTextColor="#3f3f46"
                                keyboardType="numeric"
                                value={threshold}
                                onChangeText={setThreshold}
                                maxLength={3}
                            />
                        </View>
                        <Text className="text-zinc-500 text-xs mt-3 leading-4">
                            You will see a warning on your dashboard once you've spent {threshold}% of your budget.
                        </Text>
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    onPress={handleSave}
                    disabled={saving}
                    className={`mt-10 h-16 w-full flex-row items-center justify-center rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-500/30 ${saving ? 'opacity-70' : ''}`}
                >
                    {saving ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Save size={20} color="#fff" />
                            <Text className="ml-2 text-lg font-bold text-white">Save Budget</Text>
                        </>
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
