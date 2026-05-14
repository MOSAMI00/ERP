import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, Download, ArrowRight, Calendar, Hash, CreditCard } from 'lucide-react';
import TenantLayout from '../../Layouts/tenant/TenantLayout';

export default function Show({ payment }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-YE', {
      style: 'currency',
      currency: 'YER',
      maximumFractionDigits: 0,
    }).format(amount).replace('YER', 'ر.ي');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-YE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="py-12 bg-gray-50/50 min-h-screen font-cairo" dir="rtl">
      <Head title="تفاصيل الدفع" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
          {/* Success Header */}
          <div className="bg-success/5 p-12 text-center border-b border-success/10">
            <div className="w-20 h-20 rounded-full bg-success text-white flex items-center justify-center mx-auto mb-6 shadow-lg shadow-success/20">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">تم الدفع بنجاح!</h3>
            <p className="text-gray-500">تم تأكيد حجزك وتأمين المبلغ في نظام الضمان</p>
          </div>

          {/* Receipt Details */}
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-2 gap-8 text-sm">
              <div className="space-y-1">
                <p className="text-gray-400 flex items-center gap-1">
                  <Hash size={14} /> رقم العملية
                </p>
                <p className="font-bold text-gray-900">{payment.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-400 flex items-center gap-1">
                  <Calendar size={14} /> تاريخ الدفع
                </p>
                <p className="font-bold text-gray-900">{formatDate(payment.created_at)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-400 flex items-center gap-1">
                  <CreditCard size={14} /> طريقة الدفع
                </p>
                <p className="font-bold text-gray-900">
                  {payment.payment_method === 'platform_wallet' ? 'المحفظة الإلكترونية' : 
                   payment.payment_method === 'bank_transfer' ? 'تحويل بنكي' : 'دفع نقدي'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-400 flex items-center gap-1">
                  <CheckCircle2 size={14} /> الحالة
                </p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                  مكتمل
                </span>
              </div>
            </div>

            {/* Amount Breakdown */}
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">تكلفة الإيجار</span>
                <span className="font-bold text-gray-900">{formatCurrency(payment.rental.rental_amount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">مبلغ التأمين</span>
                <span className="font-bold text-gray-900">{formatCurrency(payment.rental.insurance_amount)}</span>
              </div>
              <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                <span className="font-bold text-gray-900">الإجمالي المدفوع</span>
                <span className="text-2xl font-bold text-primary">{formatCurrency(payment.amount)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4">
              <Link
                href={`/rentals/${payment.rental.id}`}
                className="w-full h-14 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                الذهاب لتفاصيل الطلب
                <ArrowRight size={18} />
              </Link>
              <button className="w-full h-14 bg-white text-gray-700 border border-gray-200 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
                <Download size={18} />
                تحميل الإيصال (PDF)
              </button>
            </div>
          </div>

          {/* Support Footer */}
          <div className="p-6 bg-gray-50 text-center text-xs text-gray-400 border-t border-gray-100">
            في حال وجود أي مشكلة، يرجى التواصل مع الدعم الفني برقم العملية أعلاه.
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
        .font-cairo { font-family: 'Cairo', sans-serif; }
      `}</style>
    </div>
  );
}

Show.layout = page => <TenantLayout>{page}</TenantLayout>;
