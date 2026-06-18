import { Link } from '@inertiajs/react';


export function TermsCheckbox({ agreeToTerms, setAgreeToTerms }) {
  return (
    <div className="flex items-start gap-3 pt-2">
      <input
        type="checkbox"
        id="terms"
        checked={agreeToTerms}
        onChange={(e) => setAgreeToTerms(e.target.checked)}
        className="mt-1 w-4 h-4 rounded border-[#E0E0E0] text-[#2D5A27] focus:ring-[#2D5A27]"
      />
      <label htmlFor="terms" className="text-sm text-[#222222]">
        أوافق على{' '}
        <Link href="/terms" className="text-[#2D5A27] hover:underline">
          الشروط والأحكام
        </Link>
      </label>
    </div>
  );
}
