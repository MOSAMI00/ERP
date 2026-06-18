import { FileCheck, CheckCircle, Lock, MapPin, Handshake } from 'lucide-react';

const features = [
  {
    icon: FileCheck,
    text: 'عقود تأجير موثقة رقمياً',
  },
  {
    icon: CheckCircle,
    text: 'جميع الحسابات موثقة',
  },
  {
    icon: Lock,
    text: 'نظام Escrow لحماية مدفوعاتك',
  },
  {
    icon: MapPin,
    text: 'استأجر في محافظتك',
  },
  {
    icon: Handshake,
    text: 'حماية لكلا الطرفين',
  },
];

export function TrustStrip() {
  return (
    <div className="bg-[#F5F5F5] py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex items-center gap-3 justify-center text-center md:text-right">
                <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm text-foreground max-sm:hidden">{feature.text}</span>
                <span className="text-xs text-foreground sm:hidden">{feature.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
