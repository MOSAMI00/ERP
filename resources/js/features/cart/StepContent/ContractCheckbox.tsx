
export function ContractCheckbox({ agreeToContract, setAgreeToContract }) {
  return (
    <div className="border border-border rounded-xl p-6 space-y-4">
      <h3 className="font-bold text-lg">عقد التأجير الإلكتروني</h3>
      <div className="bg-muted rounded-lg p-4 text-sm text-muted-foreground max-h-48 overflow-y-auto">
        <p className="mb-3">هذا العقد يُبرم بين المستأجر والمؤجر عبر منصة تأجير المعدات، ويتضمن:</p>
        <ul className="space-y-2 mr-4">
          <li>• مدة التأجير من 01/02/2025 حتى 04/02/2025 (3 أيام)</li>
          <li>• قيمة الإيجار اليومي: 15,000 ر.ي</li>
          <li>• مبلغ التأمين: 50,000 ر.ي (قابل للاسترداد)</li>
          <li>• المستأجر مسؤول عن المعدة خلال فترة التأجير</li>
          <li>• يُعاد التأمين خلال 5 أيام عمل بعد إرجاع المعدة سليمة</li>
          <li>• أي أضرار تحدث للمعدة تُخصم من مبلغ التأمين</li>
          <li>• التأخير في الإرجاع يُحسب بسعر مضاعف</li>
        </ul>
      </div>

      <button className="text-primary hover:underline text-sm">قراءة العقد كاملاً ←</button>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={agreeToContract}
          onChange={(e) => setAgreeToContract(e.target.checked)}
          className="mt-1 w-5 h-5 rounded border-border text-primary focus:ring-primary"
        />
        <span className="text-sm">أوافق على شروط عقد التأجير وسياسة الإلغاء الخاصة بالمنصة</span>
      </label>
    </div>
  );
}
