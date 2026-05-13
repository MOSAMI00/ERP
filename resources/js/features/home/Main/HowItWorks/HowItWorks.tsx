import { Search, Calendar, Lock, Package, Upload, DollarSign, CheckCircle, TrendingUp } from 'lucide-react';

export function HowItWorks() {
  return (
    <section className="py-16 bg-[#F9F9F9]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">كيف تعمل المنصة</h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* For Renters */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">كيف تستأجر؟</h3>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold mb-1">سجّل وابحث</h4>
                  <p className="text-sm text-muted-foreground">
                    أنشئ حسابك وابحث عن المعدة التي تحتاجها في محافظتك
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-1">حدد المدة والموقع</h4>
                  <p className="text-sm text-muted-foreground">
                    اختر تاريخ الاستلام والإرجاع وحدد عنوان التسليم
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-1">ادفع بأمان (Escrow)</h4>
                  <p className="text-sm text-muted-foreground">
                    التأمين يُحتجز في Escrow ويُعاد بعد إرجاع المعدة سليمة
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold mb-1">استلم وأرجع المعدة</h4>
                  <p className="text-sm text-muted-foreground">
                    تفحّص المعدة عند الاستلام ووقّع العقد إلكترونياً
                  </p>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 h-12 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              ابدأ الاستئجار
            </button>
          </div>

          {/* For Owners */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#F39C12]/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-[#F39C12]" />
              </div>
              <h3 className="text-2xl font-bold">كيف تؤجر معدتك؟</h3>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#F39C12] text-white flex items-center justify-center flex-shrink-0 font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold mb-1">أضف معدتك وصوّرها</h4>
                  <p className="text-sm text-muted-foreground">
                    ارفع صور واضحة ومواصفات دقيقة للمعدة
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#F39C12] text-white flex items-center justify-center flex-shrink-0 font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-1">حدد سعرك بالريال اليمني</h4>
                  <p className="text-sm text-muted-foreground">
                    ضع سعر التأجير اليومي ومبلغ التأمين
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#F39C12] text-white flex items-center justify-center flex-shrink-0 font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-1">قبل أو ارفض الطلبات</h4>
                  <p className="text-sm text-muted-foreground">
                    راجع طلبات التأجير وتواصل مع المستأجرين
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#F39C12] text-white flex items-center justify-center flex-shrink-0 font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold mb-1">استلم أرباحك</h4>
                  <p className="text-sm text-muted-foreground">
                    استلم المدفوعات بأمان عبر المحفظة الإلكترونية
                  </p>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 h-12 bg-[#F39C12] text-white rounded-lg hover:bg-[#F39C12]/90 transition-colors">
              أضف معدتك الآن
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
