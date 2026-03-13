import Link from "next/link";
import { Wallet, ArrowRight, Shield, Zap, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#09090b] text-zinc-100 selection:bg-emerald-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-zinc-800 bg-[#09090b]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/20">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Expense<span className="text-emerald-500">Tracker</span></span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-emerald-600 hover:bg-emerald-500">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow pt-32">
        <section className="relative overflow-hidden px-6 lg:px-8">
          <div className="mx-auto max-w-7xl relative">
            <div className="text-center">
              <div className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400 mb-8">
                <span className="mr-2">✨</span> New: Mobile App synchronization
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl">
                Master your <span className="gradient-text">finances</span> <br />
                with elegance.
              </h1>
              <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-zinc-400 sm:text-xl">
                Track every expense, analyze your spending habits, and reach your financial goals with our premium dashboard. Secure, fast, and beautifully designed.
              </p>
              <div className="mt-12 flex items-center justify-center gap-x-6">
                <Link href="/register">
                  <Button size="lg" className="rounded-full px-8 py-6 text-lg">
                    Start Tracking Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <span className="text-sm font-semibold leading-6 text-white hover:text-emerald-400 cursor-pointer transition-colors">
                    Live Demo <span aria-hidden="true">→</span>
                  </span>
                </Link>
              </div>
            </div>

            {/* Decorative Gradients */}
            <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />
            <div className="absolute top-48 -right-24 h-96 w-96 rounded-full bg-cyan-500/5 blur-[120px]" />
          </div>
        </section>

        {/* Features Section */}
        <section className="mt-32 border-t border-zinc-800 bg-[#0a0a0c] py-24 px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
              <div className="group rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 transition-all hover:border-emerald-500/50">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-emerald-400">Smart Analysis</h3>
                <p className="mt-4 text-zinc-400">Get detailed insights into your monthly spending with beautiful charts and reports.</p>
              </div>

              <div className="group rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 transition-all hover:border-emerald-500/50">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-emerald-400">Bank-Level Security</h3>
                <p className="mt-4 text-zinc-400">Your data is encrypted and secure. We prioritize your privacy above everything else.</p>
              </div>

              <div className="group rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 transition-all hover:border-emerald-500/50">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-emerald-400">Real-time Sync</h3>
                <p className="mt-4 text-zinc-400">Sync seamlessly between your web dashboard and mobile application instantly.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12 px-6">
        <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center space-x-2 text-zinc-500">
            <Wallet className="h-4 w-4" />
            <span className="text-sm font-medium">© 2026 ExpenseTracker. All rights reserved.</span>
          </div>
          <div className="flex space-x-6 text-sm font-medium text-zinc-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

