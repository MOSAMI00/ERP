export function RegisterButton({ disabled = false }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="w-full h-12 bg-[#2D5A27] text-white rounded-lg hover:bg-[#234518] transition-colors font-medium disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {disabled ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
    </button>
  );
}
