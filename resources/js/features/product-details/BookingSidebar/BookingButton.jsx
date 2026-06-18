
export function BookingButton({ 
  days, 
  dailyRate, 
  totalRental, 
  deposit, 
  grandTotal, 
  startDate, 
  endDate, 
  onBook,
  disabled,
  loading 
}) {
  return (
    <>
      {days > 0 && (
        <div className="border-t border-border pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">إيجار {days} × {dailyRate.toLocaleString('ar-YE')}:</span>
            <span className="font-semibold">{totalRental.toLocaleString('ar-YE')} ر.ي</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">تأمين:</span>
            <span className="font-semibold">{deposit.toLocaleString('ar-YE')} ر.ي</span>
          </div>

          <div className="flex justify-between pt-2 border-t border-border text-lg">
            <span className="font-bold">الإجمالي:</span>
            <span className="font-bold text-primary">{grandTotal.toLocaleString('ar-YE')} ر.ي</span>
          </div>
        </div>
      )}

      <button
        onClick={onBook}
        disabled={disabled || !startDate || !endDate || days === 0}
        className="w-full h-13 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            جاري التحقق...
          </>
        ) : (
          <>متابعة الحجز ←</>
        )}
      </button>
    </>
  );
}
