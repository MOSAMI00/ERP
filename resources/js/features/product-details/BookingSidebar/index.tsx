import { useState } from 'react';
import { router } from '@inertiajs/react';

import { PriceCard } from './PriceCard';
import { DatePickers } from './DatePickers';
import { BookingButton } from './BookingButton';
import { TrustBadges } from './TrustBadges';
import { calculateRentalDays } from '../../../utils/formatters';

export function BookingSidebar({ product }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');

  const days = calculateRentalDays(startDate, endDate);
  const dailyRate = product.price;
  const deposit = product.insurance;
  const serviceFee = days * dailyRate * 0.05;
  const totalRental = days * dailyRate;
  const grandTotal = totalRental + deposit + serviceFee;
  
  const handleBook = () => {
    router.post('/rentals', {
      equipment_id: product.id,
      start_date: startDate,
      end_date: endDate,
      delivery_location: notes || product.location || product.address || '',
    }, {
      onSuccess: () => {
        // Inertia handles redirection if configured on the backend
        // or we could use router.visit('/cart') if needed, but standard is redirect from backend.
      }
    });
  };

  return (
    <div className="bg-white border border-border rounded-xl p-6 space-y-4">
      <PriceCard product={product} dailyRate={dailyRate} deposit={deposit} />
      
      <DatePickers 
        startDate={startDate} 
        setStartDate={setStartDate} 
        endDate={endDate} 
        setEndDate={setEndDate} 
        days={days} 
        notes={notes} 
        setNotes={setNotes} 
      />

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
      />

      <TrustBadges />
    </div>
  );
}
