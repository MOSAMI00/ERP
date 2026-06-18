
export function FeaturesCards({ userType }) {
  if (userType === 'tenant') {
    return (
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🔍</span>
            <h3 className="font-semibold text-lg">تصفح المعدات في محافظتك</h3>
          </div>
          <p className="text-sm opacity-90 pr-12">
            ابحث عن آلاف المعدات المتاحة بالقرب منك
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📅</span>
            <h3 className="font-semibold text-lg">احجز في دقائق</h3>
          </div>
          <p className="text-sm opacity-90 pr-12">
            عملية حجز سريعة وسهلة بدون تعقيدات
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🔒</span>
            <h3 className="font-semibold text-lg">ادفع بأمان عبر Escrow</h3>
          </div>
          <p className="text-sm opacity-90 pr-12">
            حماية كاملة لمدفوعاتك حتى اكتمال التأجير
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">⭐</span>
            <h3 className="font-semibold text-lg">قيّم بعد كل تأجير</h3>
          </div>
          <p className="text-sm opacity-90 pr-12">
            ساعد الآخرين باختيار المؤجرين الموثوقين
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">💰</span>
          <h3 className="font-semibold text-lg">حدد سعرك بالريال اليمني</h3>
        </div>
        <p className="text-sm opacity-90 pr-12">
          تحكم كامل في أسعارك وشروط التأجير
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">📄</span>
          <h3 className="font-semibold text-lg">عقود رقمية تحميك</h3>
        </div>
        <p className="text-sm opacity-90 pr-12">
          كل تأجير محمي بعقد موثق ومضمون
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🏦</span>
          <h3 className="font-semibold text-lg">
            استلم أرباحك بعد اكتمال التأجير
          </h3>
        </div>
        <p className="text-sm opacity-90 pr-12">
          تحويل فوري وآمن لأرباحك بعد كل تأجير
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">📊</span>
          <h3 className="font-semibold text-lg">تتبع طلباتك وأرباحك</h3>
        </div>
        <p className="text-sm opacity-90 pr-12">
          لوحة تحكم شاملة لإدارة معداتك ومتابعة أرباحك
        </p>
      </div>
    </div>
  );
}
