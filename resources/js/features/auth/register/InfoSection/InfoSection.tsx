import { FeaturesCards } from './FeaturesCards';


export function InfoSection({ userType }) {
  return (
    <div className="flex-1 bg-gradient-to-br from-[#2D5A27] to-[#1a3a15] text-white p-6 md:p-12 flex items-center justify-center order-1 md:order-2 md:sticky md:top-0 md:h-screen">
      <div className="max-w-md">
        {userType === 'tenant' ? (
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            ماذا تحصل عند التسجيل؟
          </h2>
        ) : (
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            حوّل معداتك إلى دخل إضافي
          </h2>
        )}
        <FeaturesCards userType={userType} />
      </div>
    </div>
  );
}
