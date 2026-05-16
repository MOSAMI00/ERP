import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Admin/components/layout/AdminLayout';
import Table from '@/Admin/components/ui/Table';
import Badge from '@/Admin/components/ui/Badge';
import Button from '@/Admin/components/ui/Button';
import Avatar from '@/Admin/components/ui/Avatar';
import Modal from '@/Admin/components/ui/Modal';
import { Eye, Check, X, Search, Filter, ExternalLink } from 'lucide-react';

export default function KycIndex({ documents, filters }) {
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [rejectionModal, setRejectionModal] = useState(null);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        rejection_reason: '',
    });

    const handleApprove = (id) => {
        if (confirm('هل أنت متأكد من الموافقة على هذا الطلب؟')) {
            router.post(route('admin.kyc.approve', id));
        }
    };

    const handleReject = (e) => {
        e.preventDefault();
        post(route('admin.kyc.reject', rejectionModal), {
            onSuccess: () => {
                setRejectionModal(null);
                reset();
            },
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return <Badge variant="warning">قيد الانتظار</Badge>;
            case 'approved': return <Badge variant="success">تم التحقق</Badge>;
            case 'rejected': return <Badge variant="danger">مرفوض</Badge>;
            default: return <Badge>{status}</Badge>;
        }
    };

    const columns = [
        {
            header: 'المستخدم',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <Avatar src={row.user?.avatar} name={row.user?.full_name} size="sm" />
                    <div>
                        <div className="font-bold text-gray-900">{row.user?.full_name}</div>
                        <div className="text-xs text-gray-500">{row.user?.email}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'نوع الوثيقة',
            render: (row) => (
                <span className="text-sm font-medium">
                    {row.doc_type === 'national_id' ? 'بطاقة هوية' : row.doc_type === 'passport' ? 'جواز سفر' : 'بطاقة عسكرية'}
                </span>
            )
        },
        {
            header: 'الوثائق',
            render: (row) => (
                <div className="flex gap-2">
                    <div className="group relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 cursor-pointer" onClick={() => setSelectedDoc({ url: row.front_url, title: 'الوجه الأمامي' })}>
                        <img src={`/storage/${row.front_url}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Eye className="w-3 h-3 text-white" />
                        </div>
                    </div>
                    {row.back_url && (
                        <div className="group relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 cursor-pointer" onClick={() => setSelectedDoc({ url: row.back_url, title: 'الوجه الخلفي' })}>
                            <img src={`/storage/${row.back_url}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Eye className="w-3 h-3 text-white" />
                            </div>
                        </div>
                    )}
                    <div className="group relative w-10 h-10 rounded-lg overflow-hidden border-2 border-brand-primary cursor-pointer" onClick={() => setSelectedDoc({ url: row.selfie_url, title: 'الصورة الشخصية' })}>
                        <img src={`/storage/${row.selfie_url}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Eye className="w-3 h-3 text-white" />
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'الحالة',
            render: (row) => getStatusBadge(row.status)
        },
        {
            header: 'تاريخ التقديم',
            render: (row) => <span className="text-xs text-gray-500">{new Date(row.submitted_at).toLocaleDateString('ar-EG')}</span>
        },
        {
            header: 'الإجراءات',
            render: (row) => (
                <div className="flex items-center gap-2">
                    {row.status === 'pending' && (
                        <>
                            <Button size="sm" variant="ghost" className="text-green-600 hover:bg-green-50" onClick={() => handleApprove(row.id)}>
                                <Check className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => setRejectionModal(row.id)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </>
                    )}
                </div>
            )
        }
    ];

    return (
        <AdminLayout>
            <Head title="توثيق الهوية" />
            
            <div className="space-y-6" dir="rtl">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">طلبات توثيق الهوية</h1>
                        <p className="text-sm text-gray-500">مراجعة والتحقق من هويات المستخدمين</p>
                    </div>
                </div>

                <div className="flex gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="relative flex-1">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input 
                            type="text" 
                            placeholder="بحث باسم المستخدم..." 
                            className="w-full pr-10 pl-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-all border border-gray-200">
                            <Filter className="w-4 h-4" />
                            تصفية
                        </button>
                    </div>
                </div>

                <Table columns={columns} data={documents.data} />

                {/* Lightbox Modal */}
                <Modal 
                    show={!!selectedDoc} 
                    onClose={() => setSelectedDoc(null)}
                    title={selectedDoc?.title}
                >
                    <div className="p-2">
                        <img src={`/storage/${selectedDoc?.url}`} className="w-full h-auto rounded-lg" />
                        <div className="mt-4 flex justify-end">
                            <Button variant="outline" onClick={() => window.open(`/storage/${selectedDoc?.url}`)}>
                                <ExternalLink className="w-4 h-4 ml-2" />
                                فتح في نافذة جديدة
                            </Button>
                        </div>
                    </div>
                </Modal>

                {/* Rejection Modal */}
                <Modal
                    show={!!rejectionModal}
                    onClose={() => setRejectionModal(null)}
                    title="رفض طلب التوثيق"
                >
                    <form onSubmit={handleReject} className="p-4 space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">سبب الرفض</label>
                            <textarea
                                value={data.rejection_reason}
                                onChange={e => setData('rejection_reason', e.target.value)}
                                className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none min-h-[120px] text-sm"
                                placeholder="يرجى توضيح سبب الرفض للمستخدم..."
                                required
                            />
                            {errors.rejection_reason && <p className="text-xs text-red-500 mt-1">{errors.rejection_reason}</p>}
                        </div>
                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="ghost" onClick={() => setRejectionModal(null)}>إلغاء</Button>
                            <Button type="submit" variant="danger" disabled={processing}>تأكيد الرفض</Button>
                        </div>
                    </form>
                </Modal>
            </div>
        </AdminLayout>
    );
}
