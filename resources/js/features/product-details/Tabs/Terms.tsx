export function TabTerms() {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg">سياسة الإلغاء</h3>
      <ul className="space-y-2 text-muted-foreground">
        <li className="flex gap-2">
          <span>•</span>
          <span>إلغاء مجاني قبل 24 ساعة من موعد الاستلام</span>
        </li>
        <li className="flex gap-2">
          <span>•</span>
          <span>رسوم إلغاء 50% إذا كان الإلغاء خلال 24 ساعة</span>
        </li>
        <li className="flex gap-2">
          <span>•</span>
          <span>لا يمكن الإلغاء بعد استلام المعدة</span>
        </li>
      </ul>

      <h3 className="font-bold text-lg mt-6">تعليمات التسليم</h3>
      <ul className="space-y-2 text-muted-foreground">
        <li className="flex gap-2">
          <span>•</span>
          <span>يجب التحقق من حالة المعدة عند الاستلام</span>
        </li>
        <li className="flex gap-2">
          <span>•</span>
          <span>التوقيع على العقد الإلكتروني إلزامي</span>
        </li>
        <li className="flex gap-2">
          <span>•</span>
          <span>التصوير الفوتوغرافي للمعدة مطلوب</span>
        </li>
        <li className="flex gap-2">
          <span>•</span>
          <span>يجب إرجاع المعدة بنفس الحالة</span>
        </li>
      </ul>
    </div>
  );
}
