import React, { useState, useEffect } from 'react';
import type { Booking, DayOfWeek, Location } from '../types';
import { ALL_CORE_HOSTS, LOCATIONS } from '../constants';

interface BookingModalProps {
  month: string;
  year: number;
  onClose: () => void;
  onBook: (booking: Omit<Booking, 'id' | 'bookedByEmail'>) => void;
  bookingToEdit?: Booking;
}

export const BookingModal: React.FC<BookingModalProps> = ({ month, year, onClose, onBook, bookingToEdit }) => {
  const [host, setHost] = useState<string>(ALL_CORE_HOSTS[0]);
  const [isOtherHost, setIsOtherHost] = useState(false);
  const [otherHostName, setOtherHostName] = useState('');
  const [day, setDay] = useState<DayOfWeek>('الخميس');
  const [location, setLocation] = useState<Location>(LOCATIONS[0]);

  const isEditing = !!bookingToEdit;

  useEffect(() => {
    if (bookingToEdit) {
      if (ALL_CORE_HOSTS.includes(bookingToEdit.host)) {
        setHost(bookingToEdit.host);
        setIsOtherHost(false);
      } else {
        setHost('other');
        setIsOtherHost(true);
        setOtherHostName(bookingToEdit.host);
      }
      setDay(bookingToEdit.day);
      setLocation(bookingToEdit.location);
    }
  }, [bookingToEdit]);

  const handleHostChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setHost(value);
    if (value === 'other') {
      setIsOtherHost(true);
      // Don't clear otherHostName in case user is toggling back and forth
    } else {
      setIsOtherHost(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalHost = isOtherHost ? otherHostName : host;
    if (!finalHost || finalHost === 'other') {
      alert('الرجاء إدخال اسم المستضيف');
      return;
    }
    onBook({ month, year, host: finalHost, day, location });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg mx-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold font-amiri">
            {isEditing ? 'تعديل حجز شهر: ' : 'حجز دورية شهر: '} 
            <span className="text-green-700">{month}</span> لعام <span className="text-green-700">{year}هـ</span>
          </h2>
          <p className="text-slate-500 mt-1">الرجاء تعبئة بيانات الاستضافة.</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="host" className="block text-lg font-semibold text-slate-700 mb-2">المستضيف</label>
            <select
              id="host"
              value={host}
              onChange={handleHostChange}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <optgroup label="الأعضاء الأساسيين">
                {ALL_CORE_HOSTS.map(h => <option key={h} value={h}>{h}</option>)}
              </optgroup>
              <option value="other">آخر (من الأبناء أو البنات)</option>
            </select>
            {isOtherHost && (
              <input
                type="text"
                placeholder="الرجاء كتابة الاسم"
                value={otherHostName}
                onChange={(e) => setOtherHostName(e.target.value)}
                className="w-full mt-3 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                required
              />
            )}
          </div>
          <div>
            <span className="block text-lg font-semibold text-slate-700 mb-2">اليوم المفضل</span>
            <div className="flex gap-4">
              {(['الخميس', 'الجمعة'] as DayOfWeek[]).map(d => (
                <label key={d} className="flex items-center p-3 border rounded-lg w-full cursor-pointer transition-colors"
                  htmlFor={`day-${d}`}>
                  <input
                    type="radio"
                    id={`day-${d}`}
                    name="day"
                    value={d}
                    checked={day === d}
                    onChange={() => setDay(d)}
                    className="ml-3 h-5 w-5 text-teal-600 focus:ring-teal-500 border-slate-300"
                  />
                  <span className="text-lg">{d}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <span className="block text-lg font-semibold text-slate-700 mb-2">المكان</span>
            <div className="space-y-3">
              {LOCATIONS.map(loc => (
                <label key={loc} className="flex items-center p-3 border rounded-lg w-full cursor-pointer transition-colors" 
                  htmlFor={`loc-${loc}`}>
                  <input
                    type="radio"
                    id={`loc-${loc}`}
                    name="location"
                    value={loc}
                    checked={location === loc}
                    onChange={() => setLocation(loc)}
                    className="ml-3 h-5 w-5 text-teal-600 focus:ring-teal-500 border-slate-300"
                  />
                  <span className="text-lg">{loc}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t">
            <button type="button" onClick={onClose} className="py-2 px-6 bg-slate-200 text-slate-800 rounded-lg font-semibold hover:bg-slate-300 transition-colors">
              إلغاء
            </button>
            <button type="submit" className="py-2 px-6 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors">
              {isEditing ? 'تحديث الحجز' : 'تأكيد الحجز'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
