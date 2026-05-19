import { useMemo, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { CartHeader } from './ui/Header';
import { Stepper } from './ui/Stepper';
import { ReviewItems } from './StepContent/ReviewItems';
import { DeliveryForm } from './StepContent/DeliveryForm';
import { ContractSigning } from './StepContent/ContractSigning';
import { SummarySidebar } from './SummarySidebar/SummarySidebar';

export default function CartPage({ cart_items, contract_template, contract_variables }: any) {
  const [removedIds, setRemovedIds] = useState<any[]>([]);
  const [deliveryError, setDeliveryError] = useState('');

  const cartItems = (cart_items && cart_items.length > 0
    ? cart_items
    : []
  ).filter((item) => !removedIds.includes(item.id));
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm({
    equipment_id: cartItems[0]?.equipment_id ?? cartItems[0]?.equipmentId ?? cartItems[0]?.id ?? '',
    start_date: cartItems[0]?.start_date ?? cartItems[0]?.startDate ?? '',
    end_date: cartItems[0]?.end_date ?? cartItems[0]?.endDate ?? '',
    delivery_location: '',
    payment_method: null,
    time_slot: null,
    agree_to_contract: false,
    delivery_info: {
      governorate: 'صنعاء',
      district: '',
      address: '',
    },
  });

  const rentalCost = cartItems.reduce((acc, item) => acc + (item.daily_rate ?? item.dailyRate ?? 0) * (item.days ?? 0), 0);
  const deposit = cartItems.reduce((acc, item) => acc + (item.deposit ?? 0), 0);
  const total = cartItems.reduce((acc, item) => acc + (item.total_amount ?? item.totalAmount ?? 0), 0);
  const timeSlotLabels = {
    morning: 'صباحاً (8ص - 12م)',
    afternoon: 'ظهراً (12م - 4م)',
    evening: 'مساءً (4م - 8م)',
  };
  const buildDeliveryLocation = () => [
    form.data.delivery_info?.governorate,
    form.data.delivery_info?.district,
    form.data.delivery_info?.address,
  ].filter(Boolean).join(' - ');

  const contractBody = useMemo(() => {
    const template = contract_template;
    const variables = {
      ...(contract_variables ?? {}),
      issued_at: new Date().toISOString().slice(0, 10),
      delivery_location: form.data.delivery_location || buildDeliveryLocation() || '—',
      preferred_time_slot: timeSlotLabels[form.data.time_slot] ?? '—',
      rental_price: rentalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      insurance_amount: deposit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      total_amount: (rentalCost + deposit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    };
    const aliases = {
      rental_id: 'رقم_العملية',
      issued_at: 'تاريخ_الإصدار',
      tenant_name: 'اسم_المستأجر',
      owner_name: 'اسم_المؤجر',
      equipment_name: 'اسم_المعدة',
      rental_price: 'إجمالي_الإيجار',
      insurance_amount: 'مبلغ_التأمين',
      start_date: 'تاريخ_البداية',
      end_date: 'تاريخ_النهاية',
    };

    if (!template) return null;

    return Object.entries(variables).reduce((body, [key, value]) => {
      const text = String(value ?? '—');
      const alias = aliases[key];

      return body
        .replaceAll(`{${key}}`, text)
        .replaceAll(`{{${key}}}`, text)
        .replaceAll(alias ? `{{${alias}}}` : `{{${key}}}`, text);
    }, template);
  }, [contract_template, contract_variables, form.data.delivery_info, form.data.delivery_location, form.data.time_slot, rentalCost, deposit]);

  const handleDelete = (id) => {
    setRemovedIds((current) => [...current, id]);
  };

  const handleConfirm = () => {
    form.transform((data) => ({
      ...data,
      delivery_location: data.delivery_location || [
        data.delivery_info?.governorate,
        data.delivery_info?.district,
        data.delivery_info?.address,
      ].filter(Boolean).join(' - '),
    }));
    form.post('/rentals');
  };

  const handleDeliveryNext = () => {
    const info = (form.data.delivery_info ?? {}) as any;
    if (!info.governorate || !info.district?.trim() || !info.address?.trim() || !form.data.time_slot) {
      setDeliveryError('جميع بيانات التسليم والوقت المفضل مطلوبة قبل المتابعة للعقد.');
      return;
    }

    form.setData('delivery_location', buildDeliveryLocation());
    setDeliveryError('');
    setCurrentStep(3);
  };

  return (
    <div className="min-h-screen bg-white">
      <CartHeader />
      <Stepper currentStep={currentStep} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8">
            <section className="lg:col-span-8">
              {currentStep === 1 && (
                <ReviewItems
                  cartItems={cartItems}
                  onDelete={handleDelete}
                  onNext={() => setCurrentStep(2)}
                />
              )}
              {currentStep === 2 && (
                <DeliveryForm
                  deliveryInfo={form.data.delivery_info}
                  setDeliveryInfo={(info) => form.setData('delivery_info', typeof info === 'function' ? info(form.data.delivery_info) : info)}
                  timeSlot={form.data.time_slot}
                  setTimeSlot={(slot) => form.setData('time_slot', slot)}
                  error={deliveryError}
                  onBack={() => setCurrentStep(1)}
                  onNext={handleDeliveryNext}
                />
              )}
              {currentStep === 3 && (
                <ContractSigning
                  agreeToContract={form.data.agree_to_contract}
                  setAgreeToContract={(agree) => form.setData('agree_to_contract', agree)}
                  onBack={() => setCurrentStep(2)}
                  onConfirm={handleConfirm}
                  processing={form.processing}
                  errors={form.errors}
                  contractBody={contractBody}
                />
              )}
            </section>

            <aside className="lg:col-span-4">
              <SummarySidebar
                cartItems={cartItems}
                rentalCost={rentalCost}
                deposit={deposit}
                total={total}
              />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
