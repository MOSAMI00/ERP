import React, { useMemo, useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Admin/components/layout/AdminLayout';
import Table from '@/Admin/components/ui/Table';
import Badge from '@/Admin/components/ui/Badge';
import Button from '@/Admin/components/ui/Button';
import Avatar from '@/Admin/components/ui/Avatar';
import Modal from '@/Admin/components/ui/Modal';
import Select from '@/Admin/components/ui/Select';
import { Eye, Check, X, Search, ExternalLink } from 'lucide-react';

const docTypeLabel = {
    national_id: 'بطاقة الهوية الوطنية',
    passport: 'جواز السفر',
    military_id: 'البطاقة العسكرية',
};

const statusMeta = {
    pending: { label: 'قيد الانتظار', variant: 'warning' },
    approved: { label: 'تم التحقق', variant: 'success' },
    rejected: { label: 'مرفوض', variant: 'danger' },
};

const valueOf = (value) => value?.value || value || '';
const storageUrl = (path) => {
    if (!path) return null;
    if (String(path).startsWith('http')) return path;
    return `/storage/${String(path).replace(/^\/+/, '')}`;
};

export default function KycIndex({ documents, filters = {} }) {
    const rows = documents?.data || [];
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [rejectionModal, setRejectionModal] = useState(null);
    const [search, setSearch] = useState(filters.search || '');

    const { data, setData, post, processing, errors, reset } = useForm({
        rejection_reason: '',
    });

    const requestFilters = (nextFilters) => {
        router.get(route('admin.kyc.index'), nextFilters, {
            preserveState: true,
            replace: true,
        });
    };

    const handleApprove = (id) => {
        if (!confirm('هل أنت متأكد من الموافقة على هذا الطلب؟')) return;

        router.post(route('admin.kyc.approve', id), {}, {
            preserveScroll: true,
        });
    };

    const handleReject = (event) => {
        event.preventDefault();

        post(route('admin.kyc.reject', rejectionModal), {
            preserveScroll: true,
            onSuccess: () => {
                setRejectionModal(null);
                reset();
            },
        });
    };

    const columns = useMemo(() => [
        { key: 'user', label: 'المستخدم' },
        { key: 'doc_type', label: 'نوع الوثيقة' },
        { key: 'documents', label: 'الصور', className: 'px-6 py-4 text-center' },
        { key: 'status', label: 'الحالة', className: 'px-6 py-4 text-center' },
        { key: 'submitted_at', label: 'تاريخ التقديم', className: 'px-6 py-4 text-center' },
        { key: 'actions', label: 'الإجراءات', className: 'px-6 py-4 text-center' },
    ], []);

    const renderImageThumb = (row, field, title, accent = false) => {
        const url = storageUrl(row[field]);
        if (!url) return null;

        return (
            <button
                type="button"
                className={`group relative h-12 w-12 overflow-hidden rounded-lg border ${accent ? 'border-brand-primary' : 'border-brand-border'} bg-brand-content`}
                onClick={() => setSelectedDoc({ url, title })}
                title={title}
            >
                <img src={url} alt={title} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                <span className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                    <Eye className="h-4 w-4 text-white" />
                </span>
            </button>
        );
    };

    return (
        <AdminLayout>
            <Head title="توثيق الهوية" />

            <div className="space-y-6" dir="rtl">
                <div>
                    <h1 className="text-2xl font-bold text-brand-text-primary">طلبات توثيق الهوية</h1>
                    <p className="text-sm text-brand-text-muted">مراجعة صور الوثائق والسيلفي ثم قبول الطلب أو رفضه مع السبب.</p>
                </div>

                <div className="flex flex-col gap-3 rounded-xl border border-brand-border bg-white p-4 shadow-sm md:flex-row md:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-text-muted" />
                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    requestFilters({ ...filters, search: search || undefined });
                                }
                            }}
                            placeholder="بحث باسم المستخدم أو البريد..."
                            className="h-11 w-full rounded-lg border border-brand-border bg-brand-content pr-10 pl-4 text-sm outline-none transition-colors focus:border-brand-primary"
                        />
                    </div>
                    <Select
                        value={filters.status || ''}
                        onChange={(event) => requestFilters({ ...filters, status: event.target.value || undefined })}
                        placeholder="الحالة: الكل"
                        options={[
                            { value: 'pending', label: 'قيد الانتظار' },
                            { value: 'approved', label: 'تم التحقق' },
                            { value: 'rejected', label: 'مرفوض' },
                        ]}
                    />
                    <Button type="button" variant="secondary" onClick={() => requestFilters({ ...filters, search: search || undefined })}>
                        بحث
                    </Button>
                </div>

                <div className="overflow-hidden rounded-xl border border-brand-border bg-brand-card shadow-sm">
                    <Table
                        columns={columns}
                        data={rows}
                        renderRow={(row) => {
                            const status = valueOf(row.status);
                            const meta = statusMeta[status] || { label: status || 'غير محدد', variant: 'neutral' };

                            return (
                                <tr key={row.id} className="transition-colors hover:bg-brand-content/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar src={row.user?.avatar} name={row.user?.full_name} size="sm" />
                                            <div>
                                                <div className="font-bold text-brand-text-primary">{row.user?.full_name || '—'}</div>
                                                <div className="text-xs text-brand-text-muted">{row.user?.email || '—'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-brand-text-primary">
                                        {docTypeLabel[row.doc_type] || row.doc_type}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            {renderImageThumb(row, 'front_url', 'الوجه الأمامي')}
                                            {renderImageThumb(row, 'back_url', 'الوجه الخلفي')}
                                            {renderImageThumb(row, 'selfie_url', 'الصورة الشخصية', true)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge variant={meta.variant}>{meta.label}</Badge>
                                    </td>
                                    <td className="px-6 py-4 text-center text-xs text-brand-text-muted" dir="ltr">
                                        {row.submitted_at ? new Date(row.submitted_at).toLocaleDateString('ar-EG') : '—'}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {status === 'pending' ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <Button size="sm" variant="success" onClick={() => handleApprove(row.id)} title="قبول">
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" variant="danger" onClick={() => setRejectionModal(row.id)} title="رفض">
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-brand-text-muted">تمت المراجعة</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        }}
                    />
                </div>

                <Modal
                    isOpen={!!selectedDoc}
                    onClose={() => setSelectedDoc(null)}
                    title={selectedDoc?.title}
                    panelClassName="bg-brand-card rounded-xl w-full max-w-4xl shadow-2xl border border-brand-border animate-in zoom-in-95 duration-200"
                >
                    <div className="space-y-4 p-4">
                        {selectedDoc?.url && (
                            <img src={selectedDoc.url} alt={selectedDoc.title} className="max-h-[70vh] w-full rounded-lg object-contain bg-black" />
                        )}
                        <div className="flex justify-end">
                            <Button variant="secondary" onClick={() => window.open(selectedDoc?.url, '_blank')}>
                                <ExternalLink className="ml-2 h-4 w-4" />
                                فتح في نافذة جديدة
                            </Button>
                        </div>
                    </div>
                </Modal>

                <Modal
                    isOpen={!!rejectionModal}
                    onClose={() => setRejectionModal(null)}
                    title="رفض طلب التوثيق"
                >
                    <form onSubmit={handleReject} className="space-y-4 p-4">
                        <div>
                            <label className="mb-2 block text-sm font-bold text-brand-text-primary">سبب الرفض</label>
                            <textarea
                                value={data.rejection_reason}
                                onChange={(event) => setData('rejection_reason', event.target.value)}
                                className="min-h-[120px] w-full resize-none rounded-lg border border-brand-border bg-brand-content p-3 text-sm outline-none transition-colors focus:border-brand-danger"
                                placeholder="يرجى توضيح سبب الرفض للمستخدم..."
                                required
                            />
                            {errors.rejection_reason && <p className="mt-1 text-xs text-brand-danger">{errors.rejection_reason}</p>}
                        </div>
                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="secondary" onClick={() => setRejectionModal(null)}>إلغاء</Button>
                            <Button type="submit" variant="danger" disabled={processing}>تأكيد الرفض</Button>
                        </div>
                    </form>
                </Modal>
            </div>
        </AdminLayout>
    );
}
