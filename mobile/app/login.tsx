import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Wallet, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';
import api from '../lib/api';

export default function LoginScreen() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/login', formData);
            const { access_token, user } = response.data;

            await SecureStore.setItemAsync('token', access_token);
            await SecureStore.setItemAsync('user', JSON.stringify(user));

            router.replace('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView 
            className="flex-1 bg-[#09090b]"
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView 
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className="mb-12 items-center">
                        <View className="h-24 w-24 items-center justify-center rounded-[32px] bg-emerald-500 shadow-2xl shadow-emerald-500/40">
                            <Wallet size={48} color="white" />
                        </View>
                        <Text className="mt-8 text-5xl font-black text-white tracking-tighter">Welcome Back</Text>
                        <Text className="mt-2 text-zinc-500 font-medium uppercase tracking-widest text-xs">Sign in to your portfolio</Text>
                    </View>

                    <View className="space-y-6">
                        <View>
                            <Text className="mb-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Email Address</Text>
                            <View className="flex-row items-center rounded-3xl border border-zinc-800 bg-zinc-900/50 px-5 py-5">
                                <Mail size={20} color="#059669" />
                                <TextInput
                                    className="ml-3 flex-1 text-white text-lg font-medium"
                                    placeholder="name@example.com"
                                    placeholderTextColor="#27272a"
                                    value={formData.email}
                                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>
                        </View>
                        
                        <View className="mt-2">
                            <Text className="mb-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Password</Text>
                            <View className="flex-row items-center rounded-3xl border border-zinc-800 bg-zinc-900/50 px-5 py-5">
                                <Lock size={20} color="#059669" />
                                <TextInput
                                    className="ml-3 flex-1 text-white text-lg font-medium"
                                    placeholder="••••••••"
                                    placeholderTextColor="#18181b"
                                    value={formData.password}
                                    onChangeText={(text) => setFormData({ ...formData, password: text })}
                                    secureTextEntry
                                />
                            </View>
                        </View>
                    </View>

                    {error ? (
                        <View className="mt-6 rounded-2xl bg-red-500/10 border border-red-500/20 p-4">
                            <Text className="text-sm font-medium text-red-500 text-center">⚠️ {error}</Text>
                        </View>
                    ) : null}

                    <TouchableOpacity
                        onPress={handleLogin}
                        disabled={loading}
                        className="mt-12 h-20 flex-row items-center justify-center rounded-[30px] bg-emerald-600 shadow-2xl shadow-emerald-500/40 active:scale-[0.98] transition-all"
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Text className="text-xl font-black text-white mr-3 tracking-tight">Access Dashboard</Text>
                                <ArrowRight size={24} color="white" />
                            </>
                        )}
                    </TouchableOpacity>

                    <View className="mt-8 flex-row justify-center pb-10">
                        <Text className="text-zinc-500">Don't have an account? </Text>
                        <Link href="/register" asChild>
                            <TouchableOpacity>
                                <Text className="font-bold text-emerald-500">Register</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
