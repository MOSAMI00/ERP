import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Lock, Mail, Loader2, ChevronLeft } from 'lucide-react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.login.submit'));
    };

    return (
        <div className="min-h-screen bg-[#F4F6F9] flex flex-col items-center justify-center p-4 font-cairo" dir="rtl">
            <Head title="تسجيل دخول الأدمن" />

            <div className="w-full max-w-[440px]">
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-primary/20 rotate-3">
                        <Lock className="w-10 h-10 text-white -rotate-3" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
                    <p className="text-gray-500 mt-2">يرجى تسجيل الدخول للمتابعة</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                    <form onSubmit={submit} className="space-y-5">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 mr-1">البريد الإلكتروني</label>
                            <div className="relative group">
                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full h-14 pr-12 pl-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all text-sm"
                                    placeholder="admin@example.com"
                                    required
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-500 mr-1">{errors.email}</p>}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 mr-1">كلمة المرور</label>
                            <div className="relative group">
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full h-14 pr-12 pl-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all text-sm"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            {errors.password && <p className="text-xs text-red-500 mr-1">{errors.password}</p>}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between px-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary transition-all"
                                />
                                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">تذكرني</span>
                            </label>
                            <button type="button" className="text-sm font-bold text-brand-primary hover:underline transition-all">
                                نسيت كلمة المرور؟
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full h-14 bg-brand-primary text-white rounded-2xl font-bold text-sm hover:bg-brand-primary/90 hover:shadow-lg hover:shadow-brand-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {processing ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>تسجيل الدخول</span>
                                    <ChevronLeft className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Link */}
                <p className="text-center mt-8 text-sm text-gray-500">
                    العودة إلى <a href="/" className="text-brand-primary font-bold hover:underline">الرئيسية</a>
                </p>
            </div>
        </div>
    );
}
