import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { CreditCard, Wallet, Landmark, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import TenantLayout from '../../Layouts/tenant/TenantLayout';

export default function Create({ rental, paymentMethods = [], auth }) {
  const [selectedMethod, setSelectedMethod] = useState('platform_wallet');

  const { data, setData, post, processing, errors } = useForm({
    rental_op_id: rental.id,
    payment_method: 'platform_wallet',
    amount: rental.total_amount,
    transaction_ref: 'MOCK-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/payments');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-YE', {
      style: 'currency',
      currency: 'YER',
      maximumFractionDigits: 0,
    }).format(amount).replace('YER', 'ر.ي');
  };

  const methods = [
    { id: 'platform_wallet', name: 'المحفظة الإلكترونية', icon: Wallet, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'bank_transfer', name: 'تحويل بنكي', icon: Landmark, color: 'text-orange-600', bg: 'bg-orange-50' },
    { id: 'cash', name: 'دفع نقدي (عند الاستلام)', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  return (
    <div className="bg-gray-50/50 min-h-screen font-cairo" dir="rtl">
      <Head title="إكمال الدفع" />

      <div className="py-12 bg-gray-50/50 min-h-screen font-cairo" dir="rtl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Progress Header */}
          <div className="flex items-center justify-center mb-8 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center">
                <CheckCircle2 size={16} />
              </div>
              <span className="text-sm font-bold text-success">الموافقة</span>
            </div>
            <div className="w-12 h-0.5 bg-success/30" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                2
              </div>
              <span className="text-sm font-bold text-primary">الدفع</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-200" />
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center font-bold">
                3
              </div>
              <span className="text-sm font-bold">الاستلام</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Payment Section */}
            <div className="md:col-span-7 space-y-6">
              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <h3 className="text-xl font-bold mb-6 text-gray-900">اختر طريقة الدفع</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {methods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => {
                        setSelectedMethod(method.id);
                        setData('payment_method', method.id);
                      }}
                      className={`relative flex items-center p-5 rounded-2xl border-2 transition-all ${
                        selectedMethod === method.id 
                        ? 'border-primary bg-primary/5 ring-4 ring-primary/10' 
                        : 'border-gray-100 hover:border-gray-200 bg-white'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl ${method.bg} ${method.color} flex items-center justify-center ml-4`}>
                        <method.icon size={24} />
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{method.name}</p>
                        <p className="text-xs text-gray-500 mt-1">آمن ومحمي بنسبة 100%</p>
                      </div>
                      {selectedMethod === method.id && (
                        <div className="mr-auto">
                          <CheckCircle2 size={20} className="text-primary" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  {selectedMethod === 'bank_transfer' && (
                    <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl text-orange-800 text-sm">
                      <div className="flex gap-2 font-bold mb-2">
                        <AlertCircle size={18} />
                        معلومات التحويل
                      </div>
                      <p>يرجى تحويل المبلغ إلى الحساب التالي: <br/><strong>رقم الحساب: 123456789 - بنك اليمن الدولي</strong></p>
                    </div>
                  )}

                  <button
                    disabled={processing}
                    type="submit"
                    className="w-full h-14 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20"
                  >
                    {processing ? 'جاري المعالجة...' : `تأكيد ودفع ${formatCurrency(rental.total_amount)}`}
                    <ShieldCheck size={20} />
                  </button>
                </form>
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="md:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm sticky top-8">
                <h3 className="text-lg font-bold mb-6 text-gray-900 border-b pb-4">تفاصيل الفاتورة</h3>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden">
                    <img 
                      src={rental.equipment.main_image_url || '/images/placeholder.png'} 
                      alt={rental.equipment.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{rental.equipment.name}</p>
                    <p className="text-xs text-gray-500 mt-1">#{rental.id} · {rental.duration_days} أيام</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>تكلفة الإيجار</span>
                    <span className="font-bold">{formatCurrency(rental.rental_amount)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>مبلغ التأمين (مسترد)</span>
                    <span className="font-bold">{formatCurrency(rental.insurance_amount)}</span>
                  </div>
                  <div className="pt-4 border-t border-dashed flex justify-between items-center">
                    <span className="font-bold text-gray-900">المبلغ المطلوب دفعه</span>
                    <span className="text-2xl font-bold text-primary">{formatCurrency(rental.total_amount)}</span>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-success/5 border border-success/10 rounded-2xl flex items-start gap-3">
                  <div className="text-success mt-0.5">
                    <ShieldCheck size={18} />
                  </div>
                  <div className="text-xs text-success/80 leading-5">
                    أموالك محمية لدى المنصة. سيتم تحويل المبلغ للمالك فقط بعد تأكيد استلامك للمعدة بنجاح.
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <button 
                    onClick={() => window.history.back()}
                    className="text-gray-400 hover:text-gray-600 text-sm flex items-center gap-1 transition-colors"
                  >
                    <ArrowRight size={14} className="rotate-180" />
                    العودة لتفاصيل الطلب
                  </button>
                </div>
              </div>
            </div>

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

Create.layout = page => <TenantLayout>{page}</TenantLayout>;
