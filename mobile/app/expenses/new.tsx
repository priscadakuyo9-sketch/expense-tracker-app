import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Save, CreditCard, DollarSign, Tag, Calendar as CalendarIcon, Wallet } from 'lucide-react-native';
import api from '../../lib/api';

export default function NewExpense() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        categoryId: '',
        date: new Date().toISOString(),
        paymentMethod: 'Mobile Money',
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
            if (res.data.length > 0) {
                setFormData(prev => ({ ...prev, categoryId: res.data[0]._id }));
            }
        } catch (err) {
            console.error('Fetch categories error:', err);
            Alert.alert('Error', 'Could not load categories');
        }
    };

    const handleSave = async () => {
        if (!formData.amount || isNaN(parseFloat(formData.amount))) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }
        if (!formData.categoryId) {
            Alert.alert('Error', 'Please select a category');
            return;
        }

        setLoading(true);
        try {
            await api.post('/expenses', {
                ...formData,
                amount: parseFloat(formData.amount),
            });
            Alert.alert('Success', 'Expense saved successfully');
            router.replace('/');
        } catch (err: any) {
            console.error('Save expense error:', err);
            const msg = err.response?.data?.message || 'Failed to save expense';
            Alert.alert('Error', msg);
        } finally {
            setLoading(false);
        }
    };

    const paymentMethods = ['Mobile Money', 'Orange Money', 'MTN MoMo', 'Cash', 'Bank Card'];

    return (
        <SafeAreaView className="flex-1 bg-[#09090b]">
            <View className="flex-row items-center justify-between px-6 py-4">
                <TouchableOpacity onPress={() => router.back()} className="h-10 w-10 items-center justify-center rounded-full bg-zinc-800">
                    <ArrowLeft size={20} color="white" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-white">Add Expense</Text>
                <View className="w-10" />
            </View>

            <ScrollView className="flex-1 px-6 pt-4">
                {/* Amount Input */}
                <View className="mb-10 items-center justify-center py-6 bg-zinc-900/40 rounded-[40px] border border-zinc-800/50 shadow-sm">
                    <Text className="mb-3 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Amount Spent</Text>
                    <View className="flex-row items-center justify-center">
                        <Text className="text-3xl font-black text-emerald-500 mr-3">CFA</Text>
                        <TextInput
                            className="text-6xl font-black text-white min-w-[120px] text-center tracking-tighter"
                            placeholder="0"
                            placeholderTextColor="#18181b"
                            keyboardType="numeric"
                            value={formData.amount}
                            onChangeText={(val) => setFormData(prev => ({ ...prev, amount: val }))}
                            autoFocus
                        />
                    </View>
                </View>

                {/* Form Fields */}
                <View className="space-y-6">
                    <View>
                        <Text className="mb-2 text-sm font-medium text-zinc-400">Description</Text>
                        <View className="flex-row items-center rounded-2xl border border-zinc-800 bg-zinc-900/50 px-4 h-14">
                            <TextInput
                                className="flex-1 text-white"
                                placeholder="What was this for?"
                                placeholderTextColor="#71717a"
                                value={formData.description}
                                onChangeText={(val) => setFormData(prev => ({ ...prev, description: val }))}
                            />
                        </View>
                    </View>

                    <View>
                        <Text className="mb-2 text-sm font-medium text-zinc-400">Category</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row py-2">
                            {categories.map((cat) => (
                                <TouchableOpacity
                                    key={cat._id}
                                    onPress={() => setFormData(prev => ({ ...prev, categoryId: cat._id }))}
                                    className={`mr-3 items-center rounded-2xl px-4 py-3 border ${formData.categoryId === cat._id ? 'bg-emerald-500 border-emerald-500' : 'bg-zinc-900 border-zinc-800'}`}
                                >
                                    <Text className="text-lg mb-1">{cat.icon || '💰'}</Text>
                                    <Text className={`text-xs font-bold ${formData.categoryId === cat._id ? 'text-white' : 'text-zinc-400'}`}>{cat.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    <View>
                        <Text className="mb-2 text-sm font-medium text-zinc-400">Payment Method</Text>
                        <View className="flex-row flex-wrap gap-2">
                            {paymentMethods.map((method) => (
                                <TouchableOpacity
                                    key={method}
                                    onPress={() => setFormData(prev => ({ ...prev, paymentMethod: method }))}
                                    className={`rounded-xl px-4 py-2 border ${formData.paymentMethod === method ? 'bg-zinc-100 border-zinc-100' : 'bg-zinc-900 border-zinc-800'}`}
                                >
                                    <Text className={`text-xs font-bold ${formData.paymentMethod === method ? 'text-black' : 'text-zinc-400'}`}>{method}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleSave}
                    disabled={loading}
                    className="mt-8 h-20 flex-row items-center justify-center rounded-[30px] bg-emerald-600 shadow-2xl shadow-emerald-500/40 active:scale-[0.98] transition-all"
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <View className="flex-row items-center">
                            <Save size={24} color="white" className="mr-3" />
                            <Text className="text-xl font-black text-white tracking-tight">Confirm Expense</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
}
