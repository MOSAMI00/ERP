import { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { CartHeader } from './ui/Header';
import { Stepper } from './ui/Stepper';
import { ReviewItems } from './StepContent/ReviewItems';
import { DeliveryForm } from './StepContent/DeliveryForm';
import { PaymentMethods } from './StepContent/PaymentMethods';
import { SummarySidebar } from './SummarySidebar/SummarySidebar';

export default function CartPage() {
  const { props } = usePage();
  const [removedIds, setRemovedIds] = useState([]);
  const cartItems = (props.cart_items ?? []).filter((item) => !removedIds.includes(item.id));
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
      phone: '',
    },
  });

  const rentalCost = cartItems.reduce((acc, item) => acc + (item.daily_rate ?? item.dailyRate ?? 0) * (item.days ?? 0), 0);
  const deposit = cartItems.reduce((acc, item) => acc + (item.deposit ?? 0), 0);
  const serviceFee = cartItems.reduce((acc, item) => acc + (item.service_fee ?? item.serviceFee ?? 0), 0);
  const total = cartItems.reduce((acc, item) => acc + (item.total_amount ?? item.totalAmount ?? 0), 0);

  const handleDelete = (id) => {
    setRemovedIds((current) => [...current, id]);
  };

  const handleConfirm = () => {
    form.transform((data) => ({
      equipment_id: data.equipment_id,
      start_date: data.start_date,
      end_date: data.end_date,
      delivery_location: data.delivery_location || [
        data.delivery_info?.governorate,
        data.delivery_info?.district,
        data.delivery_info?.address,
      ].filter(Boolean).join(' - '),
    })).post('/rentals');
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
                  onBack={() => setCurrentStep(1)}
                  onNext={() => setCurrentStep(3)}
                />
              )}
              {currentStep === 3 && (
                <PaymentMethods
                  paymentMethod={form.data.payment_method}
                  setPaymentMethod={(method) => form.setData('payment_method', method)}
                  agreeToContract={form.data.agree_to_contract}
                  setAgreeToContract={(agree) => form.setData('agree_to_contract', agree)}
                  onBack={() => setCurrentStep(2)}
                  onConfirm={handleConfirm}
                  requestOnly
                  processing={form.processing}
                  errors={form.errors}
                />
              )}
            </section>

            <aside className="lg:col-span-4">
              <SummarySidebar
                cartItems={cartItems}
                rentalCost={rentalCost}
                deposit={deposit}
                serviceFee={serviceFee}
                total={total}
              />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
