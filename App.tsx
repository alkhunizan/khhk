import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Introduction } from './components/Introduction';
import { Schedule } from './components/Schedule';
import { BookingModal } from './components/BookingModal';
import type { Booking, User } from './types';
import { MONTHS, GOOGLE_CLIENT_ID } from './constants';

const YEARS = [1446, 1447, 1448];

// Fix: Add type definition for window.google to avoid TypeScript errors.
declare global {
  interface Window {
    google: any;
  }
}

// Fix: Removed atobPolyfill with Buffer dependency and replaced with a robust JWT decoder to prevent type errors and handle JWT decoding correctly.
const decodeJwtPayload = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            window.atob(base64)
                .split('')
                .map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Error decoding JWT", e);
        return null;
    }
};


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
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
        localStorage.setItem('familyGatheringBookings', JSON.stringify(bookings));
    } catch (error) {
        console.error("Failed to save bookings to local storage", error);
    }
  }, [bookings]);

  useEffect(() => {
    if (typeof window.google === 'undefined') return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });
  }, []);

  const handleCredentialResponse = (response: any) => {
    try {
        const idToken = response.credential;
        const payload = decodeJwtPayload(idToken);
        if (payload) {
            setUser({
                name: payload.name,
                email: payload.email,
                picture: payload.picture,
            });
        }
    } catch (error) {
        console.error("Error processing credential response:", error);
    }
  };

const handleSignIn = () => {
  if (typeof window.google === 'undefined') {
    alert("Google Identity Services are not loaded yet. Please try again in a moment.");
    return;
  }
  window.google.accounts.id.prompt();
};


  const handleSignOut = () => {
    if (typeof window.google !== 'undefined') {
        window.google.accounts.id.disableAutoSelect();
    }
    setUser(null);
  };

  const handleOpenModal = (month: string, year: number) => {
    if (!user) {
        alert('الرجاء تسجيل الدخول أولاً للقيام بالحجز.');
        handleSignIn();
        return;
    }
    setBookingTarget({ month, year, booking: undefined });
  };

  const handleOpenEditModal = (booking: Booking) => {
    setBookingTarget({ month: booking.month, year: booking.year, booking: booking });
  };

  const handleCloseModal = () => {
    setBookingTarget(null);
  };

  const handleSaveBooking = (bookingData: Omit<Booking, 'id' | 'bookedByEmail'>) => {
    if (!user) {
        alert('Authentication error. Please sign in again.');
        return;
    }
    
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
            id: Date.now(),
            bookedByEmail: user.email 
        };
        setBookings([...bookings, newBooking]);
    }
    handleCloseModal();
  };

  const handleCancelBooking = (bookingId: number) => {
      const bookingToCancel = bookings.find(b => b.id === bookingId);
      if (!user || !bookingToCancel || user.email !== bookingToCancel.bookedByEmail) {
          alert("You can only cancel your own bookings.");
          return;
      }
      if (window.confirm('هل أنت متأكد من رغبتك في إلغاء هذا الحجز؟')) {
          setBookings(bookings.filter(b => b.id !== bookingId));
      }
  };
  
  const getBookingsForYear = (year: number) => bookings.filter(b => b.year === year);
  const getBookedMonthsForYear = (year: number) => getBookingsForYear(year).map(b => b.month);


  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      <Header user={user} onSignIn={handleSignIn} onSignOut={handleSignOut} />
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
          user={user}
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
