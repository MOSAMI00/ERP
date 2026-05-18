import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, ShieldCheck, RefreshCw, Scale, HelpCircle } from 'lucide-react';

export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 text-[#222222] font-sans pb-16">
      {/* Premium Header */}
      <div className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-muted/50 transition-all font-semibold text-sm text-gray-700"
          >
            <ArrowRight size={16} /> العودة للرئيسية
          </Link>
          <h1 className="font-extrabold text-lg text-gray-900">سياسات المنصة وشروط الاستخدام</h1>
          <div className="w-24" /> {/* Spacer */}
        </div>
      </div>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Intro Section */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-full bg-[#2D5A27]/10 flex items-center justify-center mx-auto mb-4 text-[#2D5A27]">
            <HelpCircle size={32} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-3">سياسة الإلغاء وشروط الاستخدام</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            مرحباً بك في منصتنا. يرجى قراءة الشروط والسياسات التالية لضمان تجربة تأجير آمنة وموثوقة لجميع أطراف العملية.
          </p>
        </div>

        {/* Policies Grid */}
        <div className="space-y-6">
          
          {/* Policy Card 1: Cancellation */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                <RefreshCw size={20} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">1. سياسة الإلغاء والاسترداد</h3>
            </div>
            <div className="space-y-4 text-gray-600 text-sm leading-7 text-right">
              <p>
                نحن نسعى لتوفير أقصى درجات المرونة مع الحفاظ على حقوق المؤجرين والمستأجرين. تنطبق الشروط التالية عند إلغاء الحجز:
              </p>
              <ul className="list-disc list-inside space-y-2 mr-4 text-gray-500">
                <li><strong>الإلغاء قبل 24 ساعة من تاريخ الاستلام:</strong> يسترد المستأجر كامل قيمة الإيجار ومبلغ التأمين دون أي خصومات.</li>
                <li><strong>الإلغاء قبل أقل من 24 ساعة:</strong> يترتب عليه خصم رسوم إدارية بسيطة (رسوم الخدمة) ويسترد المستأجر باقي المبلغ بالكامل مع مبلغ التأمين.</li>
                <li><strong>عدم استلام المعدة في الموعد المحدد:</strong> في حال تخلف المستأجر عن الاستلام دون إشعار مسبق، يحق للمؤجر إلغاء الطلب مع احتساب قيمة إيجار اليوم الأول كتعويض للمؤجر.</li>
                <li><strong>إلغاء الطلب من قبل المؤجر:</strong> في حال تعذر توفير المعدة من المؤجر بعد تأكيد الطلب، يسترد المستأجر كامل المبلغ فوراً، ويتم توجيه تنبيه للمؤجر لضمان الجدية.</li>
              </ul>
            </div>
          </div>

          {/* Policy Card 2: Usage Rules */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                <Scale size={20} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">2. شروط وقواعد الاستخدام</h3>
            </div>
            <div className="space-y-4 text-gray-600 text-sm leading-7 text-right">
              <p>
                باستخدامك للمنصة، فإنك تقر وتلتزم بالشروط التالية لضمان السلامة والتشغيل الاحترافي:
              </p>
              <ul className="list-disc list-inside space-y-2 mr-4 text-gray-500">
                <li><strong>أهلية الاستخدام:</strong> يجب أن يكون عمر المستخدم 18 عاماً أو أكثر، وأن يخضع لتوثيق الهوية (KYC) قبل إتمام أي عملية تأجير.</li>
                <li><strong>الغرض من التأجير:</strong> يلتزم المستأجر باستخدام المعدة في الأغراض المخصصة لها وفي بيئة تشغيل آمنة ومطابقة للمواصفات الفنية للمعدة.</li>
                <li><strong>الصيانة والتشغيل:</strong> يكون المستأجر مسؤولاً عن توفير المشغل المؤهل للمعدة وعن الاستخدام الآمن وتفقد الزيوت والوقود بانتظام أثناء فترة التأجير.</li>
                <li><strong>سرية الحساب:</strong> يتحمل العميل المسؤولية الكاملة عن الأنشطة التي تتم عبر حسابه وخصوصية بيانات الدخول الخاصة به.</li>
              </ul>
            </div>
          </div>

          {/* Policy Card 3: Insurance & Guarantees */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#2D5A27]/10 flex items-center justify-center text-[#2D5A27]">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">3. التأمين وضمان الأضرار</h3>
            </div>
            <div className="space-y-4 text-gray-600 text-sm leading-7 text-right">
              <p>
                لحماية استثمارات المؤجرين وضمان حقوق المستأجرين، نتبع نظام الحجز المالي الآمن (Escrow):
              </p>
              <ul className="list-disc list-inside space-y-2 mr-4 text-gray-500">
                <li>يتم دفع مبلغ التأمين بشكل إلزامي ويحتجز في حساب المنصة طوال فترة التأجير.</li>
                <li>عند إرجاع المعدة، يقوم الطرفان بتفحصها وتوقيع محضر الإرجاع إلكترونياً.</li>
                <li>في حال عدم وجود أضرار أو غرامات تأخير، يتم الإفراج الفوري عن مبلغ التأمين وإعادته لمحفظة المستأجر.</li>
                <li>في حال وجود أضرار ناتجة عن سوء الاستخدام، يحق للمؤجر تقديم طلب تعويض مدعوم بالصور والمحاضر لخصم القيمة المناسبة من مبلغ التأمين المحتجز.</li>
              </ul>
            </div>
          </div>

        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center p-6 bg-[#2D5A27]/5 rounded-3xl border border-[#2D5A27]/10">
          <p className="text-[#2D5A27] text-sm font-semibold">
            هل لديك أي استفسارات أخرى؟ نحن هنا دائماً لمساعدتك عبر قنوات الدعم الفني المتاحة في حسابك.
          </p>
        </div>
      </main>
    </div>
  );
}
