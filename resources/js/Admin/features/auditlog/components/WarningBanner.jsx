import { Lock } from 'lucide-react';
import BaseWarningBanner from '../../../components/ui/WarningBanner';

export default function WarningBanner() {
  return (
    <BaseWarningBanner
      icon={Lock}
      title="🔒 هذا السجل للقراءة فقط — لا يمكن حذفه أو تعديله"
      description="وفقاً لمتطلب الأمان (FRA-11.3)، يتم تسجيل جميع الإجراءات الإدارية بشكل دائم وغير قابل للتعديل."
    />
  );
}
