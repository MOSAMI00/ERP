import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Camera, ClipboardList, CheckCircle2, ArrowRight, Info, AlertTriangle, Image as ImageIcon, X } from 'lucide-react';

export default function HandoverCreatePage({ rental, phase, auth }: any) {
  const isOwner = auth.user.id === rental.owner_id;
  const isTenant = auth.user.id === rental.tenant_id;
  
  const [previews, setPreviews] = useState([]);

  const form = useForm<any>({
    rental_op_id: rental.id,
    phase: phase || 'delivery',
    condition_notes: '',
    images: [],
    // For return phase
    has_damages: false,
    damage_description: '',
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    form.setData('images', [...form.data.images, ...files]);
    
    const newPreviews = files.map((file: any) => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = [...form.data.images];
    newImages.splice(index, 1);
    form.setData('images', newImages);

    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    form.post('/handover-reports', {
      forceFormData: true,
    });
  };

  const phaseTitle = phase === 'delivery' ? 'محضر استلام المعدة' : 'محضر إرجاع المعدة';
  const phaseIcon = phase === 'delivery' ? <CheckCircle2 className="text-success" /> : <ArrowRight className="text-primary" />;

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={`/rentals/${rental.id}`} className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowRight size={20} />
          </Link>
          <h1 className="font-bold text-lg">{phaseTitle}</h1>
          <div className="w-10" />
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Context Info */}
        <div className="bg-white rounded-2xl border border-border p-6 mb-6 shadow-sm flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden flex-shrink-0">
            {rental.equipment.images?.[0] && (
              <img src={rental.equipment.images[0].image_url} className="w-full h-full object-cover" />
            )}
          </div>
          <div>
            <div className="font-bold text-lg">{rental.equipment.name}</div>
            <div className="text-sm text-muted-foreground">رقم الطلب: #{rental.id}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Notes Section */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <ClipboardList size={18} className="text-primary" />
              حالة المعدة والملاحظات
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-xl text-sm flex gap-3 items-start border border-primary/10">
                <Info size={18} className="text-primary mt-0.5" />
                <p className="text-primary/80">
                  يرجى وصف حالة المعدة بدقة عند {phase === 'delivery' ? 'الاستلام' : 'الإرجاع'}. هذا التقرير هو المرجع الأساسي في حال حدوث نزاعات.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold">ملاحظات الحالة العامة *</label>
                <textarea
                  className="w-full h-32 px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:border-primary resize-none"
                  placeholder="مثال: المعدة تعمل بشكل ممتاز، يوجد خدش بسيط في الجانب الأيسر..."
                  value={form.data.condition_notes}
                  onChange={e => form.setData('condition_notes', e.target.value)}
                  required
                />
              </div>

              {phase === 'return' && (
                <div className="pt-4 border-t border-border">
                  <label className="flex items-center gap-3 p-4 bg-muted rounded-xl cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-border text-danger focus:ring-danger"
                      checked={form.data.has_damages}
                      onChange={e => form.setData('has_damages', e.target.checked)}
                    />
                    <div className="flex-1">
                      <div className="font-bold text-danger flex items-center gap-2">
                        <AlertTriangle size={16} />
                        يوجد أضرار جديدة في المعدة
                      </div>
                      <div className="text-xs text-muted-foreground">حدد هذا المربع فقط في حال وجود أضرار لم تكن موجودة عند الاستلام</div>
                    </div>
                  </label>

                  {form.data.has_damages && (
                    <div className="mt-4 space-y-2">
                      <label className="block text-sm font-bold text-danger">وصف الأضرار بالتفصيل *</label>
                      <textarea
                        className="w-full h-24 px-4 py-3 rounded-xl border border-danger/30 bg-white focus:outline-none focus:border-danger resize-none"
                        placeholder="يرجى وصف العطل أو الضرر الجديد بدقة..."
                        value={form.data.damage_description}
                        onChange={e => form.setData('damage_description', e.target.value)}
                        required
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Evidence Photos */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Camera size={18} className="text-primary" />
              توثيق الصور (إجباري)
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              قم بالتقاط صور للمعدة من جميع الجوانب، مع التركيز على العدادات وأي ملاحظات ذكرتها.
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {previews.map((src, idx) => (
                <div key={idx} className="aspect-square rounded-xl bg-muted relative group overflow-hidden border border-border">
                  <img src={src} className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-danger text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <label className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Camera size={20} />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground">إضافة صور</span>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange}
                />
              </label>
            </div>
            {form.errors.images && <p className="text-danger text-xs mt-2">{form.errors.images}</p>}
          </div>

          <button
            type="submit"
            disabled={form.processing || form.data.images.length === 0}
            className="w-full h-14 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {form.processing ? 'جاري الحفظ...' : `تأكيد ${phaseTitle} وإرسال التقرير`}
          </button>
        </form>
      </main>
    </div>
  );
}
