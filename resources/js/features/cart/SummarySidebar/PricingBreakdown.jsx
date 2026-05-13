
export function PricingBreakdown({ rentalCost, deposit, serviceFee }) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">قيمة الإيجار:</span>
        <span className="font-semibold">{rentalCost.toLocaleString('ar-YE')} ر.ي</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">التأمين:</span>
        <span className="font-semibold">{deposit.toLocaleString('ar-YE')} ر.ي</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">رسوم الخدمة:</span>
        <span className="font-semibold">{serviceFee.toLocaleString('ar-YE')} ر.ي</span>
      </div>
    </div>
  );
}
