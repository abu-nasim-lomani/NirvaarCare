"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Lock, User, Mail } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { createClient } from "@/lib/supabase/client";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

type LoginTab = "phone" | "email";
type AuthMode = "LOGIN" | "REGISTER";

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
    const { lang } = useLang();
    const supabase = createClient();

    const [tab, setTab] = useState<LoginTab>("phone");
    const [mode, setMode] = useState<AuthMode>("LOGIN");

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Phone → virtual email
    const getVirtualEmail = (phoneNum: string) => {
        const clean = phoneNum.replace(/\D/g, "");
        return `u${clean}@nirvaarcare.com`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const isPhone = tab === "phone";
        const authEmail = isPhone ? getVirtualEmail(phone) : email;

        if (isPhone && phone.replace(/\D/g, "").length < 10) {
            setError(lang === "en" ? "Enter a valid phone number." : "সঠিক ফোন নম্বর দিন।");
            setLoading(false);
            return;
        }
        if (!isPhone && !/\S+@\S+\.\S+/.test(email)) {
            setError(lang === "en" ? "Enter a valid email address." : "সঠিক ইমেইল দিন।");
            setLoading(false);
            return;
        }
        if (password.length < 6) {
            setError(lang === "en" ? "Password must be at least 6 characters." : "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে।");
            setLoading(false);
            return;
        }

        if (mode === "REGISTER") {
            const { error: err } = await supabase.auth.signUp({
                email: authEmail,
                password,
                options: {
                    data: {
                        full_name: name,
                        ...(isPhone ? { phone_number: phone } : {}),
                    }
                }
            });
            if (err) setError(err.message);
            else onSuccess();
        } else {
            const { error: err } = await supabase.auth.signInWithPassword({ email: authEmail, password });
            if (err) setError(lang === "en" ? "Invalid credentials. Please try again." : "ভুল তথ্য দেওয়া হয়েছে, আবার চেষ্টা করুন।");
            else onSuccess();
        }

        setLoading(false);
    };

    const handleGoogle = async () => {
        // Save current page so we can return here after Google login
        if (typeof window !== "undefined") {
            localStorage.setItem("booking_intent_url", window.location.pathname);
        }
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(window.location.pathname)}`,
            },
        });
        if (error) setError(error.message);
    };

    const resetForm = () => {
        setError("");
        setName("");
        setPhone("");
        setEmail("");
        setPassword("");
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
                >
                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:text-white transition z-10"
                    >
                        <X size={18} />
                    </button>

                    <div className="p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {mode === "LOGIN"
                                        ? (lang === "en" ? "Welcome Back" : "ফিরে আসার জন্য ধন্যবাদ")
                                        : (lang === "en" ? "Create Account" : "অ্যাকাউন্ট তৈরি করুন")}
                                </h2>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {lang === "en" ? "Login to book NirvaarCare services." : "সার্ভিস বুক করতে লগিন করুন।"}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            {/* Left: Google + Divider */}
                            <div className="flex flex-col items-center gap-3 w-48 flex-shrink-0 pt-1">
                                <button
                                    onClick={handleGoogle}
                                    type="button"
                                    className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition font-medium text-sm text-gray-700 dark:text-gray-300"
                                >
                                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    {lang === "en" ? "Google" : "Google"}
                                </button>

                                <div className="flex items-center gap-2 w-full">
                                    <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1" />
                                    <span className="text-xs text-gray-400">{lang === "en" ? "or" : "বা"}</span>
                                    <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1" />
                                </div>

                                {/* Phone / Email Tabs */}
                                <div className="flex flex-col w-full gap-1.5">
                                    {(["phone", "email"] as LoginTab[]).map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => { setTab(t); resetForm(); }}
                                            className={`w-full py-2 text-sm font-medium rounded-lg transition-all border ${
                                                tab === t
                                                    ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400"
                                                    : "border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                            }`}
                                        >
                                            {t === "phone"
                                                ? (lang === "en" ? "📱 Phone" : "📱 ফোন")
                                                : (lang === "en" ? "✉️ Email" : "✉️ ইমেইল")}
                                        </button>
                                    ))}
                                </div>

                                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">
                                    {mode === "LOGIN"
                                        ? (lang === "en" ? "No account? " : "অ্যাকাউন্ট নেই? ")
                                        : (lang === "en" ? "Have an account? " : "আগে থেকে আছে? ")}
                                    <button
                                        type="button"
                                        onClick={() => { setMode(mode === "LOGIN" ? "REGISTER" : "LOGIN"); resetForm(); }}
                                        className="font-semibold text-emerald-600 hover:text-emerald-700 transition"
                                    >
                                        {mode === "LOGIN"
                                            ? (lang === "en" ? "Sign Up" : "নিবন্ধন")
                                            : (lang === "en" ? "Log In" : "লগিন")}
                                    </button>
                                </p>
                            </div>

                            {/* Vertical Divider */}
                            <div className="w-px bg-gray-100 dark:bg-gray-800 self-stretch" />

                            {/* Right: Form */}
                            <div className="flex-1 min-w-0">
                                {/* Error */}
                                {error && (
                                    <div className="mb-3 p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl text-red-600 dark:text-red-400 text-xs text-center">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-3">
                                    {/* Full Name — Register only */}
                                    {mode === "REGISTER" && (
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                {lang === "en" ? "Full Name" : "সম্পূর্ণ নাম"}
                                            </label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder={lang === "en" ? "Enter your full name" : "আপনার সম্পূর্ণ নাম লিখুন"}
                                                    required
                                                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Phone or Email */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                            {tab === "phone"
                                                ? (lang === "en" ? "Phone Number" : "ফোন নম্বর")
                                                : (lang === "en" ? "Email Address" : "ইমেইল")}
                                        </label>
                                        <div className="relative">
                                            {tab === "phone"
                                                ? <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                : <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
                                            <input
                                                type={tab === "phone" ? "tel" : "email"}
                                                value={tab === "phone" ? phone : email}
                                                onChange={(e) => tab === "phone" ? setPhone(e.target.value) : setEmail(e.target.value)}
                                                placeholder={tab === "phone" ? "01700000000" : "example@email.com"}
                                                required
                                                className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                            {lang === "en" ? "Password" : "পাসওয়ার্ড"}
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder={lang === "en" ? "Min. 6 characters" : "কমপক্ষে ৬ অক্ষর"}
                                                required
                                                className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition shadow-lg shadow-emerald-500/20 flex justify-center items-center"
                                    >
                                        {loading
                                            ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            : mode === "LOGIN"
                                                ? (lang === "en" ? "Sign In" : "লগিন করুন")
                                                : (lang === "en" ? "Create Account" : "অ্যাকাউন্ট তৈরি করুন")}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
