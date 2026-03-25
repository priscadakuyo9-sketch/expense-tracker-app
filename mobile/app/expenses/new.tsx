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
                <View className="mb-8 items-center">
                    <Text className="mb-2 text-zinc-400">Amount Spent</Text>
                    <View className="flex-row items-baseline">
                        <Text className="text-2xl font-bold text-emerald-500 mr-2">CFA</Text>
                        <TextInput
                            className="text-5xl font-bold text-white min-w-[100px] text-center"
                            placeholder="0"
                            placeholderTextColor="#27272a"
                            keyboardType="numeric"
                            value={formData.amount}
                            onChangeText={(val) => setFormData(prev => ({ ...prev, amount: val }))}
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
                    className="mt-6 h-16 flex-row items-center justify-center rounded-3xl bg-emerald-500 shadow-xl shadow-emerald-500/20"
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <Save size={20} color="white" className="mr-2" />
                            <Text className="text-lg font-bold text-white">Save Expense</Text>
                        </>
                    )}
                </TouchableOpacity>

                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
}
