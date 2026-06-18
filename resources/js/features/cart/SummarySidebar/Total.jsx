
export function Total({ total }) {
  return (
    <div className="border-t border-border pt-3">
      <div className="flex justify-between items-baseline">
        <span className="font-bold">الإجمالي:</span>
        <span className="text-2xl font-bold text-primary">{total.toLocaleString('ar-YE')} ر.ي</span>
      </div>
    </div>
  );
}
