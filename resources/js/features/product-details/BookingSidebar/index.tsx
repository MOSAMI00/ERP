import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';

import { PriceCard } from './PriceCard';
import { DatePickers } from './DatePickers';
import { BookingButton } from './BookingButton';
import { TrustBadges } from './TrustBadges';
import { calculateRentalDays } from '../../../utils/formatters';

export function BookingSidebar({ product }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [validationReason, setValidationReason] = useState('');

  const days = calculateRentalDays(startDate, endDate);
  const dailyRate = product.price;
  const deposit = product.insurance;
  const serviceFee = days * dailyRate * 0.05;
  const totalRental = days * dailyRate;
  const grandTotal = totalRental + deposit + serviceFee;
  
  useEffect(() => {
    if (startDate && endDate && days > 0) {
      const checkAvailability = async () => {
        setIsChecking(true);
        try {
          const response = await axios.get(`/equipment/${product.id}/check-availability`, {
            params: { start_date: startDate, end_date: endDate }
          });
          setIsValid(response.data.available);
          setValidationReason(response.data.reason || '');
        } catch (error) {
          console.error('Availability check failed', error);
          setIsValid(false);
          setValidationReason('حدث خطأ أثناء فحص التوفر');
        } finally {
          setIsChecking(false);
        }
      };

      const timer = setTimeout(checkAvailability, 500);
      return () => clearTimeout(timer);
    } else {
      setIsValid(false);
      setValidationReason('');
    }
  }, [startDate, endDate, days, product.id]);

  const handleBook = () => {
    if (!isValid) return;
    
    router.visit('/cart', {
      data: {
        equipment_id: product.id,
        start_date: startDate,
        end_date: endDate,
        days: days,
        daily_rate: dailyRate,
        deposit: deposit,
        service_fee: serviceFee,
        total_amount: grandTotal,
        equipment_name: product.name,
        equipment_image: product.image,
        location: product.location,
        owner_name: product.owner?.full_name || product.owner?.name || 'مالك',
      }
    });
  };

  return (
    <div className="bg-white border border-border rounded-xl p-6 space-y-4 shadow-sm">
      <PriceCard product={product} dailyRate={dailyRate} deposit={deposit} />
      
      <DatePickers 
        productId={product.id}
        startDate={startDate} 
        setStartDate={setStartDate} 
        endDate={endDate} 
        setEndDate={setEndDate} 
        days={days} 
      />

      {validationReason && (
        <div className={`text-sm p-3 rounded-lg ${isValid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {validationReason}
        </div>
      )}

      <BookingButton 
        days={days} 
        dailyRate={dailyRate} 
        totalRental={totalRental} 
        deposit={deposit} 
        serviceFee={serviceFee} 
        grandTotal={grandTotal} 
        startDate={startDate} 
        endDate={endDate} 
        onBook={handleBook}
        disabled={!isValid || isChecking}
        loading={isChecking}
      />

      <TrustBadges />
    </div>
  );
}
