import React from 'react';
import type { Booking, User } from '../types';
import { HIJRI_MONTHS_ORDER } from '../constants';

interface MonthSlotProps {
  month: string;
  year: number;
  isBooked: boolean;
  isUnavailable: boolean;
  bookingDetails?: Booking;
  onBook: () => void;
  user: User | null;
  onEdit: (booking: Booking) => void;
  onCancel: (bookingId: number) => void;
}

const HIJRI_YEAR_START_GREGORIAN: { [key: number]: { monthIndex: number, year: number } } = {
    1446: { monthIndex: 6, year: 2024 }, // Muharram 1446 ~ July 2024
    1447: { monthIndex: 5, year: 2025 }, // Muharram 1447 ~ June 2025
    1448: { monthIndex: 5, year: 2026 }, // Muharram 1448 ~ May 2026 -> Note: Hijri year is ~11 days shorter
};
const GREGORIAN_MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

const getGregorianApproximation = (hijriMonth: string, hijriYear: number): string => {
    const yearStart = HIJRI_YEAR_START_GREGORIAN[hijriYear];
    if (!yearStart) return '';

    const hijriMonthIndex = HIJRI_MONTHS_ORDER.indexOf(hijriMonth);
    if (hijriMonthIndex === -1) return '';

    const gregorianMonthIndex = (yearStart.monthIndex + hijriMonthIndex) % 12;
    const gregorianYear = yearStart.year + Math.floor((yearStart.monthIndex + hijriMonthIndex) / 12);
    
    const nextGregorianMonthIndex = (gregorianMonthIndex + 1) % 12;

    return `${GREGORIAN_MONTHS[gregorianMonthIndex]} / ${GREGORIAN_MONTHS[nextGregorianMonthIndex]} ${gregorianYear}`;
};

const CalendarIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
    </svg>
);

const LocationIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);

export const MonthSlot: React.FC<MonthSlotProps> = ({ month, year, isBooked, isUnavailable, bookingDetails, onBook, user, onEdit, onCancel }) => {
  const baseClasses = "rounded-xl shadow-lg p-6 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1";
  const unavailableClasses = "bg-slate-200 text-slate-500";
  const bookedClasses = "bg-green-100 border-2 border-green-300";
  const availableClasses = "bg-white hover:shadow-xl";
  
  const canBook = user && !isBooked && !isUnavailable;

  const getStatusClasses = () => {
    if (isUnavailable) return unavailableClasses;
    if (isBooked) return bookedClasses;
    return `${availableClasses} ${canBook ? 'cursor-pointer' : ''}`;
  };

  const isOwner = user && bookingDetails && user.email === bookingDetails.bookedByEmail;

  return (
    <div className={`${baseClasses} ${getStatusClasses()}`} onClick={canBook ? onBook : undefined}>
      <div>
        <h3 className="text-2xl font-bold font-amiri">{month}</h3>
        <p className="text-sm text-slate-500 mb-4">{getGregorianApproximation(month, year)}</p>

        {isBooked && bookingDetails ? (
          <>
            <div className="space-y-3 text-slate-700">
              <p className="font-semibold text-lg text-green-900">المستضيف: {bookingDetails.host}</p>
              <p className="flex items-center"><CalendarIcon /> {bookingDetails.day}</p>
              <p className="flex items-center"><LocationIcon /> {bookingDetails.location}</p>
            </div>
            {isOwner && (
                <div className="flex justify-end gap-2 mt-4 border-t pt-3">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onEdit(bookingDetails); }}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors py-1 px-3 rounded-md hover:bg-blue-100"
                        aria-label={`تعديل حجز شهر ${month}`}
                    >
                        تعديل
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onCancel(bookingDetails.id); }}
                        className="text-sm font-semibold text-red-600 hover:text-red-800 transition-colors py-1 px-3 rounded-md hover:bg-red-100"
                        aria-label={`إلغاء حجز شهر ${month}`}
                    >
                        إلغاء
                    </button>
                </div>
            )}
          </>
        ) : isUnavailable ? (
          <p className="text-slate-500 font-semibold">فترة إجازة / توقف</p>
        ) : (
          <p className="text-slate-500">{user ? 'هذا الشهر متاح للحجز' : 'سجل الدخول لتتمكن من الحجز'}</p>
        )}
      </div>
      <div className="mt-6">
        {isBooked ? (
          <div className="text-center font-bold text-green-700 bg-green-200 rounded-full px-4 py-2">
            محجوز
          </div>
        ) : isUnavailable ? (
           <div className="text-center font-bold text-slate-500 bg-slate-300 rounded-full px-4 py-2">
            غير متاح
          </div>
        ) : (
          <button
            onClick={onBook}
            disabled={!user}
            className="w-full bg-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
            aria-label={user ? `حجز شهر ${month}`: `يجب تسجيل الدخول لحجز شهر ${month}`}
          >
            حجز هذا الشهر
          </button>
        )}
      </div>
    </div>
  );
};
