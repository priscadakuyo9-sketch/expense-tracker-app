'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Wallet, User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import api from '@/lib/api';
import Cookies from 'js-cookie';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/register', formData);
            const { access_token, user } = response.data;

            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(user));

            Cookies.set('token', access_token, { expires: 7 });

            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#09090b] p-4 selection:bg-emerald-500/30">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-emerald-500/10 blur-[120px]" />
                <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-cyan-500/5 blur-[120px]" />
            </div>

            <Card className="w-full max-w-md border-zinc-800 bg-zinc-900/50 backdrop-blur-xl relative z-10">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-500/20">
                        <Wallet className="h-7 w-7 text-white" />
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-3xl font-bold tracking-tight text-white font-sans">
                            Create Account
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            Join us today and start managing your wealth
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-4">
                            <Input
                                label="Full Name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                icon={<User className="h-4 w-4 text-zinc-500" />}
                                required
                            />
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                icon={<Mail className="h-4 w-4 text-zinc-500" />}
                                required
                            />
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                icon={<Lock className="h-4 w-4 text-zinc-500" />}
                                required
                            />
                        </div>

                        {error && (
                            <div className="rounded-xl bg-red-500/10 p-3 border border-red-500/20">
                                <p className="text-sm font-medium text-red-500 flex items-center">
                                    <span className="mr-2">⚠️</span> {error}
                                </p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 h-12 text-base font-semibold transition-all rounded-xl active:scale-[0.98]"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Creating account...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    Register
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </span>
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 border-t border-zinc-800/50 p-6 bg-zinc-900/30 rounded-b-2xl">
                    <p className="text-sm text-zinc-400 text-center">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                            Sign In
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}

