import React from 'react';
import { Head } from '@inertiajs/react';
import TenantLayout from '../../Layouts/tenant/TenantLayout';
import OwnerLayout from '../../Layouts/owner/OwnerLayout';
import { KYCUploaders } from '../../features/settings/ui/KYCUploaders';

export default function KycIndex({ auth, kyc_documents, kyc_status }: any) {
  const role = auth?.user?.type || 'tenant';

  return (
    <>
      <Head title="توثيق الهوية" />
      <div className="p-4 md:p-6" dir="rtl">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#E0E0E0] bg-white p-5 shadow-sm md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#222222]">توثيق الهوية</h1>
            <p className="mt-1 text-sm text-[#888888]">ارفع صور الوثائق المطلوبة ليتم مراجعتها من الإدارة.</p>
          </div>
          <KYCUploaders auth={auth} kyc_documents={kyc_documents} kyc_status={kyc_status} />
        </div>
      </div>
    </>
  );
}

KycIndex.layout = (page: any) => {
  const role = page?.props?.auth?.user?.type || 'tenant';
  return role === 'owner' ? <OwnerLayout>{page}</OwnerLayout> : <TenantLayout>{page}</TenantLayout>;
};
