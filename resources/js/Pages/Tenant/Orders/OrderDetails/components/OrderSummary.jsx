
export function OrderSummary({ items, total }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5">
      <h3 className="font-bold text-[#222222] mb-4">ملخص المبالغ</h3>
      <div className="flex flex-col gap-3">
        {items.map(item => (
          <div key={item.label} className="flex items-center justify-between text-sm">
            <span className="text-[#888888]">{item.label}</span>
            <span className="font-medium text-[#222222]">{item.value} ر.ي</span>
          </div>
        ))}
        <div className="border-t border-[#E0E0E0] pt-3 flex items-center justify-between">
          <span className="font-bold text-[#222222]">الإجمالي</span>
          <span className="font-bold text-[#2D5A27] text-lg">{total} ر.ي</span>
        </div>
      </div>
    </div>
  );
}
