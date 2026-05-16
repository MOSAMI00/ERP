import React, { useState } from 'react';
// @ts-ignore
declare var route: any;
import { useForm, usePage } from '@inertiajs/react';
import { Upload, CheckCircle, AlertCircle, Eye, Trash2 } from 'lucide-react';

export function KYCUploaders() {
    const { props } = usePage();
    const kyc_documents = Array.isArray(props.kyc_documents)
        ? props.kyc_documents
        : props.kyc_documents?.data || [];
    const latestDocument = kyc_documents[0] || null;
    const kyc_status = latestDocument?.status || props.kyc_status || props.auth?.user?.kyc_status || 'not_submitted';
    const effectiveStatus = !latestDocument && kyc_status === 'pending' ? 'not_submitted' : kyc_status;

    const [previews, setPreviews] = useState<Record<string, string | null>>({
        front: null,
        back: null,
        selfie: null
    });

    const form = useForm({
        doc_type: 'national_id',
        front_image: null,
        back_image: null,
        selfie_image: null,
    });

    const handleFileChange = (type: string, file: File | null) => {
        const fieldName = `${type}_image` as any;
        form.setData(fieldName, file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => ({ ...prev, [type]: reader.result }));
            };
            reader.readAsDataURL(file);
        } else {
            setPreviews(prev => ({ ...prev, [type]: null }));
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        form.post(route('kyc.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                form.reset('front_image', 'back_image', 'selfie_image');
                setPreviews({ front: null, back: null, selfie: null });
            },
        });
    };

    const statusMap = {
        pending: { label: 'قيد الانتظار', color: 'text-[#F39C12]', bg: 'bg-[#FEF9E7]', border: 'border-[#F39C12]/30', icon: '⏳' },
        approved: { label: 'تم التحقق', color: 'text-[#27AE60]', bg: 'bg-[#EAFAF1]', border: 'border-[#27AE60]/30', icon: '✅' },
        rejected: { label: 'تم الرفض', color: 'text-[#E74C3C]', bg: 'bg-[#FDEDEC]', border: 'border-[#E74C3C]/30', icon: '❌' },
        not_submitted: { label: 'لم يتم التقديم', color: 'text-[#888888]', bg: 'bg-[#F4F6F9]', border: 'border-[#E0E0E0]', icon: '📄' }
    };

    const currentStatus = (statusMap[effectiveStatus as keyof typeof statusMap] || statusMap.not_submitted) as any;

    if (effectiveStatus === 'approved') {
        return (
            <div className="flex flex-col gap-5 text-center py-10">
                <div className="w-20 h-20 bg-[#EAFAF1] rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-[#27AE60]" />
                </div>
                <h3 className="font-bold text-2xl text-[#222222]">حسابك موثق بنجاح</h3>
                <p className="text-[#888888]">لقد تم التحقق من هويتك، يمكنك الآن استخدام كافة مميزات المنصة.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className={`p-4 rounded-xl border ${currentStatus.border} ${currentStatus.bg} flex items-center gap-3`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 border ${currentStatus.border}`}>
                    {currentStatus.icon}
                </div>
                <div>
                    <p className={`font-bold ${currentStatus.color} text-sm`}>حالة التوثيق: {currentStatus.label}</p>
                    <p className="text-xs text-[#888888] mt-0.5">
                        {effectiveStatus === 'pending'
                            ? 'تم استلام وثائقك وسيتم مراجعتها من فريق الإدارة.'
                            : effectiveStatus === 'rejected'
                                ? 'يرجى إعادة رفع الوثائق بشكل صحيح.'
                                : 'يرجى رفع المستندات المطلوبة لتفعيل حسابك بالكامل.'}
                    </p>
                </div>
            </div>

            {effectiveStatus === 'rejected' && latestDocument?.rejection_reason && (
                <div className="p-4 rounded-xl border border-red-200 bg-red-50 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                        <p className="font-bold text-red-700 text-sm">سبب الرفض:</p>
                        <p className="text-sm text-red-600">{latestDocument.rejection_reason}</p>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-[#222222] mb-1.5">نوع الوثيقة</label>
                    <select
                        value={form.data.doc_type}
                        onChange={e => form.setData('doc_type', e.target.value)}
                        className="w-full h-11 px-4 rounded-xl border border-[#E0E0E0] text-sm focus:outline-none focus:border-[#2D5A27]"
                    >
                        <option value="national_id">بطاقة الهوية الوطنية</option>
                        <option value="passport">جواز السفر</option>
                        <option value="military_id">البطاقة العسكرية</option>
                    </select>
                </div>

                {[
                    { id: 'front', label: 'صورة الوثيقة (الأمامي)', field: 'front_image' },
                    { id: 'back', label: 'صورة الوثيقة (الخلفي)', field: 'back_image' },
                    { id: 'selfie', label: 'صورة شخصية (سيلفي)', field: 'selfie_image' }
                ].map((step) => (
                    <div key={step.id} className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-[#222222]">{step.label}</label>
                        <div className={`relative h-40 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 overflow-hidden ${previews[step.id] ? 'border-[#2D5A27] bg-[#EAFAF1]/30' : 'border-[#E0E0E0] hover:border-[#2D5A27]/50 bg-[#F9FAFB]'}`}>
                            {previews[step.id] ? (
                                <>
                                    <img src={previews[step.id]} alt={step.label} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        <button type="button" onClick={() => window.open(previews[step.id])} className="p-2 bg-white rounded-full text-gray-700 hover:text-[#2D5A27]"><Eye size={18} /></button>
                                        <button type="button" onClick={() => handleFileChange(step.id, null)} className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50"><Trash2 size={18} /></button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-8 h-8 text-gray-400" />
                                    <p className="text-xs text-gray-500">اضغط للرفع أو اسحب الملف هنا</p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={e => handleFileChange(step.id, e.target.files?.[0] || null)}
                                    />
                                </>
                            )}
                        </div>
                        {form.errors[step.field] && <p className="text-xs text-red-500">{form.errors[step.field]}</p>}
                    </div>
                ))}
            </div>

            {form.errors.doc_type && <p className="text-xs text-red-500">{form.errors.doc_type}</p>}

            <button
                type="submit"
                disabled={form.processing || effectiveStatus === 'pending' || !form.data.front_image || !form.data.selfie_image}
                className="h-12 bg-[#2D5A27] text-white rounded-xl font-bold text-sm hover:bg-[#3D7A35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
                {form.processing ? 'جاري الإرسال...' : effectiveStatus === 'pending' ? 'طلبك قيد المراجعة' : 'تقديم طلب التحقق'}
            </button>
        </form>
    );
}
