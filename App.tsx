import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Introduction } from './components/Introduction';
import { Schedule } from './components/Schedule';
import { BookingModal } from './components/BookingModal';
import type { Booking } from './types';
import { MONTHS } from './constants';

const YEARS = [1446, 1447, 1448];

const App: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const savedBookings = localStorage.getItem('familyGatheringBookings');
      return savedBookings ? JSON.parse(savedBookings) : [];
    } catch (error) {
      console.error("Failed to load bookings from local storage", error);
      return [];
    }
  });
  const [bookingTarget, setBookingTarget] = useState<{ month: string; year: number; booking?: Booking } | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(YEARS[0]);

  useEffect(() => {
    try {
        localStorage.setItem('familyGatheringBookings', JSON.stringify(bookings));
    } catch (error) {
        console.error("Failed to save bookings to local storage", error);
    }
  }, [bookings]);

  const handleOpenModal = (month: string, year: number) => {
    setBookingTarget({ month, year, booking: undefined });
  };

  const handleOpenEditModal = (booking: Booking) => {
    setBookingTarget({ month: booking.month, year: booking.year, booking: booking });
  };

  const handleCloseModal = () => {
    setBookingTarget(null);
  };

  const handleSaveBooking = (bookingData: Omit<Booking, 'id'>) => {
    const isEditing = bookingTarget?.booking;

    if (isEditing) {
        setBookings(bookings.map(b =>
            b.id === isEditing.id
                ? { ...isEditing, ...bookingData }
                : b
        ));
    } else {
        const newBooking: Booking = {
            ...bookingData,
            id: Date.now()
        };
        setBookings([...bookings, newBooking]);
    }
    handleCloseModal();
  };

  const handleCancelBooking = (bookingId: number) => {
      if (window.confirm('هل أنت متأكد من رغبتك في إلغاء هذا الحجز؟')) {
          setBookings(bookings.filter(b => b.id !== bookingId));
      }
  };
  
  const getBookingsForYear = (year: number) => bookings.filter(b => b.year === year);
  const getBookedMonthsForYear = (year: number) => getBookingsForYear(year).map(b => b.month);


  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <Introduction />
        
        <div className="my-8 text-center">
          <h2 className="text-2xl font-bold font-amiri text-slate-700 mb-4">اختر السنة لعرض الجدول</h2>
          <div className="flex justify-center items-center gap-3">
            {YEARS.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-6 py-2 rounded-lg font-bold text-lg transition-all duration-300 transform hover:-translate-y-1
                  ${selectedYear === year ? 'bg-teal-600 text-white shadow-lg' : 'bg-white text-teal-700 border-2 border-teal-200 hover:bg-teal-50'}`}
              >
                {year}هـ
              </button>
            ))}
          </div>
        </div>

        <Schedule 
          year={selectedYear}
          months={MONTHS}
          bookedMonths={getBookedMonthsForYear(selectedYear)}
          bookings={getBookingsForYear(selectedYear)}
          onBookMonth={handleOpenModal}
          onEditBooking={handleOpenEditModal}
          onCancelBooking={handleCancelBooking}
        />
      </main>
      {bookingTarget && (
        <BookingModal
          month={bookingTarget.month}
          year={bookingTarget.year}
          onClose={handleCloseModal}
          onBook={handleSaveBooking}
          bookingToEdit={bookingTarget.booking}
        />
      )}
      <footer className="text-center p-6 bg-slate-100 mt-12">
        <p className="text-slate-500">صُمم بحب لتسهيل صلة الرحم</p>
      </footer>
    </div>
  );
};

export default App;
