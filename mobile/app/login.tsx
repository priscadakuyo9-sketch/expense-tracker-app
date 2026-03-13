import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Activity mountain } from 'react-native';
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
        <SafeAreaView className="flex-1 bg-[#09090b]">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 px-6 justify-center"
            >
                <View className="mb-10 items-center">
                    <View className="h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500 shadow-2xl shadow-emerald-500/40">
                        <Wallet size={40} color="white" />
                    </View>
                    <Text className="mt-6 text-4xl font-bold text-white tracking-tight">Welcome Back</Text>
                    <Text className="mt-2 text-zinc-400">Sign in to track your expenses</Text>
                </View>

                <View className="space-y-4">
                    <View>
                        <Text className="mb-2 text-sm font-medium text-zinc-400">Email Address</Text>
                        <View className="flex-row items-center rounded-2xl border border-zinc-800 bg-zinc-900/50 px-4 py-4">
                            <Mail size={20} color="#71717a" />
                            <TextInput
                                className="ml-3 flex-1 text-white"
                                placeholder="name@example.com"
                                placeholderTextColor="#3f3f46"
                                value={formData.email}
                                onChangeText={(text) => setFormData({ ...formData, email: text })}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>
                    </View>

                    <View className="mt-4">
                        <Text className="mb-2 text-sm font-medium text-zinc-400">Password</Text>
                        <View className="flex-row items-center rounded-2xl border border-zinc-800 bg-zinc-900/50 px-4 py-4">
                            <Lock size={20} color="#71717a" />
                            <TextInput
                                className="ml-3 flex-1 text-white"
                                placeholder="••••••••"
                                placeholderTextColor="#3f3f46"
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
                    className="mt-10 flex-row items-center justify-center rounded-2xl bg-emerald-600 py-4 shadow-xl shadow-emerald-600/20"
                >
                    {loading ? (
                        <Text className="text-lg font-bold text-white">Authenticating...</Text>
                    ) : (
                        <>
                            <Text className="text-lg font-bold text-white mr-2">Sign In</Text>
                            <ArrowRight size={20} color="white" />
                        </>
                    )}
                </TouchableOpacity>

                <View className="mt-8 flex-row justify-center">
                    <Text className="text-zinc-500">Don't have an account? </Text>
                    <Link href="/register" asChild>
                        <TouchableOpacity>
                            <Text className="font-bold text-emerald-500">Register</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
