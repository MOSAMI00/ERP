
export function UserTypeToggle({ userType, setUserType }) {
  return (
    <div className="flex gap-2 mb-6">
      <button
        type="button"
        onClick={() => setUserType('tenant')}
        className={`flex-1 h-14 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-1 ${
          userType === 'tenant'
            ? 'border-[#2D5A27] bg-[#2D5A27]/5'
            : 'border-[#E0E0E0] hover:border-[#2D5A27]/30'
        }`}
      >
        <span className="text-xl">🏠</span>
        <span className="text-sm font-medium">أنا مستأجر</span>
      </button>

      <button
        type="button"
        onClick={() => setUserType('owner')}
        className={`flex-1 h-14 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-1 ${
          userType === 'owner'
            ? 'border-[#2D5A27] bg-[#2D5A27]/5'
            : 'border-[#E0E0E0] hover:border-[#2D5A27]/30'
        }`}
      >
        <span className="text-xl">🔑</span>
        <span className="text-sm font-medium">أنا مؤجر</span>
      </button>
    </div>
  );
}
