
export function Stats({ count }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#222222]">طلباتي</h2>
      <p className="text-sm text-[#888888] mt-0.5">{count} طلب إجمالاً</p>
    </div>
  );
}
