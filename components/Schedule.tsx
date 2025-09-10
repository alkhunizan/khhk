import React from 'react';
import type { Booking } from '../types';
import { MonthSlot } from './MonthSlot';
import { UNAVAILABLE_MONTHS } from '../constants';

interface ScheduleProps {
  year: number;
  months: string[];
  bookedMonths: string[];
  bookings: Booking[];
  onBookMonth: (month: string, year: number) => void;
  onEditBooking: (booking: Booking) => void;
  onCancelBooking: (bookingId: number) => void;
}

export const Schedule: React.FC<ScheduleProps> = ({ 
  year, 
  months, 
  bookedMonths, 
  bookings,
  onBookMonth,
  onEditBooking,
  onCancelBooking
}) => {
  return (
    <div className="my-8">
      <h2 className="text-3xl font-bold font-amiri text-center text-teal-800 mb-8">جدول حجوزات الدورية لعام {year}هـ</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {months.map(month => {
          const isBooked = bookedMonths.includes(month);
          const isUnavailable = UNAVAILABLE_MONTHS.includes(month);
          const bookingDetails = isBooked ? bookings.find(b => b.month === month) : undefined;

          return (
            <MonthSlot
              key={month}
              month={month}
              year={year}
              isBooked={isBooked}
              isUnavailable={isUnavailable}
              bookingDetails={bookingDetails}
              onBook={() => onBookMonth(month, year)}
              onEdit={onEditBooking}
              onCancel={onCancelBooking}
            />
          );
        })}
      </div>
    </div>
  );
};
